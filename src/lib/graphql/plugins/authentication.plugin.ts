import { useGenericAuth } from "@envelop/generic-auth";
import { resolveAccessToken } from "@omnidotdev/providers";
import { QueryClient } from "@tanstack/query-core";
import ms from "ms";

import { AUTH_BASE_URL } from "lib/config/env.config";
import { userTable } from "lib/db/schema";

import type { ResolveUserFn } from "@envelop/generic-auth";
import type { InsertUser, SelectUser } from "lib/db/schema";
import type { GraphQLContext } from "lib/graphql/createGraphqlContext";

class AuthenticationError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "AuthenticationError";
    this.code = code;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: ms("2m"),
    },
  },
});

/**
 * Validate user session and resolve user if successful.
 * @see https://the-guild.dev/graphql/envelop/plugins/use-generic-auth#getting-started
 */
const resolveUser: ResolveUserFn<SelectUser, GraphQLContext> = async (ctx) => {
  try {
    const accessToken = ctx.request.headers
      .get("authorization")
      ?.split("Bearer ")[1];

    if (!accessToken) {
      if (process.env.PROTECT_ROUTES !== "true") return null;

      throw new AuthenticationError(
        "Invalid or missing access token",
        "MISSING_TOKEN",
      );
    }

    // Resolve token (JWT or opaque) into user claims via providers
    const claims = await queryClient.ensureQueryData({
      queryKey: ["UserInfo", { accessToken }],
      queryFn: () =>
        resolveAccessToken(accessToken, {
          authBaseUrl: AUTH_BASE_URL!,
          userinfoUrl: `${AUTH_BASE_URL}/oauth2/userinfo`,
        }),
    });

    if (!claims) {
      if (process.env.PROTECT_ROUTES !== "true") return null;

      throw new AuthenticationError(
        "Invalid access token or request failed",
        "INVALID_CLAIMS",
      );
    }

    const insertedUser: InsertUser = {
      identityProviderId: claims.sub,
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
    if (err instanceof AuthenticationError) {
      console.error(`[Auth] ${err.code}: ${err.message}`);
    } else {
      console.error("[Auth] Unexpected error:", err);
    }

    return null;
  }
};

/**
 * Create authentication plugin.
 * Factory function to ensure mode is evaluated at runtime, not module load time.
 * @see https://the-guild.dev/graphql/envelop/plugins/use-generic-auth
 */
const createAuthenticationPlugin = () =>
  useGenericAuth({
    contextFieldName: "observer",
    resolveUserFn: resolveUser,
    mode:
      process.env.PROTECT_ROUTES === "true" ? "protect-all" : "resolve-only",
  });

export default createAuthenticationPlugin;
