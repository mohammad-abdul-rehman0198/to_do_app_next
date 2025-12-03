import type { Todo } from "@/utils/interfaces/Todo";

const getTodos = () => {
  try {
    const stored = localStorage.getItem("todos") || "[]";
    const parsedTodos: Todo[] = JSON.parse(stored);
    return parsedTodos;
  } catch (error) {
    console.error(error);
  }
};

const addTodo = (taskName: string) => {
  try {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      taskName: taskName,
      isCompleted: false,
    };
    const oldTodos = getTodos();
    const updatedTodos = [...(oldTodos || []), newTodo];
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
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

    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  } catch (error) {
    console.error(error);
  }
};

const deleteTodo = (id: string) => {
  try {
    const todos = getTodos() || [];
    const updatedTodos = todos.filter((todo: Todo) => todo.id !== id);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  } catch (error) {
    console.error(error);
  }
};

const updateTodo = (id: string, taskName: string) => {
  try {
    const todos = getTodos() || [];

    const updatedTodos = todos.map((todo: Todo) => {
      if (todo.id === id) {
        return { ...todo, taskName };
      }
      return todo;
    });

    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  } catch (error) {
    console.error(error);
  }
};

export { getTodos, addTodo, markTodoAsCompleted, deleteTodo, updateTodo };
