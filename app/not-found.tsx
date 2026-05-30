import Link from "next/link";
import type { Metadata } from "next";
import { Home, ArrowLeft, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Elixir",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#040A1D] flex items-center justify-center overflow-hidden px-4">
      {/* Animated grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(135,53,201,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(135,53,201,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Central radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(135,53,201,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Floating blobs */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/4 h-72 w-72 rounded-full opacity-10 blur-3xl animate-pulse"
        style={{ background: "#8735C9", animationDuration: "4s" }}
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-56 w-56 rounded-full opacity-10 blur-3xl animate-pulse"
        style={{ background: "#4B2070", animationDuration: "6s" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* 404 big display */}
        <div className="relative mb-4 select-none">
          {/* Shadow / glitch layer */}
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center text-[10rem] sm:text-[14rem] font-extrabold leading-none tracking-tighter"
            style={{
              color: "transparent",
              WebkitTextStroke: "1px rgba(135,53,201,0.25)",
              transform: "translate(3px, 3px)",
            }}
          >
            404
          </span>
          {/* Main text */}
          <span
            className="relative text-[10rem] sm:text-[14rem] font-extrabold leading-none tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #a855f7 0%, #8735C9 40%, #4B2070 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </span>
        </div>

        {/* Divider line */}
        <div
          className="mb-6 h-px w-24 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, #8735C9, transparent)",
          }}
        />

        <h1 className="mb-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Page not found
        </h1>
        <p className="mb-8 max-w-md text-sm leading-relaxed text-white/50">
          Looks like this page took an unexpected detour. The URL might be wrong, or the
          page may have moved. Let&apos;s get you back on track.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            id="not-found-home-btn"
            href="/"
            className="group flex items-center justify-center gap-2 rounded-xl bg-[#8735C9] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#8735C9]/80 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>

          <Link
            id="not-found-back-btn"
            href="javascript:history.back()"
            className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-white/20 hover:bg-white/10 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Go back
          </Link>
        </div>

        {/* Help hint */}
        <div className="mt-10 flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-xs text-white/30">
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span>
            If you followed a link to get here, please{" "}
            <a
              href="mailto:support@elixir.app"
              className="text-purple-400 underline-offset-2 hover:underline"
            >
              let us know
            </a>{" "}
            so we can fix it.
          </span>
        </div>

        {/* Brand */}
        <p className="mt-8 text-xs text-white/20">
          Elixir &middot; Project Management Platform
        </p>
      </div>
    </div>
  );
}
