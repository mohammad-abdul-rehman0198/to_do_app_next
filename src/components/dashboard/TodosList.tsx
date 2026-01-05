"use client";

import { CheckCircle, Circle } from "lucide-react";

import Edit from "@/components/icons/Edit";
import Button from "@/components/ui/Button";
import DeleteDialog from "../ui/DeleteDialog";
import UpdateDialog from "../ui/UpdateDialog";
import Delete from "@/components/icons/Delete";
import CompleteDialog from "../ui/CompleteDialog";
import type { Todo } from "@/utils/interfaces/Todo";
import { todoController } from "@/state/controller/todo";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";
import { useDeleteTodoDialog } from "@/customHooks/useDeleteTodoDialog";
import { useUpdateTodoDialog } from "@/customHooks/useUpdateTodoDialog";
import { useCompleteTodoDialog } from "@/customHooks/useCompleteTodoDialog";


const Todos = () => {
  const { todos } = todoController.useState(["todos"]);

  const deleteDialog = useDeleteTodoDialog();
  const updateDialog = useUpdateTodoDialog();
  const completeDialog = useCompleteTodoDialog(todos || []);

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
                  onClick={() => completeDialog.open(todo?.id || "")}
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
                  onClick={() => updateDialog.open(todo)}
                  logo={<Edit />}
                />
                <Button
                  variant={ButtonVariant.ICON}
                  onClick={() => deleteDialog.open(todo?.id || "")}
                  logo={<Delete />}
                />
              </div>
            </>
          </li>
        ))}
      </ol>

      <UpdateDialog
        isOpen={updateDialog.isOpen}
        isLoading={updateDialog.isLoading}
        taskName={updateDialog.editTodo?.taskName}
        taskDescription={updateDialog.editTodo?.description}
        onClose={updateDialog.close}
        onConfirm={updateDialog.confirm}
      />

      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        isLoading={deleteDialog.isLoading}
        onClose={deleteDialog.close}
        onConfirm={deleteDialog.confirm}
      />

      <CompleteDialog
        isOpen={completeDialog.isOpen}
        isLoading={completeDialog.isLoading}
        taskCompleted={completeDialog.isCompleted}
        onClose={completeDialog.close}
        onConfirm={completeDialog.confirm}
      />
    </>
  );
};

export default Todos;
