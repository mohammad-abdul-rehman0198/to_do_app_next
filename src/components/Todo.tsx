"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Circle } from "lucide-react";

import Edit from "@/components/icons/Edit";
import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Delete from "@/components/icons/Delete";
import type { Todo } from "@/utils/interfaces/Todo";
import { todoController } from "@/state/controller/todo";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";
import { DialogVariant } from "@/utils/enum/DialogVariant";
import type { FormData } from "@/utils/interfaces/FormData";

const Todos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { todos } = todoController.useState(["todos"]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [dialogVariant, setDialogVariant] = useState<DialogVariant | null>(
    null
  );

  useEffect(() => {
    todoController.setTodos(todos || []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDeleteDialog = (id: string) => {
    setSelectedId(id);
    setDialogVariant(DialogVariant.DELETE);
    setDialogOpen(true);
  };

  const openCompleteDialog = (id: string) => {
    setSelectedId(id);
    if (todos?.find((todo: Todo) => todo.id === id)?.status) {
      setDialogVariant(DialogVariant.INCOMPLETE);
    } else {
      setDialogVariant(DialogVariant.COMPLETE);
    }
    setDialogOpen(true);
  };

  const openUpdateDialog = (todo: Todo) => {
    setEditTodo(todo);
    setDialogVariant(DialogVariant.UPDATE);
    setDialogOpen(true);
  };

  const handleDialogConfirm = () => {
    if (dialogVariant === DialogVariant.DELETE) {
      handleDeleteTodo(selectedId);
    } else {
      handleCompleteTodo(selectedId);
    }
  };

  const handleCompleteTodo = async (id: string) => {
    setIsLoading(true);
    await todoController.toggleTodo(id);
    setIsLoading(false);
    setDialogOpen(false);
  };

  const handleDeleteTodo = async (id: string) => {
    setIsLoading(true);
    await todoController.deleteTodo(id);
    setIsLoading(false);
    setDialogOpen(false);
  };

  const handleSaveEditTodo = async (form: FormData) => {
    setIsLoading(true);
    await todoController.updateTodo({
      id: editTodo?.id || "",
      taskName: form.taskName,
      description: form.description || "",
    });
    setIsLoading(false);
    setDialogOpen(false);
    setEditTodo(null);
  };

  return (
    <>
      <ol className="w-[70%] max-[510px]:w-[90%] max-w-[455px] space-y-[27px] mb-6">
        {todos?.map((todo: Todo) => (
          <li
            key={todo.id}
            className="w-full text-[1rem] text-white flex justify-between items-center border border-[#c2b39a] p-3"
          >
            <>
              <div className="flex items-center gap-2">
                <Button
                  variant={ButtonVariant.ICON}
                  onClick={() => openCompleteDialog(todo?.id || "")}
                  logo={
                    todo.status ? (
                      <CheckCircle color="#22C55E" />
                    ) : (
                      <Circle color="#22C55E" />
                    )
                  }
                />

                <div>
                  <p className={`${todo.status ? "line-through" : ""}`}>
                    {todo.taskName.length > 35
                      ? todo.taskName.slice(0, 35) + "..."
                      : todo.taskName}
                  </p>

                  {todo.description && (
                    <p
                      className={`${
                        todo.status ? "line-through" : ""
                      } text-xs text-gray-400 mt-1`}
                    >
                      {todo.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant={ButtonVariant.ICON}
                  onClick={() => openUpdateDialog(todo)}
                  logo={<Edit />}
                />
                <Button
                  variant={ButtonVariant.ICON}
                  onClick={() => openDeleteDialog(todo?.id || "")}
                  logo={<Delete />}
                />
              </div>
            </>
          </li>
        ))}
      </ol>

      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={(data: FormData | undefined) => {
          if (dialogVariant === DialogVariant.UPDATE) {
            if (data) handleSaveEditTodo(data);
          } else {
            handleDialogConfirm();
          }
        }}
        variant={dialogVariant as DialogVariant}
        taskName={editTodo?.taskName}
        taskDescription={editTodo?.description}
        isLoading={isLoading}
      />
    </>
  );
};

export default Todos;
