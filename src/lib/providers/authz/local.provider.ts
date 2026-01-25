import type { AuthzProvider, AuthzTuple } from "./interface";

/**
 * Local authorization provider.
 * Always returns true (permissive) for self-hosted mode.
 */
class LocalAuthzProvider implements AuthzProvider {
  async checkPermission(
    _userId: string,
    _resourceType: string,
    _resourceId: string,
    _permission: string,
    _requestCache?: Map<string, boolean>,
  ): Promise<boolean> {
    // Self-hosted: all permissions granted
    return true;
  }

  async writeTuples(_tuples: AuthzTuple[]): Promise<void> {
    // No-op in local mode
  }

  async deleteTuples(_tuples: AuthzTuple[]): Promise<void> {
    // No-op in local mode
  }

  async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
    return { healthy: true, message: "Local provider always healthy" };
  }
}

export default LocalAuthzProvider;
