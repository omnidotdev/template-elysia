/**
 * Environment variables.
 */
export const {
  NODE_ENV,
  PORT = 4000,
  // https://stackoverflow.com/a/68578294
  HOST = "0.0.0.0",
  DATABASE_URL,
  AUTH_BASE_URL = "https://localhost:8000",
  GRAPHQL_MAX_COMPLEXITY_COST,
  CORS_ALLOWED_ORIGINS,
  /** Secret for verifying auth webhook signatures */
  AUTH_WEBHOOK_SECRET,
  /** Secret for verifying billing webhook signatures */
  BILLING_WEBHOOK_SECRET,
  /** Billing/entitlements service base URL */
  BILLING_BASE_URL,
  /** Authorization PDP API URL */
  AUTHZ_API_URL,
  /** Enable authorization checks */
  AUTHZ_ENABLED,
  /** Protect GraphQL routes (require authentication) */
  PROTECT_ROUTES,
  /** Vortex event streaming API URL */
  VORTEX_API_URL,
  /** Vortex event streaming API key */
  VORTEX_API_KEY,
  /** Shared secret for service-to-service auth */
  INTERNAL_SERVICE_KEY,
  /** Organization ID for service-key authenticated requests */
  SERVICE_ORGANIZATION_ID,
} = process.env;

export const isDevEnv = NODE_ENV === "development",
  isProdEnv = NODE_ENV === "production",
  protectRoutes = PROTECT_ROUTES === "true";
