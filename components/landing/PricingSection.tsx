"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlanCard } from "../plans/PlanCard";
import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes";
import { IPlan } from "@/types/IPlanType";

export default function PricingSection({ plans }: { plans: IPlan[] }) {
  // Add isPopular property to PLANS for display purposes if needed, or just hardcode it here
  const plansWithPopularity = plans.map((plan) => ({
    ...plan,
    isPopular: plan.type === "Pro",
  }));

  return (
    <section id="pricing" className="bg-navyDark px-4 py-32">
      <div className="container mx-auto">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Choose the plan that fits your team&apos;s needs. Upgrade or
            downgrade at any time.
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
          {plansWithPopularity.map((plan) => (
            <div
              key={plan.id}
              className={
                plan.isPopular
                  ? "relative z-10 scale-105 transform transition-transform duration-300"
                  : ""
              }
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2 transform rounded-full bg-purple px-3 py-1 text-xs font-bold text-white shadow-lg shadow-purple/20">
                  MOST POPULAR
                </div>
              )}
              <PlanCard
                {...plan}
                actionSlot={
                  <Link
                    href={AUTH_CLIENT_ROUTES.LOGIN}
                    className="mt-6 block w-full"
                  >
                    <Button variant={"dark"} className="w-full">
                      Choose {plan.name}
                    </Button>
                  </Link>
                }
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
