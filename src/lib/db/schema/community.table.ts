import { index, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { userTable } from "lib/db/schema/user.table";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Community table.
 */
export const communityTable = pgTable(
  "community",
  {
    id: generateDefaultId(),
    name: text().notNull(),
    displayName: text().notNull(),
    description: text(),
    creatorId: uuid()
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
      }),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    uniqueIndex().on(table.name),
    index().on(table.creatorId),
  ],
);

export type InsertCommunity = InferInsertModel<typeof communityTable>;
export type SelectCommunity = InferSelectModel<typeof communityTable>;
