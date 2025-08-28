import { eq } from "drizzle-orm";
import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import * as schema from "lib/db/schema";

import type { GraphQLContext } from "lib/graphql/createGraphqlContext";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

type MutationScope = "create" | "update" | "delete";

const validateBulkQueryPermissions = () =>
  EXPORTABLE(
    (context, sideEffect) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $input = fieldArgs.getRaw();
        const $observer = context<GraphQLContext>().get("observer");
        const $permit = context<GraphQLContext>().get("permit");

        sideEffect(
          [$input, $observer, $permit],
          async ([input, observer, permit]) => {
            // NB: this condition requires that all `posts` queries are filtered by an `authorId` condition. Should adjust accordingly when schema is expanded upon. Simply used to showcase permissions.
            if (!input.condition.authorId || !observer) {
              throw new Error("Ooops");
            }

            const permitted = await permit.check(
              observer.id,
              "read",
              "post",
              // TODO: replace `post` above with something like below. ABAC checks not supported by the cloud PDP currently
              // You are passing attributes which are indication of an ABAC permission check. Currently, this is not supported by the cloud PDP.
              // Please use the Docker PDP for ABAC checks. https://docs.permit.io/how-to/deploy/deploy-to-production/#installing-the-pdp
              // {
              //   type: "post",
              //   // Check that the user has permissions to read posts from the provided author through `authorId` condition
              //   attributes: { authorId: input.condition.authorId },
              // },
            );

            if (!permitted) throw new Error("Permission denied");
          },
        );

        return plan();
      },
    [context, sideEffect],
  );

const validateQueryPermissions = (propName: string) =>
  EXPORTABLE(
    (context, sideEffect, propName) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $postId = fieldArgs.getRaw(["input", propName]);
        const $observer = context<GraphQLContext>().get("observer");
        const $permit = context<GraphQLContext>().get("permit");

        sideEffect(
          [$postId, $observer, $permit],
          async ([postId, observer, permit]) => {
            if (!postId || !observer) {
              throw new Error("Ooops");
            }

            const permitted = await permit.check(observer.id, "read", "post");

            if (!permitted) throw new Error("Permission denied");
          },
        );

        return plan();
      },
    [context, sideEffect, propName],
  );

const validateMutatationPermissions = (
  propName: string,
  scope: MutationScope,
) =>
  EXPORTABLE(
    (eq, schema, context, sideEffect, propName, scope) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $input = fieldArgs.getRaw(["input", propName]);
        const $observer = context<GraphQLContext>().get("observer");
        const $permit = context<GraphQLContext>().get("permit");
        const $db = context<GraphQLContext>().get("db");

        sideEffect(
          [$input, $observer, $permit, $db],
          async ([input, observer, permit, db]) => {
            if (!input || !observer) {
              throw new Error("Ooops");
            }
            const { postTable } = schema;

            if (scope !== "create") {
              const [post] = await db
                .select({ authorId: postTable.authorId })
                .from(postTable)
                .where(eq(postTable.id, input));

              const permitted = await permit.check(observer.id, scope, {
                type: "post",
                attributes: { authorId: post.authorId },
              });

              if (!permitted) throw new Error("Permission denied");
            } else {
              const permitted = await permit.check(
                observer.id,
                "create",
                "post",
              );

              if (!permitted) throw new Error("Permission denied");
            }
          },
        );

        return plan();
      },
    [eq, schema, context, sideEffect, propName, scope],
  );

/**
 * Plugin that handles API access for post table.
 */
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
