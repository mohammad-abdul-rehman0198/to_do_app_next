import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { todos } from "@/db/schemas/todo";
import { Todo } from "@/utils/interfaces/Todo";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";

const getTodos = async () => {
  try {
    const todoList: Todo[] = await db
      .select()
      .from(todos)
      .then((res) =>
        res.map((todo) => ({
          id: todo.id,
          taskName: todo.taskName,
          description: todo.description || "",
          isCompleted: todo.isCompleted,
        }))
      );

    return NextResponse.json(
      { success: true, todoList, message: "Todos fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: NOTIFY_MESSAGES.TODO_FETCH_FAILED,
        error: error,
      },
      { status: 500 }
    );
  }
};

const addTodo = async (request: Request) => {
  try {
    const { id, taskName, description, isCompleted } = await request.json();

    const newTodo = await db
      .insert(todos)
      .values({ id, taskName, description, isCompleted })
      .returning();

    return NextResponse.json(
      { success: true, newTodo, message: "Todo added successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: NOTIFY_MESSAGES.TODO_ADD_FAILED, error: error },
      { status: 500 }
    );
  }
};

const updateTodo = async (request: Request) => {
  try {
    const { id, taskName, description } = await request.json();

    const [existingTodo] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, id));

    if (!existingTodo) {
      return NextResponse.json(
        { success: false, message: NOTIFY_MESSAGES.TODO_NOT_FOUND },
        { status: 404 }
      );
    }

    const updatedTodo = await db
      .update(todos)
      .set({ taskName, description })
      .where(eq(todos.id, id));

    return NextResponse.json(
      { success: true, updatedTodo, message: "Todo updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: NOTIFY_MESSAGES.TODO_UPDATE_FAILED,
        error: error,
      },
      { status: 500 }
    );
  }
};

const deleteTodo = async (request: Request) => {
  try {
    const { id } = await request.json();

    const [existingTodo] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, id));

    if (!existingTodo) {
      return NextResponse.json(
        { success: false, message: NOTIFY_MESSAGES.TODO_NOT_FOUND },
        { status: 404 }
      );
    }

    await db.delete(todos).where(eq(todos.id, id));

    return NextResponse.json(
      { success: true, message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: NOTIFY_MESSAGES.TODO_DELETE_FAILED,
        error: error,
      },
      { status: 500 }
    );
  }
};

const markTodoAsCompleted = async (request: Request) => {
  try {
    const { id } = await request.json();

    const [existingTodo] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, id));

    if (!existingTodo) {
      return NextResponse.json(
        { success: false, message: NOTIFY_MESSAGES.TODO_NOT_FOUND },
        { status: 404 }
      );
    }

    const newStatus = !existingTodo.isCompleted;

    const updatedTodo = await db
      .update(todos)
      .set({ isCompleted: newStatus })
      .where(eq(todos.id, id))
      .returning();

    return NextResponse.json(
      {
        success: true,
        updatedTodo: updatedTodo[0],
        message: `Todo marked as ${
          newStatus ? "completed" : "incomplete"
        } successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to toggle todo status",
        error: error,
      },
      { status: 500 }
    );
  }
};

export const GET = getTodos;
export const POST = addTodo;
export const PUT = updateTodo;
export const DELETE = deleteTodo;
export const PATCH = markTodoAsCompleted;
