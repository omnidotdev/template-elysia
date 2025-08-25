import { useGenericAuth } from "@envelop/generic-auth";
import { userTable } from "lib/db/schema";
import type { GraphQLContext } from "lib/graphql/createGraphqlContext";

import type { ResolveUserFn } from "@envelop/generic-auth";
import type { InsertUser, SelectUser } from "lib/db/schema";
import { permit } from "server";

// TODO research best practices for all of this file (token validation, caching, etc.). Validate access token (introspection endpoint)? Cache userinfo output? etc. (https://linear.app/omnidev/issue/OMNI-302/increase-security-of-useauth-plugin)

/**
 * Validate user session and resolve user if successful.
 * @see https://the-guild.dev/graphql/envelop/plugins/use-generic-auth#getting-started
 */
const resolveUser: ResolveUserFn<SelectUser, GraphQLContext> = async (ctx) => {
  try {
    // const accessToken = ctx.request.headers
    //   .get("authorization")
    //   ?.split("Bearer ")[1];

    // if (!accessToken) {
    //   if (!PROTECT_ROUTES) return null;

    //   throw new Error("Invalid or missing access token");
    // }

    // TODO validate access token (introspection endpoint?) here?

    // TODO cache so this doesn't occur on every request. Research best practices
    // const userInfo = await fetch(`${AUTH_BASE_URL}/oauth2/userinfo`, {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });

    // if (!userInfo.ok) {
    //   if (!PROTECT_ROUTES) return null;

    //   throw new Error("Invalid access token or request failed");
    // }

    // const idToken: jose.JWTPayload = await userInfo.json();

    // mock ID token
    const mockIdToken = {
      iss: "https://auth.example.com/",
      sub: "550e8400-e29b-41d4-a716-446655440000",
      aud: "template-elysia",
      exp: 1732591385,
      iat: 1732587785,
      auth_time: 1732587700, // Time user authenticated
      nonce: "n-0S6_WzA2Mj", // Nonce (replay protection)
      email: "user@example.com", // Standard claim
      email_verified: true, // Whether IdP verified email
      name: "Jane Doe", // User's full name
      given_name: "Jane",
      family_name: "Doe",
      preferred_username: "jdoe",
    };

    const permitted = await permit.check(mockIdToken.sub, "read", "post");

    permitted
      ? console.log("USER PERMITTED!")
      : console.log("USER NOT PERMITTED!");

    // TODO validate token, currently major security flaw (pending BA OIDC JWKS support: https://www.better-auth.com/docs/plugins/oidc-provider#jwks-endpoint-not-fully-implemented) (https://linear.app/omnidev/issue/OMNI-302/validate-id-token-with-jwks)
    // const jwks = jose.createRemoteJWKSet(new URL(`${AUTH_BASE_URL}/jwks`));
    // const { payload } = await jose.jwtVerify(JSON.stringify(idToken), jwks);
    // if (!payload) throw new Error("Failed to verify token");

    const insertedUser: InsertUser = {
      identityProviderId: mockIdToken.sub!,
    };

    const { identityProviderId, ...rest } = insertedUser;

    const [user] = await ctx.db
      .insert(userTable)
      .values(insertedUser)
      .onConflictDoUpdate({
        target: userTable.identityProviderId,
        set: {
          ...rest,
          updatedAt: new Date().toISOString(),
        },
      })
      .returning();

    return user;
  } catch (err) {
    console.error(err);

    return null;
  }
};

/**
 * Authentication plugin.
 */
const useAuth = () =>
  useGenericAuth({
    contextFieldName: "observer",
    resolveUserFn: resolveUser,
    // mode: PROTECT_ROUTES ? "protect-all" : "resolve-only",
    mode: "resolve-only",
  });

export default useAuth;
