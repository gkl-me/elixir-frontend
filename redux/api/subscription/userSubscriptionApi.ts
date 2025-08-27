import { userApi } from "../user/userApi";
import { USER_ROUTES } from "@/constants/userRoutes";


export const userSubscriptionApi = userApi.injectEndpoints({
    endpoints:(builder) => ({
        subscribe:builder.mutation({
            query:(data) => ({
                url:USER_ROUTES.SUBSCRIBE,
                method:'POST',
                data:data
            }),
            invalidatesTags:['subscription']
        }),
        findSubscription:builder.query({
            query:({userId}) => ({
                url:`/${userId}`+USER_ROUTES.SUBSCRIPTION,
                method:'GET',
            }),
            providesTags:['subscription']
        })
    })
})


export const {useSubscribeMutation,useFindSubscriptionQuery} = userSubscriptionApi