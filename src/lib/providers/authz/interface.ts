/**
 * Authorization provider interface.
 * Implementations check if a user has permission on a resource.
 */
export interface AuthzProvider {
  /**
   * Check if a user has permission on a resource.
   * @param userId - The user ID.
   * @param resourceType - The type of resource (e.g., "organization", "project").
   * @param resourceId - The resource ID.
   * @param permission - The permission to check (e.g., "read", "write", "admin").
   * @param requestCache - Optional request-scoped cache to avoid N+1.
   * @returns true if authorized, false otherwise.
   */
  checkPermission(
    userId: string,
    resourceType: string,
    resourceId: string,
    permission: string,
    requestCache?: Map<string, boolean>,
  ): Promise<boolean>;

  /**
   * Write authorization tuples to the authz system.
   * Used after mutations to sync state.
   */
  writeTuples?(tuples: AuthzTuple[]): Promise<void>;

  /**
   * Delete authorization tuples from the authz system.
   */
  deleteTuples?(tuples: AuthzTuple[]): Promise<void>;

  /**
   * Health check for the provider.
   */
  healthCheck?(): Promise<{ healthy: boolean; message?: string }>;
}

export type AuthzTuple = {
  user: string;
  relation: string;
  object: string;
};
