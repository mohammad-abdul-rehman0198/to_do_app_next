"use client";

import { toast } from "react-toastify";
import { useEffect, useState, useContext, useRef } from "react";

import Edit from "@/components/icons/Edit";
import Dialog from "@/components/ui/Dialog";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";
import { User } from "@/utils/interfaces/User";
import Circle from "@/components/icons/Circle";
import Delete from "@/components/icons/Delete";
import { supabase } from "@/db/supabase/client";
import { getUser } from "@/utils/actions/GetUser";
import type { Todo } from "@/utils/interfaces/Todo";
import { TodoContext } from "@/context/TodoContext";
import { API_METHODS } from "@/utils/enum/ApiMethods";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";
import { DialogVariant } from "@/utils/enum/DialogVariant";
import FilledCircle from "@/components/icons/FilledCircle";
import type { FormData } from "@/utils/interfaces/FormData";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";

const Todos = () => {
  const context = useContext(TodoContext);
  const { todos, setTodos } = context || { todos: [], setTodos: () => {} };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [dialogVariant, setDialogVariant] = useState<DialogVariant | null>(
    null
  );

  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchTodos = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;
      
      try {
        const user = await getUser();

        if (!user) {
          toast.error(user);
          return;
        }

        setUserData({
          id: user?.id,
          name: user?.user_metadata?.name,
          email: user?.email,
        });

        setInitialLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.TODOS}?userId=${
            user?.id
          }`,
          {
            method: API_METHODS.GET,
            headers: HEADERS,
          }
        );

        if (!response.ok) {
          toast.error(NOTIFY_MESSAGES.TODO_FETCH_FAILED);
        }

        const data = await response.json();
        if (data.success) {
          setTodos(data.todoList || []);
        } else {
          toast.error(data.message);
          setTodos(data.todoList || []);
        }
      } catch {
        toast.error(NOTIFY_MESSAGES.TODO_FETCH_FAILED);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchTodos();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("todos-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "todos",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTodos((prev) => [
              ...prev,
              {
                id: payload.new.id,
                taskName: payload.new.task_name,
                description: payload.new.description ?? "",
                isCompleted: payload.new.is_completed,
              },
            ]);
          }

          if (payload.eventType === "UPDATE") {
            setTodos((prev) =>
              prev.map((todo) =>
                todo.id === payload.new.id
                  ? {
                      id: payload.new.id,
                      taskName: payload.new.task_name,
                      description: payload.new.description ?? "",
                      isCompleted: payload.new.is_completed,
                    }
                  : todo
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setTodos((prev) =>
              prev.filter((todo) => todo.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

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

  const handleDialogConfirm = async () => {
    setLoading(true);
    if (dialogVariant === DialogVariant.DELETE) {
      await handleDeleteTodo(selectedId);
    } else {
      await handleCompleteTodo(selectedId);
    }
    setDialogOpen(false);
    setLoading(false);
  };

  const handleCompleteTodo = async (id: string) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.TODOS,
        {
          method: API_METHODS.PATCH,
          headers: HEADERS,
          body: JSON.stringify({ id, userId: userData?.id }),
        }
      );

      if (!response.ok) {
        toast.error(NOTIFY_MESSAGES.TODO_COMPLETE_FAILED);
      }

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error(NOTIFY_MESSAGES.TODO_COMPLETE_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.TODOS,
        {
          method: API_METHODS.DELETE,
          headers: HEADERS,
          body: JSON.stringify({ id, userId: userData?.id }),
        }
      );

      if (!response.ok) {
        toast.error(NOTIFY_MESSAGES.TODO_DELETE_FAILED);
      }

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error(NOTIFY_MESSAGES.TODO_DELETE_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEditTodo = async (data: FormData) => {
    if (!isEditing) return;

    try {
      setLoading(true);
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.TODOS,
        {
          method: API_METHODS.PUT,
          headers: HEADERS,
          body: JSON.stringify({
            id: editTodo?.id,
            userId: userData?.id,
            taskName: data.taskName,
            description: data.description || "",
          }),
        }
      );

      if (!response.ok) {
        toast.error(NOTIFY_MESSAGES.TODO_UPDATE_FAILED);
      }

      const responseData = await response.json();
      if (responseData.success) {
        toast.success(responseData.message);
      } else {
        toast.error(responseData.message);
      }
    } catch {
      toast.error(NOTIFY_MESSAGES.TODO_UPDATE_FAILED);
    } finally {
      setLoading(false);
      setEditTodo(null);
      setIsEditing(false);
      setDialogOpen(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

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

                <div>
                  <p className={`${todo.isCompleted ? "line-through" : ""}`}>
                    {todo.taskName.length > 35
                      ? todo.taskName.slice(0, 35) + "..."
                      : todo.taskName}
                  </p>

                  {todo.description && (
                    <p className="text-xs text-gray-400 mt-1">
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
        isLoading={loading}
      />
    </>
  );
};

export default Todos;
