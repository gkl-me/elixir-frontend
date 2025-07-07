import { API_ROUTES } from '@/constants/config'
import axios from 'axios'


const createAxiosInstance = (baseURL:string) => {
    const instance = axios.create({
        baseURL,
        withCredentials : true,
    })

    instance.interceptors.response.use(
        response => response.data,
        error => {
            throw error
        }
    )

    return instance
}


export const userAxios = createAxiosInstance(API_ROUTES.user)
export const adminAxios = createAxiosInstance(API_ROUTES.admin)
