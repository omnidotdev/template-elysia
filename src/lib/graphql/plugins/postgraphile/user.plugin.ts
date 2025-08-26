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
        const $observerId = fieldArgs.getRaw(["input", propName]);
        const $observer = context<GraphQLContext>().get("observer");

        sideEffect(
          [$observerId, $observer],
          async ([observerId, currentObserver]) => {
            if (!currentObserver) {
              throw new Error("Unauthorized");
            }

            if (observerId !== currentObserver.id) {
              throw new Error("Insufficient permissions");
            }
          },
        );

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
