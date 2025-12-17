import { StateController } from "jotai-controller";

import type { Todo } from "@/utils/interfaces/Todo";

type TodoState = {
  todos: Todo[];
};

class TodoController extends StateController<TodoState> {
  constructor() {
    super("todos", {
      todos: [],
    });

    this.autoSubscribeOnMethods(this);
  }

  setTodos(newTodos: Todo[]) {
    this.setState({ todos: [...newTodos] });
  }

  addTodo(todo: Todo) {
    this.setState({
      todos: [...this.getValue("todos"), todo],
    });
  }

  deleteTodo(id: string) {
    const todos = this.getValue("todos").filter((todo) => todo.id !== id);
    this.setState({ todos });
  }

  toggleTodo(id: string) {
    const todos = this.getValue("todos").map((todo) =>
      todo.id === id ? { ...todo, status: !todo.status } : todo
    );
    this.setState({ todos });
  }

  updateTodo(id: string, updatedTodo: Partial<Todo>) {
    const todos = this.getValue("todos").map((todo: Todo) =>
      todo.id === id ? { ...todo, ...updatedTodo } : todo
    );
    this.setState({ todos });
  }

  clearTodos() {
    this.setState({
      todos: [],
    });
  }
}


export const todoController = new TodoController();