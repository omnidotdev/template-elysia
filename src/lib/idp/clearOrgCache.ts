import { orgExistsCache } from "./orgCache";

/**
 * Clear the organization cache (useful for testing).
 */
const clearOrgCache = (): void => {
  orgExistsCache.clear();
};

export default clearOrgCache;
