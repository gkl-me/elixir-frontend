import { BaseQueryApi, BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

export const axiosBaseQuery =
  ( axiosInstance: AxiosInstance,
    type:'admin' | 'user',
    onLogout:(api:BaseQueryApi) => void
  ): BaseQueryFn<{
        url:string,
        method?:AxiosRequestConfig['method'],
        data?:AxiosRequestConfig['data'],
        params?:AxiosRequestConfig['params'],
        headers?:AxiosRequestConfig['headers'],
    },unknown> =>
  async ({ url, method, data, params },api:BaseQueryApi) => {
    try {
      const response = await axiosInstance({ url, method, data, params });
      return { data:response };
    } catch (error) {
      const axiosError = error as AxiosError<{message:string}>
      if(axiosError.status == 401 || axiosError.status == 403){
        if(type === 'admin'){
          onLogout(api)
        }else{
          onLogout(api)
        }
      }
      console.log(error)
      return {
        error:  AxiosError
      };
    }
  };
