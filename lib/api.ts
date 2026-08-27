import { API_BASE_URL } from "@/config/url";
import axios from "axios";
import { cookies } from "next/headers";
import { getSession } from "./session";
import { STATUS_CODES } from "@/constants/statusCodes";
import { AUTH_API_ROUTES } from "@/constants/apiRoutes";
import { setCookies } from "./cookies";
import { AUTH_ERROR_CODE } from "@/constants/errorCode";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes(AUTH_API_ROUTES.REFRESH) ||
      originalRequest.url?.includes(AUTH_API_ROUTES.LOGIN)
    ) {
      return Promise.reject(error);
    }

    const isUnauthorized =
      error.response?.status === STATUS_CODES.UNAUTHORIZED &&
      error.response?.data?.errorCode === AUTH_ERROR_CODE.UNAUTHORIZED;

    if (isUnauthorized) {
      originalRequest._retry = true;

      try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        //call refresh route to refresh the token
        const response = await axios.post(
          API_BASE_URL + AUTH_API_ROUTES.REFRESH,
          {
            refreshToken,
          }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        const session = await getSession();
        session.accessToken = accessToken;

        //save access in session and refresh in cookie
        await session.save();
        setCookies(newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
