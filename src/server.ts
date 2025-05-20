import { yoga } from "@elysiajs/graphql-yoga";
import { Elysia } from "elysia";

import appConfig from "lib/config/app.config";
import { PORT } from "lib/config/env.config";

/**
 * Elysia server.
 */
const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(
    yoga({
      typeDefs: /* GraphQL */ `
        type Query {
          hi: String
        }
      `,
      resolvers: {
        Query: {
          hi: () => "Hello from Elysia",
        },
      },
    }),
  )
  .listen(PORT);

console.log(
  `🦊 ${appConfig.name} server running at ${app.server?.hostname}:${app.server?.port}`,
);

console.log(
  `🚀 ${appConfig.name} GraphQL API running at http://${app.server?.hostname}:${app.server?.port}/graphql`,
);
