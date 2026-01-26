"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useState, useTransition } from "react"
import { ArrowLeft, Github, Mail } from "lucide-react"
import { z } from "zod"
import { CustomForm } from "@/components/form/CustomForm"
import { PasswordInput } from "@/components/ui/password-input"
import {  registerAction } from "../actions/auth.action"
import { RegisterSchema } from "@/validator/AuthSchema"
import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes"
import { toastHandler } from "@/lib/toastHandler"


export default function SignupPage() {
  const [showEmail, setShowEmail] = useState(false)
  const [isPending,startTransition] = useTransition()

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    startTransition(async () => {
      const res = await registerAction(data)
      toastHandler(res)
    })
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
          <h2 className="text-xl font-medium text-gray-200">Create an account</h2>
        </div>

        <div className="w-full space-y-4 bg-navy/50 p-8 rounded-xl border border-blueDark backdrop-blur-sm">
          {!showEmail ? (
            <>
              <Button
                variant="dark"
                className="w-full bg-purple hover:bg-purple/90 h-10 text-base"
              >
                <span className="mr-2">G</span> Continue with Google
              </Button>
              <Button
                variant="white"
                className="w-full  h-10 text-base"
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
                schema={RegisterSchema}
                onSubmit={onSubmit}
                submitText={isPending?"Registering...":"Create Account"}
                fields={[
                  {
                    name: "name",
                    label: "Full Name",
                    placeholder: "John Doe",
                  },
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
                    placeholder: "************",
                  },{
                    name:'confirmPassword',
                    label:"Confirm Password",
                    component:PasswordInput,
                    placeholder:"*************"
                  }
                ]}
                defaultValues={{
                  name:"",
                  email:"",
                  password:"",
                  confirmPassword:""
                }}
                disabled={isPending}
              />
              <Button
                variant="light"
                className="w-full text-gray-400 hover:text-white mt-2"
                onClick={() => setShowEmail(false)}
              >
                <ArrowLeft/> Back to options
              </Button>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href={AUTH_CLIENT_ROUTES.LOGIN}
            className="text-white hover:underline font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
