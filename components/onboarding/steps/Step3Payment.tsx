"use client";

import { useState } from "react";
import { CreditCard, Lock, ArrowLeft } from "lucide-react";
import { IOnboardingState } from "@/types/IOnboardingTypes";

interface Step3PaymentProps {
  onComplete: () => void;
  onBack: () => void;
  data: IOnboardingState;
}

export default function Step3Payment({
  onComplete,
  onBack,
  data,
}: Step3PaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    onComplete();
  };

  const isFree = data.planType === "Free";

  return (
    <div className="mx-auto max-w-xl">
      <div className="space-y-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold text-white">Review & Pay</h2>
          <p className="text-gray-400">
            Finalize your subscription to get started.
          </p>
        </div>

        {/* Summary Card */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy shadow-xl">
          <div className="border-b border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">Order Summary</h3>
          </div>
          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Plan</span>
              <span className="font-bold uppercase tracking-wider text-purple">
                {data.planType}
              </span>
            </div>
            {data.planType === "Enterprice" ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Company</span>
                  <span className="font-medium text-white">
                    {data.company.name} ({data.company.size})
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Workspace</span>
                <span className="font-medium text-white">
                  {data.workspaceName}
                </span>
              </div>
            )}
            <div className="my-4 h-px bg-white/10" />
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-300">Total due today</span>
              <div className="text-right">
                <span className="block text-2xl font-bold text-white">
                  {"$" + data.planPrice / 100}
                </span>
                <span className="text-xs text-gray-500">/month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Action */}
        <div className="space-y-4">
          {/* Redirect Notice */}
          {!isFree && (
            <div className="flex items-start gap-4 rounded-xl border border-purple/20 bg-purple/10 p-4">
              <div className="rounded-lg bg-purple/20 p-2">
                <CreditCard className="h-5 w-5 text-purple" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">
                  Secure Checkout via Stripe
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-gray-400">
                  By clicking &quot;Confirm Payment&quot;, you will be
                  redirected to Stripe&apos;s hosted checkout page to complete
                  your purchase securely.
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-purple py-4 text-lg font-bold text-white shadow-lg shadow-purple/20 transition-all hover:scale-[1.02] hover:bg-purpleDark hover:shadow-purple/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{isFree ? "Complete Setup" : "Confirm Payment"}</span>
                <Lock className="group-hover:text-purple-200 ml-1 h-4 w-4 transition-colors" />
              </>
            )}
          </button>

          <button
            onClick={onBack}
            className="flex w-full items-center justify-center gap-2 py-2 text-sm text-gray-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Details
          </button>
        </div>
      </div>
    </div>
  );
}
