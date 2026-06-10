"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const [mounted, setMounted] = useState(false);

  const handleRetry = () => {
    try {
      window.location.reload();
    } catch (err) {
      console.error("Retry failed:", err);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#040A1D] px-4">
      {/* Animated grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(135,53,201,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(135,53,201,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial glow — red tint for error state */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(220,38,38,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Purple corner glows */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #8735C9 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #4B2070 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-lg transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
      >
        {/* Glass card */}
        <div
          className="rounded-2xl border border-white/10 p-8 backdrop-blur-sm"
          style={{ background: "rgba(12,22,53,0.75)" }}
        >
          {/* Icon */}
          <div className="mb-6 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
                <AlertTriangle
                  className="h-10 w-10 text-red-400"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="mb-2 text-center text-3xl font-extrabold tracking-tight text-white">
            Something went wrong
          </h1>
          <p className="mb-6 text-center text-sm leading-relaxed text-white/50">
            An unexpected error occurred. Don&apos;t worry — your data is safe.
            You can try recovering or head back home.
          </p>

          {/* Action buttons */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <button
              id="error-reset-btn"
              onClick={handleRetry}
              className="hover:shadow-purple-500/20 group flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#8735C9] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#8735C9]/80 hover:shadow-lg active:scale-95"
            >
              <RefreshCw className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
              Try again
            </button>

            <Link
              id="error-home-btn"
              href="/"
              className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-white/20 hover:bg-white/10 active:scale-95"
            >
              <Home className="h-4 w-4" />
              Go home
            </Link>
          </div>
        </div>

        {/* Elixir branding */}
        <p className="mt-6 text-center text-xs text-white/20">
          Elixir &middot; Project Management Platform
        </p>
      </div>
    </div>
  );
}
