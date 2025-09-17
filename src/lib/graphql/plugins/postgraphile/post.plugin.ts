import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import { CheckResult } from "@permify/permify-node/dist/src/grpc/generated/base/v1/base";
import type { GraphQLContext } from "lib/graphql/createGraphqlContext";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

type MutationScope = "create" | "update" | "delete";

const validateBulkQueryPermissions = () =>
  EXPORTABLE(
    (context, sideEffect) =>
      // biome-ignore lint: TODO: automatic TS inference
      (plan: any, _source: ExecutableStep, args: FieldArgs) => {
        const $input = args.getRaw();
        const $observer = context<GraphQLContext>().get("observer");
        const $authorization = context<GraphQLContext>().get("authorization");

        sideEffect(
          [$input, $observer, $authorization],
          async ([input, observer, authorization]) => {
            if (!observer) throw new Error("Observer not found");

            // TODO: add bulk permissions check
          },
        );

        return plan();
      },
    [context, sideEffect],
  );

const validateQueryPermissions = () =>
  EXPORTABLE(
    (context, sideEffect) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $input = fieldArgs.getRaw();
        const $observer = context<GraphQLContext>().get("observer");
        const $authorization = context<GraphQLContext>().get("authorization");

        sideEffect(
          [$input, $observer, $authorization],
          async ([input, observer, authorization]) => {
            if (!input.rowId || !observer) {
              throw new Error("Ooops");
            }

            const permitted = await authorization.permission.check({
              tenantId: "template-elysia",
              entity: {
                type: "post",
                id: input.rowId,
              },
              permission: "view",
              subject: {
                type: "user",
                id: observer.id,
              },
            });

            // TODO: make sure to add `CheckResult` import path the the generate schema script
            if (permitted.can !== CheckResult.CHECK_RESULT_ALLOWED)
              throw new Error("Permission denied");
          },
        );

        return plan();
      },
    [context, sideEffect],
  );

const validateMutatationPermissions = (
  propName: string,
  scope: MutationScope,
) =>
  EXPORTABLE(
    (context, sideEffect, propName, scope) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $input = fieldArgs.getRaw(["input", propName]);
        const $observer = context<GraphQLContext>().get("observer");
        const $authorization = context<GraphQLContext>().get("authorization");

        sideEffect(
          [$input, $observer, $authorization],
          async ([input, observer, authorization]) => {
            if (!input || !observer) {
              throw new Error("Ooops");
            }

            if (scope !== "create") {
              const permitted = await authorization.permission.check({
                tenantId: "template-elysia",
                entity: {
                  type: "post",
                  id: input,
                },
                permission: scope,
                subject: {
                  type: "user",
                  id: observer.id,
                },
              });

              if (permitted.can !== CheckResult.CHECK_RESULT_ALLOWED)
                throw new Error("Permission denied");
            } else {
              const permitted = await authorization.permission.check({
                tenantId: "template-elysia",
                entity: {
                  type: "post",
                },
                // TODO: add create permission scope
                permission: "create",
                subject: {
                  type: "user",
                  id: observer.id,
                },
              });

              if (permitted.can !== CheckResult.CHECK_RESULT_ALLOWED)
                throw new Error("Permission denied");
            }
          },
        );

        return plan();
      },
    [context, sideEffect, propName, scope],
  );

/**
 * Plugin that handles API access for post table.
 */
export const PostPlugin = makeWrapPlansPlugin({
  Query: {
    post: validateQueryPermissions(),
    posts: validateBulkQueryPermissions(),
  },
  Mutation: {
    createPost: validateMutatationPermissions("post", "create"),
    updatePost: validateMutatationPermissions("rowId", "update"),
    deletePost: validateMutatationPermissions("rowId", "delete"),
  },
});
