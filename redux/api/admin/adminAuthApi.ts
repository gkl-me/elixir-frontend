
import { ADMIN_ROUTES } from "@/constants/adminRoutes";
import { adminApi } from "./adminApi";


export const adminAuthApi = adminApi.injectEndpoints({
    endpoints:(builder) => ({
        adminLogin:builder.mutation({
            query:(data) => ({
                url:ADMIN_ROUTES.LOGIN,
                method:'POST',
                data:data
            }),
            invalidatesTags:['admin']
        }),
        adminMe:builder.query({
            query:() => ({
                url:ADMIN_ROUTES.ME,
                method:'GET'
            }),
            providesTags:['admin']
        }),
        adminLogout:builder.mutation({
            query:() => ({
                url:ADMIN_ROUTES.LOGOUT,
                method:'POST'
            }),
            invalidatesTags:['admin']
        })
    })
})


export const {useLazyAdminMeQuery,useAdminLoginMutation,useAdminLogoutMutation} = adminAuthApi