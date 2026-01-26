"use server"


import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes"
import { AUTH_API_ROUTES,} from "@/constants/apiRoutes"
import { AUTH_ERROR_CODE } from "@/constants/errorCode"
import { api } from "@/lib/api"
import { deleteCookies, setCookies } from "@/lib/cookieHandler"
import { AxiosErrorHandler } from "@/lib/errorHandler"
import { LoginSchema, RegisterSchema } from "@/validator/AuthSchema"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { redirect } from "next/navigation"
import { z } from "zod"
import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import { IAuthSession } from "@/types/types"
import { destorySession, sessionOptions } from "@/lib/session"




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

        const res = await api.post(AUTH_API_ROUTES.LOGIN,data)
        const accessToken = res.data.data.accessToken
        const refreshToken = res.data.data.refreshToken

        const cookieStore = await cookies()

        const session = await getIronSession<IAuthSession>(
            cookieStore,
            sessionOptions
        )

        session.accessToken = accessToken
        await session.save()

        await setCookies(refreshToken)

        console.log(res)

        return {
            success:res.data.success,
            accessToken,
            role:res.data.data.user.role,
            message:res.data.message
        }

    } catch (error) {
        if(isRedirectError(error)) throw error

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


export async function verifyEmailAction(token:string,email:string){
    try {
        
        const res = await api.get(AUTH_API_ROUTES.VERIFY_EMAIL+`/${token}`)

        const accessToken = res.data.data.accessToken
        const refreshToken= res.data.data.refreshToken

         const cookieStore = await cookies()

        const session = await getIronSession<IAuthSession>(
            cookieStore,
            sessionOptions
        )

        session.accessToken = accessToken
        await session.save()

        await setCookies(refreshToken)

        return {
            success:res.data.success,
            message:res.data.message,
            accessToken,
        }

    } catch (error) {
        if(isRedirectError(error)) throw error

        redirect(AUTH_CLIENT_ROUTES.VERIFY_ERROR+`?email=${encodeURIComponent(email)}`);
    }
}


export async function resendVerifyEmail(email:string){
    try {

        const res = await api.post(AUTH_API_ROUTES.RESEND_EMAIL,{email})

        return {
            success:res.data.success,
            message:res.data.message
        }
        
    } catch (error) {
        const err = AxiosErrorHandler(error)
        return {
            success:false,
            error:err.message
        }
    }
}

export async function refreshTokenAction(){
    try {

        const res = await api.post(AUTH_API_ROUTES.REFRESH)

        const accessToken = res.data.data.accessToken
        const refreshToken= res.data.data.refreshToken

         const cookieStore = await cookies()

        const session = await getIronSession<IAuthSession>(
            cookieStore,
            sessionOptions
        )

        session.accessToken = accessToken
        await session.save()

        await setCookies(refreshToken)

        return {
            success:res.data.success,
            accessToken
        }
        
    } catch (error) {
        await destorySession()
        await deleteCookies()
        const err = AxiosErrorHandler(error)

        return {
            success:false,
            errorCode:err.errorCode
        }

    } 
}