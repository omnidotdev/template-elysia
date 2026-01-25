/**
 * IDP webhook handler for organization lifecycle events.
 *
 * Handles events from the IDP when organizations are deleted.
 * Extend this handler to clean up org-scoped resources as needed.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

import { Elysia, t } from "elysia";

import { AUTH_WEBHOOK_SECRET } from "lib/config/env.config";

interface IDPWebhookPayload {
  eventType: "organization.deleted";
  organizationId: string;
  deletedAt: string;
}

/**
 * Verify HMAC-SHA256 signature from the IDP.
 */
const verifySignature = (
  payload: string,
  signature: string,
  secret: string,
): boolean => {
  try {
    const expectedSignature = createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const signatureBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch {
    return false;
  }
};

/**
 * Handle organization deletion.
 * Extend this function to clean up org-scoped resources.
 */
const handleOrganizationDeleted = async (
  payload: IDPWebhookPayload,
): Promise<void> => {
  const { organizationId, deletedAt } = payload;

  // TODO: Add cleanup logic for org-scoped resources here
  // Example: soft-delete projects, revoke API keys, etc.

  // biome-ignore lint/suspicious/noConsole: structured logging
  console.log(
    JSON.stringify({
      type: "idp_webhook_processed",
      event: "organization.deleted",
      organizationId,
      deletedAt,
      timestamp: new Date().toISOString(),
    }),
  );
};

/**
 * IDP webhook receiver.
 * Receives organization lifecycle events from the IDP.
 *
 * This handler:
 * 1. Verifies HMAC-SHA256 signature
 * 2. Processes organization lifecycle events
 */
const idpWebhook = new Elysia().post(
  "/idp",
  async ({ request, headers, set }) => {
    const signature = headers["x-idp-signature"];
    const eventType = headers["x-idp-event"];

    if (!AUTH_WEBHOOK_SECRET) {
      console.warn(
        "AUTH_WEBHOOK_SECRET not set - skipping signature verification",
      );
    }

    try {
      const rawBody = await request.text();

      // verify signature if secret is configured
      if (AUTH_WEBHOOK_SECRET && signature) {
        const isValid = verifySignature(
          rawBody,
          signature,
          AUTH_WEBHOOK_SECRET,
        );

        if (!isValid) {
          set.status = 401;
          return { error: "Invalid signature" };
        }
      } else if (AUTH_WEBHOOK_SECRET && !signature) {
        set.status = 401;
        return { error: "Missing signature" };
      }

      const body = JSON.parse(rawBody) as IDPWebhookPayload;

      switch (body.eventType) {
        case "organization.deleted":
          await handleOrganizationDeleted(body);
          break;
        default:
          console.warn(`Unknown IDP event type: ${eventType}`);
      }

      set.status = 200;
      return { received: true };
    } catch (err) {
      console.error("Error processing IDP webhook:", err);
      set.status = 500;
      return { error: "Internal Server Error" };
    }
  },
  {
    headers: t.Object({
      "x-idp-signature": t.Optional(t.String()),
      "x-idp-event": t.Optional(t.String()),
    }),
  },
);

export default idpWebhook;
