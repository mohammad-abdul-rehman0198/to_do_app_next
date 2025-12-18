import { useState } from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, type SubmitHandler } from "react-hook-form";

import Add from "@/components/icons/Add";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { todoController } from "@/state/controller/todo";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";
import type { FormData } from "@/utils/interfaces/FormData";
import { DEFAULT_VALUES } from "@/utils/constants/DefaultValues";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { FormSchema } from "@/utils/validationSchemas/TodoFormSchema";


const Form = () => {
  const { todos } = todoController.useState(["todos"]);

  const [isAdding, setIsAdding] = useState(false);

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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setIsAdding(true);
     await todoController.addTodo({
        taskName: data.taskName,
        description: data.description || "",
        status: false,
      });
      setIsAdding(false);
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
          isLoading={isAdding || isSubmitting}
          isDisable={!isValid}
        />
      </form>

      {todos?.length === 0 && (
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
