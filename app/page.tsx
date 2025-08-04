import GradientWithGrid from "@/components/landing/GradientGrid";
import HeroSection from "@/components/landing/HeroSection";
import LandingHeader from "@/components/landing/LandingHeader";

export default function LandingPage() {
  return (
    <>
    <GradientWithGrid>
      <LandingHeader />
      <div className="pt-20">
        <HeroSection/>
      </div>
    </GradientWithGrid>
    </>
  );
}
