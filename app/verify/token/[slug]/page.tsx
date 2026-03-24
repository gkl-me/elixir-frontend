import { AUTH_CLIENT_ROUTES } from "@/constants/clientRoutes";
import { handlerServerError } from "@/lib/authHelper";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { sleep } from "@/lib/helper";
import { authService } from "@/services/auth.service";
import { redirect } from "next/navigation";


type PageProps = {
  params: {
    slug: string;
  };
  searchParams: {
    email?: string;
  };
};

export default async function VerifyPage({
  params,
  searchParams
}:PageProps) {

  const { slug } = params;
const { email } = searchParams;


  try {

    await authService.verifyEmail({email,token:slug})
    await sleep(3000)
    redirect(AUTH_CLIENT_ROUTES.LOGIN)

  } catch (error) {
    handlerServerError(error)
    const err = AxiosErrorHandler(error)
    throw new Error(err.message)
  }
}
