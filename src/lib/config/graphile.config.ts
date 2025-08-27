import { PgSimplifyInflectionPreset } from "@graphile/simplify-inflection";
import { PostGraphileConnectionFilterPreset } from "postgraphile-plugin-connection-filter";
import { makePgService } from "postgraphile/adaptors/pg";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";

import { PostPlugin } from "lib/graphql/plugins/postgraphile/post.plugin";
import { PrimaryKeyMutationsOnlyPlugin } from "lib/graphql/plugins/postgraphile/primaryKeyMutations.plugin";
import { UserPlugin } from "lib/graphql/plugins/postgraphile/user.plugin";
import { DATABASE_URL, isDevEnv, isProdEnv } from "./env.config";

/**
 * Graphile preset.
 */
const graphilePreset: GraphileConfig.Preset = {
  extends: [
    PostGraphileAmberPreset,
    PgSimplifyInflectionPreset,
    PostGraphileConnectionFilterPreset,
  ],
  plugins: [UserPlugin, PrimaryKeyMutationsOnlyPlugin, PostPlugin],
  schema: {
    retryOnInitFail: isProdEnv,
    sortExport: true,
    pgForbidSetofFunctionsToReturnNull: false,
    jsonScalarAsString: false,
    defaultBehavior: "-type:node -interface:node",
    connectionFilterAllowNullInput: true,
    connectionFilterAllowEmptyObjectInput: true,
  },
  pgServices: [makePgService({ connectionString: DATABASE_URL })],
  grafast: { explain: isDevEnv },
};

export default graphilePreset;
