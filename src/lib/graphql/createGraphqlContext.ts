import { newEnforcer as createCasbinEnforcer } from "casbin";
import { createWithPgClient } from "postgraphile/adaptors/pg";

import { dbPool, pgPool } from "lib/db/db";

import type { Enforcer as AuthorizationSDK } from "casbin";
import type { YogaInitialContext } from "graphql-yoga";
import type { SelectUser } from "lib/db/schema";
import type { WithPgClient } from "postgraphile/@dataplan/pg";
import type {
  NodePostgresPgClient,
  PgSubscriber,
} from "postgraphile/adaptors/pg";

const postgresClient = createWithPgClient({ pool: pgPool });

const authorizationClient = await createCasbinEnforcer(
  "./model.conf",
  "./policy.csv",
);

export interface GraphQLContext {
  /** API observer, injected by the authentication plugin and controlled via `contextFieldName`. Related to the viewer pattern: https://wundergraph.com/blog/graphql_federation_viewer_pattern */
  observer: SelectUser | null;
  /** Network request. */
  request: Request;
  /** Database. */
  db: typeof dbPool;
  /** Authorization instance for permission checks. */
  authorization: AuthorizationSDK;
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
  authorization: authorizationClient,
  // NB: Postgraphile expects `withPgClient`, exactly named, on the GraphQL context
  withPgClient: postgresClient,
});

export default createGraphqlContext;
