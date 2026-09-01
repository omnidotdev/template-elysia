/**
 * Organization Context Middleware
 *
 * Elysia middleware that:
 * 1. Extracts organization from JWT claims
 * 2. Verifies the user is a member of that organization (coarse entry gate)
 * 3. Injects organization context for downstream handlers
 *
 * IMPORTANT: this is only a coarse "is the user in this org" gate. Passing it
 * does NOT authorize any specific action. Handlers must still check the
 * relevant relation ("viewer" | "editor" | "admin") on the specific resource:
 *
 *   app.use(organizationMiddleware)
 *      .get("/posts/:id", async ({ organization, params, store }) => {
 *        const userId = store.session.user.id;
 *        const canView = await authz.checkPermission(
 *          userId,
 *          "post",
 *          params.id,
 *          "viewer",
 *        );
 *        if (!canView) throw new Error("Forbidden");
 *        // organization context is available; the action is now authorized
 *      });
 */

import { Elysia } from "elysia";

import { authz } from "lib/providers";

/**
 * Relation a user must hold on an organization to pass the coarse entry gate.
 *
 * "member" is intentionally the broadest, most conservative admission check: it
 * proves the user belongs to the org, nothing more. Keep it fail-closed here
 * and authorize specific actions per-resource downstream. Widen this only if a
 * service deliberately admits weaker relations (e.g. read-only "viewer") to its
 * org-scoped routes.
 */
const ORGANIZATION_ACCESS_RELATION = "member";

interface OrganizationContext {
  id: string;
  slug: string;
  name: string;
  roles: string[];
}

/**
 * Organization middleware plugin for Elysia.
 *
 * Requires routes to have orgSlug param.
 */
const organizationMiddleware = new Elysia({
  name: "organization-middleware",
}).derive({ as: "scoped" }, async ({ params, set, store }) => {
  const { orgSlug } = params as { orgSlug?: string };

  // skip if not an org-scoped route
  if (!orgSlug) {
    return {};
  }

  // get session from store (assumes auth middleware ran first)
  const session = (
    store as {
      session?: {
        user: { id: string };
        organizations?: Array<{
          id: string;
          slug: string;
          name: string;
          roles: string[];
        }>;
      };
    }
  ).session;

  if (!session?.user) {
    set.status = 401;
    throw new Error("Unauthorized - no session");
  }

  // Find organization from JWT claims
  const orgClaim = session.organizations?.find((o) => o.slug === orgSlug);
  if (!orgClaim) {
    set.status = 403;
    throw new Error("Not a member of this organization");
  }

  // Coarse org-entry gate: confirm membership via the authz provider as
  // defense-in-depth against a stale JWT claim. Per-action checks belong in
  // the route handlers (see the doc comment above)
  const canAccess = await authz.checkPermission(
    session.user.id,
    "organization",
    orgClaim.id,
    ORGANIZATION_ACCESS_RELATION,
  );

  if (!canAccess) {
    set.status = 403;
    throw new Error("Access denied to organization");
  }

  // Return context for downstream handlers
  const organization: OrganizationContext = {
    id: orgClaim.id,
    slug: orgClaim.slug,
    name: orgClaim.name,
    roles: orgClaim.roles,
  };

  return { organization };
});

export type { OrganizationContext };

export default organizationMiddleware;
