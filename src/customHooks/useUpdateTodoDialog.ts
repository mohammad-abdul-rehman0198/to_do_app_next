"use client";

import { useState } from "react";
import type { Todo } from "@/utils/interfaces/Todo";
import { todoController } from "@/state/controller/todo";
import type { FormData } from "@/utils/interfaces/TodoFormData";

export function useUpdateTodoDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const open = (todo: Todo) => {
    setEditTodo(todo);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setEditTodo(null);
  };

  const confirm = async (form: FormData) => {
    if (!editTodo) return;

    setIsLoading(true);
    await todoController.updateTodo({
      id: editTodo.id,
      taskName: form.taskName,
      description: form.description || "",
    });
    setIsLoading(false);
    close();
  };

  return {
    isOpen,
    isLoading,
    editTodo,
    open,
    close,
    confirm,
  };
}
