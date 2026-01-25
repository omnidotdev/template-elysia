import type {
  Entitlement,
  EntitlementProvider,
  EntitlementsResponse,
} from "./interface";

/**
 * Create a self-hosted entitlement.
 */
const createEntitlement = (
  featureKey: string,
  value: string,
  productId: string,
): Entitlement => ({
  id: `self-hosted-${featureKey}`,
  featureKey,
  value,
  productId,
  source: "self-hosted",
  validFrom: "1970-01-01T00:00:00Z",
  validUntil: null,
});

/**
 * Self-hosted entitlements - all features unlocked.
 */
const UNLIMITED_ENTITLEMENTS: EntitlementsResponse = {
  billingAccountId: "self-hosted",
  entityType: "organization",
  entityId: "self-hosted",
  entitlementVersion: 1,
  entitlements: [
    createEntitlement("tier", "enterprise", "platform"),
    createEntitlement("max_members", "unlimited", "platform"),
    createEntitlement("sso_enabled", "true", "platform"),
    createEntitlement("audit_logs", "true", "platform"),
  ],
};

/**
 * Local entitlement provider.
 * Returns unlimited entitlements for self-hosted mode.
 */
class LocalEntitlementProvider implements EntitlementProvider {
  async getEntitlements(
    entityType: string,
    entityId: string,
    _productId?: string,
  ): Promise<EntitlementsResponse> {
    return {
      ...UNLIMITED_ENTITLEMENTS,
      entityType,
      entityId,
    };
  }

  async checkEntitlement(
    _entityType: string,
    _entityId: string,
    _feature: string,
  ): Promise<boolean> {
    // All features enabled in self-hosted
    return true;
  }

  async getEntitlementValue(
    _entityType: string,
    _entityId: string,
    feature: string,
  ): Promise<string | null> {
    const entitlement = UNLIMITED_ENTITLEMENTS.entitlements.find(
      (e) => e.featureKey === feature,
    );
    return entitlement?.value ?? "unlimited";
  }

  async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
    return { healthy: true, message: "Local provider always healthy" };
  }
}

export default LocalEntitlementProvider;
