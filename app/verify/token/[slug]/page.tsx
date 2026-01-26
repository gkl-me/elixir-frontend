'use client'

import { Loader2, ShieldCheck, Github } from "lucide-react"
import { GoogleIcon } from "@/components/landing/GoogleIcon"
import { verifyEmailAction } from "@/app/actions/auth.action"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { USER_CLIENT_ROUTES } from "@/constants/clientRoutes"
import { toastHandler } from "@/lib/toastHandler"
import { useAuthStore } from "@/store/useAuthStore"




export default function VerifyPage() {

  const params = useParams()
  const searchParams = useSearchParams()

  const slug= params.slug as string
  const email = searchParams.get('email')

  const router = useRouter()
  const login = useAuthStore((s) => s.login)

  useEffect(() => {
    (async () => {
      const res = await verifyEmailAction(slug,email)


      //save token in zustand
      login(res.accessToken)

      //redirect user 
      toastHandler({
        success:res.success,
        message:res.message
      })
      router.replace(USER_CLIENT_ROUTES.ONBOARDING)


    })()
  },[slug,email])

  const getContent = () => {
    switch (slug) {
      case "google":
        return {
          title: "Verifying Google Account",
          description: "Please wait while we securely verify your Google credentials.",
          icon: <GoogleIcon className="h-12 w-12" />,
          colorAttributes: "bg-blue-500/10 border-blue-500/20 text-blue-500"
        }
      case "github":
        return {
          title: "Verifying GitHub Account",
          description: "Connecting to GitHub to verify your identity.",
          icon: <Github className="h-12 w-12 text-white" />,
          colorAttributes: "bg-zinc-800/50 border-zinc-700/50 text-white"
        }
      default:
        return {
          title: "Verifying Token",
          description: "Validating your security token...",
          icon: <ShieldCheck className="h-12 w-12 text-violet-500" />,
          colorAttributes: "bg-violet-500/10 border-violet-500/20 text-violet-500"
        }
    }
  }

  const content = getContent()

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-navyDark p-4 relative overflow-hidden">
      
      {/* Background Aesthetic Elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[100px]" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Icon Container with Pulse Effect */}
          <div className={`relative flex h-24 w-24 items-center justify-center rounded-full border ${content.colorAttributes.split(' ')[1]} ${content.colorAttributes.split(' ')[0]}`}>
             <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${content.colorAttributes.split(' ')[0]}`} />
             {content.icon}
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {content.title}
            </h1>
            <p className="text-base text-slate-400">
              {content.description}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
            <span>Processing request...</span>
          </div>

        </div>
        
        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-slate-500">
          Secure Verification • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
