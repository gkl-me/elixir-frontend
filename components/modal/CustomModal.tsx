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
      <DialogContent className={cn("bg-navy border border-purpleDark sm:max-w-lg w-full rounded-xl shadow-lg shadow-purple/10", className)}>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-white text-2xl font-semibold">{title}</DialogTitle>
          <DialogDescription className={cn("text-gray-400", !description && "sr-only")}>
            {description || "Modal Content"}
          </DialogDescription>
        </DialogHeader>
        <div className="text-white">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
