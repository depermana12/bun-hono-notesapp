import { relations } from "drizzle-orm";
import { integer, pgTable, timestamp, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notes = pgTable("notes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});

export const notesRelations = relations(notes, ({ one }) => ({
  userId: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  notes: many(notes),
}));
