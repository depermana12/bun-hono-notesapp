import { relations } from "drizzle-orm";
import { integer, pgTable, timestamp, text } from "drizzle-orm/pg-core";
import { notes } from "./note";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  notes: many(notes),
}));
