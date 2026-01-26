"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes";

export default function CTABanner() {
    return (
        <section className="py-20 px-4 bg-navyDark">
            <div className="container mx-auto">
                <div className="bg-gradient-to-r from-purpleDark to-blueDark rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl border border-white/10 group">
                    
                    {/* Background glow effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple/30 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-purple/40 transition-colors duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Ready to Streamline Your Workflow?
                        </h2>
                        <p className="text-gray-200 text-lg mb-10 leading-relaxed">
                            Join thousands of teams who are shipping faster and more efficiently with Elixir. Start your free trial today.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href={AUTH_CLIENT_ROUTES.REGISTER}>
                                <Button size="lg" className="bg-white text-purpleDark hover:bg-gray-100 font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                    Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
