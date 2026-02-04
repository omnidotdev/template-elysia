import { billingProvider } from "lib/config/env.config";
import AetherBillingProvider from "./aether.provider";
import LocalBillingProvider from "./local.provider";

import type { BillingProvider } from "./interface";

export type {
  BillingProvider,
  CheckoutParams,
  CheckoutWithWorkspaceParams,
  CheckoutWithWorkspaceResponse,
  Entitlement,
  EntitlementsResponse,
  Price,
  Product,
  Recurring,
  Subscription,
} from "./interface";

/**
 * Create the billing provider based on environment configuration.
 */
const createBillingProvider = (): BillingProvider => {
  switch (billingProvider) {
    case "local":
      return new LocalBillingProvider();
    case "aether":
      return new AetherBillingProvider();
    default:
      console.warn(
        `[billing] Unknown provider "${billingProvider}", using local`,
      );
      return new LocalBillingProvider();
  }
};

/**
 * Singleton billing provider instance.
 */
const billing = createBillingProvider();

export default billing;

/**
 * Invalidate cached entitlements for an entity.
 * Used by webhooks to clear stale data.
 */
export const invalidateBillingCache = (
  entityType: string,
  entityId: string,
): void => {
  // Only Aether provider has cache to invalidate
  if (billingProvider === "aether") {
    const provider = billing as AetherBillingProvider;
    provider.invalidateCache(entityType, entityId);
  }
};

/**
 * Clear all cached entitlements.
 */
export const clearBillingCache = (): void => {
  if (billingProvider === "aether") {
    const provider = billing as AetherBillingProvider;
    provider.clearCache();
  }
};
