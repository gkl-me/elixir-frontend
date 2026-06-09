"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  RefreshCcw,
  LayoutDashboard,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  retryPaymentAction,
  verifyPaymentAction,
} from "@/app/actions/payment.action";
import { USER_CLIENT_ROUTES } from "@/constants/clientRoutes";
import { toastHandler } from "@/lib/toastHandler";
import {
  changePlanAction,
  completeOnboadringPaymentAction,
} from "@/app/actions/onboarding.action";
import { useApi } from "@/hooks/useApi";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";

type PaymentStatus = "pending" | "success" | "failed" | "incomplete";

export default function PaymentVerifyPage() {
  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [message, setMessage] = useState("Verifying your payment...");
  const router = useRouter();


  const { execute } = useApi({
    method: 'POST',
    url: NEXT_API_ROUTES.UPDATE_SESSION
  })

  const handleVerify = useCallback(async () => {
    setStatus("pending");
    const res = await verifyPaymentAction();

    // console.log(res)

    if (res.success) {
      const paymentData = res.data;
      if (paymentData.paymentStatus === "success" && paymentData?.workspaceSlug) {

        //update the session with workspace slug 
        await execute({
          body: {
            workspaceSlug: paymentData?.workspaceSlug
          }
        })

        setStatus("success");
        setMessage(res.message);
        setTimeout(() => {
          router.push(`/workspace/${paymentData.workspaceSlug}`);
        }, 2000);
      } else if (paymentData.paymentStatus === "incomplete") {
        setStatus("incomplete");
        setMessage(res.message);
      } else if (paymentData.paymentStatus === "pending") {
        setStatus("pending");
        setMessage(res.message);
        setTimeout(handleVerify, 5000);
      } else {
        setStatus("failed");
        setMessage(res.data.message || "Payment verification failed.");
      }
    } else {
      setStatus("failed");
      setMessage(res.error);
    }
  }, [router]);

  const handleRetry = async () => {
    setStatus("pending");
    setMessage("Initiating retry...");
    const res = await retryPaymentAction();
    router.push(res.data.payment_url);
    if (res && !res.success) {
      setStatus("failed");
      setMessage(res.error);
      toastHandler(res);
    }
  };

  const handleChangePlan = async () => {
    setStatus("pending");
    setMessage("Redirecting to onboarding...");
    await changePlanAction();
  };

  const handleCompletePayment = async () => {
    setStatus("pending");
    setMessage("Completing payment");
    const res = await completeOnboadringPaymentAction();
    router.push(res.data.payment_url);
    if (res && !res.success) {
      setStatus("failed");
      setMessage(res.error);
      toastHandler(res);
    }
  };

  useEffect(() => {
    handleVerify();
  }, [handleVerify]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navyDark p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {status === "pending" && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 rounded-3xl border border-white/10 bg-navy p-8 text-center shadow-2xl"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-purple/20 blur-3xl" />
                <Loader2 className="relative mx-auto h-16 w-16 animate-spin text-purple" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Verifying Payment
                </h2>
                <p className="text-gray-400">{message}</p>
              </div>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 rounded-3xl border border-white/10 bg-navy p-8 text-center shadow-2xl"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">
                  Payment Confirmed!
                </h2>
                <p className="text-gray-400">{message}</p>
              </div>
              <button
                onClick={() => router.push(USER_CLIENT_ROUTES.WORKSPACE)}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-purple py-4 font-bold text-white transition-all hover:bg-purpleDark"
              >
                Go to Dashboard
                <LayoutDashboard className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          )}

          {status === "failed" && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 rounded-3xl border border-white/10 bg-navy p-8 text-center shadow-2xl"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  Payment Failed
                </h2>
                <p className="text-gray-400">{message}</p>
              </div>
              <div className="space-y-3 pt-4">
                <button
                  onClick={handleRetry}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-purple py-4 font-bold text-white transition-all hover:bg-purpleDark"
                >
                  <RefreshCcw className="h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
                  Retry Payment
                </button>
                <button
                  onClick={handleChangePlan}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 font-semibold text-gray-300 transition-all hover:bg-white/10"
                >
                  Change Plan
                </button>
              </div>
            </motion.div>
          )}

          {status === "incomplete" && (
            <motion.div
              key="incomplete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 rounded-3xl border border-white/10 bg-navy p-8 text-center shadow-2xl"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10">
                <AlertCircle className="h-12 w-12 text-amber-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  Action Required
                </h2>
                <p className="text-gray-400">{message}</p>
              </div>
              <div className="space-y-3 pt-4">
                <button
                  onClick={handleCompletePayment}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-purple py-4 font-bold text-white transition-all hover:bg-purpleDark"
                >
                  <CreditCard className="h-5 w-5" />
                  Complete Payment
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={handleChangePlan}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 font-semibold text-gray-300 transition-all hover:bg-white/10"
                >
                  Change Plan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-8 text-center text-sm text-gray-500">
          Having trouble?{" "}
          <span className="cursor-pointer text-purple hover:underline">
            Contact Support
          </span>
        </p>
      </div>
    </div>
  );
}
