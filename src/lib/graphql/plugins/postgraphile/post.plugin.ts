import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";
import { match } from "ts-pattern";

import { permit } from "lib/permit/permit";

import type { GraphQLContext } from "lib/graphql/createGraphqlContext";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

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

type MutationScope = "create" | "update" | "delete";

const validateBulkQueryPermissions = () =>
  EXPORTABLE(
    (permit, context, sideEffect, mockIdToken) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $input = fieldArgs.getRaw();
        const $observer = context<GraphQLContext>().get("observer");

        sideEffect([$input, $observer], async ([input, observer]) => {
          if (!input.condition.authorId || !observer) {
            throw new Error("Ooops");
          }

          const permitted = await permit.check(mockIdToken.sub, "read", {
            type: "post",
            attributes: { authorId: input.condition.authorId },
          });

          if (!permitted) throw new Error("Permission denied");
        });

        return plan();
      },
    [permit, context, sideEffect, mockIdToken],
  );

const validateQueryPermissions = (propName: string) =>
  EXPORTABLE(
    (permit, context, sideEffect, propName, mockIdToken) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $postId = fieldArgs.getRaw(["input", propName]);
        const $observer = context<GraphQLContext>().get("observer");

        sideEffect([$postId, $observer], async ([postId, observer]) => {
          if (!postId || !observer) {
            throw new Error("Ooops");
          }

          const permitted = await permit.check(mockIdToken.sub, "read", "post");

          if (!permitted) throw new Error("Permission denied");
        });

        return plan();
      },
    [permit, context, sideEffect, propName, mockIdToken],
  );

const validateMutatationPermissions = (
  propName: string,
  scope: MutationScope,
) =>
  EXPORTABLE(
    (permit, match, context, sideEffect, propName, scope, mockIdToken) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $postInput = fieldArgs.getRaw(["input", propName]);
        const $observer = context<GraphQLContext>().get("observer");

        sideEffect([$postInput, $observer], async ([postInput, observer]) => {
          if (!postInput || !observer) {
            throw new Error("Ooops");
          }

          const getPermission = async () =>
            match(scope)
              .with("update", () =>
                permit.check(mockIdToken.sub, "update", "post"),
              )
              .with("create", () =>
                permit.check(mockIdToken.sub, "create", "post"),
              )
              .with("delete", () =>
                permit.check(mockIdToken.sub, "delete", "post"),
              )
              .exhaustive();

          const permitted = await getPermission();

          if (!permitted) throw new Error("Permission denied");
        });

        return plan();
      },
    [permit, match, context, sideEffect, propName, scope, mockIdToken],
  );

export const PostPlugin = makeWrapPlansPlugin({
  Mutation: {
    createPost: validateMutatationPermissions("post", "create"),
    updatePost: validateMutatationPermissions("rowId", "update"),
    deletePost: validateMutatationPermissions("rowId", "delete"),
  },
  Query: {
    post: validateQueryPermissions("rowId"),
    posts: validateBulkQueryPermissions(),
  },
});
