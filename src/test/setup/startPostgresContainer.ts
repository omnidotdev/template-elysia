// TODO: Switch back to testcontainers once Bun compatibility is confirmed
// @see https://github.com/testcontainers/testcontainers-node/issues/807
// The issue is marked resolved but still hangs with Bun as of testcontainers v11.11.0

const CONTAINER_LABEL = "template-elysia-test";
const CONTAINER_NAME = "template-elysia-test-postgres";
const POSTGRES_IMAGE = "postgres:16-alpine";
const POSTGRES_USER = "test";
const POSTGRES_PASSWORD = "test";
const POSTGRES_DB = "template_elysia_test";
const POSTGRES_PORT = "54320"; // Use non-standard port to avoid conflicts

interface PostgresContainer {
  getConnectionUri: () => string;
  stop: () => Promise<void>;
}

let container: PostgresContainer | null = null;

/**
 * Wait for PostgreSQL to be ready to accept connections.
 * Uses pg_isready first, then verifies with an actual query.
 */
const waitForPostgres = async (
  containerName: string,
  timeoutMs = 30000,
): Promise<void> => {
  const startTime = Date.now();

  // Wait for pg_isready
  while (Date.now() - startTime < timeoutMs) {
    const result = Bun.spawnSync({
      cmd: [
        "docker",
        "exec",
        containerName,
        "pg_isready",
        "-U",
        POSTGRES_USER,
        "-d",
        POSTGRES_DB,
        "-p",
        POSTGRES_PORT,
      ],
    });

    if (result.exitCode === 0) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Verify with actual query to ensure database is ready
  while (Date.now() - startTime < timeoutMs) {
    const result = Bun.spawnSync({
      cmd: [
        "docker",
        "exec",
        containerName,
        "psql",
        "-U",
        POSTGRES_USER,
        "-d",
        POSTGRES_DB,
        "-p",
        POSTGRES_PORT,
        "-c",
        "SELECT 1",
      ],
    });

    if (result.exitCode === 0) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`PostgreSQL not ready after ${timeoutMs}ms`);
};

/**
 * Clean up any orphaned test containers from previous runs.
 */
export const cleanupOrphanedContainers = async (): Promise<void> => {
  try {
    const result = Bun.spawnSync({
      cmd: ["docker", "ps", "-aq", "--filter", `label=${CONTAINER_LABEL}`],
    });

    const containerIds = result.stdout
      .toString()
      .trim()
      .split("\n")
      .filter(Boolean);

    if (containerIds.length > 0) {
      console.log(
        `[preload] Removing ${containerIds.length} orphaned container(s)...`,
      );
      Bun.spawnSync({
        cmd: ["docker", "rm", "-f", ...containerIds],
      });
    }
  } catch {
    // Ignore errors - cleanup is best-effort
  }
};

/**
 * Start a PostgreSQL container for testing using Docker directly.
 * Uses host networking to avoid Docker port mapping issues.
 */
export const startPostgresContainer = async (): Promise<PostgresContainer> => {
  // Start the container with host networking
  const startResult = Bun.spawnSync({
    cmd: [
      "docker",
      "run",
      "-d",
      "--name",
      CONTAINER_NAME,
      "--label",
      `${CONTAINER_LABEL}=true`,
      "--network",
      "host",
      "-e",
      `POSTGRES_USER=${POSTGRES_USER}`,
      "-e",
      `POSTGRES_PASSWORD=${POSTGRES_PASSWORD}`,
      "-e",
      `POSTGRES_DB=${POSTGRES_DB}`,
      "-e",
      "POSTGRES_HOST_AUTH_METHOD=trust",
      "-e",
      `PGPORT=${POSTGRES_PORT}`,
      POSTGRES_IMAGE,
      "-c",
      `port=${POSTGRES_PORT}`,
    ],
  });

  if (startResult.exitCode !== 0) {
    throw new Error(
      `Failed to start PostgreSQL container: ${startResult.stderr.toString()}`,
    );
  }

  const connectionUri = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@127.0.0.1:${POSTGRES_PORT}/${POSTGRES_DB}`;

  // Wait for PostgreSQL to be ready
  await waitForPostgres(CONTAINER_NAME);

  container = {
    getConnectionUri: () => connectionUri,
    stop: async () => {
      Bun.spawnSync({ cmd: ["docker", "rm", "-f", CONTAINER_NAME] });
    },
  };

  return container;
};

/**
 * Get the running container instance.
 */
export const getContainer = (): PostgresContainer | null => container;

/**
 * Stop the PostgreSQL container.
 */
export const stopPostgresContainer = async (): Promise<void> => {
  if (container) {
    await container.stop();
    container = null;
  }
};
