import { createWithPgClient } from "postgraphile/adaptors/pg";

import { dbPool, pgPool } from "lib/db/db";

import type { YogaInitialContext } from "graphql-yoga";
import type { SelectUser } from "lib/db/schema";
import type { WithPgClient } from "postgraphile/@dataplan/pg";
import type {
  NodePostgresPgClient,
  PgSubscriber,
} from "postgraphile/adaptors/pg";

const withPgClient = createWithPgClient({ pool: pgPool });

export interface GraphQLContext {
  /** API observer, injected by the authentication plugin and controlled via `contextFieldName`. Related to the viewer pattern: https://wundergraph.com/blog/graphql_federation_viewer_pattern */
  observer: SelectUser | null;
  /** Network request. */
  request: Request;
  /** Database. */
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
}: Omit<YogaInitialContext, "waitUntil">): Promise<
  Omit<GraphQLContext, "observer" | "pgSettings" | "pgSubscriber">
> => ({
  request,
  db: dbPool,
  withPgClient,
});

export default createGraphqlContext;
