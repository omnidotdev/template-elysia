/**
 * Organization-scoped database queries.
 *
 * Provides organization-scoped database query helpers that automatically
 * filter by organizationId to ensure tenant isolation.
 *
 * Usage:
 *   const posts = createScopedRepository(postTable, context.organization.id);
 *   const allPosts = await posts.findMany();
 *   const post = await posts.findById(postId);
 */

import { and, eq } from "drizzle-orm";

import { dbPool as db } from "lib/db";

import type { SQL } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";

type TableWithOrganizationId = PgTable & {
  organizationId: PgColumn;
  id: PgColumn;
};

// biome-ignore lint/complexity/noBannedTypes: dynamic query access requires Function type
type QueryMethod = { findMany: Function; findFirst: Function };

/**
 * Creates an organization-scoped query helper.
 * All queries automatically filter by organizationId.
 */
const createScopedRepository = <T extends TableWithOrganizationId>(
  table: T,
  organizationId: string,
) => {
  const tableName = (table as unknown as { _: { name: string } })._.name;

  return {
    /**
     * Find all records in this organization.
     */
    findMany: async (opts?: {
      where?: SQL;
      limit?: number;
      offset?: number;
    }) => {
      const baseWhere = eq(table.organizationId, organizationId);
      const where = opts?.where ? and(baseWhere, opts.where) : baseWhere;

      return (db.query as Record<string, QueryMethod>)[tableName].findMany({
        where,
        limit: opts?.limit,
        offset: opts?.offset,
      });
    },

    /**
     * Find first matching record in this organization.
     */
    findFirst: async (opts?: { where?: SQL }) => {
      const baseWhere = eq(table.organizationId, organizationId);
      const where = opts?.where ? and(baseWhere, opts.where) : baseWhere;

      return (db.query as Record<string, QueryMethod>)[tableName].findFirst({
        where,
      });
    },

    /**
     * Find a record by ID within this organization.
     * Returns null if record exists but belongs to different organization.
     */
    findById: async (id: string) => {
      return (db.query as Record<string, QueryMethod>)[tableName].findFirst({
        where: and(eq(table.organizationId, organizationId), eq(table.id, id)),
      });
    },

    /**
     * Insert a record, automatically setting organizationId.
     */
    insert: async (values: Omit<T["$inferInsert"], "organizationId">) => {
      return db
        .insert(table)
        .values({
          ...values,
          organizationId,
        } as T["$inferInsert"])
        .returning();
    },

    /**
     * Update a record by ID within this organization.
     * No-op if record belongs to different organization.
     */
    update: async (id: string, values: Partial<T["$inferInsert"]>) => {
      return db
        .update(table)
        .set(values)
        .where(and(eq(table.organizationId, organizationId), eq(table.id, id)))
        .returning();
    },

    /**
     * Delete a record by ID within this organization.
     * No-op if record belongs to different organization.
     */
    delete: async (id: string) => {
      return db
        .delete(table)
        .where(and(eq(table.organizationId, organizationId), eq(table.id, id)))
        .returning();
    },
  };
};

export default createScopedRepository;
