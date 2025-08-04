import { USER_ROUTES } from "@/constants/userRoutes";
import { userApi } from "./userApi";


export const userPlanApi = userApi.injectEndpoints({
    endpoints: (builder) => ({
        getAvailablePlans: builder.query({
            query: () => ({
                url:USER_ROUTES.PLANS,
                method:'GET'
            })
        })
    })
})


export const {useLazyGetAvailablePlansQuery} = userPlanApi