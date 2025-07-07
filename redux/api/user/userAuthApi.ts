import { userApi } from "./userApi";

export const userAuthApi = userApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: '/login',
                method: 'POST',
                body:data,
            }),
            invalidatesTags:['user'],
        }),
        getUser: builder.query({
            query: () => ({
                url: '/user',
                method: 'GET',
            }),
            providesTags:['user'],
            keepUnusedDataFor:30
        })
    })
})


export const {useLoginMutation,useGetUserQuery} = userAuthApi