/**
 * Tenant-Scoped Cache Keys
 *
 * All cache keys MUST include tenant context to prevent data leakage.
 * Pattern: {scope}:{tenantId}:{resource}:{resourceId}
 *
 * Usage:
 *   const key = cacheKeys.organization.posts(orgId);
 *   await cacheClient.set(key, JSON.stringify(posts));
 */

/**
 * Cache key generators for tenant-scoped resources.
 */
const cacheKeys = {
  // organization-scoped resources
  organization: {
    /** All posts in an org */
    posts: (orgId: string) => `org:${orgId}:posts`,

    /** Single post */
    post: (orgId: string, postId: string) => `org:${orgId}:post:${postId}`,

    /** Org members */
    members: (orgId: string) => `org:${orgId}:members`,

    /** Org settings */
    settings: (orgId: string) => `org:${orgId}:settings`,

    /** Billing info */
    billing: (orgId: string) => `org:${orgId}:billing`,

    /** Entitlements for a product */
    entitlements: (orgId: string, productId: string) =>
      `org:${orgId}:entitlements:${productId}`,

    /** Generic resource */
    resource: (orgId: string, resourceType: string, resourceId: string) =>
      `org:${orgId}:${resourceType}:${resourceId}`,
  },

  // user-scoped resources (cross-tenant safe)
  user: {
    /** User session */
    session: (userId: string) => `user:${userId}:session`,

    /** User organizations */
    organizations: (userId: string) => `user:${userId}:organizations`,

    /** User preferences */
    preferences: (userId: string) => `user:${userId}:preferences`,
  },
};

export default cacheKeys;
