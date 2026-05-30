"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlanCard } from "../plans/PlanCard";
import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes";
import { IPlan } from "@/types/IPlanType";



export default function PricingSection({plans}:{
    plans:IPlan[]
}) {
    // Add isPopular property to PLANS for display purposes if needed, or just hardcode it here
    const plansWithPopularity = plans.map(plan => ({
        ...plan,
        isPopular: plan.type === "Pro"
    }))

    return (
        <section id="pricing" className="py-32 px-4 bg-navyDark">
             <div className="container mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Choose the plan that fits your team&apos;s needs. Upgrade or downgrade at any time.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {plansWithPopularity.map((plan) => (
                        <div key={plan.id} className={plan.isPopular ? "scale-105 transform transition-transform duration-300 relative z-10" : ""}>
                            {plan.isPopular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple text-white text-xs font-bold px-3 py-1 rounded-full z-20 shadow-lg shadow-purple/20">
                                    MOST POPULAR
                                </div>
                            )}
                            <PlanCard 
                                {...plan} 
                                actionSlot={
                                    <Link href={AUTH_CLIENT_ROUTES.LOGIN} className="w-full mt-6 block">
                                        <Button 
                                            variant={'dark'}
                                            className='w-full'
                                        >
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
    )
}
