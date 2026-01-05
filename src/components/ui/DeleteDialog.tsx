"use client";

import Button from "@/components/ui/Button";
import { ButtonVariant } from "@/utils/enum/ButtonVariant";

interface DeleteDialogProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteDialog({ isOpen, isLoading, onClose, onConfirm }: DeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-800 text-white p-6 rounded-xl w-[90%] max-w-sm shadow-lg">
        <h2 className="text-xl font-semibold mb-3">Delete Task?</h2>
        <p className="text-gray-300 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>

        <div className="flex justify-end gap-3">
          <Button variant={ButtonVariant.SECONDARY} onClick={onClose} buttonText="Cancel" />
          <Button variant={ButtonVariant.PRIMARY} onClick={onConfirm} buttonText="Delete" isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
