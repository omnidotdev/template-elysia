import { index, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { communityTable } from "lib/db/schema/community.table";
import { userTable } from "lib/db/schema/user.table";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Community member junction table.
 */
export const communityMemberTable = pgTable(
  "community_member",
  {
    id: generateDefaultId(),
    communityId: uuid()
      .notNull()
      .references(() => communityTable.id, {
        onDelete: "cascade",
      }),
    userId: uuid()
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
      }),
    joinedAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    uniqueIndex().on(table.communityId, table.userId),
    index().on(table.communityId),
    index().on(table.userId),
  ],
);

export type InsertCommunityMember = InferInsertModel<
  typeof communityMemberTable
>;
export type SelectCommunityMember = InferSelectModel<
  typeof communityMemberTable
>;
