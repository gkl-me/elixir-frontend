import { PLAN_API_ROUTES } from "@/constants/apiRoutes"
import api from "@/lib/api"
import { IUpdatePlanData } from "@/types/IPlanType"




export const planService = {
    getAllPlans:async () => {
        return api.get(PLAN_API_ROUTES.GET_ALL_PLANS)
    },
    updatePlan:async (planId:string,data:IUpdatePlanData) => {
        return api.patch(PLAN_API_ROUTES.UPDATE_PLAN+`/${planId}`,data)
    }
}