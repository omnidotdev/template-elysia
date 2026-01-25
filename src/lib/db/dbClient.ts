import createDbClient from "./createDbClient";
import pgClient from "./pgClient";

/**
 * Database connection client.
 */
const dbClient = createDbClient(pgClient);

export default dbClient;
