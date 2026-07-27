"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes";

export default function CTABanner() {
  return (
    <section className="bg-navyDark px-4 py-20">
      <div className="container mx-auto">
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-purpleDark to-blueDark p-12 text-center shadow-2xl md:p-20">
          {/* Background glow effects */}
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-purple/30 blur-[80px] transition-colors duration-500 group-hover:bg-purple/40"></div>
          <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-600/20 blur-[80px]"></div>

          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
              Ready to Streamline Your Workflow?
            </h2>
            <p className="mb-10 text-lg leading-relaxed text-gray-200">
              Join thousands of teams who are shipping faster and more
              efficiently with Elixir. Start your free trial today.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href={AUTH_CLIENT_ROUTES.REGISTER}>
                <Button
                  size="lg"
                  className="bg-white px-8 py-6 text-lg font-bold text-purpleDark shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100 hover:shadow-2xl"
                >
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
