"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CreditCard, Zap, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { Section } from "./shared";
import { cn } from "@/lib/utils";
import { IPlan } from "@/types/IPlanType";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { toastHandler } from "@/lib/toastHandler";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { useApi } from "@/hooks/useApi";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { PlanCard } from "@/components/plans/PlanCard";
import {
  customerPortalAction,
  startUpgradeCheckoutAction,
} from "@/app/actions/payment.action";
import {
  CompanyDetailsModal,
  ICompanyDetailsForm,
} from "./CompanyDetailsModal";

// ─── Helpers ──────────────────────────────────────────────
const fmt = (cents: number) =>
  cents === 0 ? "$0.00" : `$${(cents / 100).toFixed(2)}`;

// ─── BillingTab ───────────────────────────────────────────
export const BillingTab = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [currentPlan, setCurrentPlan] = useState<IPlan | undefined>();
  const [upgradePlans, setUpgradePlans] = useState<IPlan[]>([]);
  const [, setSubscription] = useState<unknown>();

  // Upgrade state
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] =
    useState<IPlan | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Status modal state (success or cancelled)
  const [statusModal, setStatusModal] = useState<
    "success" | "cancelled" | null
  >(null);

  const workspaceId = useWorkspaceStore((s) => s?.context?.workspaceId);

  const { execute } = useApi({
    url: NEXT_API_ROUTES.GET_BILLING_INFO,
    method: "GET",
  });

  const fetchBillingInfo = useCallback(async () => {
    if (!workspaceId) {
      return;
    }

    try {
      const res = await execute({
        params: {
          workspaceId,
        },
      });

      if (res?.success) {
        setCurrentPlan(res.data.currentPlan);
        setSubscription(res.data.subscription);
        setUpgradePlans(res.data.upgradePlans);
      }
    } catch (error) {
      toastHandler({
        success: false,
        error: AxiosErrorHandler(error).message,
      });
    }
  }, [workspaceId, execute]);

  useEffect(() => {
    fetchBillingInfo();
  }, [fetchBillingInfo]);

  // Detect payment status query param from Stripe redirect
  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      setStatusModal("success");
    } else if (status === "cancelled" || status === "canceled") {
      setStatusModal("cancelled");
    }
  }, [searchParams]);

  const handleCloseStatusModal = () => {
    setStatusModal(null);
    // Clean up query param from URL without full reload
    const params = new URLSearchParams(searchParams.toString());
    params.delete("status");
    const query = params.toString();
    const newUrl = query ? `${pathname}?${query}` : pathname;
    router.replace(newUrl, { scroll: false });
  };

  const handleCustomerPortal = async () => {
    if (!workspaceId) {
      return;
    }
    const res = await customerPortalAction({ workspaceId });

    if (res?.success && res.data?.customerPortalUrl) {
      window.location.href = res.data.customerPortalUrl;
    }

    toastHandler(res);
  };

  // Trigger plan upgrade
  const handleUpgradeClick = (plan: IPlan) => {
    setSelectedPlanForUpgrade(plan);
    const planType = plan.type.toLowerCase();

    if (planType === "enterprice") {
      setIsCompanyModalOpen(true);
    } else {
      executeUpgrade(plan.id);
    }
  };

  // Perform upgrade API call and redirect to Stripe
  const executeUpgrade = async (
    planId: string,
    companyData?: ICompanyDetailsForm
  ) => {
    if (!workspaceId) {
      return;
    }
    setIsUpgrading(true);

    try {
      const res = await startUpgradeCheckoutAction({
        workspaceId,
        planId,
        company: companyData,
      });

      if (res?.success && res.data?.payment_url) {
        toastHandler({
          success: true,
          message: "Redirecting to Stripe payment checkout...",
        });
        window.location.href = res.data.payment_url;
      } else {
        toastHandler({
          success: false,
          error: res.error || "Failed to create checkout session.",
        });
      }
    } catch (error) {
      toastHandler({
        success: false,
        error: AxiosErrorHandler(error).message,
      });
    } finally {
      setIsUpgrading(false);
      setIsCompanyModalOpen(false);
    }
  };

  const handleCompanySubmit = async (details: ICompanyDetailsForm) => {
    if (selectedPlanForUpgrade) {
      await executeUpgrade(selectedPlanForUpgrade.id, details);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current plan badge */}
      {currentPlan && currentPlan.type !== "Free" && (
        <div className="flex items-center justify-between rounded-2xl border border-[#8735C9]/40 bg-gradient-to-r from-[#1a0f35] to-[#0C1635] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8735C9]/20">
              <Zap className="h-5 w-5 text-[#c084fc]" />
            </div>
            <div>
              <p className="text-xs text-[#6b7db3]">Current plan</p>
              <p className="text-lg font-black text-white">
                {currentPlan?.name}{" "}
                <span className="text-sm font-normal text-[#6b7db3]">
                  · {fmt(currentPlan?.price ?? 0)}/mo
                </span>
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="gap-1.5 border border-[#1e2a4a] text-xs text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
            onClick={handleCustomerPortal}
          >
            <CreditCard className="h-3.5 w-3.5" />
            Manage Payment
          </Button>
        </div>
      )}

      {/* Upgrade plans */}
      {(upgradePlans?.length ?? 0) > 0 && (
        <Section
          title="Upgrade Plan"
          description="Unlock more features and higher limits for your team."
        >
          <div
            className={cn(
              "grid gap-4",
              upgradePlans.length === 1
                ? "max-w-sm md:grid-cols-1"
                : "md:grid-cols-2"
            )}
          >
            {upgradePlans.map((plan) => {
              const planId = plan?.id;
              return (
                <PlanCard
                  key={planId}
                  {...plan}
                  actionSlot={
                    <Button
                      variant="dark"
                      disabled={isUpgrading}
                      onClick={() => handleUpgradeClick(plan)}
                      className="w-full bg-purple font-semibold text-white transition-all hover:bg-purple/90"
                    >
                      {isUpgrading && selectedPlanForUpgrade?.id === plan.id
                        ? "Redirecting..."
                        : `Upgrade to ${plan.name}`}
                    </Button>
                  }
                />
              );
            })}
          </div>
        </Section>
      )}

      {/* Company Details Modal for Enterprise Plan */}
      {selectedPlanForUpgrade && (
        <CompanyDetailsModal
          isOpen={isCompanyModalOpen}
          onClose={() => setIsCompanyModalOpen(false)}
          onSubmit={handleCompanySubmit}
          isLoading={isUpgrading}
          planName={selectedPlanForUpgrade.name}
        />
      )}

      {/* Payment Status Feedback Modal (Success or Cancelled) */}
      {statusModal !== null && (
        <CustomModal
          isOpen={statusModal !== null}
          onClose={handleCloseStatusModal}
          title={
            statusModal === "success"
              ? "Payment Successful!"
              : "Payment Cancelled"
          }
          description={
            statusModal === "success"
              ? "Your subscription plan upgrade has been completed."
              : "The checkout session was cancelled. No charges were made."
          }
          className="text-center sm:max-w-md"
        >
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            {statusModal === "success" ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
                <XCircle className="h-10 w-10 text-amber-400" />
              </div>
            )}

            <p className="text-sm text-gray-300">
              {statusModal === "success"
                ? "Thank you! Your subscription has been successfully upgraded. Your new plan features and limits are now active."
                : "You cancelled the Stripe checkout process. No payment was charged. You can upgrade whenever you are ready."}
            </p>

            <Button
              onClick={handleCloseStatusModal}
              className={cn(
                "mt-2 w-full font-semibold text-white",
                statusModal === "success"
                  ? "bg-emerald-600 hover:bg-emerald-500"
                  : "bg-purple hover:bg-purple/90"
              )}
            >
              {statusModal === "success" ? "Great, Thanks!" : "Got it"}
            </Button>
          </div>
        </CustomModal>
      )}
    </div>
  );
};
