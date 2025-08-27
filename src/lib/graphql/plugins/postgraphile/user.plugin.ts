import { EXPORTABLE } from "graphile-export/helpers";
import { context, sideEffect } from "postgraphile/grafast";
import { makeWrapPlansPlugin } from "postgraphile/utils";
import { match } from "ts-pattern";

import type { GraphQLContext } from "lib/graphql/createGraphqlContext";
import type { ExecutableStep, FieldArgs } from "postgraphile/grafast";

type MutationScope = "create" | "update" | "delete";

const validateBulkQueryPermissions = () =>
  EXPORTABLE(
    (context, sideEffect) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, _fieldArgs: FieldArgs) => {
        const $observer = context<GraphQLContext>().get("observer");
        const $permit = context<GraphQLContext>().get("permit");

        sideEffect([$observer, $permit], async ([observer, permit]) => {
          if (!observer) {
            throw new Error("Ooops");
          }

          // TODO: adjust permission check accordingly
          const permitted = await permit.check(
            observer.identityProviderId,
            "read",
            "user",
          );

          if (!permitted) throw new Error("Permission denied");
        });

        return plan();
      },
    [context, sideEffect],
  );

const validateQueryPermissions = (propName: string) =>
  EXPORTABLE(
    (context, sideEffect, propName) =>
      // biome-ignore lint/suspicious/noExplicitAny: SmartFieldPlanResolver is not an exported type
      (plan: any, _: ExecutableStep, fieldArgs: FieldArgs) => {
        const $userId = fieldArgs.getRaw(["input", propName]);
        const $observer = context<GraphQLContext>().get("observer");
        const $permit = context<GraphQLContext>().get("permit");

        sideEffect(
          [$userId, $observer, $permit],
          async ([userId, observer, permit]) => {
            if (!userId || !observer) {
              throw new Error("Ooops");
            }

            const permitted = await permit.check(
              observer.identityProviderId,
              "read",
              "user",
            );

            if (!permitted) throw new Error("Permission denied");
          },
        );

        return plan();
      },
    [context, sideEffect, propName],
  );

const validateMutationPermissions = (propName: string, scope: MutationScope) =>
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
              const permitted = await permit.check(
                "550e8400-e29b-41d4-a716-446655440000",
                "create",
                "user",
              );

              if (!permitted) throw new Error("Permission denied");

              // TODO: uncomment below when full info can be derived from `observer` including role assignments, etc
              // const user = await permit.api.syncUser({
              //   key: observer.identityProviderId,
              //   first_name: observer.firstName ?? undefined,
              //   last_name: observer.lastName ?? undefined,
              //   email: observer.email,
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
    createUser: validateMutationPermissions("user", "create"),
    updateUser: validateMutationPermissions("rowId", "update"),
    deleteUser: validateMutationPermissions("rowId", "delete"),
  },
  Query: {
    user: validateQueryPermissions("rowId"),
    users: validateBulkQueryPermissions(),
  },
});
