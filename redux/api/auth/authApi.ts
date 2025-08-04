import { USER_ROUTES } from "@/constants/userRoutes";
import { userApi } from "../user/userApi";

export const AuthApi = userApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: '/login',
                method: 'POST',
                data:data,
            }),
            invalidatesTags:['user'],
        }),
        register: builder.mutation({
            query:(data) => ({
                url:USER_ROUTES.REGISTER,
                method:'POST',
                data:data
            }),
            invalidatesTags:['user']
        }),
        verify: builder.query({
            query:(data) => ({
                url:USER_ROUTES.VERIFY+`/${data.token}`,
                method:'GET',
            }),
        }),
        googleAuth: builder.mutation({
            query:(data) => ({
                url:USER_ROUTES.GOOGLE,
                method:'POST',
                data:data
            })
        })
    })
})


export const {useLoginMutation,useRegisterMutation,useLazyVerifyQuery,useGoogleAuthMutation} = AuthApi