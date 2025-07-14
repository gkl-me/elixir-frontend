'use client'

import PlanCardSkeleton from "@/components/admin/cardSkeleton"
import PlanCard  from "@/components/admin/planCard"
import { usePlansQuery } from "@/redux/api/admin/adminPlan"
import { PlanCardProps } from "@/types/IPlan"
import { useEffect } from "react"
import { toast } from "sonner"

export default function AdminPlans(){

    const {data,isLoading,isError,error} = usePlansQuery({})

    useEffect(() => {
        if(isError && error){
            toast.error(error as string )
        }
    },[isError,error])

    if(isLoading){
        return <div className="mx-auto mt-20">
            <PlanCardSkeleton/>
        </div>
    }

    return(
       <div className="mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
            {data && data.data.map((plan:PlanCardProps) => {
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