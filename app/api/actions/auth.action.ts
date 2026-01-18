"use server"


import { AUTH_API_ROUTES, AUTH_CLIENT_ROUTES } from "@/constants/authRoutes"
import { AUTH_ERROR_CODE } from "@/constants/errorCode"
import { api } from "@/lib/api"
import { AxiosErrorHandler } from "@/lib/errorHandler"
import { LoginSchema, RegisterSchema } from "@/validator/AuthSchema"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { redirect } from "next/navigation"
import { z } from "zod"


export async function registerAction(data: z.infer<typeof RegisterSchema>){
    try {

        await api.post(AUTH_API_ROUTES.REGISTER,data)
        redirect(AUTH_CLIENT_ROUTES.VERIFY_EMAIL)

    } catch (error) {
        if(isRedirectError(error)) throw error
        return{
            success:false,
            error:AxiosErrorHandler(error).message
        }
    }
}


export async function loginAction(data: z.infer<typeof LoginSchema>){
    try {

        const res = await api.post('/auth/login',data)

        const role = res.data.data.role
        if(role == 'superAdmin') redirect ('/admin/dashboard')

    } catch (error) {
        if(isRedirectError(error)) throw error

        const err = AxiosErrorHandler(error)

        console.log(err)

        if(err.errorCode === AUTH_ERROR_CODE.NOT_VERIFIED){
            redirect(`/verification-error?email=${encodeURIComponent(data.email)}`);
        }

        //check block user

        return {
            error:err.message
        }

    }
}


export async function verifyEmailAction(token:string,email:string){
    try {
        
        await api.post(`/auth/verify/${token}`)
        redirect('/dashboard')

    } catch (error) {
        if(isRedirectError(error)) throw error

        redirect(`/verification-error?email=${encodeURIComponent(email)}`);
    }
}


export async function resendVerificationEmail(email:string){
    try {

        await api.post('/auth/resend-email',{email})
        
    } catch (error) {
        const err = AxiosErrorHandler(error)
        return {error:err.message}
    }
}