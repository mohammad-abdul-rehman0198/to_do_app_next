"use client";
import { useEffect } from "react";

import { User } from "@/utils/interfaces/User";
import { Todo } from "@/utils/interfaces/Todo";
import { userController } from "@/state/controller/user";
import { todoController } from "@/state/controller/todo";

type Props = {
  user: User | null;
  todos: Todo[] | [];
};

export default function StateHydrator({ user, todos }: Props) {
  useEffect(() => {
    if (user) {
      userController.setUser(user);
    }
    if (todos.length) {
      todoController.setTodos(todos);
    }
  }, [user, todos]);

  return null;
}
