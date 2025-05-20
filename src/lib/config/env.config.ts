/**
 * Environment variables.
 */
export const {
  NODE_ENV,
  PORT = 4000,
  // https://stackoverflow.com/a/68578294
  HOST = "0.0.0.0",
  DATABASE_NAME,
  DATABASE_URL,
  AUTH_BASE_URL,
  GRAPHQL_COMPLEXITY_MAX_COST,
} = process.env;

export const isDevEnv = NODE_ENV === "development",
  isProdEnv = NODE_ENV === "production";
