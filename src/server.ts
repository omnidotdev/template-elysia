import { cors } from "@elysiajs/cors";
import { yoga } from "@elysiajs/graphql-yoga";
import { useParserCache } from "@envelop/parser-cache";
import { useValidationCache } from "@envelop/validation-cache";
import { Elysia } from "elysia";
import { useGrafast } from "grafast/envelop";

import { schema } from "generated/graphql/schema.executable";
import appConfig from "lib/config/app.config";
import { CORS_ALLOWED_ORIGINS, PORT } from "lib/config/env.config";
import createGraphqlContext from "lib/graphql/createGraphqlContext";
import { armorPlugins, useAuth } from "lib/graphql/plugins";

/**
 * Elysia server.
 */
const app = new Elysia({
  serve: {
    // https://elysiajs.com/patterns/configuration#serve-tls
    // https://bun.sh/guides/http/tls
    // NB: Elysia (and Bun) trust the well-known CA list curated by Mozilla (https://wiki.mozilla.org/CA/Included_Certificates), but they can be customized here if needed (`tls.ca` option)
    tls: {
      certFile: "cert.pem",
      keyFile: "key.pem",
    },
  },
})
  .use(
    cors({
      origin: CORS_ALLOWED_ORIGINS!.split(","),
      methods: ["GET", "POST"],
    }),
  )
  .use(
    yoga({
      schema,
      // @ts-ignore TODO
      context: createGraphqlContext,
      plugins: [
        ...armorPlugins,
        useAuth(),
        // parser and validation caches recommended for Grafast (https://grafast.org/grafast/servers#envelop)
        useParserCache(),
        useValidationCache(),
        useGrafast(),
      ],
    }),
  )
  .listen(PORT);

console.log(
  `🦊 ${appConfig.name} server running at ${app.server?.url.toString().slice(0, -1)}`,
);

console.log(
  `🧘 ${appConfig.name} GraphQL Yoga API running at ${app.server?.url}graphql`,
);
