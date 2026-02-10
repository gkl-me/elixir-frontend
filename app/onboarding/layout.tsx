import OnboardingHeader from "@/components/onboarding/OnboardingHeader"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-navyDark text-white flex flex-col relative">
      <OnboardingHeader />
      <main className="flex-1 container mx-auto py-24 px-4">
        {children}
      </main>
    </div>
  )
}
