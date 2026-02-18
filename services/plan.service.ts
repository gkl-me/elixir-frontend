import { PLAN_API_ROUTES } from "@/constants/apiRoutes"
import api from "@/lib/api"
import { ICreatePlanData, ITogglePlanStatusData } from "@/types/IPlanType"




export const planService = {
    getAllPlans:async () => {
        return api.get(PLAN_API_ROUTES.GET_ALL_PLANS)
    },
    createPlan:async (data:ICreatePlanData) => {
        return api.post(PLAN_API_ROUTES.CREATE_PLAN,data)
    },
    toggleStatus:async (data:ITogglePlanStatusData) => {
        return api.patch(PLAN_API_ROUTES.TOGGLE_PLAN_STATUS+`/${data.planId}`,{})
    }
}