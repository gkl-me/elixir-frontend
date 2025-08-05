'use client'

import { AxiosErrorHandler } from "@/lib/errorHandler"
import { useLazyGetAvailablePlansQuery } from "@/redux/api/user/usePlanApi"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import PlanCard, { PlanCardProps } from "./PlanCard"



export default function PlanForm(){

    
    const [plans,setPlans] = useState<PlanCardProps[]>()
    
    const [triggerGetAvailablePlans] = useLazyGetAvailablePlansQuery()

    useEffect(() => {
        const check = async () => {
            try {
                const res = await triggerGetAvailablePlans({}).unwrap()
                setPlans(res.data)
            } catch (error) {
                toast.error(AxiosErrorHandler(error))
            }
        }
        check()
    },[triggerGetAvailablePlans])

    return (
        <div className="flex gap-10">
           {plans?.map((plan) => (
            <PlanCard key={plan.id} id={plan.id} name={plan.name} price={plan.price} limits={plan.limits} />
            ))}
        </div>
    )
}