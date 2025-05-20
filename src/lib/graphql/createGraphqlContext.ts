import {
  createWithPgClient,
  NodePostgresPgClient,
} from "postgraphile/adaptors/pg";

import { dbPool, pgPool } from "lib/db/db";

import type { YogaInitialContext } from "graphql-yoga";
import type { WithPgClient } from "postgraphile/@dataplan/pg";
import { type PgSubscriber } from "postgraphile/adaptors/pg";

const withPgClient = createWithPgClient({ pool: pgPool });

export interface GraphQLContext {
  db: typeof dbPool;
  /** Postgres client, injected by Postgraphile. */
  withPgClient: WithPgClient<NodePostgresPgClient>;
  /** Postgres settings for the current request, injected by Postgraphile. */
  pgSettings: Record<string, string | undefined> | null;
  /** Postgres subscription client for the current request, injected by Postgraphile. */
  pgSubscriber: PgSubscriber | null;
}

/**
 * Create a GraphQL context.
 * @see https://graphql.org/learn/execution/#root-fields-and-resolvers
 */
const createGraphqlContext = async ({
  request,
}: YogaInitialContext): Promise<
  Omit<GraphQLContext, "pgSettings" | "pgSubscriber">
> => ({
  db: dbPool,
  withPgClient,
});

export default createGraphqlContext;
