import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

export const axiosBaseQuery =
  (axiosInstance: AxiosInstance): BaseQueryFn<{
        url:string,
        method?:AxiosRequestConfig['method'],
        data?:AxiosRequestConfig['data'],
        params?:AxiosRequestConfig['params'],
        headers?:AxiosRequestConfig['headers'],
    }> =>
  async ({ url, method, data, params }) => {
    try {
      const response = await axiosInstance({ url, method, data, params });
      return { data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        error: {
          status: axiosError.response?.status || 500,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };
