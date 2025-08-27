import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";

import type { GraphQLContext } from "lib/graphql/createGraphqlContext";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

type MutationScope = "create" | "update" | "delete";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (context, sideEffect, propName, scope) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $observerId = fieldArgs.getRaw(["input", propName]);
        const $observer = context<GraphQLContext>().get("observer");

        sideEffect([$observerId, $observer], async ([observerId, observer]) => {
          if (!observer) {
            throw new Error("Unauthorized");
          }

          // TODO: permissions for creating users

          if (scope !== "create") {
            if (observerId !== observer.id) {
              throw new Error("Insufficient permissions");
            }
          }
        });

        return plan();
      },
    [context, sideEffect, propName, scope],
  );

/**
 * Plugin that handles API access for user table mutations.
 */
export const UserPlugin = makeWrapPlansPlugin({
  Mutation: {
    createUser: validatePermissions("user", "create"),
    updateUser: validatePermissions("rowId", "update"),
    deleteUser: validatePermissions("rowId", "delete"),
  },
});
