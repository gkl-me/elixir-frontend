import { USER_ROUTES } from "@/constants/userRoutes"
import { AxiosErrorHandler } from "@/lib/errorHandler"
import { useLoginMutation } from "@/redux/api/auth/authApi"
import { setUser } from "@/redux/slices/userSlice"
import { UserLoginSchema } from "@/validator/user/UserAuthSchema"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { z } from "zod"

export default function useLogin() {

    const [login,{isLoading}] = useLoginMutation()
    const router = useRouter()
    const dispatch = useDispatch()

    const handleLogin = async(data:z.infer<typeof UserLoginSchema>) => {
      try {
        const res = await login(data).unwrap()
        console.log(res.data)
        dispatch(setUser(res.data.user))
        router.replace(USER_ROUTES.ONBOARDING)
      } catch (error) {
        toast.error(AxiosErrorHandler(error))
      }
    }

  return {
    handleLogin,
    isLoading
  }
}
