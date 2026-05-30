"use client";

import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-navyDark p-4">
      {/* Background Aesthetic Elements */}
      <div className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
        <div className="bg-purple-900/20 absolute -left-[10%] -top-[20%] h-[50%] w-[50%] rounded-full blur-[120px]" />
        <div className="absolute -right-[10%] top-[40%] h-[40%] w-[40%] rounded-full bg-blue-900/10 blur-[100px]" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md duration-500 animate-in fade-in zoom-in slide-in-from-bottom-4">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {/* Icon Container with Pulse Effect */}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-500">
            <div className="absolute inset-0 animate-ping rounded-full bg-violet-500 opacity-20" />
            <Mail className="h-10 w-10" />
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Check your email
            </h1>
            <p className="text-base text-slate-400">
              We&apos;ve sent a verification link to your email address. <br />
              Please check your inbox to confirm your account.
            </p>
          </div>

          <div className="w-full pt-2">
            <Link
              href={AUTH_CLIENT_ROUTES.LOGIN}
              className="flex w-full items-center justify-center rounded-lg bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Back to Login
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-slate-500">
          Didn&apos;t receive it? Check your spam folder.
        </p>
      </div>
    </div>
  );
}
