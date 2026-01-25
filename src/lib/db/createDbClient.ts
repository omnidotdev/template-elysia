import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "lib/db/schema";

import type { Client as PostgresClient, Pool as PostgresPool } from "pg";

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

export default createDbClient;
