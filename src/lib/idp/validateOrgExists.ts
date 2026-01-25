/**
 * IDP organization validation.
 *
 * Validates that an organization exists in the IDP before creating resources.
 * Uses caching and fail-open circuit breaker for resilience.
 */

import { AUTH_BASE_URL } from "lib/config/env.config";
import { CACHE_TTL_MS, orgExistsCache } from "./orgCache";

/** Request timeout in milliseconds */
const REQUEST_TIMEOUT_MS = 3000;

/**
 * Check if an organization exists in the IDP.
 *
 * - Caches positive results for 5 minutes
 * - Does NOT cache negative results (org might be in propagation delay)
 * - Fails open if IDP is unavailable (logs warning, returns true)
 *
 * @param organizationId - The organization ID to validate
 * @returns true if org exists or IDP unavailable, false if org confirmed not to exist
 */
const validateOrgExists = async (organizationId: string): Promise<boolean> => {
  if (!AUTH_BASE_URL) {
    console.warn(
      "[IDP] `AUTH_BASE_URL` not configured, skipping org validation",
    );
    return true; // fail open
  }

  // check cache first
  const cached = orgExistsCache.get(organizationId);
  if (cached && cached.expiresAt > Date.now()) return cached.exists;

  try {
    // query IDP for organization existence
    // using the Better Auth organization API endpoint
    const response = await fetch(
      `${AUTH_BASE_URL}/api/organization/${organizationId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    );

    if (response.ok) {
      // cache positive result
      orgExistsCache.set(organizationId, {
        exists: true,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
      return true;
    }

    if (response.status === 404) {
      // org confirmed not to exist - don't cache (might be propagation delay)
      console.warn(`[IDP] Organization ${organizationId} not found in IDP`);
      return false;
    }

    // other error status - fail open
    console.warn(
      `[IDP] Unexpected response checking org ${organizationId}: ${response.status}`,
    );
    return true;
  } catch (err) {
    // network error or timeout - fail open
    const message = err instanceof Error ? err.message : String(err);
    console.warn(
      `[IDP] Failed to validate org ${organizationId}, failing open: ${message}`,
    );
    return true;
  }
};

export default validateOrgExists;
