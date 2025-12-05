"use client";

import { useEffect, useState, useContext } from "react";

import Button from "./ui/Button";
import Edit from "@/components/icons/Edit";
import Dialog from "@/components/ui/Dialog";
import Circle from "@/components/icons/Circle";
import Delete from "@/components/icons/Delete";
import type { Todo } from "@/utils/interfaces/Todo";
import { TodoContext } from "@/context/TodoContext";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";
import { DialogVariant } from "@/utils/enum/DialogVariant";
import FilledCircle from "@/components/icons/FilledCircle";
import type { FormData } from "@/utils/interfaces/FormData";
import { getTodos,markTodoAsCompleted,deleteTodo,updateTodo } from "@/utils/actions/Database";

const Todos = () => {
  const context = useContext(TodoContext);
  const { todos, setTodos } = context || { todos: [], setTodos: () => {} };

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogVariant, setDialogVariant] = useState<DialogVariant | null>(
    null
  );
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const fetchTodos = () => {
      const todos = getTodos();
      setTodos(todos || []);
    };
    fetchTodos();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const openDeleteDialog = (id: string) => {
    setSelectedId(id);
    setDialogVariant(DialogVariant.DELETE);
    setDialogOpen(true);
  };

  const openCompleteDialog = (id: string) => {
    setSelectedId(id);
    if (todos.find((todo: Todo) => todo.id === id)?.isCompleted) {
      setDialogVariant(DialogVariant.INCOMPLETE);
    } else {
      setDialogVariant(DialogVariant.COMPLETE);
    }
    setDialogOpen(true);
  };

  const openUpdateDialog = (todo: Todo) => {
    setEditTodo(todo);
    setIsEditing(true);
    setDialogVariant(DialogVariant.UPDATE);
    setDialogOpen(true);
  };

  const handleDialogConfirm = () => {
    if (dialogVariant === DialogVariant.DELETE) {
      handleDeleteTodo(selectedId);
    } else {
      handleCompleteTodo(selectedId);
    }
    setDialogOpen(false);
  };

  const handleCompleteTodo = (id: string) => {
    markTodoAsCompleted(id);
    const todos = getTodos() || [];
    setTodos(todos);
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
    const todos = getTodos() || [];
    setTodos(todos);
  };

  const handleSaveEditTodo = (data: FormData) => {
    if (!isEditing) return;

    updateTodo(editTodo?.id as string, data.taskName, data.description || "");
    const todos = getTodos() || [];
    setTodos(todos);
    setEditTodo(null);
    setIsEditing(false);
    setDialogOpen(false);
  };

  return (
    <>
      <ol className="w-[70%] max-[510px]:w-[90%] max-w-[455px] space-y-[27px]">
        {todos.map((todo: Todo) => (
          <li
            key={todo.id}
            className="w-full text-[1rem] text-white flex justify-between items-center border border-[#c2b39a] p-3"
          >
            <>
              <div className="flex items-center gap-2">
                <Button
                  variant={ButtonVariant.ICON}
                  onClick={() => openCompleteDialog(todo.id)}
                  logo={todo.isCompleted ? <FilledCircle /> : <Circle />}
                />

                <p className={`${todo.isCompleted ? "line-through" : ""}`}>
                  {todo.taskName.length > 35
                    ? todo.taskName.slice(0, 35) + "..."
                    : todo.taskName}
                </p>
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
      />
    </>
  );
};

export default Todos;
