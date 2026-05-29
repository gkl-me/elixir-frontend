import OnboardingHeader from "@/components/onboarding/OnboardingHeader"
import { USER_CLIENT_ROUTES } from "@/constants/clientRoutes"
import { handlerServerError } from "@/lib/authHelper"
import { AxiosErrorHandler } from "@/lib/errorHandler"
import { onboardingService } from "@/services/onboarding.service"
import { redirect } from "next/navigation"

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
})
{

  try {
    const res = await onboardingService.getUserOnboarding()
    if(res.data.data.onboarding.isCompleted && res.data.data.onboarding.paymentStatus === 'success'){
      redirect(USER_CLIENT_ROUTES.WORKSPACE)
    }

  } catch (error) {
    handlerServerError(error)
    throw new Error(AxiosErrorHandler(error).message)
  }

  return (
    <div className="min-h-screen bg-navyDark text-white flex flex-col relative">
      <OnboardingHeader />
      <main className="flex-1 container mx-auto py-24 px-4">
        {children}
      </main>
    </div>
  )
}
