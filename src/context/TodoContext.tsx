import { createContext } from "react";

import type { Todo } from "@/utils/interfaces/Todo";

type TodoContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodoContext = createContext<TodoContextType | null>(null);
