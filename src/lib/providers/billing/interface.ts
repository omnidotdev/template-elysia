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
 * Checkout with workspace parameters.
 * Either workspaceId (upgrade existing) or createWorkspace (new) must be provided.
 */
export interface CheckoutWithWorkspaceParams {
  appId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  accessToken: string;
  /** Upgrade existing workspace */
  workspaceId?: string;
  /** Create new workspace */
  createWorkspace?: {
    name: string;
    slug?: string;
  };
}

/**
 * Checkout with workspace response.
 */
export interface CheckoutWithWorkspaceResponse {
  checkoutUrl: string;
  workspaceSlug: string;
  organizationId: string;
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
   * Create a checkout session with workspace creation/selection.
   * Routes through Aether for orchestration.
   */
  createCheckoutWithWorkspace(
    params: CheckoutWithWorkspaceParams,
  ): Promise<CheckoutWithWorkspaceResponse>;

  /**
   * Health check for the provider.
   */
  healthCheck?(): Promise<{ healthy: boolean; message?: string }>;
}
