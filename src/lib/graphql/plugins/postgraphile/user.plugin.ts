import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";
import { match } from "ts-pattern";

import type { GraphQLContext } from "lib/graphql/createGraphqlContext";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

type MutationScope = "create" | "update" | "delete";

const validatePermissions = (propName: string, scope: MutationScope) =>
  EXPORTABLE(
    (match, context, sideEffect, propName, scope) =>
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
              // TODO: update check constraints and make dependent on `observerId`
              const getPermission = async () =>
                match(scope)
                  .with("update", () =>
                    permit.check(observer.identityProviderId, "update", "user"),
                  )
                  .with("delete", () =>
                    permit.check(observer.identityProviderId, "delete", "user"),
                  )
                  .exhaustive();

              const permitted = await getPermission();

              if (!permitted) throw new Error("Permission denied");
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
    [match, context, sideEffect, propName, scope],
  );

/**
 * Plugin that handles API access for user table.
 */
export const UserPlugin = makeWrapPlansPlugin({
  Mutation: {
    createUser: validatePermissions("user", "create"),
    updateUser: validatePermissions("rowId", "update"),
    deleteUser: validatePermissions("rowId", "delete"),
  },
});
