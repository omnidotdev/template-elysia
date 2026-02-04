import { describe, expect, it } from "bun:test";

import LocalBillingProvider from "./local.provider";

describe("LocalBillingProvider", () => {
  const provider = new LocalBillingProvider();

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

  it("checkEntitlement returns value for known features", async () => {
    const result = await provider.checkEntitlement(
      "organization",
      "org-123",
      "platform",
      "tier",
    );
    expect(result).toBe("enterprise");
  });

  it("checkEntitlement returns value for various features", async () => {
    const features = [
      { key: "tier", expected: "enterprise" },
      { key: "max_members", expected: "unlimited" },
      { key: "max_workspaces", expected: "unlimited" },
      { key: "sso_enabled", expected: "true" },
      { key: "audit_logs", expected: "true" },
    ];

    for (const { key, expected } of features) {
      const result = await provider.checkEntitlement(
        "organization",
        "org-123",
        "platform",
        key,
      );
      expect(result).toBe(expected);
    }
  });

  it("checkEntitlement returns unlimited for unknown features", async () => {
    const result = await provider.checkEntitlement(
      "organization",
      "org-123",
      "platform",
      "unknown_feature",
    );
    expect(result).toBe("unlimited");
  });

  it("healthCheck returns healthy", async () => {
    const result = await provider.healthCheck();
    expect(result.healthy).toBe(true);
    expect(result.message).toBe("Local provider always healthy");
  });

  it("getPrices returns empty array", async () => {
    const result = await provider.getPrices("platform");
    expect(result).toEqual([]);
  });

  it("getSubscription returns mock subscription", async () => {
    const result = await provider.getSubscription(
      "organization",
      "org-123",
      "token",
    );
    expect(result).not.toBeNull();
    expect(result?.status).toBe("active");
    expect(result?.product?.name).toBe("Self-Hosted Enterprise");
  });

  it("getBillingPortalUrl returns returnUrl", async () => {
    const returnUrl = "https://example.com/return";
    const result = await provider.getBillingPortalUrl(
      "organization",
      "org-123",
      "platform",
      returnUrl,
      "token",
    );
    expect(result).toBe(returnUrl);
  });

  it("cancelSubscription returns self-hosted", async () => {
    const result = await provider.cancelSubscription(
      "organization",
      "org-123",
      "token",
    );
    expect(result).toBe("self-hosted");
  });

  it("renewSubscription completes without error", async () => {
    await expect(
      provider.renewSubscription("organization", "org-123", "token"),
    ).resolves.toBeUndefined();
  });

  it("createCheckoutSession throws", async () => {
    await expect(
      provider.createCheckoutSession({
        priceId: "price_123",
        successUrl: "https://example.com/success",
        customerEmail: "test@example.com",
      }),
    ).rejects.toThrow("Billing is not available in self-hosted mode");
  });

  it("createCheckoutWithWorkspace throws", async () => {
    await expect(
      provider.createCheckoutWithWorkspace({
        appId: "app_123",
        priceId: "price_123",
        successUrl: "https://example.com/success",
        cancelUrl: "https://example.com/cancel",
        accessToken: "token",
      }),
    ).rejects.toThrow("Billing is not available in self-hosted mode");
  });
});
