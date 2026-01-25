/** Cache TTL for positive results (org exists) in milliseconds */
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** Cache for organization existence checks */
const orgExistsCache = new Map<
  string,
  { exists: boolean; expiresAt: number }
>();

export { orgExistsCache, CACHE_TTL_MS };
