"use client";

import CustomForm, { CustomFormProps } from "@/components/CustomForm";
import GradientWithGrid from "@/components/GradientGrid";
import { useAdminLoginMutation } from "@/redux/api/admin/adminAuthApi";
import { AdminLoginSchema } from "@/validator/admin/AdminAuthSchema";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import z from 'zod'


const fields:CustomFormProps<typeof AdminLoginSchema>['fields'] = [
  {
    name:'email',
    label:'Email',
    type:'text',
    placeholder:'Enter admin email'
  },{
    name:'password',
    label:'Password',
    type:'password',
    placeholder:'Enter admin password'
  }
]

export default function LoginPage() {

  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [login,{isLoading}] = useAdminLoginMutation()
  const router = useRouter()

  useEffect(() => {
    if(error){
      toast.error(error)
      const params = new URLSearchParams(window.location.search)
      params.delete('error')
      const newUrl = window.location.pathname + params.toString()
      router.replace(newUrl,{scroll:false})
    }
      
  },[searchParams,router])


  const handleLogin = async (data:z.infer<typeof AdminLoginSchema>) => {
    try {
      const res = await login(data).unwrap()
      console.log(res)
      toast.success(res.message)
      router.push('/admin/dashboard')
    } catch (error) {
      console.log(error)
      toast.error(error as string)
    }
  } 

  return (
    <GradientWithGrid>
      <div className="absolute top-32 left-1/2 -translate-x-1/2 max-w-md w-full p-6 rounded-lg border border-black shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <CustomForm 
          buttonText="Login"
          defaultValues={{ email: "", password: "" }}
          fields={fields}
          isLoading={isLoading}
          schema={AdminLoginSchema}
          onSubmit={handleLogin}
        />
      </div>
    </GradientWithGrid>
  );
}
