import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";

import { AUTH_BASE_URL } from "lib/config/env.config";

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
 * Create a MSW server with mocked OIDC calls.
 */
export const mswServer = setupServer(
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
