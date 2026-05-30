"use client";

import { CustomForm } from "@/components/form/CustomForm";
import { OTPInputWrapper } from "@/components/ui/otp-input-wrapper";
import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes";
import { useCountdown } from "@/hooks/useCountdown";
import { useOtpStore } from "@/store/useOtpStore";
import { otpSchema } from "@/validator/AuthSchema";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resendOtpAction, verifyOtpAction } from "../actions/auth.action";
import { toastHandler } from "@/lib/toastHandler";
import { z } from "zod";
import { useTransition } from "react";

export default function VerifyOTPPage() {
  const router = useRouter();
  const email = useOtpStore((s) => s.email);
  const expiresAt = useOtpStore((s) => s.expiresAt);
  const setOtp = useOtpStore((s) => s.setOtp);
  const clearTimer = useOtpStore((s) => s.clearTimer);

  //use count down hook
  const { formattedTime, isExpired } = useCountdown(expiresAt);

  //transition
  const [isPending, startTransition] = useTransition();

  const handleResend = async () => {
    const res = await resendOtpAction(email);

    toastHandler({
      success: res.success,
      message: res.message,
      error: res.error,
    });
    if (res.success) {
      setOtp(res.email, res.expiresAt);
    }
  };

  const onSubmit = (data: z.infer<typeof otpSchema>) => {
    startTransition(async () => {
      const res = await verifyOtpAction(data.otp, email);

      toastHandler(res);
      if (res.success) {
        clearTimer();
        router.replace(AUTH_CLIENT_ROUTES.RESET_PASSWORD);
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navyDark p-4">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center space-y-8 duration-500 animate-in fade-in zoom-in-95">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-12 w-12">
            <Image
              src={"/elixir-logo.svg"}
              alt="logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white">Elixir</h1>
          <h2 className="text-xl font-medium text-gray-200">Password Reset</h2>
          <p className="max-w-xs text-center text-sm text-gray-400">
            We sent a code to{" "}
            <span className="font-medium text-white">{email}</span>. Enter the
            4-digit code below.
          </p>
        </div>

        <div className="w-full space-y-6 rounded-xl border border-blueDark bg-navy/50 p-8 backdrop-blur-sm">
          <CustomForm
            schema={otpSchema}
            onSubmit={onSubmit}
            submitText={isPending ? "Loading..." : "Verify Code"}
            fields={[
              {
                name: "otp",
                label: "",
                component: OTPInputWrapper,
              },
            ]}
            defaultValues={{ otp: "" }}
            disabled={isPending}
          />

          <div className="flex flex-col items-center gap-2 text-center">
            {!isExpired ? (
              <p className="text-sm text-gray-400">
                Expires in:{" "}
                <span className="font-mono text-white">{formattedTime}</span>
              </p>
            ) : (
              <button
                type="button"
                className="hover:text-purple-400 cursor-pointer text-sm text-purple"
                onClick={handleResend}
              >
                Click here to resend
              </button>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-gray-400">
          <Link
            href={AUTH_CLIENT_ROUTES.LOGIN}
            className="flex items-center justify-center gap-2 font-medium text-white hover:underline"
          >
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
