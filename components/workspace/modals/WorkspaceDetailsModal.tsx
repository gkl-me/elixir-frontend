"use client";

import React from "react";
import {
  Building2,
  Mail,
  Users,
  Calendar,
  Activity,
  Sparkles,
  Zap,
  Crown,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { CustomModal } from "@/components/modal/CustomModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Workspace } from "../WorkspaceColumns";

interface WorkspaceDetailsModalProps {
  isOpen: boolean;
  workspace: Workspace | null;
  onClose: () => void;
}

export function WorkspaceDetailsModal({
  isOpen,
  workspace,
  onClose,
}: WorkspaceDetailsModalProps) {
  if (!workspace) return null;

  const isSuspended =
    workspace.status === "suspended" || workspace.status === "blocked";

  const getPlanBadge = (planType: string) => {
    const plan = planType?.toLowerCase() || "";
    if (plan.includes("pro")) {
      return {
        label: "Pro Plan",
        icon: Zap,
        badgeClass:
          "bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-purple-500/15 text-blue-400 border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]",
      };
    }
    if (plan.includes("enter")) {
      return {
        label: "Enterprise",
        icon: Crown,
        badgeClass:
          "bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-fuchsia-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
      };
    }
    return {
      label: "Free Plan",
      icon: Sparkles,
      badgeClass:
        "bg-slate-500/10 text-slate-300 border-slate-500/20",
    };
  };

  const planInfo = getPlanBadge(workspace.planType);
  const PlanIcon = planInfo.icon;

  const formattedDate = workspace.createdAt
    ? new Date(workspace.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Workspace Details"
      description={`Overview and operational specifications for ${workspace.name}`}
      className="sm:max-w-xl"
    >
      <div className="space-y-5">
        {/* Top Header Card */}
        <div className="relative overflow-hidden rounded-2xl border border-purple/20 bg-gradient-to-r from-[#0a1128] via-[#0f1b3e] to-[#0a1128] p-4 shadow-inner">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 ring-2 ring-purple/30 ring-offset-2 ring-offset-navy">
              <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-purple to-purpleDark text-lg font-bold text-white shadow-md">
                {workspace.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-lg font-bold tracking-wide text-white">
                  {workspace.name}
                </h3>
              </div>
              <p className="mt-0.5 truncate text-xs text-gray-400">
                {workspace.ownerEmail}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  isSuspended
                    ? "border border-red-500/30 bg-red-500/10 text-red-400"
                    : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSuspended ? "bg-red-400 animate-pulse" : "bg-emerald-400"
                  }`}
                />
                {workspace.status || "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-2">
          {/* Workspace Name */}
          <div className="rounded-xl border border-purple/20 bg-navy/60 p-3.5 transition-colors hover:border-purple/40">
            <div className="flex items-center gap-2 text-gray-400">
              <Building2 className="h-4 w-4 text-purple-400" />
              <span className="font-medium">Workspace Name</span>
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-white">
              {workspace.name}
            </p>
          </div>

          {/* Owner Email */}
          <div className="rounded-xl border border-purple/20 bg-navy/60 p-3.5 transition-colors hover:border-purple/40">
            <div className="flex items-center gap-2 text-gray-400">
              <Mail className="h-4 w-4 text-blue-400" />
              <span className="font-medium">Owner Email</span>
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-white">
              {workspace.ownerEmail}
            </p>
          </div>

          {/* Current Plan */}
          <div className="rounded-xl border border-purple/20 bg-navy/60 p-3.5 transition-colors hover:border-purple/40">
            <div className="flex items-center gap-2 text-gray-400">
              <Crown className="h-4 w-4 text-amber-400" />
              <span className="font-medium">Subscription Plan</span>
            </div>
            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${planInfo.badgeClass}`}
              >
                <PlanIcon className="h-3.5 w-3.5" />
                {planInfo.label}
              </span>
            </div>
          </div>

          {/* Total Members */}
          <div className="rounded-xl border border-purple/20 bg-navy/60 p-3.5 transition-colors hover:border-purple/40">
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="h-4 w-4 text-indigo-400" />
              <span className="font-medium">Total Members</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-white">
              {workspace.totalUsers}{" "}
              <span className="text-xs font-normal text-gray-400">
                {workspace.totalUsers === 1 ? "user" : "users"}
              </span>
            </p>
          </div>

          {/* Status */}
          <div className="rounded-xl border border-purple/20 bg-navy/60 p-3.5 transition-colors hover:border-purple/40">
            <div className="flex items-center gap-2 text-gray-400">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span className="font-medium">Account Health</span>
            </div>
            <p className="mt-2 text-sm font-semibold capitalize text-white">
              {isSuspended ? "Suspended Access" : "Operational"}
            </p>
          </div>

          {/* Created At */}
          <div className="rounded-xl border border-purple/20 bg-navy/60 p-3.5 transition-colors hover:border-purple/40">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="h-4 w-4 text-pink-400" />
              <span className="font-medium">Created Date</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-white">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end border-t border-purple/20 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-purple/30 bg-navy/50 font-medium text-gray-300 hover:bg-purple/20 hover:text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
