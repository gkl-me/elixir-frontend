import { AdminRoutes } from "@/constants/adminRoutes";
import { adminApi } from "./adminApi";


export const adminAuthApi = adminApi.injectEndpoints({
    endpoints:(builder) => ({
        adminLogin:builder.mutation({
            query:(data) => ({
                url:AdminRoutes.LOGIN,
                method:'POST',
                data:data
            }),
            invalidatesTags:['admin']
        }),
        adminMe:builder.query({
            query:() => ({
                url:AdminRoutes.ME,
                method:'GET'
            }),
            providesTags:['admin']
        })
    })
})


export const {useAdminMeQuery,useAdminLoginMutation} = adminAuthApi