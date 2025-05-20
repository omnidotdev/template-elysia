/**
 * @file Set up a database.
 */

import { $ } from "bun";

import { DATABASE_NAME } from "lib/config/env.config";

console.log(`Creating ${DATABASE_NAME} database...`);
await $`createdb -U postgres template-elysia`;
console.log("Database created");
