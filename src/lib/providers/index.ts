/**
 * Shared provider instances.
 *
 * Instantiates authorization and billing providers from @omnidotdev/providers
 * with app-specific configuration from environment variables.
 */

import {
  createApiKeyProvider,
  createAuthzProvider,
  createBillingProvider,
  createEventsProvider,
} from "@omnidotdev/providers";

import {
  AUTH_BASE_URL,
  AUTHZ_API_URL,
  BILLING_BASE_URL,
  VORTEX_API_KEY,
  VORTEX_API_URL,
} from "lib/config/env.config";

export const authz = createAuthzProvider({
  apiUrl: AUTHZ_API_URL,
});

export const billing = createBillingProvider({
  baseUrl: BILLING_BASE_URL,
  appId: "platform",
});

export const events = createEventsProvider(
  VORTEX_API_URL && VORTEX_API_KEY
    ? {
        provider: "http",
        baseUrl: VORTEX_API_URL,
        apiKey: VORTEX_API_KEY,
        source: "platform",
      }
    : {},
);

export const apiKeys = createApiKeyProvider(
  AUTH_BASE_URL
    ? {
        provider: "gatekeeper",
        authBaseUrl: AUTH_BASE_URL,
      }
    : {},
);
