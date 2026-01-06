import { faker } from "@faker-js/faker";

import { userTable } from "lib/db/schema";
import { createFactory } from "./base";

import type { InsertUser, SelectUser } from "lib/db/schema";

export const userFactory = createFactory<InsertUser, SelectUser>(
  () => ({
    identityProviderId: faker.string.uuid(),
  }),
  async (db, data) => {
    const [user] = await db.insert(userTable).values(data).returning();
    return user;
  },
);
