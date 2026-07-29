"use server";

import { handlerServerError } from "@/lib/authHelper";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { subscriptionService } from "@/services/subscription.service";
import {
  ICancelSubscriptionParams,
  IReactivateSubscriptionParams,
} from "@/types/ISubscriptionType";

export async function cancelSubscriptionAction(
  params: ICancelSubscriptionParams
) {
  try {
    const res = await subscriptionService.handleCancelSubscription(params);
    return {
      success: res.data.success,
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error).message,
    };
  }
}

export async function reactivateSubscriptionAction(
  params: IReactivateSubscriptionParams
) {
  try {
    const res = await subscriptionService.handleReactivateSubscription(params);
    return {
      success: res.data.success,
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error).message,
    };
  }
}
