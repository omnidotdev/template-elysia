/**
 * Tenant-Aware Logging
 *
 * Creates loggers with tenant context automatically included.
 * Every log entry will include organizationId, workspaceId, userId.
 *
 * Usage:
 *   const logger = createTenantLogger({
 *     organizationId: context.organization.id,
 *     workspaceId: context.workspace.id,
 *     userId: context.session.user.id,
 *   });
 *   logger.info({ projectId }, "Project created");
 */

interface TenantContext {
  organizationId?: string;
  workspaceId?: string;
  userId?: string;
  requestId?: string;
}

interface LogEntry {
  level: string;
  timestamp: string;
  tenant: {
    organizationId?: string;
    workspaceId?: string;
    userId?: string;
  };
  requestId?: string;
  msg: string;
  [key: string]: unknown;
}

type LogData = Record<string, unknown>;

/**
 * Creates a logger with tenant context automatically included.
 */
const createTenantLogger = (context: TenantContext) => {
  const tenantInfo = {
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
  };

  const log = (level: string, data: LogData | string, message?: string) => {
    const entry: LogEntry = {
      level,
      timestamp: new Date().toISOString(),
      tenant: tenantInfo,
      requestId: context.requestId,
      msg: typeof data === "string" ? data : message || "",
    };

    if (typeof data === "object") Object.assign(entry, data);

    // biome-ignore lint/suspicious/noConsole: structured logging output
    console.log(JSON.stringify(entry));
  };

  return {
    debug: (data: LogData | string, message?: string) =>
      log("debug", data, message),
    info: (data: LogData | string, message?: string) =>
      log("info", data, message),
    warn: (data: LogData | string, message?: string) =>
      log("warn", data, message),
    error: (data: LogData | string, message?: string) =>
      log("error", data, message),

    /** Create a child logger with additional context */
    child: (additionalContext: Record<string, unknown>) => {
      return createTenantLogger({
        ...context,
        ...additionalContext,
      } as TenantContext);
    },
  };
};

export default createTenantLogger;
