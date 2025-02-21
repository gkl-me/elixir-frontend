import GradientWithGrid from "@/components/GradientGrid";
import HeroSection from "@/components/HeroSection";
import LandingHeader from "@/components/LandingHeader";

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
