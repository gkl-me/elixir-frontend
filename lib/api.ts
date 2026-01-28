import { API_BASE_URL } from '@/config/url'
import { IAuthSession } from '@/types/types'
import axios from 'axios'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions } from './session'
import { STATUS_CODES } from '@/constants/statusCodes'
import { refreshTokenAction } from '@/app/actions/auth.action'
import http from 'http'
import https from "https"

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
            const originalRequest = error.config
            
            if(error.response?.status == STATUS_CODES.UNAUTHORIZED && !originalRequest._retry){
                originalRequest._retry = true
                
                // refresh token  , return new access and set new refresh in cookie
                const res = await refreshTokenAction()
                if(res.success){
                    const accessToken = res.accessToken
                    originalRequest.headers.Authorization=`Bearer ${accessToken}`
                    return api(originalRequest)
                }else{
                    return Promise.reject(error)
                }
            }
    }
) 