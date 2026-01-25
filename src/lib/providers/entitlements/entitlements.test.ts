import { describe, expect, it } from "bun:test";

import LocalEntitlementProvider from "./local.provider";

describe("LocalEntitlementProvider", () => {
  const provider = new LocalEntitlementProvider();

  it("returns unlimited entitlements", async () => {
    const result = await provider.getEntitlements("organization", "org-123");

    expect(result).not.toBeNull();
    expect(result?.entitlements.length).toBeGreaterThan(0);
    expect(
      result?.entitlements.find((e) => e.featureKey === "tier")?.value,
    ).toBe("enterprise");
  });

  it("includes entityType and entityId in response", async () => {
    const result = await provider.getEntitlements("organization", "my-org-id");

    expect(result?.entityType).toBe("organization");
    expect(result?.entityId).toBe("my-org-id");
  });

  it("checkEntitlement always returns true", async () => {
    const result = await provider.checkEntitlement(
      "organization",
      "org-123",
      "any_feature",
    );
    expect(result).toBe(true);
  });

  it("checkEntitlement returns true for known features", async () => {
    const features = ["tier", "max_members", "sso_enabled", "audit_logs"];

    for (const feature of features) {
      const result = await provider.checkEntitlement(
        "organization",
        "org-123",
        feature,
      );
      expect(result).toBe(true);
    }
  });

  it("getEntitlementValue returns value for known features", async () => {
    const result = await provider.getEntitlementValue(
      "organization",
      "org-123",
      "tier",
    );
    expect(result).toBe("enterprise");
  });

  it("getEntitlementValue returns 'unlimited' for unknown features", async () => {
    const result = await provider.getEntitlementValue(
      "organization",
      "org-123",
      "unknown_feature",
    );
    expect(result).toBe("unlimited");
  });

  it("healthCheck returns healthy", async () => {
    const result = await provider.healthCheck();
    expect(result.healthy).toBe(true);
    expect(result.message).toBe("Local provider always healthy");
  });
});
