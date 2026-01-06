import type { KnipConfig } from "knip";

/**
 * Knip configuration.
 * @see https://knip.dev/overview/configuration
 */
const knipConfig: KnipConfig = {
  ignore: [
    "**/generated/**",
    "src/lib/config/drizzle.config.ts",
    "src/scripts/**",
    "src/lib/db/db.ts",
    "src/lib/config/env.config.ts",
    "src/test/**",
    "src/__tests__/**",
  ],
  ignoreDependencies: [
    "drizzle-kit",
    // TODO remove once testcontainers Bun race condition is fixed
    // @see https://github.com/testcontainers/testcontainers-node/issues/974
    "@testcontainers/postgresql",
    "testcontainers",
  ],
  tags: ["-knipignore"],
};

export default knipConfig;
