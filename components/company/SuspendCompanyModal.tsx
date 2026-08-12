"use client";

import React, { useState } from "react";
import { Ban, CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Company } from "./CompanyColumns";

interface SuspendCompanyModalProps {
  isOpen: boolean;
  company: Company | null;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export function SuspendCompanyModal({
  isOpen,
  company,
  onClose,
  onConfirm,
}: SuspendCompanyModalProps) {
  const [loading, setLoading] = useState(false);

  if (!company) {
    return null;
  }

  const isSuspendedOrBlocked =
    company.status === "suspended" ||
    company.status === "blocked" ||
    company.isBlocked;

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={isSuspendedOrBlocked ? "Activate Company" : "Suspend Company"}
      description={
        isSuspendedOrBlocked
          ? `Re-activate ${company.name} and restore workspace access`
          : `Suspend ${company.name} and disable all associated workspaces`
      }
      className="sm:max-w-md"
    >
      <div className="space-y-4">
        {/* Company Info Card */}
        <div className="flex items-center gap-3 rounded-xl border border-[#1e2a4a] bg-[#07112b] p-3.5">
          <Avatar className="h-10 w-10">
            <AvatarImage src={company.logo} />
            <AvatarFallback className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0] text-sm font-bold text-white">
              {company.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {company.name}
            </p>
            <p className="truncate text-xs text-[#6b7db3]">{company.email}</p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
              isSuspendedOrBlocked
                ? "border border-red-500/30 bg-red-500/15 text-red-400"
                : "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
            }`}
          >
            {company.status || (isSuspendedOrBlocked ? "Suspended" : "Active")}
          </span>
        </div>

        {/* Workspace Disabling Warning Box */}
        {!isSuspendedOrBlocked ? (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-red-200">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-red-400">
                Disabling Associated Workspaces
              </p>
              <p className="text-red-200/80">
                Suspending this company will immediately disable and restrict
                access to all workspaces, projects, and team members associated
                with this company.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs leading-relaxed text-[#6b7db3]">
            Activating this company will restore full workspace access for all
            associated team members and projects.
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 border-t border-[#1e2a4a] pt-3">
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 gap-2 font-semibold text-white disabled:opacity-50 ${
              !isSuspendedOrBlocked
                ? "bg-red-500 hover:bg-red-600"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : !isSuspendedOrBlocked ? (
              <Ban className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            {!isSuspendedOrBlocked
              ? "Suspend & Disable Workspaces"
              : "Activate Company"}
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
