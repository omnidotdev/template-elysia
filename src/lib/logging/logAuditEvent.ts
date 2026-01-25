interface TenantContext {
  organizationId?: string;
  workspaceId?: string;
  userId?: string;
  requestId?: string;
}

/**
 * Log an audit event for compliance tracking.
 */
const logAuditEvent = (
  context: TenantContext,
  evt: {
    action: string;
    resource: string;
    resourceId: string;
    details?: Record<string, unknown>;
  },
) => {
  const entry = {
    level: "audit",
    timestamp: new Date().toISOString(),
    tenant: {
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
    },
    requestId: context.requestId,
    action: evt.action,
    resource: evt.resource,
    resourceId: evt.resourceId,
    details: evt.details,
  };

  // biome-ignore lint/suspicious/noConsole: audit log output
  console.log(JSON.stringify(entry));
};

export default logAuditEvent;
