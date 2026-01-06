import { afterEach, describe, expect, test } from "bun:test";

import { mswServer } from "test/setup/mswServer";
import { makeYogaServer } from "test/util/server";

const AUTH_TOKEN = "good-token";

afterEach(() => {
  mswServer.resetHandlers();
});

describe("GraphQL auth via useAuth", () => {
  test("throws error if user is not authenticated", async () => {
    const yoga = makeYogaServer();

    const query = /* GraphQL */ `
      {
        users {
          nodes {
            id
          }
        }
      }
    `;

    const res = await yoga.fetch("http://test/graphql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query }),
    });

    expect(res.status).toBe(401);

    const json = await res.json();

    expect(json.errors).toBeDefined();
    expect(json.errors[0].message).toBe("Unauthorized field or type");
  });

  test("inserts or updates user on first authenticated request", async () => {
    const yoga = makeYogaServer({
      headers: { authorization: `Bearer ${AUTH_TOKEN}` },
    });

    const query = /* GraphQL */ `
      {
        users {
          nodes {
            id
          }
        }
      }
    `;

    const res = await yoga.fetch("http://test/graphql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const json = await res.json();

    expect(json.errors).toBeUndefined();
  });
});
