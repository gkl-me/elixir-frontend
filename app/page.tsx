import GradientWithGrid from "@/components/landing/GradientWithGrid";
import LandingHeader from "@/components/landing/LandingHeader";
import CodeDesign from "@/components/landing/CodeDesign";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FeaturesSection from "@/components/landing/FeaturesSection";
import AutomationSection from "@/components/landing/AutomationSection";
import PricingSection from "@/components/landing/PricingSection";

import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";
import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { planService } from "@/services/plan.service";

export default async function Home() {

  let plans;
  try {
    const res = await planService.getAllPlans()
    plans = res.data.data.plans
  } catch (error) {
    const err = AxiosErrorHandler(error)
    throw new Error(err.message)
  }

  return (
    <div className="bg-navyDark min-h-screen">
      <LandingHeader />
      
      <main className="flex flex-col items-center justify-center text-center">
        {/* Hero Section with Grid Background */}
        <GradientWithGrid>
            <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 sm:pt-24 pb-12 w-full">
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl mt-8">
                Automated Project Management
                </h1>
                <p className="text-base md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
                Streamline your workflow, automate tasks, and boost team productivity
                with our intelligent project management platform.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
                <Link href={AUTH_CLIENT_ROUTES.REGISTER}>
                    <Button size="lg" className="bg-purple hover:bg-purple/90 text-white w-full sm:w-auto px-8">Get Started</Button>
                </Link>
                <Link href={AUTH_CLIENT_ROUTES.LOGIN}>
                    <Button variant="white" size="lg" className="w-full sm:w-auto px-8">Login</Button>
                </Link>
                </div>
                <div className="relative animate-in fade-in slide-in-from-bottom-8 duration-700 w-full max-w-5xl">
                <CodeDesign />
                </div>
            </section>
        </GradientWithGrid>

        {/* Features Section */}
        <FeaturesSection />

        {/* Automation Section */}
        <AutomationSection />

        {/* Pricing Section */}
        <PricingSection plans={plans} />

        {/* CTA Banner */}
        <CTABanner />



      </main>
      <Footer />
    </div>
  );
}
