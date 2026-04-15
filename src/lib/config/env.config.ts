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

// Startup warnings for optional integrations
if (!BILLING_BASE_URL)
  console.warn("BILLING_BASE_URL not set, billing disabled");
if (!BILLING_WEBHOOK_SECRET)
  console.warn("BILLING_WEBHOOK_SECRET not set, billing webhooks disabled");
if (!AUTH_WEBHOOK_SECRET)
  console.warn("AUTH_WEBHOOK_SECRET not set, auth webhooks disabled");
if (!AUTHZ_API_URL)
  console.warn("AUTHZ_API_URL not set, authorization disabled");
if (!AUTHZ_ENABLED)
  console.warn("AUTHZ_ENABLED not set, authorization disabled");
if (!VORTEX_API_URL)
  console.warn("VORTEX_API_URL not set, event streaming disabled");
if (!VORTEX_API_KEY)
  console.warn("VORTEX_API_KEY not set, event streaming disabled");
if (!CORS_ALLOWED_ORIGINS)
  console.warn("CORS_ALLOWED_ORIGINS not set, CORS unrestricted");
if (!GRAPHQL_MAX_COMPLEXITY_COST)
  console.warn(
    "GRAPHQL_MAX_COMPLEXITY_COST not set, query complexity limiting disabled",
  );
if (!INTERNAL_SERVICE_KEY)
  console.warn(
    "INTERNAL_SERVICE_KEY not set, service-to-service auth disabled",
  );
if (!SERVICE_ORGANIZATION_ID)
  console.warn(
    "SERVICE_ORGANIZATION_ID not set, service-key org resolution disabled",
  );
if (!PROTECT_ROUTES)
  console.warn("PROTECT_ROUTES not set, route protection disabled");
