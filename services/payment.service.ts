import { PAYMENT_API_ROUTES } from "@/constants/apiRoutes";
import api from "@/lib/api";

export const paymentService = {
  verifyPayment: async () => {
    return api.post(PAYMENT_API_ROUTES.VERIFY_PAYMENT);
  },
  retryPayment: async () => {
    return api.post(PAYMENT_API_ROUTES.RETRY_PAYMENT);
  },
};
