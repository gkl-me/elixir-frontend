import { ADMIN_ROUTES } from "@/constants/adminRoutes";
import { adminApi } from "./adminApi";


export const adminPlanApi = adminApi.injectEndpoints({
    endpoints:(builder) => ({
        plans:builder.query({
            query:() => ({
                url:ADMIN_ROUTES.PLANS,
                method:'GET',
            }),
           providesTags:['plans'] 
        }),
        editPlan:builder.mutation({
            query:({data,id}) => ({
                url:ADMIN_ROUTES.PLANS + `/${id}`,
                method:'PATCH',
                data:data
            }),
            invalidatesTags:['plans']
        }),
    })
})

export const {usePlansQuery,useEditPlanMutation} = adminPlanApi