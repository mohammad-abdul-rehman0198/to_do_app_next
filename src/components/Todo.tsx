"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState, useRef, useContext } from "react";

import Edit from "@/components/icons/Edit";
import Circle from "@/components/icons/Circle";
import Delete from "@/components/icons/Delete";
import type { Todo } from "@/utils/interfaces/Todo";
import { TodoContext } from "@/context/TodoContext";
import FilledCircle from "@/components/icons/FilledCircle";
import type { FormData } from "@/utils/interfaces/FormData";
import { FormSchema } from "@/utils/validationSchemas/FormSchema";
import { getTodos,markTodoAsCompleted,deleteTodo,updateTodo } from "@/utils/actions/Database";

const Todos = () => {
  const context = useContext(TodoContext);
  const { todos, setTodos } = context || { todos: [], setTodos: () => {} };

  const editRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  
  const { register, handleSubmit, setValue } = useForm<FormData>({
    resolver: yupResolver(FormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const fetchTodos = () => {
      const todos = getTodos() || [];
      setTodos(todos);
    };
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editTodo) {
      setValue("taskName", editTodo.taskName);
    }
  }, [editTodo, setValue]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        editRef.current &&
        !editRef.current.contains(e.target as HTMLElement)
      ) {
        handleSubmit(handleSaveEditTodo)();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editRef, editTodo]);

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

  const handleEditTodo = (todo: Todo) => {
    setEditTodo(todo);
    setIsEditing(true);
  };

  const handleSaveEditTodo = (data: FormData) => {
    if (!isEditing) return;

    updateTodo(editTodo?.id as string, data.taskName);
    const todos = getTodos() || [];
    setTodos(todos);
    setEditTodo(null);
    setIsEditing(false);
  };

  return (
    <ol className="w-[70%] max-[510px]:w-[90%] max-w-[455px] space-y-[27px]">
      {todos.map((todo: Todo) => (
        <li
          key={todo.id}
          className="w-full text-[1rem] text-white flex justify-between items-center border border-[#c2b39a] p-3"
        >
          {isEditing && editTodo?.id === todo.id ? (
            <form
              onSubmit={handleSubmit(handleSaveEditTodo)}
              className="w-full"
            >
              <div ref={editRef} className="w-full">
                <input
                  type="text"
                  {...register("taskName")}
                  className="w-full bg-transparent border-none outline-none ring-0"
                />
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center gap-2">
                {todo.isCompleted ? (
                  <FilledCircle
                    onClick={() => handleCompleteTodo(todo.id)}
                    className="cursor-pointer"
                  />
                ) : (
                  <Circle
                    onClick={() => handleCompleteTodo(todo.id)}
                    className="cursor-pointer"
                  />
                )}
                <p className={`${todo.isCompleted ? "line-through " : ""}`}>
                  {todo.taskName.length > 35
                    ? todo.taskName.slice(0, 35) + "..."
                    : todo.taskName}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button>
                  <Edit
                    onClick={() => handleEditTodo(todo)}
                    className="cursor-pointer"
                  />
                </button>
                <button>
                  <Delete
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="cursor-pointer"
                  />
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ol>
  );
};

export default Todos;
