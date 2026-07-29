"use client";

import React, { useState } from "react";
import {
  Ban,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Clock,
  ZapOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminSubscription } from "@/data/demoData";

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  subscription: AdminSubscription | null;
  onClose: () => void;
  onConfirm: (mode: "period_end" | "immediate") => Promise<void> | void;
}

export function CancelSubscriptionModal({
  isOpen,
  subscription,
  onClose,
  onConfirm,
}: CancelSubscriptionModalProps) {
  const [loading, setLoading] = useState(false);
  const [cancelMode, setCancelMode] = useState<"period_end" | "immediate">(
    "period_end"
  );

  if (!subscription) {return null;}

  const isCanceled = subscription.status === "canceled";
  const isPendingCancel =
    subscription.status === "active" && subscription.cancelAtPeriodEnd;
  const isFree = subscription.planName === "Free" || subscription.price === 0;

  // Reactivation Rules:
  // 1. Within period (active & cancelAtPeriodEnd) -> CAN reactivate
  // 2. Immediate / Canceled & Free -> CAN reactivate
  // 3. Immediate / Canceled & Paid -> CANNOT reactivate
  const canReactivate = isPendingCancel || (isCanceled && isFree);
  const isReactivationView = isPendingCancel || isCanceled;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(cancelMode);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isReactivationView ? "Re-activate Subscription" : "Cancel Subscription"
      }
      description={
        isReactivationView
          ? `Manage reactivation settings for ${subscription.workspaceName}`
          : `Choose how to cancel subscription for ${subscription.workspaceName}`
      }
      className="sm:max-w-lg"
    >
      <div className="space-y-4">
        {/* Subscription Info Card */}
        <div className="flex items-center gap-3.5 rounded-xl border border-purple/20 bg-navy/80 p-3.5">
          <Avatar className="h-11 w-11 ring-1 ring-purple/30">
            <AvatarFallback className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple to-purpleDark text-sm font-bold text-white">
              {subscription.workspaceName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">
              {subscription.workspaceName}
            </p>
            <p className="truncate text-xs text-gray-400">
              {subscription.planName} Plan • {subscription.ownerEmail}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
              isCanceled
                ? "border border-red-500/30 bg-red-500/15 text-red-400"
                : isPendingCancel
                  ? "border border-amber-500/30 bg-amber-500/15 text-amber-400"
                  : "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
            }`}
          >
            {isPendingCancel ? "Canceling at End" : subscription.status}
          </span>
        </div>

        {/* ── MODE 1: CANCELING ACTIVE SUBSCRIPTION ───────────────── */}
        {!isReactivationView && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-300">
              Select Cancellation Strategy:
            </p>

            {/* Option A: End of Period */}
            <div
              onClick={() => setCancelMode("period_end")}
              className={`cursor-pointer rounded-xl border p-3.5 transition-all duration-200 ${
                cancelMode === "period_end"
                  ? "border-purple bg-purple/15 text-white ring-1 ring-purple/50"
                  : "border-purple/20 bg-navy/40 text-gray-300 hover:border-purple/40 hover:bg-navy/70"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-amber-500/20 p-1.5 text-amber-400">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">
                      Cancel at End of Billing Period
                    </p>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-400">
                    Customer keeps paid features until end of period.{" "}
                    <strong className="text-white">
                      Can be reactivated anytime
                    </strong>{" "}
                    before the cycle ends.
                  </p>
                </div>
              </div>
            </div>

            {/* Option B: Immediate */}
            <div
              onClick={() => setCancelMode("immediate")}
              className={`cursor-pointer rounded-xl border p-3.5 transition-all duration-200 ${
                cancelMode === "immediate"
                  ? "border-red-500 bg-red-500/15 text-white ring-1 ring-red-500/50"
                  : "border-purple/20 bg-navy/40 text-gray-300 hover:border-purple/40 hover:bg-navy/70"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-red-500/20 p-1.5 text-red-400">
                  <ZapOff className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    Immediate Cancellation
                  </p>
                  <p className="text-xs leading-relaxed text-gray-400">
                    Revokes features immediately.{" "}
                    {!isFree ? (
                      <strong className="text-red-400">
                        Paid plans cannot be reactivated directly in Stripe
                      </strong>
                    ) : (
                      <span>Free plans can be reactivated anytime.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MODE 2: REACTIVATION VIEW ───────────────────────────── */}
        {isReactivationView && (
          <>
            {canReactivate ? (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-emerald-200">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-emerald-400">
                    {isPendingCancel
                      ? "Un-cancel & Resume Auto-Renewal"
                      : "Restore Free Subscription"}
                  </p>
                  <p className="leading-relaxed text-emerald-200/90">
                    {isPendingCancel ? (
                      <>
                        Re-activating{" "}
                        <strong className="text-white">
                          {subscription.workspaceName}
                        </strong>{" "}
                        will remove the pending cancellation and resume normal
                        recurring billing on the renewal date.
                      </>
                    ) : (
                      <>
                        Re-activating{" "}
                        <strong className="text-white">
                          {subscription.workspaceName}
                        </strong>{" "}
                        will restore access to the Free tier features
                        immediately.
                      </>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-red-200">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-red-400">
                    Cannot Reactivate Directly
                  </p>
                  <p className="leading-relaxed text-red-200/90">
                    This paid{" "}
                    <strong className="text-white">
                      {subscription.planName}
                    </strong>{" "}
                    plan was canceled immediately. Stripe strictly locks
                    canceled paid subscriptions. To restore access, the
                    workspace customer must start a{" "}
                    <strong className="text-white">new Checkout session</strong>
                    .
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 border-t border-purple/20 pt-3.5">
          {!isReactivationView ? (
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className={`flex-1 gap-2 font-semibold text-white shadow-md transition-all duration-200 disabled:opacity-50 ${
                cancelMode === "immediate"
                  ? "bg-gradient-to-r from-red-600 to-red-700 shadow-red-900/20 hover:from-red-500 hover:to-red-600"
                  : "bg-gradient-to-r from-amber-600 to-amber-700 shadow-amber-900/20 hover:from-amber-500 hover:to-amber-600"
              }`}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Ban className="h-4 w-4" />
              )}
              {cancelMode === "immediate"
                ? "Cancel Immediately"
                : "Cancel at Period End"}
            </Button>
          ) : (
            <Button
              onClick={handleConfirm}
              disabled={loading || !canReactivate}
              className="flex-1 gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 font-semibold text-white shadow-md shadow-emerald-900/20 transition-all duration-200 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-40"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Re-activate Subscription
            </Button>
          )}

          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-purple/30 bg-navy/50 text-gray-300 hover:bg-purple/20 hover:text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
