'use client'

import PlanCardSkeleton from "@/components/admin/plan/cardSkeleton"
import { useGetPlans } from "@/hooks/admin/useGetPlans"
import { PlanCardProps } from "@/types/IPlan"
import AdminPlanCard from "./AdminPlanCard"

export default function AdminPlanForm(){

    const {plans,isLoading} = useGetPlans()

    if(isLoading){
        return <div className="mx-auto mt-20">
            <PlanCardSkeleton/>
        </div>
    }

    return(
       <div className="mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
            {plans && plans.map((plan:PlanCardProps) => {
               return ( <AdminPlanCard
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