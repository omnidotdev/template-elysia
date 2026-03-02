import { timingSafeEqual } from "node:crypto";

/**
 * Compare two secrets using a timing-safe comparison.
 * @param a - First secret
 * @param b - Second secret
 * @returns Whether the secrets match
 */
const secretsMatch = (a: string, b: string): boolean => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;

  return timingSafeEqual(bufA, bufB);
};

export default secretsMatch;
