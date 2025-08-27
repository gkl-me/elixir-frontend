import { ADMIN_ROUTES } from '@/constants/adminRoutes'
import { API_BASE_URL, API_ROUTES } from '@/constants/config'
import { USER_ROUTES } from '@/constants/userRoutes'
import axios from 'axios'


const createAxiosInstance = (baseURL:string,type:'admin'|'user') => {
    const instance = axios.create({
        baseURL,
        withCredentials : true,
    })

    //refresh token logic
    instance.interceptors.response.use(
        response => response.data,
        async (error) => {
            const originalRequest = error.config

            if(error.response?.status == 401 && !originalRequest._retry){
                originalRequest._retry = true

                try {

                    const refreshUrl = type === 'admin' ? ADMIN_ROUTES.ADMIN+ADMIN_ROUTES.REFRESH :  USER_ROUTES.USER+USER_ROUTES.REFRESH
                    await axios.post(API_BASE_URL+refreshUrl,{},{
                        withCredentials:true
                    })

                    return instance(originalRequest)
                } catch (error) {
                    return Promise.reject(error)
                }
            }

            return Promise.reject(error)
        }
    )

    return instance
}


export const adminAxios = createAxiosInstance(API_ROUTES.admin,'admin')
export const userAxios = createAxiosInstance(API_ROUTES.user,'user')
