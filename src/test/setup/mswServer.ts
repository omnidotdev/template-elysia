import { exportJWK, generateKeyPair, SignJWT } from "jose";
import { AUTH_BASE_URL } from "lib/config/env.config";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";

export const TEST_USER_ID = "e5d5d4ce-1ee4-42c0-b223-7ad2173a4616";

/**
 * Default test user returned by mocked OIDC endpoint.
 * Use this constant for consistent test assertions.
 */
export const TEST_USER = {
  id: TEST_USER_ID,
  email: "test@example.com",
  name: "Test User",
} as const;

/**
 * Test key pair for JWT signing/verification.
 * Generated once and reused for all tests.
 */
const testKeyPair = await generateKeyPair("RS256");
const testPublicJwk = await exportJWK(testKeyPair.publicKey);
testPublicJwk.kid = "test-key-id";
testPublicJwk.use = "sig";
testPublicJwk.alg = "RS256";

/**
 * Generate a valid test JWT.
 */
export const generateTestToken = async (
  claims: { sub: string } & Record<string, unknown> = { sub: TEST_USER_ID },
): Promise<string> => {
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT(claims)
    .setProtectedHeader({ alg: "RS256", kid: "test-key-id" })
    .setIssuer(AUTH_BASE_URL)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(testKeyPair.privateKey);
};

/**
 * Pre-generated test token for convenience.
 */
export const TEST_TOKEN = await generateTestToken();

/**
 * Create a MSW server with mocked OIDC calls.
 */
export const mswServer = setupServer(
  // Mock JWKS endpoint for JWT verification
  http.get(`${AUTH_BASE_URL}/.well-known/jwks.json`, () => {
    return HttpResponse.json({
      keys: [testPublicJwk],
    });
  }),

  // Mock userinfo endpoint
  http.get(`${AUTH_BASE_URL}/oauth2/userinfo`, async ({ request }) => {
    const auth = request.headers.get("authorization") ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

    if (!token || token === "bad") {
      return HttpResponse.json({ error: "invalid_token" }, { status: 401 });
    }

    return HttpResponse.json({
      sub: TEST_USER.id,
      email: TEST_USER.email,
      name: TEST_USER.name,
    });
  }),
);
