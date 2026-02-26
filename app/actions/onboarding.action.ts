"use server"

import { USER_CLIENT_ROUTES } from "@/constants/clientRoutes"
import { handlerServerError } from "@/lib/authHelper"
import { AxiosErrorHandler } from "@/lib/errorHandler"
import { onboardingService } from "@/services/onboarding.service"
import { redirect } from "next/navigation"


export async function saveOnboardingStepAction(data){
    try {
        
        const res = await onboardingService.saveOnboardingStep(data)
        return{
            success:res.data.success,
            data:res.data.data.onboarding,
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


export async function completeOnboardingAction(){
    try {

        const res = await onboardingService.completeOnboarding()
        return {
            success:true,
            data:res.data.data,
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


export async function completeOnboadringPaymentAction(){
    try {

        const res = await onboardingService.completeOnboardingPayment()
         return {
            success:true,
            data:res.data.data,
            message:res.data.message
        }
        
    } catch (error) {
        handlerServerError(error)
        return {
            success:false,
            error:AxiosErrorHandler(error)?.message
        }
    }
}

export async function changePlanAction(){
    try {
        
        await onboardingService.changePlan()
        redirect(USER_CLIENT_ROUTES.ONBOARDING)

    } catch (error) {
        handlerServerError(error)
        return {
            success:false,
            error:AxiosErrorHandler(error)?.message
        }
    }
}