"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlanCard } from "@/components/plans/PlanCard";
import { IPlan } from "@/types/IPlanType";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { IOnboardingState } from "@/types/IOnboardingTypes";

interface Step1PlanProps {
  onNext: (data: ISelectedPlan) => void;
  initialData: IOnboardingState;
}

interface ISelectedPlan {
  planType: "Free" | "Pro" | "Enterprice";
  planId?: string;
  planPrice?: number;
}

export default function Step1Plan({ onNext, initialData }: Step1PlanProps) {
  const [selectedPlan, setSelectedPlan] = useState<ISelectedPlan>({
    planType: initialData?.planType || "Free",
    planId: initialData?.planId,
    planPrice: initialData?.planPrice,
  });

  const [plans, setPlans] = useState<IPlan[]>([]);

  const { execute } = useApi({
    url: "/api/plans",
    method: "GET",
  });

  useEffect(() => {
    (async () => {
      const res = await execute();
      const planList: IPlan[] = res?.data?.plans || [];
      setPlans(planList);

      if (planList.length > 0) {
        const targetType = initialData?.planType || "Free";
        const matchingPlan =
          planList.find((p) => p.id === initialData?.planId) ||
          planList.find((p) => p.type === targetType) ||
          planList[0];

        if (matchingPlan) {
          setSelectedPlan({
            planId: matchingPlan.id,
            planType: matchingPlan.type as "Free" | "Pro" | "Enterprice",
            planPrice: matchingPlan.price,
          });
        }
      }
    })();
  }, []);

  const handleContinue = () => {
    let planToSubmit = selectedPlan;
    if (!planToSubmit.planId && plans.length > 0) {
      const matching =
        plans.find((p) => p.type === (planToSubmit.planType || "Free")) ||
        plans[0];
      if (matching) {
        planToSubmit = {
          planId: matching.id,
          planType: matching.type as "Free" | "Pro" | "Enterprice",
          planPrice: matching.price,
        };
      }
    }
    console.log("Select", planToSubmit);
    onNext(planToSubmit);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold text-white">Choose your plan</h2>
        <p className="text-gray-400">
          Select the plan that best fits your needs
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
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
              isSelected={selectedPlan.planType === plan.type}
              onClick={() =>
                setSelectedPlan({
                  planId: plan.id,
                  planType: plan.type,
                  planPrice: plan.price,
                })
              }
              actionSlot={
                <div className="mt-4 w-full text-center">
                  <Button
                    variant={
                      selectedPlan.planType === plan.type ? "dark" : "light"
                    }
                    className="w-full"
                  >
                    {selectedPlan.planType === plan.type
                      ? "Selected"
                      : "Click to Select"}
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
          className="transform rounded-lg bg-purple px-8 py-3 font-medium text-white transition-all hover:scale-105 hover:bg-purpleDark"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
