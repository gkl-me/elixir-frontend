export const AUTH_API_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GOOGLE_AUTH: "/auth/google-auth",
  GITHUB_AUTH: "/auth/github-auth",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",

  VERIFY_EMAIL: "/auth/verify",
  RESEND_EMAIL: "/auth/resend-email",

  VERIFY_OTP: "/auth/verify-otp",
  RESEND_OTP: "/auth/resend-otp",

  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
};

export const USER_API_ROUTES = {
  GET_ALL_USER: "/users/",
  TOGGLE_USER_STATUS: "/users",
  CHANGE_PASSWORD: "/users/change-password",
  ACTIVE_SESSIONS: "/users/active-sessions"
};

export const PLAN_API_ROUTES = {
  GET_ALL_PLANS: "/plans/",
  CREATE_PLAN: "/plans/create",
  TOGGLE_PLAN_STATUS: "/plans/toggle",
};

export const ONBOARDING_API_ROUTES = {
  GET_USER_ONBOARDING: "/onboarding/",
  SAVE_ONBOARDING_STEP: "/onboarding/step",
  COMPLETE_ONBOARDING_STEP: "/onboarding/complete",
  COMPLETE_ONBOARDING_PAYMENT: "/onboarding/complete-payment",
  CHANGE_PLAN: "/onboarding/change-plan",
};

export const PAYMENT_API_ROUTES = {
  VERIFY_PAYMENT: "/payment/verify",
  RETRY_PAYMENT: "/payment/retry",
};

export const COMPANY_API_ROUTES = {
  GET_ALL_COMPANY: "/company",
};
