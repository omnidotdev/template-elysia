import createDbClient from "./createDbClient";
import pgPool from "./pgPool";

/**
 * Database connection pool.
 */
const dbPool = createDbClient(pgPool);

export default dbPool;
