import { faker } from "@faker-js/faker";

import { postTable } from "lib/db/schema";
import { createFactory } from "./base";

import type { InsertPost, SelectPost } from "lib/db/schema";

export const postFactory = createFactory<InsertPost, SelectPost>(
  () => ({
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    authorId: "", // Must be provided via overrides
  }),
  async (db, data) => {
    const [post] = await db.insert(postTable).values(data).returning();
    return post;
  },
);
