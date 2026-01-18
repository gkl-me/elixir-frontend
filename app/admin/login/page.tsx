"use client"

import { loginAction } from "@/app/api/actions/auth.action";
import { CustomForm } from "@/components/form/CustomForm";
import GradientWithGrid from "@/components/landing/GradientGrid";
import { LoginSchema } from "@/validator/AuthSchema";
import { z } from "zod";

export default function LoginPage() {

  const handleSubmit = async (data: z.infer<typeof LoginSchema>) => {
      loginAction(data)
  }

  return (
    <GradientWithGrid>
      <div className="absolute top-32 left-1/2 -translate-x-1/2 max-w-md w-full p-6 rounded-lg border border-black shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <CustomForm 
          submitText="Login"
          defaultValues={{ email: "", password: "" }}
          fields={[
            {
              name:"email",
              label:"Email",
              placeholder:"Enter your email",
              type:'email'
            },{
              name:"password",
              label:"Password",
              placeholder:"Enter your password",
              type:'password'
            }
          ]}
          schema={LoginSchema}
          onSubmit={handleSubmit}
        />
      </div>
    </GradientWithGrid>
  )
}
