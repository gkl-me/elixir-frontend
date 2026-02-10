import { STATUS_CODES } from "@/constants/statusCodes";
import { AxiosErrorHandler } from "./errorHandler";
import { AUTH_ERROR_CODE } from "@/constants/errorCode";
import { redirect } from "next/navigation"
import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes";
import { NextRequest, NextResponse } from "next/server";
import { IronSession, sealData } from "iron-session";
import { IAuthSession } from "@/types/types";
import { sessionOptions } from "./session";
import { isRedirectError } from "next/dist/client/components/redirect-error";



//handle redirect in server
export function handlerServerError(error:unknown){

    console.log("server errp",error)
    if(isRedirectError(error)) throw error

    const err = AxiosErrorHandler(error)

    const status = err.statusCode || 500
    const errorCode = err?.errorCode 

    if(status == STATUS_CODES.UNAUTHORIZED && errorCode == AUTH_ERROR_CODE.UNAUTHORIZED ){
        return redirect(AUTH_CLIENT_ROUTES.LOGIN+`?reason=${AUTH_ERROR_CODE.SESSION_EXPIRED}`)
    }

    if(status == STATUS_CODES.FORBIDDEN){
        return redirect(AUTH_CLIENT_ROUTES.LOGIN+`?reason=${AUTH_ERROR_CODE.BLOCKED}`)
    }
}

//updates sessio and cookies to ongoing request and response
export async function updateSessionAndCookies(
    req:NextRequest,
    session:IronSession<IAuthSession>,
    accessToken:string,
    refreshToken:string
){
    session.accessToken = accessToken
    await session.save()


    //session sealed to manually add data to cookies
    const sealedSession  = await sealData(session,{
        password:sessionOptions.password
    })

    const requestHeaders = new Headers(req.headers)

    //custom cookies string
    const allCookies = new Map()
    req.cookies.getAll().forEach((c) => allCookies.set(c.name,c.value))

    allCookies.set(sessionOptions.cookieName,sealedSession)
    allCookies.set("refreshToken",refreshToken)


    const newCookieString = Array.from(allCookies.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; "); 

    requestHeaders.set("Cookie", newCookieString);

    const finalRes = NextResponse.next({
        request: {
        headers: requestHeaders,
        },
    });


    //for client
    finalRes.cookies.set(
        sessionOptions.cookieName,
        sealedSession,
        sessionOptions.cookieOptions
    );

    //set refresh in client
    finalRes.cookies.set("refreshToken",refreshToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV == 'production',
        path:'/',
        maxAge: 7 * 24 * 60 * 60,
        sameSite:'lax'
    })

    return finalRes

}



//handle refresh failure on middleware for server rendered component and server actions
export  function handleRefreshFailure(req:NextRequest){

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


