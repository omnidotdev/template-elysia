import { drizzle } from "drizzle-orm/node-postgres";
import { Client, Pool } from "pg";

import { DATABASE_URL } from "lib/config/env.config";
import * as schema from "lib/db/schema";

import type { Client as PostgresClient, Pool as PostgresPool } from "pg";

/**
 * Postgres database client.
 * @see https://node-postgres.com/apis/client
 */
export const pgClient = new Client({
  connectionString: DATABASE_URL,
});

/**
 * Postgres database pool.
 * @see https://node-postgres.com/apis/pool
 */
export const pgPool = new Pool({
  connectionString: DATABASE_URL,
});

/**
 * Create a database connection client.
 */
const createDbClient = (client: PostgresClient | PostgresPool) =>
  drizzle({
    client,
    schema,
    // ! NB: must match Drizzle config casing, otherwise database scripts may fail
    casing: "snake_case",
  });

/**
 * Database connection client.
 */
export const dbClient = createDbClient(pgClient);

/**
 * Database connection pool.
 */
export const dbPool = createDbClient(pgPool);
