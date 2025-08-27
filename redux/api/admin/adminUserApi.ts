import { ADMIN_ROUTES } from "@/constants/adminRoutes";
import { adminApi } from "./adminApi";


export const adminUserApi = adminApi.injectEndpoints({
    endpoints:(builder) => ({
        getAllUsers:builder.query({
            query:({page,limit,search,status,sortBy,sortOrder}) => ({
                url:ADMIN_ROUTES.USERS,
                method:'GET',
                params:{
                    page,
                    limit,
                    search,
                    status,
                    sortBy,
                    sortOrder
                }
            }),
            providesTags:['users']
        }),
        toggleBlockStatus:builder.mutation({
            query:(data) => ({
                url:ADMIN_ROUTES.USERS+`/${data.id}/toggle-block`,
                method:'PATCH',
            }),
            invalidatesTags:['users']
        })
    })
})


export const {useGetAllUsersQuery,useToggleBlockStatusMutation} = adminUserApi