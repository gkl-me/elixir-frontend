"use client"

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


export default function  VerifyOTPPage(){

  const router = useRouter()
  const email = useOtpStore(s => s.email)
  const expiresAt = useOtpStore(s => s.expiresAt)
  const setOtp = useOtpStore(s => s.setOtp)
  const clearTimer = useOtpStore(s => s.clearTimer)


  //use count down hook
  const {formattedTime,isExpired} = useCountdown(expiresAt)

  //transition 
  const [isPending,startTransition] = useTransition()

  const handleResend = async () => {
    const res = await resendOtpAction(email)
    
    toastHandler({
      success:res.success,
      message:res.message,
      error:res.error
    })
    if(res.success){
      setOtp(res.email,res.expiresAt)
    }

  }

  const onSubmit =  (data:z.infer<typeof otpSchema>) => {
    startTransition(async () =>{

      const res = await verifyOtpAction(data.otp,email)

      toastHandler(res)
      if(res.success){
        clearTimer()
        router.replace(AUTH_CLIENT_ROUTES.RESET_PASSWORD)
      }
    })
  }


  return (
    <div className="min-h-screen bg-navyDark flex flex-col items-center justify-center p-4">
       <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>

      <div className="relative z-10 flex flex-col items-center space-y-8 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center space-y-4">
            <div className="relative w-12 h-12">
                 <Image src={"/elixir-logo.svg"} alt="logo" fill className="object-contain"/>
            </div>
            <h1 className="text-3xl font-bold text-white">Elixir</h1>
            <h2 className="text-xl font-medium text-gray-200">Password Reset</h2>
            <p className="text-sm text-gray-400 text-center max-w-xs">
              We sent a code to <span className="text-white font-medium">{email}</span>. Enter the 4-digit code below.
            </p>
        </div>

        <div className="w-full space-y-6 bg-navy/50 p-8 rounded-xl border border-blueDark backdrop-blur-sm">
            <CustomForm
              schema={otpSchema}
              onSubmit={onSubmit}
              submitText={isPending ? "Loading..." :"Verify Code"}
              fields={[
                {
                  name: "otp",
                  label: "",
                  component: OTPInputWrapper
                }
              ]}
              defaultValues={{ otp: "" }}
              disabled={isPending}
            />
            
             <div className="text-center flex flex-col items-center gap-2">
                {!isExpired ? (
                    <p className="text-sm text-gray-400">
                        Expires in: <span className="text-white font-mono">{formattedTime}</span>
                    </p>
                ) : (
                    <button 
                        type="button" 
                        className="text-sm text-purple hover:text-purple-400 cursor-pointer"
                        onClick={handleResend}
                    >
                        Click here to resend
                    </button>
                )}
             </div>
        </div>

         <div className="text-center text-sm text-gray-400">
            <Link href={AUTH_CLIENT_ROUTES.LOGIN} className="text-white hover:underline font-medium flex items-center justify-center gap-2">
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
      </div>
    </div>
  )
}