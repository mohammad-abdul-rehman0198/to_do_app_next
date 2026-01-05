import { toast } from "react-toastify";
import { StateController } from "jotai-controller";

import type { Todo } from "@/utils/interfaces/Todo";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { addTodo,updateTodo,deleteTodo,toggleTodoStatus } from "@/app/actions/todo/todo";

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

  async addTodo(todo: Todo) {
    const { success, newTodo, message } = await addTodo(todo);
    if (success) {
      toast.success(message || NOTIFY_MESSAGES.TODO_ADD_SUCCESS);
      this.setState({
        todos: [...this.getValue("todos"), newTodo as Todo],
      });
    } else {
      toast.error(message || NOTIFY_MESSAGES.TODO_ADD_FAILED);
    }
  }

  async deleteTodo(id: string) {
    const { success, message } = await deleteTodo(id);
    if (success) {
      toast.success(message || NOTIFY_MESSAGES.TODO_DELETE_SUCCESS);
      const todos = this.getValue("todos").filter((todo) => todo.id !== id);
      this.setState({ todos });
    } else {
      toast.error(message || NOTIFY_MESSAGES.TODO_DELETE_FAILED);
    }
  }

  async toggleTodo(id: string) {
    const { success, message } = await toggleTodoStatus(id);
    if (success) {
      toast.success(message || NOTIFY_MESSAGES.TODO_COMPLETE_SUCCESS);
      const todos = this.getValue("todos").map((todo) =>
        todo.id === id ? { ...todo, status: !todo.status } : todo
      );
      this.setState({ todos });
    } else {
      toast.error(message || NOTIFY_MESSAGES.TODO_COMPLETE_FAILED);
    }
  }

  async updateTodo(updatedTodo: Partial<Todo>) {
    const { success, message } = await updateTodo(updatedTodo);
    if (success) {
      toast.success(message || NOTIFY_MESSAGES.TODO_UPDATE_SUCCESS);
      const todos = this.getValue("todos").map((todo: Todo) =>
        todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo
      );
      this.setState({ todos });
    } else {
      toast.error(message || NOTIFY_MESSAGES.TODO_UPDATE_FAILED);
    }
  }

  clearTodos() {
    this.setState({
      todos: [],
    });
  }
}

export const todoController = new TodoController();
