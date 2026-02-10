import { PlanCard } from "@/components/plans/PlanCard"
import UpdateCardModal from "@/components/plans/UpdateCardModal"
import { AxiosErrorHandler } from "@/lib/errorHandler"
import { planService } from "@/services/plan.service";

export default async function PlansPage() {

    let plans;
    try {

        const res = await planService.getAllPlans()
        plans=res.data.data.plans
        console.log(plans)

    } catch (error) {
        const err = AxiosErrorHandler(error)
        throw new Error(err.message)
    }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white relative inline-block">
                Plans
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-purple rounded-full"></span>
            </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {plans.map((plan) => (
                <PlanCard 
                    key={plan.id} 
                    {...plan} 
                    actionSlot={
                        <UpdateCardModal 
                            id={plan.id}
                            name={plan.name}
                            price={plan.price}
                            limits={plan.limits}
                            features={plan.features}
                        />
                    }
                />
            ))}
        </div>
    </div>
  )
}
