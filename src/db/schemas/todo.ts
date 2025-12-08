import { pgTable, uuid, text, boolean } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskName: text("task_name").notNull(),
  description: text("description"),
  isCompleted: boolean("is_completed").notNull().default(false),
});
