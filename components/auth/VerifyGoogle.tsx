'use client'

import { USER_ROUTES } from "@/constants/userRoutes"
import { AxiosErrorHandler } from "@/lib/errorHandler"
import { useGoogleAuthMutation } from "@/redux/api/auth/authApi"
import { signOut, useSession } from "next-auth/react"
import { useEffect } from "react"
import { toast } from "sonner"

function VerifyGoogle() {

    const {data:session,status} = useSession()
    const [googleAuth] = useGoogleAuthMutation() 

    useEffect(() => {
        (async () => {
            try {
                const res = await googleAuth({
                    name:session?.user.name,
                    email:session?.user.email,
                    googleId:session?.user.googleId,
                    image:session?.user.image
                })

                console.log(res)
                signOut({
                    callbackUrl:USER_ROUTES.ONBOARDING
                })
            } catch (error) {
                signOut({
                    callbackUrl:USER_ROUTES.LOGIN
                })
                toast.error(AxiosErrorHandler(error))
            }
        })()
    },[session,status,googleAuth])

  return (
     <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="loader mb-4 mx-auto" />
        <p className="text-gray-600 text-lg">Signing you in with Google...</p>
      </div>
    </div>
  )
}

export default VerifyGoogle