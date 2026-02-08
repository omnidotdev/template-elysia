/**
 * Invalidate all cache keys for an organization.
 */
const invalidateOrganizationCache = async (
  cacheClient: {
    keys: (pattern: string) => Promise<string[]>;
    del: (...keys: string[]) => Promise<number>;
  },
  orgId: string,
): Promise<void> => {
  const pattern = `org:${orgId}:*`;
  const keys = await cacheClient.keys(pattern);

  if (keys.length > 0) await cacheClient.del(...keys);
};

export default invalidateOrganizationCache;
