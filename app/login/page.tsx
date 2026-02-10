"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState, useTransition } from "react"
import { ArrowLeft, Github, Mail } from "lucide-react"
import { z } from "zod"
import { CustomForm } from "@/components/form/CustomForm"
import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes"
import { PasswordInput } from "@/components/ui/password-input"
import { LoginSchema } from "@/validator/AuthSchema"
import { loginAction } from "../actions/auth.action"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { AUTH_ERROR_CODE } from "@/constants/errorCode"
import {signIn} from "next-auth/react"
import { toastHandler } from "@/lib/toastHandler"
import { NEXT_API_ROUTES } from "@/constants/routeHandler"

export default function LoginPage() {


  const [showEmail, setShowEmail] = useState(false)
  const [isPending,startTransition] = useTransition()

  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')

  useEffect(() => {
    if(reason){
      if(reason == AUTH_ERROR_CODE.UNAUTHORIZED){
        toast.error('You are not authorized to access this resource')
      }else if(reason == AUTH_ERROR_CODE.SESSION_EXPIRED){
        toast.error("Your session has expired. Please log in again.")
      }else if(reason==AUTH_ERROR_CODE.BLOCKED){
       toast.error("Your account has been blocked. Please contact the admin.");
      }
    }
  },[reason])


  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
      const res = await loginAction(data)
      toastHandler(res)
    })
  }

  const handleGoogle = () => {
    signIn(
      "google",{
        callbackUrl:NEXT_API_ROUTES.GOOGLE_AUTH
      }
    )
  }

  const handleGithub = () => {
    signIn(
      'github',{
        callbackUrl:NEXT_API_ROUTES.GITHUB_AUTH
      }
    )
  }

  return (
    <div className="min-h-screen bg-navyDark flex flex-col items-center justify-center p-4">
      {/* Background grid effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>

      <div className="relative z-10 flex flex-col items-center space-y-8 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-12 h-12">
            <Image
              src={"/elixir-logo.svg"}
              alt="logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white">Elixir</h1>
          <h2 className="text-xl font-medium text-gray-200">Login to Elixir</h2>
        </div>

        <div className="w-full space-y-4 bg-navy/50 p-8 rounded-xl border border-blueDark backdrop-blur-sm">
          {!showEmail ? (
            <>
              <Button
                variant="dark"
                className="w-full"
                onClick={() => handleGoogle()}
              >
                <span className="mr-2">G</span> Continue with Google
              </Button>
              <Button
                variant="white"
                onClick={() => handleGithub()}
              >
                <Github className="mr-2 h-4 w-4" /> Continue with GitHub
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-navyDark/0 px-2 text-gray-400">or</span>
                </div>
              </div>

              <Button
                variant="light"
                className="w-full h-10 text-base"
                onClick={() => setShowEmail(true)}
              >
                <Mail className="mr-2 h-4 w-4" /> Continue with email
              </Button>
            </>
          ) : (
            <div className="animate-in slide-in-from-right-8 fade-in duration-300">
              <CustomForm
                schema={LoginSchema}
                onSubmit={onSubmit}
                submitText={isPending?"Loading...":"Login"}
                fields={[
                  {
                    name: "email",
                    label: "Email",
                    type: "email",
                    placeholder: "name@example.com",
                  },
                  {
                    name: "password",
                    label: "Password",
                    component:PasswordInput,
                    placeholder: "*************",
                  },
                ]}
                defaultValues={{
                  email:"",
                  password:""
                }}
                disabled={isPending}
              />
              <div className="flex justify-end mb-4 mt-2">
                 <Link href={AUTH_CLIENT_ROUTES.FORGOT_PASSWORD} className="text-xs text-purple hover:text-purple-400">Forgot password?</Link>
              </div>
              <Button
                variant="light"
                className="w-full hover:text-white mt-2"
                onClick={() => setShowEmail(false)}
              >
                <ArrowLeft/> Back to options
              </Button>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href={AUTH_CLIENT_ROUTES.REGISTER}
            className="text-white hover:underline font-medium"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  )
}
