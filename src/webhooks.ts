import { Elysia } from "elysia";

import idpWebhook from "lib/idp/webhooks";
import entitlementsWebhook from "lib/providers/entitlements/webhooks";

/**
 * Webhooks Elysia instance (effectively used as a plugin).
 * @see https://hookdeck.com/webhooks/guides/what-are-webhooks-how-they-work
 */
const webhooks = new Elysia({ prefix: "/webhooks" })
  .use(entitlementsWebhook)
  .use(idpWebhook);

export default webhooks;
