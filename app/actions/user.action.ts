"use server"

import { AxiosErrorHandler } from "@/lib/errorHandler";
import { userService } from "@/services/user.service";


export async function toggleUserStatusAction(
    userId:string
){
    try {
        
        const res = await userService.toggleUserStatus({
            userId
        })

        return {
            success:res.data.success,
            message:res.data.message
        }

    } catch (error) {
        return {
            success:false,
            error:AxiosErrorHandler(error).message
        }
    }    
}


