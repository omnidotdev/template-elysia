import { index, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { communityTable } from "lib/db/schema/community.table";
import { userTable } from "lib/db/schema/user.table";
import { generateDefaultDate, generateDefaultId } from "lib/db/util";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * Post table.
 */
export const postTable = pgTable(
  "post",
  {
    id: generateDefaultId(),
    title: text(),
    description: text(),
    communityId: uuid()
      .notNull()
      .references(() => communityTable.id, {
        onDelete: "cascade",
      }),
    authorId: uuid()
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
      }),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [
    uniqueIndex().on(table.id),
    index().on(table.authorId),
    index().on(table.communityId),
  ],
);

export type InsertPost = InferInsertModel<typeof postTable>;
export type SelectPost = InferSelectModel<typeof postTable>;
