import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { todos } from "@/db/schemas/todo";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";

const getTodosCount = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }
    const todoCount = await db.select({ count: count() }).from(todos).where(eq(todos.userId, userId));

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
