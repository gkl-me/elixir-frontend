
import { ENV } from '@/config/env'
import { IAuthSession } from '@/types/types'
import {getIronSession, SessionOptions} from 'iron-session'
import { cookies } from 'next/headers'

export const sessionOptions:SessionOptions = {
    cookieName:ENV.SESSION_NAME,
    password:ENV.SESSION_PASSWORD,
    cookieOptions:{
        secure:ENV.NODE_ENV == 'production',
        httpOnly:true,
        maxAge:15 * 60 * 60 * 1000,
        sameSite:'lax'
    }
}

export async function getSession(){
    const cookieStore = await cookies()
    return getIronSession<IAuthSession>(cookieStore,sessionOptions)
}

export async function deleteSession(){
    const cookieStore = await cookies()
    const session = await getIronSession<IAuthSession>(cookieStore,sessionOptions)
    session.destroy()
}


