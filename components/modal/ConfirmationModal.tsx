"use client";

import { CustomModal } from "@/components/modal/CustomModal";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
    >
      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          {cancelText}
        </Button>
        <Button variant="dark" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Loading..." : confirmText}
        </Button>
      </div>
    </CustomModal>
  );
}
