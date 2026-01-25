import type { KnipConfig } from "knip";

/**
 * Knip configuration.
 * @see https://knip.dev/overview/configuration
 *
 * NOTE: Many lib files are intentionally unused in the template.
 * They serve as reference patterns for Omni products to adopt.
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
    // Reference patterns - unused in template but available for adoption
    "src/lib/cache/**",
    "src/lib/db/scoped.ts",
    "src/lib/db/createDbClient.ts",
    "src/lib/db/dbClient.ts",
    "src/lib/db/getDefaultOrgContext.ts",
    "src/lib/db/pgClient.ts",
    "src/lib/idp/**",
    "src/lib/logging/**",
    "src/lib/middleware/**",
    "src/lib/providers/**",
  ],
  ignoreDependencies: [
    "@changesets/changelog-github",
    "@changesets/cli",
    "drizzle-kit",
    // TODO switch to testcontainers (unstable behavior with Bun/Docker), then remove below
    "@testcontainers/postgresql",
    "testcontainers",
    "@faker-js/faker",
  ],
  ignoreBinaries: [
    "tsc", // Bun provides TypeScript compilation
  ],
  tags: ["-knipignore"],
};

export default knipConfig;
