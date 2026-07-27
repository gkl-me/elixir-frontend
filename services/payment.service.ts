import { PAYMENT_API_ROUTES } from "@/constants/apiRoutes";
import api from "@/lib/api";
import { BillingInfoData } from "@/types/IPaymentType";

export const paymentService = {
  verifyPayment: async () => {
    return api.post(PAYMENT_API_ROUTES.VERIFY_PAYMENT);
  },
  retryPayment: async () => {
    return api.post(PAYMENT_API_ROUTES.RETRY_PAYMENT);
  },
  billingInfo: async (data: BillingInfoData) => {
    return api.get(PAYMENT_API_ROUTES.BILLING_INFO + '/' + data.workspaceId)
  }
};
