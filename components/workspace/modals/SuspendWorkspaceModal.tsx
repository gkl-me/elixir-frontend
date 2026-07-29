"use client";

import React, { useState } from "react";
import { Ban, CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Workspace } from "../WorkspaceColumns";

interface SuspendWorkspaceModalProps {
  isOpen: boolean;
  workspace: Workspace | null;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export function SuspendWorkspaceModal({
  isOpen,
  workspace,
  onClose,
  onConfirm,
}: SuspendWorkspaceModalProps) {
  const [loading, setLoading] = useState(false);

  if (!workspace) {return null;}

  const isSuspended =
    workspace.status === "suspended" || workspace.status === "blocked";

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={isSuspended ? "Activate Workspace" : "Suspend Workspace"}
      description={
        isSuspended
          ? `Re-activate workspace access for ${workspace.name}`
          : `Suspend workspace and disable access for ${workspace.name}`
      }
      className="sm:max-w-md"
    >
      <div className="space-y-4">
        {/* Workspace Card Info */}
        <div className="flex items-center gap-3.5 rounded-xl border border-purple/20 bg-navy/80 p-3.5">
          <Avatar className="h-11 w-11 ring-1 ring-purple/30">
            <AvatarFallback className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple to-purpleDark text-sm font-bold text-white">
              {workspace.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">
              {workspace.name}
            </p>
            <p className="truncate text-xs text-gray-400">
              {workspace.ownerEmail}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
              isSuspended
                ? "border border-red-500/30 bg-red-500/15 text-red-400"
                : "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
            }`}
          >
            {workspace.status || (isSuspended ? "Suspended" : "Active")}
          </span>
        </div>

        {/* Warning / Impact Box */}
        {!isSuspended ? (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-red-200">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-red-400">
                Suspending Workspace Access
              </p>
              <p className="leading-relaxed text-red-200/90">
                Suspending{" "}
                <strong className="text-white">{workspace.name}</strong> will
                immediately disable access for all{" "}
                <strong className="text-white">{workspace.totalUsers}</strong>{" "}
                user(s) and freeze all active projects and services inside this
                workspace.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-emerald-200">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-emerald-400">
                Restoring Workspace Access
              </p>
              <p className="leading-relaxed text-emerald-200/90">
                Activating{" "}
                <strong className="text-white">{workspace.name}</strong> will
                restore full dashboard, API, and project permissions for all{" "}
                <strong className="text-white">{workspace.totalUsers}</strong>{" "}
                member(s).
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 border-t border-purple/20 pt-3.5">
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 gap-2 font-semibold text-white shadow-md transition-all duration-200 disabled:opacity-50 ${
              !isSuspended
                ? "bg-gradient-to-r from-red-600 to-red-700 shadow-red-900/20 hover:from-red-500 hover:to-red-600"
                : "bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-emerald-900/20 hover:from-emerald-500 hover:to-emerald-600"
            }`}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : !isSuspended ? (
              <Ban className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            {!isSuspended ? "Suspend Workspace" : "Activate Workspace"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-purple/30 bg-navy/50 text-gray-300 hover:bg-purple/20 hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
