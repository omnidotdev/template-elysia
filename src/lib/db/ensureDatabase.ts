import { Client } from "pg";

import { DATABASE_URL } from "lib/config/env.config";

/**
 * Parse database name and base connection URL from `DATABASE_URL`.
 */
const parseDatabaseUrl = (url: string) => {
  const urlObj = new URL(url);
  const databaseName = urlObj.pathname.slice(1); // remove leading "/"
  urlObj.pathname = "/postgres"; // connect to default postgres database

  return {
    databaseName,
    baseUrl: urlObj.toString(),
  };
};

/**
 * Ensure the database exists, creating it if necessary.
 * Should be called before starting the server.
 */
const ensureDatabase = async (): Promise<void> => {
  if (!DATABASE_URL) throw new Error("`DATABASE_URL` is not set");

  const { databaseName, baseUrl } = parseDatabaseUrl(DATABASE_URL);

  if (!databaseName)
    throw new Error("could not parse database name from `DATABASE_URL`");

  const client = new Client({ connectionString: baseUrl });

  try {
    await client.connect();

    // check if database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [databaseName],
    );

    if (result.rowCount === 0) {
      // biome-ignore lint/suspicious/noConsole: startup logging
      console.log(`[DB] Database "${databaseName}" not found, creating...`);

      // create the database (identifiers can't be parameterized, but we extracted it from our own URL)
      await client.query(`CREATE DATABASE "${databaseName}"`);

      // biome-ignore lint/suspicious/noConsole: startup logging
      console.log(`[DB] Database "${databaseName}" created successfully`);
    }
  } finally {
    await client.end();
  }
};

export default ensureDatabase;
