import { ONBOARDING_API_ROUTES } from "@/constants/apiRoutes";
import api from "@/lib/api";

export const onboardingService = {
  getUserOnboarding: async () => {
    return api.get(ONBOARDING_API_ROUTES.GET_USER_ONBOARDING);
  },
  saveOnboardingStep: async (data) => {
    return api.patch(ONBOARDING_API_ROUTES.SAVE_ONBOARDING_STEP, data);
  },
  completeOnboarding: async () => {
    return api.post(ONBOARDING_API_ROUTES.COMPLETE_ONBOARDING_STEP);
  },
  completeOnboardingPayment: async () => {
    return api.post(ONBOARDING_API_ROUTES.COMPLETE_ONBOARDING_PAYMENT);
  },
  changePlan: async () => {
    return api.patch(ONBOARDING_API_ROUTES.CHANGE_PLAN);
  },
};
