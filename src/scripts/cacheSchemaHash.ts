/**
 * Compute and persist the schema dependency hash.
 *
 * Run during Docker build so that the startup `graphql:generate` step
 * can skip the expensive PostGraphile DB introspection when the schema
 * source files haven't changed.
 */

import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const CACHE_DIR = `${__dirname}/../../.cache`;
const HASH_FILE = `${CACHE_DIR}/schema-hash`;
const SCHEMA_DIR = `${__dirname}/../lib/db/schema`;

const computeSchemaHash = (): string => {
  const hash = createHash("sha256");

  const files = readdirSync(SCHEMA_DIR, { recursive: true })
    .filter((f): f is string => typeof f === "string" && f.endsWith(".ts"))
    .sort();

  for (const file of files) {
    const content = readFileSync(join(SCHEMA_DIR, file));
    hash.update(file);
    hash.update(content);
  }

  return hash.digest("hex");
};

if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });

const schemaHash = computeSchemaHash();
writeFileSync(HASH_FILE, schemaHash);

// biome-ignore lint/suspicious/noConsole: build script
console.log(`[cacheSchemaHash] Wrote schema hash: ${schemaHash.slice(0, 12)}…`);
