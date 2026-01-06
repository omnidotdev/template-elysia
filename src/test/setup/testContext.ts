import { afterEach, beforeEach } from "bun:test";

import { createTestGraphQLClient } from "test/util/graphqlClient";

import { mswServer } from "./mswServer";
import { resetDatabase } from "./resetDatabase";

import type { SelectUser } from "lib/db/schema";
import type { Pool } from "pg";
import type { GraphQLTestClient } from "test/util/graphqlClient";
import type { TestDatabase } from "./createTestDatabase";

export interface TestContext {
  db: TestDatabase["db"];
  pool: Pool;
  graphql: GraphQLTestClient;
  graphqlAs: (observer: SelectUser) => GraphQLTestClient;
}

/**
 * Setup test context with database and GraphQL client.
 * Resets database before each test for isolation.
 *
 * Note: Global setup (container, migrations, MSW) is handled by preload.ts
 */
export const setupTestContext = (): TestContext => {
  const getTestDb = () => {
    if (!globalThis.__TEST_DATABASE__) {
      throw new Error(
        "Test database not initialized. Ensure preload.ts is configured in bunfig.toml",
      );
    }
    return globalThis.__TEST_DATABASE__;
  };

  beforeEach(async () => {
    const { db } = getTestDb();
    await resetDatabase(db);
  });

  afterEach(() => {
    mswServer.resetHandlers();
  });

  return new Proxy({} as TestContext, {
    get(_, prop: keyof TestContext) {
      const { db, pool } = getTestDb();

      if (prop === "db") return db;
      if (prop === "pool") return pool;
      if (prop === "graphql") return createTestGraphQLClient({ pool, db });
      if (prop === "graphqlAs") {
        return (observer: SelectUser) =>
          createTestGraphQLClient({ pool, db, observer });
      }

      return undefined;
    },
  });
};
