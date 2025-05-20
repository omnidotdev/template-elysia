import { yoga } from "@elysiajs/graphql-yoga";
import { Elysia } from "elysia";

import { PORT } from "lib/config/env.config";

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
// .trace();

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
