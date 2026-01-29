import { API_BASE_URL } from "@/config/url";
import { AUTH_API_ROUTES } from "@/constants/apiRoutes";
import { NextRequest, NextResponse } from "next/server";
import { sessionOptions } from "./session";
import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes";
import { AUTH_ERROR_CODE } from "@/constants/errorCode";
import { IronSession, sealData } from "iron-session";
import { IAuthSession } from "@/types/types";
import { ENV } from "@/config/env";




//refresh token using fetch
export async function refreshAuthToken(refreshToken:string){
    try {

        const res = await fetch(`${API_BASE_URL}${AUTH_API_ROUTES.REFRESH}`,{
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        })

        return await res.json()

    } catch (error) {
        console.log("refresh token error",error)
        return  {
            success:false
        }
    }
}


//handle auth failure
export  function handleAuthFailure(req:NextRequest){

    if(req.headers.has('next-action')){
        const response = NextResponse.next()
        response.cookies.delete(sessionOptions.cookieName)
        response.cookies.delete('refreshToken')
        return response
    }

    // Standard Redirect
    const response = NextResponse.redirect(
        new URL(AUTH_CLIENT_ROUTES.LOGIN + `?reason=${AUTH_ERROR_CODE.SESSION_EXPIRED}`, req.url)
    )
    response.cookies.delete(sessionOptions.cookieName)
    response.cookies.delete('refreshToken')
    return response

}


//apply token in cookies

export async function applyCookies(response:NextResponse,session:IronSession<IAuthSession>,refreshToken){

    //save session
    await session.save()

    const sealedSession = await sealData(session,{password:sessionOptions.password})

    //save session in next response
    response.cookies.set(sessionOptions.cookieName,sealedSession,sessionOptions.cookieOptions)

    //save refresh in next response
    response.cookies.set('refreshToken',refreshToken,{
        httpOnly:true,
        secure:ENV.NODE_ENV == 'production',
        sameSite:'lax',
        path:'/',
        maxAge:7 * 24 * 60 * 60
    })
}


