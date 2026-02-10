"use server"

<<<<<<< HEAD
import { USER_API_ROUTES } from "@/constants/apiRoutes";
import { api } from "@/lib/api";
=======
import { handlerServerError } from "@/lib/authHelper";
>>>>>>> a43d818 (changes for plan to admin branc)
import { AxiosErrorHandler } from "@/lib/errorHandler";



export async function getAllUserAction(
    search?:string,
    status?:string,
    page?:number,
    limit?:number,
    sortBy?:string,
    sortOrder?:'desc'|'asc',
){
    try {

        const res = await api.get(USER_API_ROUTES.GET_ALL_USER,{
            params:{
                search:search||"",
                status:status||"",
                page:page||1,
                limit:limit||10,
                sortBy:sortBy||"",
                sortOrder:sortOrder||'desc'
            }
        })


        return {
            success:res.data.success,
            message:res.data.message,
            data:res.data.data
        }

        
    } catch (error) {
        return {
            success:false,
            error:AxiosErrorHandler(error).message
        }
    }
}



export async function toggleUserStatusAction(
    userId:string
){
    try {
        
        const res = await api.patch(USER_API_ROUTES.TOGGLE_USER_STATUS+`/${userId}/status`)

        return {
            success:res.data.success,
            message:res.data.message
        }

    } catch (error) {
        handlerServerError(error)
        return {
            success:false,
            error:AxiosErrorHandler(error).message
        }
    }    
}


