import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";

import { users } from "@/db/schemas/user";

export const todos = pgTable("todos", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  taskName: text("task_name").notNull(),
  description: text("description"),
  status: boolean("status").notNull().default(false), 
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),

  updatedBy: uuid("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at"),

  deletedBy: uuid("deleted_by").references(() => users.id),
  deletedAt: timestamp("deleted_at"),
});
