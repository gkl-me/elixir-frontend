"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { CustomForm } from "@/components/form/CustomForm";
import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes";
import { useTransition } from "react";
import { forgotPasswordAction } from "../actions/auth.action";
import { useOtpStore } from "@/store/useOtpStore";
import { toastHandler } from "@/lib/toastHandler";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const setOtp = useOtpStore((s) => s.setOtp);

  const onSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    startTransition(async () => {
      //call forgot password action
      const res = await forgotPasswordAction(data.email);
      //set email and expiresAt
      toastHandler({
        success: res.success,
        message: res.message,
        error: res.error,
      });
      if (res.success) {
        setOtp(res.email, res.expiresAt);
        //redirect to verify otp page
        router.replace(AUTH_CLIENT_ROUTES.VERIFY_OTP);
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
          <h2 className="text-xl font-medium text-gray-200">Reset Password</h2>
          <p className="max-w-xs text-center text-sm text-gray-400">
            Enter your email address and we&apos;ll send you a code to reset
            your password.
          </p>
        </div>

        <div className="w-full space-y-4 rounded-xl border border-blueDark bg-navy/50 p-8 backdrop-blur-sm">
          <CustomForm
            schema={forgotPasswordSchema}
            onSubmit={onSubmit}
            submitText={isPending ? "Loading...." : "Submit"}
            fields={[
              {
                name: "email",
                label: "Email",
                type: "email",
                placeholder: "name@example.com",
              },
            ]}
            defaultValues={{
              email: "",
            }}
            disabled={isPending}
          />
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
