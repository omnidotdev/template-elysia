import { Elysia } from "elysia";

import { PORT } from "lib/config/env.config";

const app = new Elysia().get("/", () => "Hello Elysia").listen(PORT);
// .trace();

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
