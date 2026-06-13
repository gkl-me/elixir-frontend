export const dynamic = "force-dynamic";

import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes";
import { handlerServerError } from "@/lib/authHelper";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { sleep } from "@/lib/helper";
import { authService } from "@/services/auth.service";
import { redirect } from "next/navigation";

export default async function VerifyPage({
  params,
  searchParams,
}: {
  params: Promise<{slug:string}>
  searchParams: Promise<{ email?: string }>;
}) {
  const { slug } = await params;
  const { email } = await searchParams;

  try {
    await authService.verifyEmail({ email, token: slug });
    await sleep(3000);
    redirect(AUTH_CLIENT_ROUTES.LOGIN);
  } catch (error) {
    handlerServerError(error);
    const err = AxiosErrorHandler(error);
    throw new Error(err.message);
  }
}
