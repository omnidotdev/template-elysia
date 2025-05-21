import { timestamp } from "drizzle-orm/pg-core";

/**
 * Generate a default date database column.
 */
const generateDefaultDate = () =>
  timestamp({
    precision: 6,
    mode: "string",
    withTimezone: true,
  }).defaultNow();

export default generateDefaultDate;
