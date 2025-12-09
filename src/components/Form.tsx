import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState, useContext } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import Add from "@/components/icons/Add";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Todo } from "@/utils/interfaces/Todo";
import { User } from "@/utils/interfaces/User";
import { getUser } from "@/utils/actions/GetUser";
import { TodoContext } from "@/context/TodoContext";
import { API_METHODS } from "@/utils/enum/ApiMethods";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";
import type { FormData } from "@/utils/interfaces/FormData";
import { DEFAULT_VALUES } from "@/utils/constants/DefaultValues";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { FormSchema } from "@/utils/validationSchemas/TodoFormSchema";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";


const Form = () => {
  const context = useContext(TodoContext);
  const { todos } = context || { todos: [], setTodos: () => {} };

  const [todosSize, setTodosSize] = useState<number>(0);
  const [userData, setUserData] = useState<User | null>(null);
  
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
    const fetchTodosSize = async () => {
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

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.TODOS_COUNT
          }?userId=${user?.id}`,
          {
            method: API_METHODS.GET,
            headers: HEADERS,
          }
        );

        if (!response.ok) {
          toast.error(NOTIFY_MESSAGES.TODO_COUNT_FAILED);
        }

        const responseData = await response.json();
        if (responseData.success) {
          setTodosSize(responseData.todoCount || 0);
        } else {
          toast.error(responseData.message);
        }
      } catch {
        toast.error(NOTIFY_MESSAGES.TODO_COUNT_FAILED);
      }
    };

    fetchTodosSize();
  }, [todos]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        taskName: data.taskName,
        description: data.description || "",
        isCompleted: false,
      };

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.TODOS,
        {
          method: API_METHODS.POST,
          headers: HEADERS,
          body: JSON.stringify({ ...newTodo, userId: userData?.id }),
        }
      );

      if (!response.ok) {
        toast.error(NOTIFY_MESSAGES.TODO_ADD_FAILED);
      }

      const responseData = await response.json();
      if (responseData.success) {
        toast.success(responseData.message);
      } else {
        toast.error(responseData.message);
      }
    } catch {
      toast.error(NOTIFY_MESSAGES.TODO_ADD_FAILED);
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
