"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { ButtonType } from "@/utils/enum/ButtonType";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";
import type { FormData } from "@/utils/interfaces/TodoFormData";
import { FormSchema } from "@/utils/validationSchemas/TodoFormSchema";

interface UpdateDialogProps {
  isOpen: boolean;
  taskName?: string;
  taskDescription?: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (data: FormData) => void;
}

export default function UpdateDialog({
  isOpen,
  taskName = "",
  taskDescription = "",
  isLoading = false,
  onClose,
  onConfirm,
}: UpdateDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(FormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen) {
      reset({ taskName, description: taskDescription });
    }
  }, [isOpen, taskName, taskDescription, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <form
        onSubmit={handleSubmit(onConfirm)}
        className="relative bg-gray-800 text-white p-6 rounded-xl w-[90%] max-w-sm shadow-lg flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold mb-3">Update Task?</h2>
        <p className="text-gray-300 mb-4">You can update your task details below.</p>

        <Input
          label="Task*"
          placeholder="Write your task"
          {...register("taskName")}
          className="border-[#c2b39a] border"
        />
        {errors.taskName && <p className="text-red-400 text-sm">{errors.taskName.message}</p>}

        <Input
          label="Description"
          placeholder="Write your description"
          {...register("description")}
          className="border-[#c2b39a] border"
        />
        {errors.description && <p className="text-red-400 text-sm">{errors.description.message}</p>}

        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant={ButtonVariant.SECONDARY}
            onClick={onClose}
            buttonText="Cancel"
            isDisable={isSubmitting}
            type={ButtonType.BUTTON}
          />
          <Button
            type={ButtonType.SUBMIT}
            variant={ButtonVariant.PRIMARY}
            buttonText="Update"
            isDisable={!isValid || !isDirty || isSubmitting}
            isLoading={isLoading || isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
