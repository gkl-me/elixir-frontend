"use server";

import { handlerServerError } from "@/lib/authHelper";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { paymentService } from "@/services/payment.service";
import { ICustomerPortalData, UpgradeCheckoutData } from "@/types/IPaymentType";

export async function verifyPaymentAction() {
  try {
    const res = await paymentService.verifyPayment();
    return {
      success: true,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error)?.message,
    };
  }
}

export async function retryPaymentAction() {
  try {
    const res = await paymentService.retryPayment();
    return {
      success: true,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error)?.message,
    };
  }
}

export async function customerPortalAction(data: ICustomerPortalData) {
  try {
    const res = await paymentService.customerPortal(data);
    return {
      success: true,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error)?.message,
    };
  }
}


export async function startUpgradeCheckoutAction(data: UpgradeCheckoutData) {
  try {
    const res = await paymentService.upgradeCheckout(data);
    return {
      success: true,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error)?.message,
    };
  }
}