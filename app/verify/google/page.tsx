"use client"

import { GoogleIcon } from "@/components/landing/GoogleIcon"
import { Loader2 } from "lucide-react"


const content = {
          title: "Verifying Google Account",
          description: "Please wait while we securely verify your Google credentials.",
          icon: <GoogleIcon className="h-12 w-12" />,
          colorAttributes: "bg-blue-500/10 border-blue-500/20 text-blue-500"
        }


export default function googleAuth(){
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