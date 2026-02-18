"use server"

import { handlerServerError } from "@/lib/authHelper"
import { AxiosErrorHandler } from "@/lib/errorHandler"
import { planService } from "@/services/plan.service"
import { revalidatePath } from "next/cache"


export async function createPlanAction(data){
    try {

        await planService.createPlan(data)
        revalidatePath('/admin/plans')

    } catch (error) {
        handlerServerError(error)
        return {
            success:false,
            error:AxiosErrorHandler(error).message
        }
    }
}

export async function togglePlanStatus(planId:string){
    try {
        console.log("plan id",planId)
        const res = await planService.toggleStatus({planId})
        revalidatePath('/admin/plans')

        return  {
            success:true,
            message:res.data.message
        }
    } catch (error) {
        return {
            success:false,
            error:AxiosErrorHandler(error).message
        }
    }
}