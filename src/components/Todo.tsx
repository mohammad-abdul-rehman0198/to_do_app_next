"use client";

import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import Edit from "@/components/icons/Edit";
import Dialog from "@/components/ui/Dialog";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";
import useTodos from "@/customHooks/useTodos";
import Delete from "@/components/icons/Delete";
import type { Todo } from "@/utils/interfaces/Todo";
import { useEditTodo } from "@/customHooks/useEditTodo";
import { QUERY_KEYS } from "@/utils/constants/QueryKeys";
import { todoController } from "@/state/controller/todo";
import { userController } from "@/state/controller/user";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";
import { DialogVariant } from "@/utils/enum/DialogVariant";
import type { FormData } from "@/utils/interfaces/FormData";
import { useDeleteTodo } from "@/customHooks/useDeleteTodo";
import { useCompleteTodo } from "@/customHooks/useCompleteTodo";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";


const Todos = () => {
  const queryClient = useQueryClient();

  const userData = userController.useState(["id", "name", "email", "imageUrl"]);
  const { todos } = todoController.useState(["todos"]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [dialogVariant, setDialogVariant] = useState<DialogVariant | null>(
    null
  );

  const { isLoading, data, error } = useTodos();
  const { mutate: updateTodo, isPending: isEditing } = useEditTodo();
  const { mutate: deleteTodo, isPending: isDeleting } = useDeleteTodo();
  const { mutate: completeTodo, isPending: isCompleting } = useCompleteTodo();

  useEffect(() => {
    if (data) {
      todoController.setTodos(data.todoList || []);
    } else if (error) {
      toast.error(error.message);
    }
  }, [data, error]);

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

  const handleCompleteTodo = (id: string) => {
    completeTodo(id, {
      onSuccess: () => {
        toast.success(NOTIFY_MESSAGES.TODO_COMPLETE_SUCCESS);
        setDialogOpen(false);
      },
      onError: () => {
        toast.error(NOTIFY_MESSAGES.TODO_COMPLETE_FAILED);
      },
    });
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id, {
      onSuccess: () => {
        todoController.deleteTodo(id);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.TODOS, userData?.id],
        });
        toast.success(NOTIFY_MESSAGES.TODO_DELETE_SUCCESS);
        setDialogOpen(false);
      },
      onError: () => {
        toast.error(NOTIFY_MESSAGES.TODO_DELETE_FAILED);
      },
    });
  };

  const handleSaveEditTodo = (form: FormData) => {
    updateTodo(
      { data: form, editTodoId: editTodo?.id || "" },
      {
        onSuccess: () => {
          toast.success(NOTIFY_MESSAGES.TODO_UPDATE_SUCCESS);
          setDialogOpen(false);
          setEditTodo(null);
        },
        onError: () => {
          toast.error(NOTIFY_MESSAGES.TODO_UPDATE_FAILED);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <ol className="w-[70%] max-[510px]:w-[90%] max-w-[455px] space-y-[27px]">
        {todos?.map((todo: Todo) => (
          <li
            key={todo.id}
            className="w-full text-[1rem] text-white flex justify-between items-center border border-[#c2b39a] p-3"
          >
            <>
              <div className="flex items-center gap-2">
                <Button
                  variant={ButtonVariant.ICON}
                  onClick={() => openCompleteDialog(todo.id)}
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
                  onClick={() => openDeleteDialog(todo.id)}
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
        isLoading={isCompleting || isDeleting || isEditing}
      />
    </>
  );
};

export default Todos;
