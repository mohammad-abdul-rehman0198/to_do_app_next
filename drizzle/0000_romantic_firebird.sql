CREATE TABLE "todos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_name" text NOT NULL,
	"description" text,
	"is_completed" boolean DEFAULT false NOT NULL
);
