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
    })
})


export const {useLoginMutation} = userAuthApi