"use server";

import { db } from "@/db";
import { eq, and, isNull } from "drizzle-orm";

import { todos } from "@/db/schemas/todo";
import { Todo } from "@/utils/interfaces/Todo";
import { getUser } from "@/app/actions/auth/user";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { getServerSession } from "@/utils/actions/GetServerSession";

const getTodos = async () => {
  try {
    const { session, error } = await getServerSession();
    const userData = await getUser();

    if (error || !session || !userData?.id) {
      return {
        success: false,
        todos: [],
        message: NOTIFY_MESSAGES.UNAUTHORIZED,
      };
    }

    const todoList = await db
      .select()
      .from(todos)
      .where(
        and(eq(todos.userId, userData?.id as string), isNull(todos.deletedAt))
      );

    const todoss = todoList.map((todo) => ({
      id: todo.id,
      taskName: todo.taskName,
      description: todo.description ?? "",
      status: todo.status,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
      deletedAt: todo.deletedAt,
    }));

    return {
      success: true,
      todos: todoss,
    };
  } catch {
    return {
      success: false,
      todos: [],
      message: NOTIFY_MESSAGES.SERVER_ERROR,
    };
  }
};

const addTodo = async (data: Todo) => {
  try {
    const { session, error } = await getServerSession();
    const userData = await getUser();

    if (error || !session || !userData?.id) {
      return {
        success: false,
        message: NOTIFY_MESSAGES.UNAUTHORIZED,
      };
    }

    const [newTodo] = await db
      .insert(todos)
      .values({
        userId: userData.id,
        taskName: data.taskName,
        description: data.description,
        status: data.status ?? false,
        createdBy: userData.id,
        createdAt: new Date(),
      })
      .returning();

    return {
      success: true,
      newTodo,
      message: NOTIFY_MESSAGES.TODO_ADD_SUCCESS,
    };
  } catch {
    return {
      success: false,
      message: NOTIFY_MESSAGES.SERVER_ERROR,
    };
  }
};

const updateTodo = async (data: Partial<Todo>) => {
  try {
    const { session } = await getServerSession();
    const userData = await getUser();

    if (!session || !userData?.id) {
      throw new Error(NOTIFY_MESSAGES.UNAUTHORIZED);
    }

    const [existingTodo] = await db
      .select()
      .from(todos)
      .where(
        and(eq(todos.id, data.id as string), eq(todos.userId, userData.id))
      );

    if (!existingTodo) {
      return {
        success: false,
        message: NOTIFY_MESSAGES.TODO_NOT_FOUND,
      };
    }

    const [updatedTodo] = await db
      .update(todos)
      .set({
        taskName: data.taskName,
        description: data.description,
        updatedBy: userData.id,
        updatedAt: new Date(),
      })
      .where(eq(todos.id, data.id as string))
      .returning();

    return {
      success: true,
      updatedTodo,
      message: NOTIFY_MESSAGES.TODO_UPDATE_SUCCESS,
    };
  } catch {
    return {
      success: false,
      message: NOTIFY_MESSAGES.SERVER_ERROR,
    };
  }
};

const deleteTodo = async (id: string) => {
  try {
    const { session } = await getServerSession();
    const userData = await getUser();

    if (!session || !userData?.id) {
      return {
        success: false,
        message: NOTIFY_MESSAGES.UNAUTHORIZED,
      };
    }

    const [existingTodo] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userData.id)));

    if (!existingTodo) {
      return {
        success: false,
        message: NOTIFY_MESSAGES.TODO_NOT_FOUND,
      };
    }

    await db
      .update(todos)
      .set({
        deletedBy: userData.id,
        deletedAt: new Date(),
      })
      .where(eq(todos.id, id));

    return {
      success: true,
      message: NOTIFY_MESSAGES.TODO_DELETE_SUCCESS,
    };
  } catch {
    return {
      success: false,
      message: NOTIFY_MESSAGES.SERVER_ERROR,
    };
  }
};

const toggleTodoStatus = async (id: string) => {
  try {
    const { session } = await getServerSession();
    const userData = await getUser();

    if (!session || !userData?.id) {
      return {
        success: false,
        message: NOTIFY_MESSAGES.UNAUTHORIZED,
      };
    }

    const [existingTodo] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userData.id)));

    if (!existingTodo) {
      return {
        success: false,
        message: NOTIFY_MESSAGES.TODO_NOT_FOUND,
      };
    }

    const [updatedTodo] = await db
      .update(todos)
      .set({
        status: !existingTodo.status,
        updatedBy: userData?.id,
        updatedAt: new Date(),
      })
      .where(eq(todos.id, id))
      .returning();

    return {
      success: true,
      updatedTodo,
      message: NOTIFY_MESSAGES.TODO_COMPLETE_SUCCESS,
    };
  } catch {
    return {
      success: false,
      message: NOTIFY_MESSAGES.SERVER_ERROR,
    };
  }
};

export { getTodos, addTodo, updateTodo, deleteTodo, toggleTodoStatus };
