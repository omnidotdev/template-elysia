/**
 * Organization Context Middleware
 *
 * Elysia middleware that:
 * 1. Extracts organization from JWT claims
 * 2. Verifies user has access via authz provider
 * 3. Injects organization context for downstream handlers
 *
 * Usage:
 *   app.use(organizationMiddleware)
 *      .get("/posts", async ({ organization }) => {
 *        // organization context is now available
 *      });
 */

import { Elysia } from "elysia";

import { authz } from "lib/providers";

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

  // Check organization-level authorization via authz provider
  const canAccess = await authz.checkPermission(
    session.user.id,
    "organization",
    orgClaim.id,
    "viewer",
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
