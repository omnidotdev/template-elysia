import { describe, expect, it } from "bun:test";

import { LocalAuthzProvider } from "@omnidotdev/providers";

describe("LocalAuthzProvider", () => {
  const provider = new LocalAuthzProvider();

  it("always returns true for checkPermission", async () => {
    const result = await provider.checkPermission(
      "user-123",
      "organization",
      "ws-456",
      "read",
    );
    expect(result).toBe(true);
  });

  it("checkPermission returns true regardless of permission type", async () => {
    const permissions = ["read", "write", "admin", "owner", "nonexistent"];

    for (const permission of permissions) {
      const result = await provider.checkPermission(
        "user-123",
        "organization",
        "ws-456",
        permission,
      );
      expect(result).toBe(true);
    }
  });

  it("writeTuples succeeds", async () => {
    const result = await provider.writeTuples?.([
      { user: "user:123", relation: "member", object: "org:456" },
    ]);
    expect(result).toEqual({ success: true });
  });

  it("deleteTuples succeeds", async () => {
    const result = await provider.deleteTuples?.([
      { user: "user:123", relation: "member", object: "org:456" },
    ]);
    expect(result).toEqual({ success: true });
  });

  it("healthCheck returns healthy", async () => {
    const result = await provider.healthCheck?.();
    expect(result?.healthy).toBe(true);
    expect(result?.message).toBe("Local provider always healthy");
  });
});
