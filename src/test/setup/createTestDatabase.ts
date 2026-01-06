import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

import * as schema from "lib/db/schema";

export interface TestDatabase {
  pool: Pool;
  db: ReturnType<typeof drizzle<typeof schema>>;
  connectionString: string;
  cleanup: () => Promise<void>;
}

/**
 * Create a test database connection and run migrations.
 */
export const createTestDatabase = async (
  connectionString: string,
): Promise<TestDatabase> => {
  const pool = new Pool({ connectionString });

  const db = drizzle(pool, {
    schema,
    casing: "snake_case",
  });

  await migrate(db, {
    migrationsFolder: "./src/generated/drizzle",
  });

  return {
    pool,
    db,
    connectionString,
    cleanup: async () => {
      await pool.end();
    },
  };
};
