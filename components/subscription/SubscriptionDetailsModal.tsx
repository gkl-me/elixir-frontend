"use client";

import React from "react";
import {
  Calendar,
  Sparkles,
  Zap,
  Crown,
  Repeat,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import { CustomModal } from "@/components/modal/CustomModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AdminSubscription } from "@/data/demoData";

interface SubscriptionDetailsModalProps {
  isOpen: boolean;
  subscription: AdminSubscription | null;
  onClose: () => void;
}

export function SubscriptionDetailsModal({
  isOpen,
  subscription,
  onClose,
}: SubscriptionDetailsModalProps) {
  if (!subscription) {
    return null;
  }

  const isCanceled = subscription.status === "canceled";
  const isPastDue = subscription.status === "past_due";

  const getPlanBadge = (planName: string) => {
    if (planName === "Pro") {
      return {
        label: "Pro Plan",
        icon: Zap,
        badgeClass:
          "bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-purple-500/15 text-blue-400 border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]",
      };
    }
    if (planName === "Enterprise") {
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
      badgeClass: "bg-slate-500/10 text-slate-300 border-slate-500/20",
    };
  };

  const planInfo = getPlanBadge(subscription.planName);
  const PlanIcon = planInfo.icon;

  const priceFmt =
    subscription.price === 0
      ? "$0.00"
      : `$${(subscription.price / 100).toFixed(2)}`;

  const startDateFmt = subscription.currentPeriodStart
    ? new Date(subscription.currentPeriodStart).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const endDateFmt = subscription.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Subscription Details"
      description={`Subscription details and billing history for ${subscription.workspaceName}`}
      className="sm:max-w-xl"
    >
      <div className="space-y-5">
        {/* Header Summary Card */}
        <div className="relative overflow-hidden rounded-2xl border border-purple/20 bg-gradient-to-r from-[#0a1128] via-[#0f1b3e] to-[#0a1128] p-4 shadow-inner">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 ring-2 ring-purple/30 ring-offset-2 ring-offset-navy">
              <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-purple to-purpleDark text-lg font-bold text-white shadow-md">
                {subscription.workspaceName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-bold tracking-wide text-white">
                {subscription.workspaceName}
              </h3>
              <p className="mt-0.5 truncate text-xs text-gray-400">
                {subscription.companyName} • {subscription.ownerEmail}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  isCanceled
                    ? "border border-red-500/30 bg-red-500/10 text-red-400"
                    : isPastDue
                      ? "border border-amber-500/30 bg-amber-500/10 text-amber-400"
                      : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isCanceled
                      ? "animate-pulse bg-red-400"
                      : isPastDue
                        ? "animate-pulse bg-amber-400"
                        : "bg-emerald-400"
                  }`}
                />
                {subscription.status.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-2">
          {/* Subscription Plan */}
          <div className="rounded-xl border border-purple/20 bg-navy/60 p-3.5 transition-colors hover:border-purple/40">
            <div className="flex items-center gap-2 text-gray-400">
              <Crown className="h-4 w-4 text-amber-400" />
              <span className="font-medium">Plan Type</span>
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

          {/* Pricing & Cycle */}
          <div className="rounded-xl border border-purple/20 bg-navy/60 p-3.5 transition-colors hover:border-purple/40">
            <div className="flex items-center gap-2 text-gray-400">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span className="font-medium">Billing Price</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-white">
              {priceFmt}{" "}
              <span className="text-xs font-normal capitalize text-gray-400">
                / {subscription.billingCycle}
              </span>
            </p>
          </div>

          {/* Auto-Renewal */}
          <div className="rounded-xl border border-purple/20 bg-navy/60 p-3.5 transition-colors hover:border-purple/40">
            <div className="flex items-center gap-2 text-gray-400">
              <RefreshCw className="h-4 w-4 text-blue-400" />
              <span className="font-medium">Auto-Renew</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-white">
              {subscription.cancelAtPeriodEnd ? (
                <span className="text-amber-400">Cancels at Period End</span>
              ) : (
                <span className="text-emerald-400">Enabled</span>
              )}
            </p>
          </div>

          {/* Period Start */}
          <div className="rounded-xl border border-purple/20 bg-navy/60 p-3.5 transition-colors hover:border-purple/40">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <span className="font-medium">Period Start</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-white">
              {startDateFmt}
            </p>
          </div>

          {/* Period End / Renewal */}
          <div className="rounded-xl border border-purple/20 bg-navy/60 p-3.5 transition-colors hover:border-purple/40">
            <div className="flex items-center gap-2 text-gray-400">
              <Repeat className="h-4 w-4 text-pink-400" />
              <span className="font-medium">Next Renewal Date</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-white">
              {endDateFmt}
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
