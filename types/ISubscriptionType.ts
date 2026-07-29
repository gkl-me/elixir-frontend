




export interface IListSubscriptionParams {
    search?: string,
    status?: string,
    page?: number
    limit?: number
    plan?: string
}


export interface ICancelSubscriptionParams {
    subscriptionId: string
    cancelMode: "period_end" | "immediate"
}

export interface IReactivateSubscriptionParams {
    subscriptionId: string
}