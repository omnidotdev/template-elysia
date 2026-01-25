import { DEFAULT_ORG_ID, isSelfHosted } from "lib/config/env.config";

/**
 * Get default organization context for self-hosted mode.
 * Used when org context is required but IDP is not available.
 */
const getDefaultOrgContext = () => {
  if (!isSelfHosted) return null;

  return {
    id: DEFAULT_ORG_ID,
    slug: "default",
    name: "Default Organization",
    type: "team" as const,
  };
};

export default getDefaultOrgContext;
