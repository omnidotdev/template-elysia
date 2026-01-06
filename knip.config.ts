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
    // TODO switch to testcontainers (unstable behavior with Bun/Docker), then remove below
    "@testcontainers/postgresql",
    "testcontainers",
    "@faker-js/faker",
  ],
  tags: ["-knipignore"],
};

export default knipConfig;
