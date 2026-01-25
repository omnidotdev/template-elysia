/**
 * Invalidate all cache keys for an organization.
 */
const invalidateOrganizationCache = async (
  redis: {
    keys: (pattern: string) => Promise<string[]>;
    del: (...keys: string[]) => Promise<number>;
  },
  orgId: string,
): Promise<void> => {
  const pattern = `org:${orgId}:*`;
  const keys = await redis.keys(pattern);

  if (keys.length > 0) await redis.del(...keys);
};

export default invalidateOrganizationCache;
