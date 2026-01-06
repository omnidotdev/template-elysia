/**
 * @file Set up a database.
 */

import { $ } from "bun";

import { DATABASE_URL } from "lib/config/env.config";

const databaseName = DATABASE_URL?.split("/").pop()?.split("?")[0];

// biome-ignore lint/suspicious/noConsole: script logging
console.log(`Creating ${databaseName} database...`);
await $`createdb -U postgres ${databaseName}`;
// biome-ignore lint/suspicious/noConsole: script logging
console.log("Database created");
