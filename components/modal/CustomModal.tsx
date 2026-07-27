"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function CustomModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: CustomModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "w-full rounded-2xl border border-purple/30 bg-navyDark/95 p-6 shadow-[0_0_40px_-5px_rgba(135,53,201,0.2)] backdrop-blur-xl sm:max-w-lg sm:p-8",
          className
        )}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </DialogTitle>
          <DialogDescription
            className={cn(
              "mt-2 text-sm text-gray-400 sm:text-base",
              !description && "sr-only"
            )}
          >
            {description || "Modal Content"}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 text-gray-200">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
