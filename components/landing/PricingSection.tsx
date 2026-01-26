"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes";

// Reusing the structure and styles of PlanCard but tailored for landing page (no edit/switch controls)
function LandingPlanCard({ name, price, limits, features, isPopular }: any) {
    return (
        <Card className={`relative overflow-hidden border transition-all duration-300 flex flex-col h-full ${isPopular ? 'bg-navy border-purple shadow-lg shadow-purple/20 scale-105' : 'bg-navyDark border-white/10 hover:border-purple/50'}`}>
            {isPopular && (
                <div className="absolute top-0 right-0 bg-purple text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                </div>
            )}
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-white text-2xl font-bold">{name}</CardTitle>
                <div className="flex items-center justify-center pt-2">
                    <span className="text-4xl font-bold text-white">${price / 100}</span>
                    <span className="text-gray-400 ml-1 text-sm">/month</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-4 flex-grow">
                {/* Unified Features List */}
                <div className="space-y-4">
                    {[
                        limits.maxProjects ? `${limits.maxProjects} Projects` : 'Unlimited Projects',
                        limits.maxTeams ? `${limits.maxTeams} Teams` : 'Unlimited Teams',
                        limits.maxUsersPerTeam ? `${limits.maxUsersPerTeam} Users per Team` : 'Unlimited Users',
                        ...features
                    ].map((feature, idx) => {
                         // Check if feature string itself indicates a negative (though usually X is for missing features in comparison)
                         // For landing page, we usually list what IS included.
                         // But reusing the logic from admin:
                        const isNegative = feature.toString().startsWith("No ");
                        return (
                            <div key={idx} className="flex items-start text-sm font-medium leading-tight">
                                {isNegative ? (
                                    <X className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                                ) : (
                                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                                )}
                                <span className={isNegative ? "text-gray-500" : "text-gray-300"}>{feature}</span>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
            <CardFooter>
                 <Link href={AUTH_CLIENT_ROUTES.LOGIN} className="w-full">
                    <Button variant={isPopular ? "default" : "outline"} className={`w-full ${isPopular ? 'bg-purple hover:bg-purpleDark text-white' : 'border-purple text-purple hover:bg-purple hover:text-white'}`}>
                        Choose {name}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}

export default function PricingSection() {
    const plans = [
        {
            id: "plan_free",
            name: "Free",
            price: 0,
            limits: {
                maxProjects: 5,
                maxTeams: 2,
                maxUsersPerTeam: 10
            },
            features: [
                "Personal Workspace",
                "Limit in members", 
                "Limits in projects",
                "No Automation",
                "No GitHub Integration",
                "100MB Storage"
            ],
            isPopular: false
        },
        {
            id: "plan_pro",
            name: "Pro",
            price: 1500, 
            limits: {
                maxProjects: 50,
                maxTeams: 10,
                maxUsersPerTeam: 50
            },
            features: [
                "Automation Scripts",
                "GitHub Integration",
                "Better Limits",
                "Custom Roles (Limited)",
                "Default Roles",
                "Everything in Free"
            ],
            isPopular: true
        },
        {
            id: "plan_enterprise",
            name: "Enterprise",
            price: 4900,
            limits: {
                // Undefined means Unlimited
            },
            features: [
                "Custom Domain",
                "Custom Roles (Unlimited)",
                "Priority Support",
                "SSO Integration",
                "Everything in Pro"
            ],
            isPopular: false
        }
    ]

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
                    {plans.map((plan) => (
                        <LandingPlanCard key={plan.id} {...plan} />
                    ))}
                </div>
             </div>
        </section>
    )
}
