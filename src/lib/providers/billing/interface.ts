/**
 * Billing types.
 */
export interface Entitlement {
  id: string;
  productId: string;
  featureKey: string;
  value: string | null;
  source: string;
  validFrom: string;
  validUntil: string | null;
}

export interface EntitlementsResponse {
  billingAccountId: string;
  entityType: string;
  entityId: string;
  entitlementVersion: number;
  entitlements: Entitlement[];
}

/**
 * Billing provider interface.
 * Implementations check feature access and limits.
 */
export interface BillingProvider {
  /**
   * Get all entitlements for an entity.
   * @param entityType - The entity type (e.g., "organization").
   * @param entityId - The entity ID.
   * @param productId - Optional product filter.
   */
  getEntitlements(
    entityType: string,
    entityId: string,
    productId?: string,
  ): Promise<EntitlementsResponse | null>;

  /**
   * Check if a feature is enabled for an entity.
   * @param entityType - The entity type.
   * @param entityId - The entity ID.
   * @param feature - The feature key to check.
   */
  checkEntitlement(
    entityType: string,
    entityId: string,
    feature: string,
  ): Promise<boolean>;

  /**
   * Get a specific entitlement value.
   * @returns The value or null if not found.
   */
  getEntitlementValue(
    entityType: string,
    entityId: string,
    feature: string,
  ): Promise<string | null>;

  /**
   * Health check for the provider.
   */
  healthCheck?(): Promise<{ healthy: boolean; message?: string }>;
}
