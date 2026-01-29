import { BILLING_BASE_URL } from "lib/config/env.config";

import type { BillingProvider, EntitlementsResponse } from "./interface";

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

      const response = await fetch(url.toString(), {
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
    feature: string,
  ): Promise<boolean> {
    const entitlements = await this.getEntitlements(entityType, entityId);
    if (!entitlements) return false;

    const entitlement = entitlements.entitlements.find(
      (e) => e.featureKey === feature,
    );

    if (!entitlement) return false;

    // Check if value indicates enabled
    return (
      entitlement.value === "true" ||
      entitlement.value === "unlimited" ||
      Number.parseInt(entitlement.value ?? "0", 10) > 0
    );
  }

  async getEntitlementValue(
    entityType: string,
    entityId: string,
    feature: string,
  ): Promise<string | null> {
    const entitlements = await this.getEntitlements(entityType, entityId);
    if (!entitlements) return null;

    const entitlement = entitlements.entitlements.find(
      (e) => e.featureKey === feature,
    );

    return entitlement?.value ?? null;
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
