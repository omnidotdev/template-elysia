import { yoga } from "@elysiajs/graphql-yoga";
import { useParserCache } from "@envelop/parser-cache";
import { useValidationCache } from "@envelop/validation-cache";
import { Elysia } from "elysia";
import { useGrafast } from "grafast/envelop";

import { schema } from "generated/graphql/schema.executable";
import appConfig from "lib/config/app.config";
import { PORT } from "lib/config/env.config";
import createGraphqlContext from "lib/graphql/createGraphqlContext";

/**
 * Elysia server.
 */
const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(
    yoga({
      schema,
      // @ts-ignore TODO
      context: createGraphqlContext,
      plugins: [
        // parser and validation caches recommended for Grafast (https://grafast.org/grafast/servers#envelop)
        useParserCache(),
        useValidationCache(),
        useGrafast(),
      ],
    }),
  )
  .listen(PORT);

console.log(
  `🦊 ${appConfig.name} server running at ${app.server?.hostname}:${app.server?.port}`,
);

console.log(
  `🚀 ${appConfig.name} GraphQL API running at http://${app.server?.hostname}:${app.server?.port}/graphql`,
);
