import { SUBSCRIPTION_API_ROUTES } from "@/constants/apiRoutes"
import api from "@/lib/api"
import { ICancelSubscriptionParams, IListSubscriptionParams, IReactivateSubscriptionParams } from "@/types/ISubscriptionType"



export const subscriptionService = {
    handleListSubscription: async (params: IListSubscriptionParams) => {
        return api.get(SUBSCRIPTION_API_ROUTES.GET_ALL_SUBSCRIPTION, {
            params
        })
    },
    handleCancelSubscription: async (params: ICancelSubscriptionParams) => {
        return api.patch(SUBSCRIPTION_API_ROUTES.CANCEL_SUBSCRIPTION(params.subscriptionId), {
            cancelMode: params.cancelMode
        })
    },
    handleReactivateSubscription: async (params: IReactivateSubscriptionParams) => {
        return api.patch(SUBSCRIPTION_API_ROUTES.REACTIVATE_SUBSCRIPTION(params.subscriptionId))
    }
}