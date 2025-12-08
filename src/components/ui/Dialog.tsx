"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { ButtonType } from "@/utils/enum/ButtonType";
import { yupResolver } from "@hookform/resolvers/yup";
import { DialogVariant } from "@/utils/enum/DialogVariant";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";
import type { FormData } from "@/utils/interfaces/FormData";
import { FormSchema } from "@/utils/validationSchemas/FormSchema";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data?: FormData | undefined) => void;
  variant?: DialogVariant;
  title?: string;
  description?: string;
  taskName?: string;
  taskDescription?: string;
  isLoading?: boolean;
}

const Dialog = ({
  isOpen,
  onClose,
  onConfirm,
  variant = DialogVariant.DELETE,
  title,
  description,
  taskName = "",
  taskDescription = "",
  isLoading = false,
}: DialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(FormSchema),
    mode: "onChange",
  });

  const TITLE_MESSAGES = {
    [DialogVariant.DELETE]: "Delete Task?",
    [DialogVariant.COMPLETE]: "Mark as Completed?",
    [DialogVariant.INCOMPLETE]: "Mark as Incomplete?",
    [DialogVariant.UPDATE]: "Update Task?",
  };

  const DESCRIPTION_MESSAGES = {
    [DialogVariant.DELETE]:
      "Are you sure you want to delete this task? This action cannot be undone.",
    [DialogVariant.COMPLETE]: "Do you want to mark this task as completed?",
    [DialogVariant.INCOMPLETE]: "Do you want to mark this task as incomplete?",
    [DialogVariant.UPDATE]: "You can update your task details below.",
  };

  const BUTTON_MESSAGES = {
    [DialogVariant.DELETE]: "Delete",
    [DialogVariant.COMPLETE]: "Mark Completed",
    [DialogVariant.INCOMPLETE]: "Mark Incomplete",
    [DialogVariant.UPDATE]: "Update",
  };

  useEffect(() => {
    if (isOpen && variant === DialogVariant.UPDATE) {
      reset({
        taskName,
        description: taskDescription,
      });
    }
  }, [isOpen, taskName, taskDescription, reset, variant]);

  const submitUpdate = (data: FormData) => {
    onConfirm(data);
  };

  const handleNormalConfirm = () => {
    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-gray-800 text-white p-6 rounded-xl w-[90%] max-w-sm shadow-lg">
        <h2 className="text-xl font-semibold mb-3">
          {title || TITLE_MESSAGES[variant]}
        </h2>

        <p className="text-gray-300 mb-6">
          {description || DESCRIPTION_MESSAGES[variant]}
        </p>

        {variant === DialogVariant.UPDATE && (
          <form
            onSubmit={handleSubmit(submitUpdate)}
            className="flex flex-col gap-4 mb-6"
          >
            <div>
              <Input
                type="text"
                placeholder="Task name*"
                {...register("taskName", { required: "Task name is required." })}
                className="border-[#c2b39a] border"
              />
              {errors.taskName && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.taskName.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="text"
                {...register("description")}
                placeholder="Description"
                className="border-[#c2b39a] border"
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant={ButtonVariant.SECONDARY}
                onClick={onClose}
                buttonText="Cancel"
                isDisable={isSubmitting}
              />

              <Button
                type={ButtonType.SUBMIT}
                variant={ButtonVariant.PRIMARY}
                buttonText={BUTTON_MESSAGES[variant]}
                isDisable={!isValid}
                isLoading={isLoading || isSubmitting}
              />
            </div>
          </form>
        )}

        {variant !== DialogVariant.UPDATE && (
          <div className="flex justify-end gap-3">
            <Button
              variant={ButtonVariant.SECONDARY}
              onClick={onClose}
              buttonText="Cancel"
            />

            <Button
              variant={ButtonVariant.PRIMARY}
              onClick={handleNormalConfirm}
              buttonText={BUTTON_MESSAGES[variant]}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dialog;
