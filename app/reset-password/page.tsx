"use client"


import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { z } from "zod"
import { CustomForm } from "@/components/form/CustomForm"
import { PasswordInput } from "@/components/ui/password-input"
import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes"
import { useTransition } from "react"
import { resetPasswordAction } from "../actions/auth.action"
import { useOtpStore } from "@/store/useOtpStore"
import { toastHandler } from "@/lib/toastHandler"

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function ResetPasswordPage() {
  const router = useRouter()
  const [isPending,startTransition] = useTransition()
  const email = useOtpStore((s) => s.email)
  const clearOtp = useOtpStore((s) => s.clearOtp)

  const onSubmit = (data: z.infer<typeof resetPasswordSchema>) => {

    startTransition(async () => {
      const res = await resetPasswordAction(email,data.password)
      toastHandler(res)
      if(res.success){
        clearOtp()
        router.replace(AUTH_CLIENT_ROUTES.LOGIN)
      }

      if(!res.success){
        clearOtp()
        router.replace(AUTH_CLIENT_ROUTES.FORGOT_PASSWORD)
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
            <h2 className="text-xl font-medium text-gray-200">Set New Password</h2>
            <p className="text-sm text-gray-400 text-center max-w-xs">
              Your new password must be different from previously used passwords.
            </p>
        </div>

        <div className="w-full space-y-4 bg-navy/50 p-8 rounded-xl border border-blueDark backdrop-blur-sm">
            <CustomForm
                schema={resetPasswordSchema}
                onSubmit={onSubmit}
                submitText={isPending ? "Loading...":"Reset Password"}
                fields={[
                    {
                        name: "password",
                        label: "New Password",
                        component: PasswordInput,
                        placeholder: "••••••••",
                    },
                    {
                        name: "confirmPassword",
                        label: "Confirm Password",
                        component: PasswordInput,
                        placeholder: "••••••••",
                    },
                ]}
                defaultValues={{
                  password:"",
                  confirmPassword:""
                }}
                disabled={isPending}
            />
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
