import { AxiosError } from "axios";

export function AxiosErrorHandler(error:unknown){
    if(error instanceof AxiosError){
        return error?.response?.data?.message
    }
    return "Session expired please login again"
}