"use client";

import React, { useState } from "react";
import { UserCheck, UserX, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "./UserColumns";

interface ToggleUserBlockModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export function ToggleUserBlockModal({
  isOpen,
  user,
  onClose,
  onConfirm,
}: ToggleUserBlockModalProps) {
  const [loading, setLoading] = useState(false);

  if (!user) {
    return null;
  }

  const isBlocking = !user.isBlocked; // true if target action is to block

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={isBlocking ? "Block User Account" : "Unblock User Account"}
      description={
        isBlocking
          ? `Are you sure you want to block ${user.name}?`
          : `Are you sure you want to unblock ${user.name}?`
      }
      className="sm:max-w-md"
    >
      <div className="space-y-4">
        {/* Selected User Info Card */}
        <div className="flex items-center gap-3 rounded-xl border border-[#1e2a4a] bg-[#07112b] p-3.5">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image} />
            <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#8735C9] to-[#6a29a0] text-sm font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {user.name}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#6b7db3]">
              <Mail className="h-3 w-3 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              user.isBlocked
                ? "border border-red-500/30 bg-red-500/15 text-red-400"
                : "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
            }`}
          >
            {user.isBlocked ? "Blocked" : "Active"}
          </span>
        </div>

        {/* Warning / Explanation Text */}
        <p className="text-xs leading-relaxed text-[#6b7db3]">
          {isBlocking
            ? "Blocking this user will immediately revoke their access to the platform and end all active sessions. You can unblock them at any time."
            : "Unblocking this user will restore their full access to the platform and allow them to log in again."}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 border-t border-[#1e2a4a] pt-3">
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 gap-2 font-semibold text-white disabled:opacity-50 ${
              isBlocking
                ? "bg-red-500 hover:bg-red-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isBlocking ? (
              <UserX className="h-4 w-4" />
            ) : (
              <UserCheck className="h-4 w-4" />
            )}
            {isBlocking ? "Block User" : "Unblock User"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-[#1e2a4a] text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
