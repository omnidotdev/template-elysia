import { Elysia } from "elysia";

import idpWebhook from "lib/idp/webhooks";
import billingWebhook from "lib/providers/billing/webhooks";

/**
 * Webhooks Elysia instance (effectively used as a plugin).
 * @see https://hookdeck.com/webhooks/guides/what-are-webhooks-how-they-work
 */
const webhooks = new Elysia({ prefix: "/webhooks" })
  .use(billingWebhook)
  .use(idpWebhook);

export default webhooks;
