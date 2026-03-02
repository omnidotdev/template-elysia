import {
  INTERNAL_SERVICE_KEY,
  SERVICE_ORGANIZATION_ID,
} from "lib/config/env.config";
import secretsMatch from "lib/crypto/secretsMatch";
import { apiKeys } from "lib/providers";

import type { ApiKeyInfo } from "@omnidotdev/providers";

/**
 * Validate an API key and return the associated identity.
 *
 * Supports two auth mechanisms:
 * 1. Internal service key (INTERNAL_SERVICE_KEY) — timing-safe, no network call
 * 2. Gatekeeper API key (omni_... prefix) — verified via providers
 */
const validateApiKey = async (
  authHeader: string | undefined,
): Promise<ApiKeyInfo | null> => {
  if (!authHeader) return null;

  // Strip "Bearer " prefix if present
  const key = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  // Check internal service key first (service-to-service auth, no network)
  if (
    INTERNAL_SERVICE_KEY &&
    SERVICE_ORGANIZATION_ID &&
    secretsMatch(key, INTERNAL_SERVICE_KEY)
  ) {
    return {
      id: "service",
      name: "Service Key",
      userId: "service",
      organizationId: SERVICE_ORGANIZATION_ID,
    };
  }

  // Gatekeeper API key path requires Bearer format
  if (!authHeader.startsWith("Bearer ")) return null;

  // Fall back to Gatekeeper API key verification via provider
  return apiKeys.verifyApiKey(key);
};

export default validateApiKey;
