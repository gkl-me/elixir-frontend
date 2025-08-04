import { userApi } from "./userApi";
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
        })
    })
})


export const {useSubscribeMutation} = userSubscriptionApi