"use server";


import { ADMIN_CLIENT_ROUTES, AUTH_CLIENT_ROUTES, USER_CLIENT_ROUTES } from "@/constants/clientRoutes"
import { AUTH_ERROR_CODE } from "@/constants/errorCode"
import { deleteCookies, setCookies } from "@/lib/cookies"
import { AxiosErrorHandler } from "@/lib/errorHandler"
import { LoginSchema, RegisterSchema } from "@/validator/AuthSchema"
import { redirect } from "next/navigation"
import { z } from "zod"
import { cookies } from "next/headers"
import { deleteSession, getSession} from "@/lib/session"
import { ENV } from "@/config/env"
import { authService } from "@/services/auth.service";
import { handlerServerError } from "@/lib/authHelper";


export async function registerAction(data: z.infer<typeof RegisterSchema>){
    try {

        await authService.register(data)
        redirect(AUTH_CLIENT_ROUTES.VERIFY_EMAIL)

    } catch (error) {
        handlerServerError(error)
        return{
            success:false,
            error:AxiosErrorHandler(error).message
        }
    }
}


export async function loginAction(data: z.infer<typeof LoginSchema>){
    try {

        const res = await authService.login(data)

        const accessToken = res?.data.data.accessToken
        const refreshToken = res?.data.data.refreshToken

        setCookies(refreshToken)
        const session = await getSession()
        session.accessToken = accessToken
        await session.save()

        //redirect the user based on roles
        if(res?.data.data.user.role === "superAdmin"){
            redirect(ADMIN_CLIENT_ROUTES.DASHBOARD)
        }else{
            redirect(USER_CLIENT_ROUTES.ONBOARDING)
        }

    } catch (error) {
        handlerServerError(error)
        const err = AxiosErrorHandler(error)
        if(err.errorCode === AUTH_ERROR_CODE.NOT_VERIFIED){
            redirect(AUTH_CLIENT_ROUTES.VERIFY_ERROR+`?email=${encodeURIComponent(data.email)}`);
        }

        //check block user

        return {
            success:false,
            error:err.message
        }

    }
}


// export async function verifyEmailAction(token:string,email:string){
//     try {
        
//         const res = await api.get(AUTH_API_ROUTES.VERIFY_EMAIL+`/${token}`)

//         const accessToken = res.data.data.accessToken
//         const refreshToken= res.data.data.refreshToken

//          const cookieStore = await cookies()

//         const session = await getIronSession<IAuthSession>(
//             cookieStore,
//             sessionOptions
//         )

//         session.accessToken = accessToken
//         await session.save()

//         await setCookies(refreshToken)

//         return {
//             success:res.data.success,
//             message:res.data.message,
//             accessToken,
//         }

//     } catch (error) {
//         if(isRedirectError(error)) throw error

//         redirect(AUTH_CLIENT_ROUTES.VERIFY_ERROR+`?email=${encodeURIComponent(email)}`);
//     }
// }


export async function resendVerifyEmail(email:string){
    try {

        await authService.resendVerifyEmail({email})
        redirect(AUTH_CLIENT_ROUTES.VERIFY_EMAIL)
        
    } catch (error) {
        handlerServerError(error)
        const err = AxiosErrorHandler(error)
        return {
            success:false,
            error:err.message
        }
    }
}


export async function forgotPasswordAction(email:string){
    try {

        const res = await authService.forgotPassword({email})


        return {
            success:res.data.success,
            message:res.data.message,
            expiresAt:res.data.data.expiresAt,
            email:res.data.data.email
        }
        
    } catch (error) {
        handlerServerError(error)
        const err = AxiosErrorHandler(error)
        return {
            success:false,
            error:err.message
        }
    }
}


export async function verifyOtpAction(otp:string,email:string){
    try {

        const res = await authService.verifyOtp({email,otp})

        const resetToken = res.data.data.resetPasswordToken

        const cookieStore = await cookies()

        cookieStore.set('reset_token',resetToken,{
            httpOnly:true,
            secure:ENV.NODE_ENV === 'production',
            sameSite:'lax',
            path:'/',
            maxAge:15 * 60 * 1000
        })

        return {
            success:res.data.success,
            message:res.data.message
        }
        
    } catch (error) {
        handlerServerError(error)
        const err = AxiosErrorHandler(error)
        return {
            success:false,
            error:err.message
        }
    }
}


export async function resendOtpAction(email:string){
    try {

        const res = await authService.resendOtp({email})

        return {
            success:res.data.success,
            message:res.data.message,
            expiresAt:res.data.data.expiresAt,
            email:res.data.data.email
        }
        
    } catch (error) {
        handlerServerError(error)
        const err = AxiosErrorHandler(error)
        return {
            success:false,
            error:err.message
        }
    }
}


export async function resetPasswordAction(email:string,password:string){
    try {

        const cookieStore = await cookies()
        const resetToken = cookieStore.get('reset_token')?.value

        const res = await authService.resetPassword({
            email,
            newPassword:password,
            resetPasswordToken:resetToken
        })

        cookieStore.delete('reset_token')

        return {
            success:res.data.success,
            message:res.data.message
        }
        
    } catch (error) {
         const cookieStore = await cookies()
        cookieStore.delete('reset_token')
        const err = AxiosErrorHandler(error)
        return {
            success:false,
            error:err.message
        }
    }
}


export async function logoutAction(){
    try {
        
        const refreshToken = (await cookies()).get('refreshToken')?.value
        
        
        await authService.logout({refreshToken})
        await deleteSession()
        await deleteCookies()

        redirect(AUTH_CLIENT_ROUTES.LOGIN)
        
    } catch (error) {
        await deleteSession()
        await deleteCookies()
        handlerServerError(error)
        redirect(AUTH_CLIENT_ROUTES.LOGIN)
    }
}