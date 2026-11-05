/**
 * @file Run database migrations with error visibility, resilient to tracker
 * drift.
 *
 * Wraps drizzle-orm's `migrate` so failures surface the actual error instead of
 * a silent exit code 1.
 *
 * It also self-heals the one failure mode that otherwise bricks boot: if the
 * drizzle-orm migration tracker (`drizzle.__drizzle_migrations`) falls behind
 * the database - e.g. after a migration regen/squash, a partial run, or a
 * restore - `migrate` re-applies an already-applied migration and aborts on a
 * non-idempotent statement (`CREATE POLICY ... already exists`, and similar
 * `duplicate_*` errors). On such an error we reconcile the tracker to reality
 * (probing each untracked migration in a rolled-back transaction and recording
 * the ones whose objects already exist) and retry once. A genuinely pending
 * migration still applies normally; a real error still surfaces.
 *
 * Note: a migration containing a statement that cannot run inside a transaction
 * (e.g. `CREATE INDEX CONCURRENTLY`) is not reconcilable by the probe and will
 * surface its error rather than self-heal.
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("[Migrate] DATABASE_URL is not set");
  process.exit(1);
}

const MIGRATIONS_FOLDER = "src/generated/drizzle";

/** Postgres SQLSTATEs that mean "this object already exists" (duplicate_*). */
const ALREADY_EXISTS = new Set([
  "42710", // duplicate_object (policy, trigger, ...)
  "42P07", // duplicate_table
  "42P06", // duplicate_schema
  "42701", // duplicate_column
  "42P04", // duplicate_database
  "42723", // duplicate_function
]);

interface JournalEntry {
  idx: number;
  tag: string;
  when: number;
}

/**
 * True when an error (or any error in its `cause` chain) is a Postgres
 * "already exists" error, i.e. a migration being re-applied over objects that
 * are already present.
 */
const isAlreadyExists = (err: unknown): boolean => {
  let current: unknown = err;
  while (current && typeof current === "object") {
    const code = (current as { code?: unknown }).code;
    if (typeof code === "string" && ALREADY_EXISTS.has(code)) return true;
    current = (current as { cause?: unknown }).cause;
  }
  return false;
};

/**
 * Reconcile the migration tracker with the database after a re-apply error.
 *
 * For each journal entry not yet recorded in the tracker, in order, probe its
 * SQL inside a rolled-back transaction: if a statement fails because the object
 * already exists, the migration is already applied, so record it; if every
 * statement would succeed, it is genuinely pending, so leave it for the
 * migrator and stop (later migrations depend on it). The probe never commits,
 * so it is side-effect free. Relies on migrations being applied atomically
 * (drizzle wraps each in a transaction), so a migration is fully present or
 * fully absent, never partial.
 *
 * @returns the number of migrations backfilled (retry the migrate if > 0)
 */
const reconcileTracker = async (pool: Pool): Promise<number> => {
  const journal = JSON.parse(
    readFileSync(join(MIGRATIONS_FOLDER, "meta", "_journal.json"), "utf-8"),
  ) as { entries: JournalEntry[] };

  await pool.query('CREATE SCHEMA IF NOT EXISTS "drizzle"');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
      id SERIAL PRIMARY KEY,
      hash TEXT NOT NULL,
      created_at BIGINT
    )
  `);

  const { rows } = await pool.query<{ hash: string }>(
    'SELECT hash FROM "drizzle"."__drizzle_migrations"',
  );
  const trackedHashes = new Set(rows.map((r) => r.hash));

  let backfilled = 0;

  for (const entry of journal.entries) {
    const sql = readFileSync(
      join(MIGRATIONS_FOLDER, `${entry.tag}.sql`),
      "utf-8",
    );
    // drizzle-orm records the sha256 of the migration file's contents as `hash`
    const hash = createHash("sha256").update(sql).digest("hex");
    if (trackedHashes.has(hash)) continue;

    const statements = sql
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean);

    const client = await pool.connect();
    let alreadyApplied = false;
    try {
      await client.query("BEGIN");
      for (const statement of statements) await client.query(statement);
      // Applied cleanly in the probe => genuinely pending; leave for migrate().
      await client.query("ROLLBACK");
      break;
    } catch (probeErr) {
      await client.query("ROLLBACK").catch(() => {});
      if (!isAlreadyExists(probeErr)) throw probeErr;
      alreadyApplied = true;
    } finally {
      client.release();
    }

    if (alreadyApplied) {
      await pool.query(
        'INSERT INTO "drizzle"."__drizzle_migrations" (hash, created_at) VALUES ($1, $2)',
        [hash, entry.when],
      );
      console.warn(
        `[Migrate] Reconciled already-applied migration ${entry.tag} into the tracker`,
      );
      backfilled++;
    }
  }

  return backfilled;
};

const pool = new Pool({ connectionString: DATABASE_URL });

try {
  const db = drizzle({ client: pool, casing: "snake_case" });

  // biome-ignore lint/suspicious/noConsole: migration status logging
  console.info("[Migrate] Applying migrations...");
  try {
    await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
  } catch (err) {
    if (!isAlreadyExists(err)) throw err;
    // A migration re-applied over existing objects: tracker is behind the
    // database. Reconcile and retry once.
    console.warn(
      "[Migrate] Migration re-applied over existing objects; reconciling tracker",
    );
    const backfilled = await reconcileTracker(pool);
    if (backfilled === 0) throw err;
    await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
  }
  // biome-ignore lint/suspicious/noConsole: migration status logging
  console.info("[Migrate] Migrations applied successfully");
} catch (err) {
  console.error("[Migrate] Migration failed:", err);
  process.exit(1);
} finally {
  await pool.end();
}
