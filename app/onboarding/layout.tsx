export const dynamic = "force-dynamic";

import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import { USER_CLIENT_ROUTES } from "@/constants/clientRoutes";
import { handlerServerError } from "@/lib/authHelper";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { onboardingService } from "@/services/onboarding.service";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const res = await onboardingService.getUserOnboarding();

    if (
      res.data.data.onboarding.isCompleted &&
      res.data.data.onboarding.paymentStatus !== "success"
    ) {
      redirect(USER_CLIENT_ROUTES.PAYMENT_VERIFY);
    }

    if (
      res.data.data.onboarding.isCompleted &&
      res.data.data.onboarding.paymentStatus === "success" &&
      res.data.data.onboarding.workspaceSlug
    ) {
      redirect(
        USER_CLIENT_ROUTES.WORKSPACE +
          "/" +
          res.data.data.onboarding.workspaceSlug
      );
    }
  } catch (error) {
    handlerServerError(error);
    throw new Error(AxiosErrorHandler(error).message);
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-navyDark text-white">
      <OnboardingHeader />
      <main className="container mx-auto flex-1 px-4 py-24">{children}</main>
    </div>
  );
}
