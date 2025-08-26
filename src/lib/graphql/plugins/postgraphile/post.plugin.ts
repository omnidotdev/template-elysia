import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import { permit } from "lib/permit/permit";

import type { GraphQLContext } from "lib/graphql/createGraphqlContext";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

const validatePermissions = (propName: string) =>
  EXPORTABLE(
    (permit, context, sideEffect, propName) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $postId = fieldArgs.getRaw(["input", propName]);
        const $observer = context<GraphQLContext>().get("observer");

        sideEffect([$postId, $observer], async ([postId, observer]) => {
          if (!postId || !observer) {
            throw new Error("Ooops");
          }

          // TODO: extract from context
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

          // TODO: update permission set for appropriate validation context
          const permitted = await permit.check(mockIdToken.sub, "read", "post");

          if (!permitted) throw new Error("Permission denied");
        });

        return plan();
      },
    [permit, context, sideEffect, propName],
  );

export const PostPlugin = makeWrapPlansPlugin({
  Mutation: {
    updatePost: validatePermissions("rowId"),
    deletePost: validatePermissions("rowId"),
  },
});
