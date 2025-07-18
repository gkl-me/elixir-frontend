'use client'

import PlanCardSkeleton from "@/components/admin/plan/cardSkeleton"
import PlanCard  from "@/components/admin/PlanCard"
import { AxiosErrorHandler } from "@/lib/errorHandler"
import { useLazyPlansQuery } from "@/redux/api/admin/adminPlan"
import { PlanCardProps } from "@/types/IPlan"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function AdminPlans(){

    const [triggerPlans,{isLoading}] = useLazyPlansQuery()
    const [data,setData] = useState<PlanCardProps[] | null>(null)

    useEffect(() => {
        const getPlans = async () => {
            try {
                const res = await triggerPlans({}).unwrap()
                setData(res.data)
            } catch (error) {
                toast.error(AxiosErrorHandler(error))
            }
        }
        getPlans()
    },[])

    if(isLoading){
        return <div className="mx-auto mt-20">
            <PlanCardSkeleton/>
        </div>
    }

    return(
       <div className="mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
            {data && data.map((plan) => {
               return ( <PlanCard
                    key={plan.id}
                    id={plan.id}
                    name={plan.name}
                    price={plan.price}
                    isActive={plan.isActive}
                    limits={plan.limits}
                /> )
            })}
        </div>
    )
}