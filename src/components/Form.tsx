import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState, useContext } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import Add from "@/components/icons/Add";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { TodoContext } from "@/context/TodoContext";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";
import type { FormData } from "@/utils/interfaces/FormData";
import { getTodos, addTodo } from "@/utils/actions/Database";
import { DEFAULT_VALUES } from "@/utils/constants/DefaultValues";
import { FormSchema } from "@/utils/validationSchemas/FormSchema";

const Form = () => {
  const context = useContext(TodoContext);
  const { todos, setTodos } = context || { todos: [], setTodos: () => {} };

  const [todosSize, setTodosSize] = useState<number>(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      taskName: DEFAULT_VALUES.TASK_NAME,
    },
  });

  useEffect(() => {
    const fetchTodosSize = () => {
      try {
        const todos = getTodos();
        setTodosSize(todos?.length || 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTodosSize();
  }, [todos]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    try {
      addTodo(data.taskName);
      const todos = getTodos() || [];
      setTodos(todos);
    } catch (error) {
      console.error(error);
    } finally {
      reset();
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[70%] max-[510px]:w-[90%] flex items-center gap-3 border-none mt-[38px] mb-5 rounded-[11px] max-w-[455px]"
      >
        <Input
          type="text"
          placeholder="Write your next task"
          {...register("taskName", { required: "Task name is required" })}
        />

        <Button
          variant={ButtonVariant.PRIMARY}
          logo={<Add />}
          isLoading={isSubmitting}
          isDisable={!isValid}
        />
      </form>

      {todosSize === 0 && (
        <div className="w-[70%] max-[510px]:w-[90%] flex flex-col items-center justify-center">
          <p className="text-[16px]">
            Seems lonely in here, what are you up to?
          </p>
        </div>
      )}
    </>
  );
};

export default Form;
