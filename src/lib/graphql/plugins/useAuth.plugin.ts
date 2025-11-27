import { useGenericAuth } from "@envelop/generic-auth";

import { AUTH_BASE_URL } from "lib/config/env.config";
import { userTable } from "lib/db/schema";

import type { ResolveUserFn } from "@envelop/generic-auth";
import type * as jose from "jose";
import type { InsertUser, SelectUser } from "lib/db/schema";
import type { GraphQLContext } from "lib/graphql/createGraphqlContext";

// TODO research best practices for all of this file (token validation, caching, etc.). Validate access token (introspection endpoint)? Cache userinfo output? etc. (https://linear.app/omnidev/issue/OMNI-302/increase-security-of-useauth-plugin)

/**
 * Validate user session and resolve user if successful.
 * @see https://the-guild.dev/graphql/envelop/plugins/use-generic-auth#getting-started
 */
const resolveUser: ResolveUserFn<SelectUser, GraphQLContext> = async (ctx) => {
  try {
    const accessToken = ctx.request.headers
      .get("authorization")
      ?.split("Bearer ")[1];

    if (!accessToken) throw new Error("Invalid or missing access token");

    // TODO validate access token (introspection endpoint?) here?

    // TODO cache so this doesn't occur on every request. Research best practices
    const userInfo = await fetch(`${AUTH_BASE_URL}/oauth2/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userInfo.ok) throw new Error("Invalid access token or request failed");

    const idToken: jose.JWTPayload = await userInfo.json();

    // TODO validate token, currently major security flaw (pending BA OIDC JWKS support: https://www.better-auth.com/docs/plugins/oidc-provider#jwks-endpoint-not-fully-implemented) (https://linear.app/omnidev/issue/OMNI-302/validate-id-token-with-jwks)
    // const jwks = jose.createRemoteJWKSet(new URL(`${AUTH_BASE_URL}/jwks`));
    // const { payload } = await jose.jwtVerify(JSON.stringify(idToken), jwks);
    // if (!payload) throw new Error("Failed to verify token");

    const insertedUser: InsertUser = {
      identityProviderId: idToken.sub!,
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
    mode: "protect-all",
  });

export default useAuth;
