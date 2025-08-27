import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";
import { match } from "ts-pattern";

import { permit } from "lib/permit/permit";

import type { GraphQLContext } from "lib/graphql/createGraphqlContext";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

type MutationScope = "create" | "update" | "delete";

const validateBulkQueryPermissions = () =>
  EXPORTABLE(
    (permit, context, sideEffect) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $input = fieldArgs.getRaw();
        const $observer = context<GraphQLContext>().get("observer");

        sideEffect([$input, $observer], async ([input, observer]) => {
          // NB: this condition requires that all `posts` queries are filtered by an `authorId` condition. Should adjust accordingly when schema is expanded upon. Simply used to showcase permissions.
          if (!input.condition.authorId || !observer) {
            throw new Error("Ooops");
          }

          const permitted = await permit.check(
            observer.identityProviderId,
            "read",
            {
              type: "post",
              // Check that the user has permissions to read posts from the provided author through `authorId` condition
              attributes: { authorId: input.condition.authorId },
            },
          );

          if (!permitted) throw new Error("Permission denied");
        });

        return plan();
      },
    [permit, context, sideEffect],
  );

const validateQueryPermissions = (propName: string) =>
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

          const permitted = await permit.check(
            observer.identityProviderId,
            "read",
            "post",
          );

          if (!permitted) throw new Error("Permission denied");
        });

        return plan();
      },
    [permit, context, sideEffect, propName],
  );

const validateMutatationPermissions = (
  propName: string,
  scope: MutationScope,
) =>
  EXPORTABLE(
    (permit, match, context, sideEffect, propName, scope) =>
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
                permit.check(observer.identityProviderId, "update", "post"),
              )
              .with("create", () =>
                permit.check(observer.identityProviderId, "create", "post"),
              )
              .with("delete", () =>
                permit.check(observer.identityProviderId, "delete", "post"),
              )
              .exhaustive();

          const permitted = await getPermission();

          if (!permitted) throw new Error("Permission denied");
        });

        return plan();
      },
    [permit, match, context, sideEffect, propName, scope],
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
