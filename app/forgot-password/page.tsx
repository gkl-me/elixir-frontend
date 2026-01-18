"use client"

import { USER_ROUTES } from "@/constants/userRoutes";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { CustomForm } from "@/components/form/CustomForm";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export default function ForgotPasswordPage() {
//   const router = useRouter();

  const onSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    console.log("Forgot Password Data:", data)
    // Add API call logic here
    // Redirect to OTP page passing email (in real app, use query param or context)
    // router.push(USER_ROUTES.VERIFY_OTP);
  };

  return (
    <div className="min-h-screen bg-navyDark flex flex-col items-center justify-center p-4">
       <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>

      <div className="relative z-10 flex flex-col items-center space-y-8 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center space-y-4">
            <div className="relative w-12 h-12">
                 <Image src={"/elixir-logo.svg"} alt="logo" fill className="object-contain"/>
            </div>
            <h1 className="text-3xl font-bold text-white">Elixir</h1>
            <h2 className="text-xl font-medium text-gray-200">Reset Password</h2>
            <p className="text-sm text-gray-400 text-center max-w-xs">
              Enter your email address and we&apos;ll send you a code to reset your password.
            </p>
        </div>

        <div className="w-full space-y-4 bg-navy/50 p-8 rounded-xl border border-blueDark backdrop-blur-sm">
            <CustomForm
                schema={forgotPasswordSchema}
                onSubmit={onSubmit}
                submitText="Send Code"
                fields={[
                    {
                        name: "email",
                        label: "Email",
                        type: "email",
                        placeholder: "name@example.com",
                    }
                ]}
            />
        </div>

         <div className="text-center text-sm text-gray-400">
            <Link href={USER_ROUTES.LOGIN} className="text-white hover:underline font-medium flex items-center justify-center gap-2">
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
      </div>
    </div>
  )
}
