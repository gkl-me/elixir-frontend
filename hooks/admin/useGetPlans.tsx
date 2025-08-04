import { AxiosErrorHandler } from "@/lib/errorHandler"
import { usePlansQuery } from "@/redux/api/admin/adminPlan"
import { useEffect } from "react"
import { toast } from "sonner"



export const useGetPlans = ()=> {
    const {data,isLoading,error,isError} = usePlansQuery({})

    useEffect(() => {
        if(isError && error){
            toast.error(AxiosErrorHandler(error))
        }
    },[error,isError])

    return {
        plans:data?.data ?? [],
        isLoading
    }
}