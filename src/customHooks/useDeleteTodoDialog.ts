"use client";

import { useState } from "react";
import { todoController } from "@/state/controller/todo";

export function useDeleteTodoDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

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
    await todoController.deleteTodo(selectedId);
    setIsLoading(false);
    close();
  };

  return {
    isOpen,
    isLoading,
    open,
    close,
    confirm,
  };
}
