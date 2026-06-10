"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { acceptInviteAction } from "@/app/actions/workspace.action";
import { useApi } from "@/hooks/useApi";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";


interface Props {
  token: string;
  workspaceName: string;
  invitedEmail: string;
}

export function InviteAcceptClient({ token, workspaceName, invitedEmail }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);


  const { execute } = useApi({
    url: NEXT_API_ROUTES.UPDATE_SESSION,
    method: "GET"
  })

  const handleAccept = async () => {
    setLoading(true);
    setError("");
    const result = await acceptInviteAction(token);


    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }
    localStorage.removeItem("elixir_invite_token");

    setDone(true);

    await execute({
      body: {
        workspaceSlug: result.data.workspaceSlug,
      }
    })

    setLoading(false);

    setTimeout(() => {
      router.replace(`/workspace/${result.data.workspaceSlug}`);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#040A1D] px-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8735C9]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-2xl border border-[#1e2a4a] bg-[#0C1635] p-8 shadow-2xl text-center">
          {done ? (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="h-7 w-7 text-emerald-400" />
              </div>
              <h1 className="text-lg font-bold text-white">Joined!</h1>
              <p className="mt-2 text-sm text-[#6b7db3]">
                Redirecting to <span className="font-semibold text-white">{workspaceName}</span>…
              </p>
              <div className="mt-4 flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-[#8735C9]" />
              </div>
            </>
          ) : (
            <>
              {/* Icon */}
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8735C9]/10 border border-[#8735C9]/20">
                <svg className="h-8 w-8 text-[#c084fc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h1 className="text-xl font-bold text-white">You've been invited!</h1>
              <p className="mt-2 text-sm text-[#6b7db3]">
                Join{" "}
                <span className="font-semibold text-white">{workspaceName}</span>
              </p>
              {invitedEmail && (
                <p className="mt-0.5 text-xs text-[#4B5578]">as {invitedEmail}</p>
              )}

              {error && (
                <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                  {error}
                </p>
              )}

              <button
                onClick={handleAccept}
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#8735C9] to-[#6a29a0] py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Joining…
                  </span>
                ) : (
                  "Accept & Join Workspace"
                )}
              </button>

              <a
                href="/login"
                className="mt-3 block text-xs text-[#4B5578] hover:text-[#8b9cc8] transition-colors"
              >
                Not you? Sign in with a different account →
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
