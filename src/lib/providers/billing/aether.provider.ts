import { BILLING_BASE_URL } from "lib/config/env.config";

import type {
  BillingProvider,
  CheckoutParams,
  CheckoutWithWorkspaceParams,
  CheckoutWithWorkspaceResponse,
  EntitlementsResponse,
  Price,
  Subscription,
} from "./interface";

/** Request timeout in milliseconds */
const REQUEST_TIMEOUT_MS = 5000;

/** Cache TTL: 5 minutes */
const CACHE_TTL_MS = 300_000;

interface CacheEntry {
  value: EntitlementsResponse;
  expiresAt: number;
}

/**
 * Aether billing provider.
 * Fetches entitlements from Aether billing service.
 */
class AetherBillingProvider implements BillingProvider {
  private cache = new Map<string, CacheEntry>();

  async getEntitlements(
    entityType: string,
    entityId: string,
    productId?: string,
    accessToken?: string,
  ): Promise<EntitlementsResponse | null> {
    if (!BILLING_BASE_URL) {
      console.warn("[billing] BILLING_BASE_URL not configured");
      return null;
    }

    const cacheKey = `${entityType}:${entityId}:${productId ?? "all"}`;

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    try {
      const url = new URL(
        `${BILLING_BASE_URL}/entitlements/${entityType}/${entityId}`,
      );
      if (productId) url.searchParams.set("productId", productId);

      const headers: HeadersInit = {};
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

      const response = await fetch(url.toString(), {
        headers,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (!response.ok) {
        console.error(`[billing] Failed to fetch: ${response.status}`);
        return null;
      }

      const result = (await response.json()) as EntitlementsResponse;

      // Cache result
      this.cache.set(cacheKey, {
        value: result,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });

      return result;
    } catch (error) {
      console.error("[billing] Error fetching:", error);
      return null;
    }
  }

  async checkEntitlement(
    entityType: string,
    entityId: string,
    productId: string,
    featureKey: string,
    accessToken?: string,
  ): Promise<string | null> {
    const entitlements = await this.getEntitlements(
      entityType,
      entityId,
      productId,
      accessToken,
    );
    if (!entitlements) return null;

    const entitlement = entitlements.entitlements.find(
      (e) => e.featureKey === featureKey,
    );

    return entitlement?.value ?? null;
  }

  async getPrices(_appName: string): Promise<Price[]> {
    // Backend-only template - pricing fetched client-side
    throw new Error("getPrices not implemented for backend-only template");
  }

  async createCheckoutSession(_params: CheckoutParams): Promise<string> {
    // Backend-only template - checkout handled via createCheckoutWithWorkspace
    throw new Error(
      "createCheckoutSession not implemented for backend-only template",
    );
  }

  async createCheckoutWithWorkspace(
    params: CheckoutWithWorkspaceParams,
  ): Promise<CheckoutWithWorkspaceResponse> {
    if (!BILLING_BASE_URL) {
      throw new Error("BILLING_BASE_URL not configured");
    }

    const response = await fetch(`${BILLING_BASE_URL}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.accessToken}`,
      },
      body: JSON.stringify({
        appId: params.appId,
        priceId: params.priceId,
        successUrl: params.successUrl,
        cancelUrl: params.cancelUrl,
        ...(params.workspaceId && { workspaceId: params.workspaceId }),
        ...(params.createWorkspace && {
          createWorkspace: params.createWorkspace,
        }),
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        (error as { error?: string }).error ||
          "Failed to create checkout session",
      );
    }

    return response.json();
  }

  async getSubscription(
    entityType: string,
    entityId: string,
    accessToken: string,
  ): Promise<Subscription | null> {
    if (!BILLING_BASE_URL) return null;

    try {
      const response = await fetch(
        `${BILLING_BASE_URL}/billing-portal/subscription/${entityType}/${entityId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        },
      );

      if (!response.ok) return null;

      const { subscription } = await response.json();
      return subscription;
    } catch {
      return null;
    }
  }

  async getBillingPortalUrl(
    entityType: string,
    entityId: string,
    productId: string,
    returnUrl: string,
    accessToken: string,
  ): Promise<string> {
    if (!BILLING_BASE_URL) {
      throw new Error("BILLING_BASE_URL not configured");
    }

    const response = await fetch(
      `${BILLING_BASE_URL}/billing-portal/${entityType}/${entityId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ productId, returnUrl }),
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        (error as { error?: string }).error ||
          "Failed to get billing portal URL",
      );
    }

    const { url } = await response.json();
    return url;
  }

  async cancelSubscription(
    entityType: string,
    entityId: string,
    accessToken: string,
  ): Promise<string> {
    if (!BILLING_BASE_URL) {
      throw new Error("BILLING_BASE_URL not configured");
    }

    const response = await fetch(
      `${BILLING_BASE_URL}/billing-portal/subscription/${entityType}/${entityId}/cancel`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        (error as { error?: string }).error || "Failed to cancel subscription",
      );
    }

    const { id } = await response.json();
    return id;
  }

  async renewSubscription(
    entityType: string,
    entityId: string,
    accessToken: string,
  ): Promise<void> {
    if (!BILLING_BASE_URL) {
      throw new Error("BILLING_BASE_URL not configured");
    }

    const response = await fetch(
      `${BILLING_BASE_URL}/billing-portal/subscription/${entityType}/${entityId}/renew`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        (error as { error?: string }).error || "Failed to renew subscription",
      );
    }
  }

  async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
    if (!BILLING_BASE_URL) {
      return { healthy: false, message: "BILLING_BASE_URL not configured" };
    }

    try {
      const response = await fetch(`${BILLING_BASE_URL}/health`, {
        signal: AbortSignal.timeout(5000),
      });
      return {
        healthy: response.ok,
        message: response.ok ? "OK" : `Status ${response.status}`,
      };
    } catch (error) {
      return {
        healthy: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Invalidate cached entitlements for an entity.
   */
  invalidateCache(entityType: string, entityId: string): void {
    const prefix = `${entityType}:${entityId}:`;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cached entitlements.
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export default AetherBillingProvider;
