"use server";

import { handlerServerError } from "@/lib/authHelper";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { paymentService } from "@/services/payment.service";

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
