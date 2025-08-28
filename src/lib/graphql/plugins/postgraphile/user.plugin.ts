import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import type { GraphQLContext } from "lib/graphql/createGraphqlContext";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

const validatePermissions = (propName: string) =>
  EXPORTABLE(
    (context, sideEffect, propName) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $userId = fieldArgs.getRaw(["input", propName]);
        const $observer = context<GraphQLContext>().get("observer");

        sideEffect([$userId, $observer], async ([userId, observer]) => {
          if (!observer) {
            throw new Error("Unauthorized");
          }

          if (userId !== observer.id) {
            throw new Error("Insufficient permissions");
          }
        });

        return plan();
      },
    [context, sideEffect, propName],
  );

/**
 * Plugin that handles API access for user table mutations.
 */
export const UserPlugin = makeWrapPlansPlugin({
  Mutation: {
    updateUser: validatePermissions("rowId"),
    deleteUser: validatePermissions("rowId"),
  },
});
