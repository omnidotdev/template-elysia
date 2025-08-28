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
        const $input = fieldArgs.getRaw(["input", propName]);
        const $observer = context<GraphQLContext>().get("observer");
        const $permit = context<GraphQLContext>().get("permit");

        sideEffect(
          [$input, $observer, $permit],
          async ([input, observer, permit]) => {
            if (scope !== "create") {
              if (!observer) {
                throw new Error("Unauthorized");
              }

              // Only allow users to update their own records. `input` in this case will be the user's `rowId`
              if (input !== observer.id) {
                throw new Error("Insufficient permissions");
              }
            } else {
              // TODO: determine permissions check for creating a user as well as sync logic. For relations to seemlessly work, the `key` should be the `rowId` of the user (this allows us to compare to FKs easily)
              // await permit.api.syncUser({
              //   key: ** this should be the `rowId` of the created user **,
              //   first_name: input.firstName,
              //   last_name: input.lastName,
              //   email: input.email,
              //   role_assignments: [{ role: "viewer", tenant: "default" }],
              // });
            }
          },
        );

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
