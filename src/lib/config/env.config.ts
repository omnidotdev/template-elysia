/**
 * Environment variables.
 *
 * Read through a `process.env` alias rather than a destructuring export or the
 * literal `process.env.NODE_ENV`. Two bundler pitfalls this avoids under
 * `bun build --target node`:
 *   1. `export const { ... } = process.env` compiles to a deferred destructuring
 *      assignment that throws `ReferenceError: X is not defined` at runtime,
 *      crash-looping the production server
 *   2. the literal `process.env.NODE_ENV` is inlined to a build-time constant,
 *      which freezes NODE_ENV and can wrongly enable dev-only behavior (e.g.
 *      local TLS) in production
 * Aliasing keeps every read at runtime
 */
const env = process.env;

export const NODE_ENV = env.NODE_ENV;
export const PORT = env.PORT ?? 4000;
// https://stackoverflow.com/a/68578294
export const HOST = env.HOST ?? "0.0.0.0";
export const DATABASE_URL = env.DATABASE_URL;
export const AUTH_BASE_URL = env.AUTH_BASE_URL ?? "https://localhost:8000";
export const GRAPHQL_MAX_COMPLEXITY_COST = env.GRAPHQL_MAX_COMPLEXITY_COST;
export const CORS_ALLOWED_ORIGINS = env.CORS_ALLOWED_ORIGINS;
/** Secret for verifying auth webhook signatures */
export const AUTH_WEBHOOK_SECRET = env.AUTH_WEBHOOK_SECRET;
/** Secret for verifying billing webhook signatures */
export const BILLING_WEBHOOK_SECRET = env.BILLING_WEBHOOK_SECRET;
/** Billing/entitlements service base URL */
export const BILLING_BASE_URL = env.BILLING_BASE_URL;
/** Authorization PDP API URL */
export const AUTHZ_API_URL = env.AUTHZ_API_URL;
/** Enable authorization checks */
export const AUTHZ_ENABLED = env.AUTHZ_ENABLED;
/** Protect GraphQL routes (require authentication) */
export const PROTECT_ROUTES = env.PROTECT_ROUTES;
/** Vortex event streaming API URL */
export const VORTEX_API_URL = env.VORTEX_API_URL;
/** Vortex event streaming API key */
export const VORTEX_API_KEY = env.VORTEX_API_KEY;
/** Shared secret for service-to-service auth */
export const INTERNAL_SERVICE_KEY = env.INTERNAL_SERVICE_KEY;
/** Organization ID for service-key authenticated requests */
export const SERVICE_ORGANIZATION_ID = env.SERVICE_ORGANIZATION_ID;

export const isDevEnv = NODE_ENV === "development",
  isProdEnv = NODE_ENV === "production",
  protectRoutes = PROTECT_ROUTES === "true";
