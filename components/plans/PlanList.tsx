
"use client"

import { IPlan } from "@/types/IPlanType"
import { Pagination } from "../ui/pagination"
import { PlanCard } from "./PlanCard"
import { getAllPlansAction } from "@/app/actions/plan.action"

export default function PlanList({
    plans,
    currentPage,
    totalPages,
}: {
    plans: IPlan[]
    currentPage: number
    totalPages: number
}) {

    const onPageChange = async (page: number) => {
        const res = await getAllPlansAction(page, 6)
        if (res.success) {
            plans = res.data.plans
            currentPage = res.data.currentPage
            totalPages = res.data.totalPage
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {plans?.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        {...plan}
                        showToggle={true}
                    />
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </>
    )
}