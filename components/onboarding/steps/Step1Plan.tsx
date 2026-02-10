"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PlanCard } from "@/components/plans/PlanCard"
import { OnboardingData, PlanType } from "@/types/IOnboardingTypes"
import { IPlan } from "@/types/IPlanType"
import { useApi } from "@/hooks/useApi"
import { Button } from "@/components/ui/button"


interface Step1PlanProps {
  onNext: (data: { planName: PlanType }) => void
  initialData: OnboardingData
}

export default function Step1Plan({ onNext, initialData }: Step1PlanProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(initialData?.planName || 'Free')
  const [plans,setPlans] = useState<IPlan[]>([])
  
  const {execute} = useApi({
    url:"/api/plans",
    method:"GET"
  })

  useEffect(() => {
    (async () =>{
        const res = await execute()
        setPlans(res.data.plans)
    })()
  },[])

  const handleContinue = () => {
    onNext({ planName: selectedPlan })
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Choose your plan</h2>
        <p className="text-gray-400">Select the plan that best fits your needs</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="cursor-pointer"
          >
            <PlanCard
              {...plan}
              isSelected={selectedPlan === (plan.name)}
              onClick={() => setSelectedPlan(plan.name as PlanType)}
              actionSlot={
                <div className="mt-4 w-full text-center">
                    <Button 
                    variant={selectedPlan == plan.name ? "dark":"light"}
                    className="w-full"
                    >

                        {selectedPlan === (plan.name as PlanType) ? 'Selected' : 'Click to Select'}
                    </Button>
                </div>
              }
            />
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end pt-8">
        <button
          onClick={handleContinue}
          className="bg-purple hover:bg-purpleDark text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
