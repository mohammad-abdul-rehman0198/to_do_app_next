import { count } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { todos } from "@/db/schemas/todo";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";

const getTodosCount = async () => {
  try {
    const todoCount = await db.select({ count: count() }).from(todos);

    return NextResponse.json(
      {
        success: true,
        todoCount: todoCount[0].count,
        message: "Todos count fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: NOTIFY_MESSAGES.TODO_COUNT_FAILED, error: error },
      { status: 500 }
    );
  }
};

export const GET = getTodosCount;
