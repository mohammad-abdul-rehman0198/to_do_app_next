import type { Todo } from "@/utils/interfaces/Todo";
import { getFromLocalStorage, setToLocalStorage } from "@/utils/actions/LocalStorage";

const getTodos = () => {
  try {
    const stored = getFromLocalStorage("todos") || "[]";
    const parsedTodos: Todo[] = JSON.parse(stored);
    return parsedTodos;
  } catch (error) {
    console.error(error);
  }
};

const addTodo = (taskName: string, description?: string) => {
  try {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      taskName: taskName,
      description: description || "",
      isCompleted: false,
    };
    const oldTodos = getTodos();
    const updatedTodos = [...(oldTodos || []), newTodo];
    setToLocalStorage("todos", updatedTodos);
  } catch (error) {
    console.error(error);
  }
};

const markTodoAsCompleted = (id: string) => {
  try {
    const todos = getTodos() || [];

    const updatedTodos = todos.map((todo: Todo) => {
      if (todo.id === id) {
        if (todo.isCompleted) {
          return { ...todo, isCompleted: false };
        } else {
          return { ...todo, isCompleted: true };
        }
      }
      return todo;
    });

    setToLocalStorage("todos", updatedTodos);
  } catch (error) {
    console.error(error);
  }
};

const deleteTodo = (id: string) => {
  try {
    const todos = getTodos() || [];
    const updatedTodos = todos.filter((todo: Todo) => todo.id !== id);
    setToLocalStorage("todos", updatedTodos);
  } catch (error) {
    console.error(error);
  }
};

const updateTodo = (id: string, taskName: string, description?:string) => {
  try {
    const todos = getTodos() || [];

    const updatedTodos = todos.map((todo: Todo) => {
      if (todo.id === id) {
        return { ...todo, taskName, description: description || "" };
      }
      return todo;
    });

    setToLocalStorage("todos", updatedTodos);
  } catch (error) {
    console.error(error);
  }
};

export { getTodos, addTodo, markTodoAsCompleted, deleteTodo, updateTodo };
