export const dynamic = "force-dynamic";

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
    const res = await planService.getAllPlans({});
    plans = res.data.data.plans;
  } catch (error) {
    const err = AxiosErrorHandler(error);
    throw new Error(err.message);
  }

  return (
    <div className="min-h-screen bg-navyDark">
      <LandingHeader />

      <main className="flex flex-col items-center justify-center text-center">
        {/* Hero Section with Grid Background */}
        <GradientWithGrid>
          <section className="flex min-h-screen w-full flex-col items-center justify-center px-4 pb-12 pt-20 sm:pt-24">
            <h1 className="xs:text-4xl mb-6 mt-8 text-3xl font-extrabold leading-tight text-white drop-shadow-2xl sm:text-5xl md:text-7xl">
              Automated Project Management
            </h1>
            <p className="mb-10 max-w-2xl text-base leading-relaxed text-gray-300 md:text-xl">
              Streamline your workflow, automate tasks, and boost team
              productivity with our intelligent project management platform.
            </p>
            <div className="mb-16 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link href={AUTH_CLIENT_ROUTES.REGISTER}>
                <Button
                  size="lg"
                  className="w-full bg-purple px-8 text-white hover:bg-purple/90 sm:w-auto"
                >
                  Get Started
                </Button>
              </Link>
              <Link href={AUTH_CLIENT_ROUTES.LOGIN}>
                <Button
                  variant="white"
                  size="lg"
                  className="w-full px-8 sm:w-auto"
                >
                  Login
                </Button>
              </Link>
            </div>
            <div className="relative w-full max-w-5xl duration-700 animate-in fade-in slide-in-from-bottom-8">
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
