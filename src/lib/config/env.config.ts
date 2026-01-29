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
  /** Self-hosted mode flag */
  SELF_HOSTED,
  /** Default organization ID for self-hosted mode */
  DEFAULT_ORG_ID = "default-org",
  /** Provider overrides (default based on SELF_HOSTED) */
  BILLING_PROVIDER,
  AUTHZ_PROVIDER,
} = process.env;

export const isDevEnv = NODE_ENV === "development",
  isProdEnv = NODE_ENV === "production",
  isSelfHosted = SELF_HOSTED === "true",
  protectRoutes = PROTECT_ROUTES === "true";

/**
 * Resolve a provider based on env var or self-hosted defaults.
 * Explicit *_PROVIDER env var always wins.
 */
const resolveProvider = (
  envVar: string | undefined,
  defaultSaas: string,
  defaultSelfHosted = "local",
): string => {
  if (envVar) return envVar;
  return isSelfHosted ? defaultSelfHosted : defaultSaas;
};

export const billingProvider = resolveProvider(BILLING_PROVIDER, "aether");
export const authzProvider = resolveProvider(AUTHZ_PROVIDER, "warden");
