import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes";
import { AUTH_ERROR_CODE } from "@/constants/errorCode";
import { STATUS_CODES } from "@/constants/statusCodes";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";


type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";


interface useApiConfig {
  url: string;
  method: HttpMethod;
}


export function useApi(config:useApiConfig){
    const router = useRouter()
    const [state,setState] = useState({
        data:null,
        isLoading:false,
        error:null
    })


    const execute = useCallback(
        async (options?:{
            params?:unknown,
            body?:unknown
        })  => {

            //update the states 
            setState((prev) => ({...prev,isLoading:true,error:null}))

            try {

                const response = await axios.request({
                    url:config.url,
                    method:config.method,
                    params:options?.params,
                    data:options?.body
                })

                setState({
                    data:response.data,
                    isLoading:false,
                    error:null
                })

                return response.data

            } catch (error) {

                const err = AxiosErrorHandler(error)

                if(err.statusCode == STATUS_CODES.UNAUTHORIZED){
                    router.push(AUTH_CLIENT_ROUTES.LOGIN+`?reason=${AUTH_ERROR_CODE.SESSION_EXPIRED}`)
                }

                if(err.statusCode == STATUS_CODES.FORBIDDEN){
                    router.push(AUTH_CLIENT_ROUTES.LOGIN+`?reason=${AUTH_ERROR_CODE.BLOCKED}`)
                }

                setState({
                    data:null,
                    error:err.message,
                    isLoading:false
                })
                
            }
        }
    ,[config.url,config.method,router])


    return {...state,execute}
 
}