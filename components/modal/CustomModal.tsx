"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
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
          "bg-navyDark/95 backdrop-blur-xl border border-purple/30 sm:max-w-lg w-full rounded-2xl shadow-[0_0_40px_-5px_rgba(135,53,201,0.2)] p-6 sm:p-8",
          className
        )}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-white text-2xl sm:text-3xl font-bold tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className={cn("text-gray-400 mt-2 text-sm sm:text-base", !description && "sr-only")}>
            {description || "Modal Content"}
          </DialogDescription>
        </DialogHeader>
        <div className="text-gray-200 mt-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
