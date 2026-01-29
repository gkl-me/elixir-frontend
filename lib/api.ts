import { API_BASE_URL } from '@/config/url'
import { IAuthSession } from '@/types/types'
import axios from 'axios'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions } from './session'
import { STATUS_CODES } from '@/constants/statusCodes'
import http from 'http'
import https from "https"
import { redirect } from 'next/navigation'
import { AUTH_CLIENT_ROUTES } from '@/constants/clientRoutes'
import { AUTH_ERROR_CODE } from '@/constants/errorCode'

export const api = axios.create({
    baseURL:API_BASE_URL,
    withCredentials:true,
    httpAgent:new http.Agent({keepAlive:true}),
    httpsAgent:new https.Agent({keepAlive:true})
})



api.interceptors.request.use(async (config) => {

    const cookieStore = await cookies()
    const session = await getIronSession<IAuthSession>(
        cookieStore,
        sessionOptions
    )
    if(session?.accessToken){
        config.headers.Authorization=`Bearer ${session.accessToken}`
    }    
    return config
})


api.interceptors.response.use(
    (response) => response,
    async (error) => {                        
            if(error.response?.status == STATUS_CODES.UNAUTHORIZED){
                redirect(AUTH_CLIENT_ROUTES.LOGIN + `?reason=${AUTH_ERROR_CODE.SESSION_EXPIRED}`)
            }
    }
) 