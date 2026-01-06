import { Elysia } from "elysia";

/**
 * Webhooks Elysia instance (effectively used as a plugin).
 * @see https://hookdeck.com/webhooks/guides/what-are-webhooks-how-they-work
 */
const webhooks = new Elysia({ prefix: "/webhooks" });

// TODO add webhook routes here (e.g., Stripe)

export default webhooks;
