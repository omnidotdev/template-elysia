import type { TestDatabase } from "test/setup/createTestDatabase";

export type DbClient = TestDatabase["db"];

export interface Factory<TInsert, TSelect> {
  build: (overrides?: Partial<TInsert>) => TInsert;
  create: (db: DbClient, overrides?: Partial<TInsert>) => Promise<TSelect>;
  createMany: (
    db: DbClient,
    count: number,
    overrides?: Partial<TInsert>,
  ) => Promise<TSelect[]>;
}

export const createFactory = <TInsert, TSelect>(
  defaultBuilder: () => TInsert,
  inserter: (db: DbClient, data: TInsert) => Promise<TSelect>,
): Factory<TInsert, TSelect> => ({
  build: (overrides = {}): TInsert => ({
    ...defaultBuilder(),
    ...overrides,
  }),

  create: async (db: DbClient, overrides = {}): Promise<TSelect> => {
    const data = { ...defaultBuilder(), ...overrides };
    return inserter(db, data);
  },

  createMany: async (
    db: DbClient,
    count: number,
    overrides = {},
  ): Promise<TSelect[]> => {
    const results: TSelect[] = [];
    for (let i = 0; i < count; i++) {
      const data = { ...defaultBuilder(), ...overrides };
      results.push(await inserter(db, data));
    }
    return results;
  },
});
