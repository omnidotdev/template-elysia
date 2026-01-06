import { describe, expect, test } from "bun:test";

import { makeElysiaApp } from "test/util/server";

describe("GET /health", () => {
  test("responds 200", async () => {
    const app = makeElysiaApp();

    const res = await app.handle(new Request("http://test/health"));

    expect(res.status).toBe(200);

    expect(await res.json()).toEqual({ ok: true });
  });
});
