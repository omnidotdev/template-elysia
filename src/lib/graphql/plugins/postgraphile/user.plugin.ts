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
        const $permit = context<GraphQLContext>().get("permit");

        sideEffect(
          [$observerId, $observer, $permit],
          async ([observerId, observer, permit]) => {
            if (!observer) {
              throw new Error("Unauthorized");
            }

            if (scope !== "create") {
              if (observerId !== observer.id) {
                throw new Error("Insufficient permissions");
              }
            } else {
              // TODO: uncomment below when full info can be derived from `observer` including role assignments, etc
              // const user = await permit.api.syncUser({
              //   key: "bc8d19ed-b69a-43c3-1e9d-2301b2541f92",
              //   first_name: "John",
              //   last_name: "Doe",
              //   email: "john@example.com",
              //   role_assignments: [{ role: "viewer", tenant: "default" }],
              // });
              // if (!user) throw new Error("Could not create user");
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
