import { AUTH_API_ROUTES } from "@/constants/apiRoutes";
import api from "@/lib/api";
import {
  ForgotPasswordData,
  GithubAuthData,
  GoogleAuthData,
  LoginData,
  LogoutData,
  RegisterData,
  ResendOtpData,
  ResendVerifyEmailData,
  ResetPasswordData,
  VerifyEmailData,
  VerifyOtpData,
} from "@/types/IAuthType";

export const authService = {
  register: async (data: RegisterData) => {
    return api.post(AUTH_API_ROUTES.REGISTER, data);
  },
  login: async (data: LoginData) => {
    return api.post(AUTH_API_ROUTES.LOGIN, data);
  },
  verifyEmail: async (data: VerifyEmailData) => {
    return api.get(AUTH_API_ROUTES.VERIFY_EMAIL + `/${data?.token}`);
  },
  resendVerifyEmail: async (data: ResendVerifyEmailData) => {
    return api.post(AUTH_API_ROUTES.RESEND_EMAIL, data);
  },
  forgotPassword: async (data: ForgotPasswordData) => {
    return api.post(AUTH_API_ROUTES.FORGOT_PASSWORD, data);
  },
  verifyOtp: async (data: VerifyOtpData) => {
    return api.post(AUTH_API_ROUTES.VERIFY_OTP, data);
  },
  resendOtp: async (data: ResendOtpData) => {
    return api.post(AUTH_API_ROUTES.RESEND_OTP, data);
  },
  resetPassword: async (data: ResetPasswordData) => {
    return api.post(AUTH_API_ROUTES.RESET_PASSWORD, data);
  },
  googleAuth: async (data: GoogleAuthData) => {
    return api.post(AUTH_API_ROUTES.GOOGLE_AUTH, data);
  },
  githubAuth: async (data: GithubAuthData) => {
    return api.post(AUTH_API_ROUTES.GITHUB_AUTH, data);
  },
  logout: async (data: LogoutData) => {
    return api.post(AUTH_API_ROUTES.LOGOUT, data);
  },
};
