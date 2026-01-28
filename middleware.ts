import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_ROUTES } from "./constants/publicRoutes.";
import { getIronSession } from "iron-session";
import { IAuthSession } from "./types/types";
import { sessionOptions } from "./lib/session";
import { verifyAccessToken, verifyRefreshToken } from "./lib/tokenHandler";
import { ADMIN_CLIENT_ROUTES, AUTH_CLIENT_ROUTES, USER_CLIENT_ROUTES } from "./constants/clientRoutes";
import { AUTH_ERROR_CODE } from "./constants/errorCode";

const ADMIN_ROUTE = '/admin'

function isPublicRoutes(path:string){
    return PUBLIC_ROUTES.some((p) => path.startsWith(p) )
}

function redirect(url:string,req:NextRequest){
    return NextResponse.redirect(new URL(url,req.url))
}

export async function middleware(req:NextRequest){
    const {pathname}  = req.nextUrl


    const cookieStore = await cookies()
    const session = await getIronSession<IAuthSession>(
        cookieStore,
        sessionOptions
    )

    const accessToken = session?.accessToken
    const refreshToken = cookieStore.get('refreshToken')?.value
    const resetToken = cookieStore.get('reset_token')?.value

    //verify token 
    const accessPayload = await verifyAccessToken(accessToken)
    const refreshPayload = accessPayload ? null : await verifyRefreshToken(refreshToken)

    const user = accessPayload || refreshPayload
    const isAuthenticated = Boolean(user)

    //reset password middleware
    if(pathname.startsWith(AUTH_CLIENT_ROUTES.RESET_PASSWORD)){
        if(!resetToken){
            return redirect(AUTH_CLIENT_ROUTES.FORGOT_PASSWORD,req)
        }
        return
    }

    //public routes
    if(isPublicRoutes(pathname)){
        if(isAuthenticated){
            if(user.role == 'superAdmin'){
                return redirect(ADMIN_CLIENT_ROUTES.DASHBOARD,req)
            }else{
                return redirect(USER_CLIENT_ROUTES.ONBOARDING,req)
            }
        }
        return
    }

    //private routes
    if(!isAuthenticated && !isPublicRoutes(pathname)){
        return redirect(AUTH_CLIENT_ROUTES.LOGIN+`?reason=${AUTH_ERROR_CODE.UNAUTHORIZED}`,req)
    }

    //admin routes
    if(pathname.startsWith(ADMIN_ROUTE)){
        if(user.role != 'superAdmin'){
            return redirect(USER_CLIENT_ROUTES.ONBOARDING,req)
        }

        if(pathname=='/admin'){
            return redirect(ADMIN_CLIENT_ROUTES.DASHBOARD,req)
        }
    }

    return NextResponse.next()

}


export const config = {
   matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)).*)'
  ]
}