"use client";

import { useState } from "react";
import type { Todo } from "@/utils/interfaces/Todo";
import { todoController } from "@/state/controller/todo";

export function useCompleteTodoDialog(todos: Todo[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedTodo = todos.find(t => t.id === selectedId);
  const isCompleted = !!selectedTodo?.status;

  const open = (id: string) => {
    setSelectedId(id);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setSelectedId("");
  };

  const confirm = async () => {
    setIsLoading(true);
    await todoController.toggleTodo(selectedId);
    setIsLoading(false);
    close();
  };

  return {
    isOpen,
    isLoading,
    isCompleted,
    open,
    close,
    confirm,
  };
}
