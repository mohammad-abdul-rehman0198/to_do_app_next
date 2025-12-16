import { NextResponse } from "next/server";
import { eq, and, isNull } from "drizzle-orm";

import { db } from "@/db";
import { todos } from "@/db/schemas/todo";
import { Todo } from "@/utils/interfaces/Todo";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { getServerSession } from "@/utils/actions/GetServerSession";

const getTodos = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const { session, error } = await getServerSession();

    if (error || !session || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: error?.message || NOTIFY_MESSAGES.UNAUTHORIZED,
        },
        { status: 500 }
      );
    }

    const todoList: Todo[] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.userId, userId), isNull(todos.deletedAt)))
      .then((res) =>
        res.map((todo) => ({
          id: todo.id,
          taskName: todo.taskName,
          description: todo.description || "",
          status: todo.status,
          createdAt: todo.createdAt,
          updatedAt: todo.updatedAt,
          deletedAt: todo.deletedAt,
        }))
      );

    return NextResponse.json(
      { success: true, todoList, message: NOTIFY_MESSAGES.TODO_FETCH_SUCCESS },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: NOTIFY_MESSAGES.TODO_FETCH_FAILED, error },
      { status: 500 }
    );
  }
};

const addTodo = async (request: Request) => {
  try {
    const {
      userId,
      taskName,
      description,
      status = false,
    } = await request.json();
    const { session, error } = await getServerSession();

    if (error || !session || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: error?.message || NOTIFY_MESSAGES.UNAUTHORIZED,
        },
        { status: 500 }
      );
    }

    const newTodo = await db
      .insert(todos)
      .values({
        userId,
        taskName,
        description,
        status,
        createdBy: userId,
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        newTodo: newTodo[0],
        message: NOTIFY_MESSAGES.TODO_ADD_SUCCESS,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: NOTIFY_MESSAGES.TODO_ADD_FAILED, error },
      { status: 500 }
    );
  }
};

const updateTodo = async (request: Request) => {
  try {
    const { userId, id, taskName, description } = await request.json();
    const { session, error } = await getServerSession();

    if (error || !session || !userId || !id || !taskName) {
      return NextResponse.json(
        {
          success: false,
          message: error?.message || NOTIFY_MESSAGES.UNAUTHORIZED,
        },
        { status: 500 }
      );
    }

    const [existingTodo] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)));

    if (!existingTodo)
      return NextResponse.json(
        { success: false, message: NOTIFY_MESSAGES.TODO_NOT_FOUND },
        { status: 404 }
      );

    const updatedTodo = await db
      .update(todos)
      .set({
        taskName,
        description,
        updatedBy: userId,
        updatedAt: new Date(),
      })
      .where(eq(todos.id, id))
      .returning();

    return NextResponse.json(
      {
        success: true,
        updatedTodo: updatedTodo[0],
        message: NOTIFY_MESSAGES.TODO_UPDATE_SUCCESS,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: NOTIFY_MESSAGES.TODO_UPDATE_FAILED, error },
      { status: 500 }
    );
  }
};

const deleteTodo = async (request: Request) => {
  try {
    const { userId, id } = await request.json();
    const { session, error } = await getServerSession();

    if (error || !session || !userId || !id) {
      return NextResponse.json(
        {
          success: false,
          message: error?.message || NOTIFY_MESSAGES.UNAUTHORIZED,
        },
        { status: 500 }
      );
    }

    const [existingTodo] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)));

    if (!existingTodo)
      return NextResponse.json(
        { success: false, message: NOTIFY_MESSAGES.TODO_NOT_FOUND },
        { status: 404 }
      );

    await db
      .update(todos)
      .set({ deletedBy: userId, deletedAt: new Date() })
      .where(eq(todos.id, id));

    return NextResponse.json(
      { success: true, message: NOTIFY_MESSAGES.TODO_DELETE_SUCCESS },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: NOTIFY_MESSAGES.TODO_DELETE_FAILED, error },
      { status: 500 }
    );
  }
};

const markTodoAsCompleted = async (request: Request) => {
  try {
    const { userId, id } = await request.json();
    const { session, error } = await getServerSession();

    if (error || !session || !userId || !id) {
      return NextResponse.json(
        {
          success: false,
          message: error?.message || NOTIFY_MESSAGES.UNAUTHORIZED,
        },
        { status: 500 }
      );
    }

    const [existingTodo] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)));

    if (!existingTodo)
      return NextResponse.json(
        { success: false, message: NOTIFY_MESSAGES.TODO_NOT_FOUND },
        { status: 404 }
      );

    const newStatus = !existingTodo.status;

    const updatedTodo = await db
      .update(todos)
      .set({ status: newStatus, updatedBy: userId, updatedAt: new Date() })
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
      { success: false, message: NOTIFY_MESSAGES.SERVER_ERROR, error },
      { status: 500 }
    );
  }
};

export const GET = getTodos;
export const POST = addTodo;
export const PUT = updateTodo;
export const DELETE = deleteTodo;
export const PATCH = markTodoAsCompleted;
