export const dynamic = "force-dynamic";

import CreateCardModal from "@/components/plans/CreateCardModal"
import { AxiosErrorHandler } from "@/lib/errorHandler"
import { planService } from "@/services/plan.service";
import PlanList from "@/components/plans/PlanList";

export default async function PlansPage() {

    let plans;
    let currentPage = 1
    let totalPages = 1;
    try {

        const res = await planService.getAllPlans({ page: 1, limit: 6 })
        plans = res.data.data.plans
        currentPage = res.data.data.currentPage
        totalPages = res.data.data.totalPage
        // console.log(totalPages)

    } catch (error) {
        const err = AxiosErrorHandler(error)
        throw new Error(err.message)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white relative inline-block">
                    Plans
                    <span className="absolute -bottom-2 left-0 w-12 h-1 bg-purple rounded-full"/>
                </h1>
                <div>
                    <CreateCardModal />
                </div>
            </div>
            <PlanList plans={plans} currentPage={currentPage} totalPages={totalPages} />
        </div>
    )
}
