"use client";

import Button from "@/components/ui/Button";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";

interface CompleteDialogProps {
  isOpen: boolean;
  isLoading?: boolean;
  taskCompleted: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CompleteDialog({
  isOpen,
  isLoading,
  taskCompleted,
  onClose,
  onConfirm,
}: CompleteDialogProps) {
  if (!isOpen) return null;

  const title = taskCompleted ? "Mark as Incomplete?" : "Mark as Completed?";
  const description = taskCompleted
    ? "Do you want to mark this task as incomplete?"
    : "Do you want to mark this task as completed?";
  const buttonText = taskCompleted ? "Mark Incomplete" : "Mark Completed";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gray-800 text-white p-6 rounded-xl w-[90%] max-w-sm shadow-lg">
        <h2 className="text-xl font-semibold mb-3">{title}</h2>
        <p className="text-gray-300 mb-6">{description}</p>

        <div className="flex justify-end gap-3">
          <Button
            variant={ButtonVariant.SECONDARY}
            onClick={onClose}
            buttonText="Cancel"
          />
          <Button
            variant={ButtonVariant.PRIMARY}
            onClick={onConfirm}
            buttonText={buttonText}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
