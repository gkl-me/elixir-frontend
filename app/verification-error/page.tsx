"use client"

import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { resendVerifyEmail } from "../actions/auth.action"
import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes"
import {  toastHandler } from "@/lib/toastHandler"

export default function VerificationErrorPage() {
  const params = useSearchParams()
  const email = params.get('email')
  const [isPending,startTransition] = useTransition()

  const handleResendEmail = () => {
    if(!email){
      toast.error("Email not found try to login again")
    }
    startTransition(async () => {
      const res = await resendVerifyEmail(email)
      toastHandler(res)
    })
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-navyDark p-4 relative overflow-hidden">
      
      {/* Background Aesthetic Elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-red-900/10 blur-[120px]" />
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-orange-900/10 blur-[100px]" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Icon Container with Warning Pulse */}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-500">
             <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-red-500" />
             <AlertTriangle className="h-10 w-10" />
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Verification Failed
            </h1>
            <p className="text-base text-slate-400">
              We couldn&apos;t verify your account. The link may have expired or is invalid.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 pt-2">
             <Button
                variant="default"
                className="w-full bg-purple hover:bg-purple/90 h-10 text-base"
                onClick={handleResendEmail}
                disabled={isPending}
             >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                    </>
                ) : (
                    "Resend Verification Email"
                )}
             </Button>

             <Link 
                href={AUTH_CLIENT_ROUTES.LOGIN}
                className="flex w-full items-center justify-center rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
             >
                <ArrowLeft/> Back to Login
             </Link>
          </div>

        </div>
        
        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-slate-500">
            Issues? Contact support.
        </p>
      </div>
    </div>
  )
}
