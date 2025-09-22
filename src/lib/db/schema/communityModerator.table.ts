import { index, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { communityTable } from "lib/db/schema/community.table";
import { userTable } from "lib/db/schema/user.table";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Community moderator junction table.
 */
export const communityModeratorTable = pgTable(
  "community_moderator",
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
    addedAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    uniqueIndex().on(table.communityId, table.userId),
    index().on(table.communityId),
    index().on(table.userId),
  ],
);

export type InsertCommunityModerator = InferInsertModel<
  typeof communityModeratorTable
>;
export type SelectCommunityModerator = InferSelectModel<
  typeof communityModeratorTable
>;
