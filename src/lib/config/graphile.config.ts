import { PgSimplifyInflectionPreset } from "@graphile/simplify-inflection";
import { PostGraphileConnectionFilterPreset } from "postgraphile-plugin-connection-filter";
import { makePgService } from "postgraphile/adaptors/pg";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";

import { PrimaryKeyMutationsOnlyPlugin } from "lib/postgraphile/plugins/PrimaryKeyMutationsOnly.plugin";
import { SmartTagsPlugin } from "lib/postgraphile/plugins/SmartTags.plugin";
import { DATABASE_URL, isDevEnv } from "./env.config";

/**
 * Graphile preset.
 */
const graphilePreset: GraphileConfig.Preset = {
  extends: [
    PostGraphileAmberPreset,
    PgSimplifyInflectionPreset,
    PostGraphileConnectionFilterPreset,
  ],
  plugins: [PrimaryKeyMutationsOnlyPlugin, SmartTagsPlugin],
  schema: {
    // NB: restrict mutations by default. Opt-in to certain behaviors through the `SmartTagsPlugin`
    defaultBehavior: "-insert -update -delete",
    pgForbidSetofFunctionsToReturnNull: true,
    // See https://github.com/graphile-contrib/postgraphile-plugin-connection-filter?tab=readme-ov-file#handling-null-and-empty-objects
    connectionFilterAllowNullInput: true,
    connectionFilterAllowEmptyObjectInput: true,
  },
  pgServices: [makePgService({ connectionString: DATABASE_URL })],
  grafast: { explain: isDevEnv },
};

export default graphilePreset;
