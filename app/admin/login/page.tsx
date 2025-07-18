"use client";

import CustomForm, { CustomFormProps } from "@/components/forms/CustomForm";
import GradientWithGrid from "@/components/landing/GradientGrid";
import { ADMIN_ROUTES } from "@/constants/adminRoutes";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { useAdminLoginMutation } from "@/redux/api/admin/adminAuthApi";
import { setAdmin } from "@/redux/slices/adminSlice";
import { AdminLoginSchema } from "@/validator/admin/AdminAuthSchema";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
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

  const [login,{isLoading}] = useAdminLoginMutation()
  const router = useRouter()
  const dispatch = useDispatch()



  const handleLogin = async (data:z.infer<typeof AdminLoginSchema>) => {
    try {
      const res = await login(data).unwrap()
      dispatch(setAdmin(res.data))
      toast.success(res.message)
      router.push(ADMIN_ROUTES.ADMIN+ADMIN_ROUTES.DASHBOARD)
    } catch (error) {
      const err = AxiosErrorHandler(error)
      toast.error(err)
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
