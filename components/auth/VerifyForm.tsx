'use client'

import { AxiosErrorHandler } from "@/lib/errorHandler"
import { useLazyVerifyQuery } from "@/redux/api/auth/authApi"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { USER_ROUTES } from "@/constants/userRoutes"
import { useEffect } from "react"



export default function VerifyForm({token}:{token:string}){

    const [triggerVerify] = useLazyVerifyQuery()
    const router = useRouter()

    useEffect(() => {
            const handleVerify = async () => {
        try {

            const res = await triggerVerify({token}).unwrap()
            console.log(res)
            toast.success("User email verified")
            setTimeout(() => {
                router.push(USER_ROUTES.LOGIN)
            },2000)
        } catch (error) {
            toast.error(AxiosErrorHandler(error))
        }
    }
        handleVerify()
    },[router,token,triggerVerify])

    return(
        <div className="min-h-screen w-full bg-[radial-gradient(circle_at_50%_1%,_#4B2070_0%,_#040A1D_100%)] flex items-center justify-center px-4">
       <div className="bg-[#0C1635]/70 backdrop-blur-md border border-[#132353] rounded-xl p-8 max-w-md w-full shadow-lg text-white text-center">
        <div className="flex justify-center mb-6">
          <span className="animate-spin inline-block w-8 h-8 border-4 border-purple border-t-transparent rounded-full" />
        </div>
        <h2 className="text-2xl font-bold text-purple mb-2">Verifying your account</h2>
        <p className="text-gray-300 mb-4">
          Please wait while we complete the verification process.
        </p>
      </div>
    </div>
    )
}