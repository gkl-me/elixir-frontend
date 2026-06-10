import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_ROUTES } from "./constants/publicRoutes.";
import { getSession } from "./lib/session";
import { verifyAccessToken, verifyRefreshToken } from "./lib/tokenHandler";
import {
  ADMIN_CLIENT_ROUTES,
  AUTH_CLIENT_ROUTES,
  USER_CLIENT_ROUTES,
} from "./constants/clientRoutes";
import { AUTH_ERROR_CODE } from "./constants/errorCode";
import { getCookies } from "./lib/cookies";
import { refreshHandler } from "./lib/refreshHandler";
import {
  handleRefreshFailure,
  updateSessionAndCookies,
} from "./lib/authHelper";

const ADMIN_ROUTE = "/admin";

function isPublicRoutes(path: string) {
  return PUBLIC_ROUTES.some((p) => path.startsWith(p));
}

function redirect(url: string, req: NextRequest) {
  return NextResponse.redirect(new URL(url, req.url));
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const reason = req.nextUrl.searchParams.get("reason");
  const response = NextResponse.next();

  // console.log("middleware running")

  const session = await getSession();
  const accessToken = session?.accessToken;
  const refreshToken = await getCookies("refreshToken");
  const resetToken = await getCookies("reset_token");

  //verify token
  let accessPayload = await verifyAccessToken(accessToken);
  const refreshPayload = accessPayload
    ? null
    : await verifyRefreshToken(refreshToken);

  if (!accessPayload && refreshToken) {
    //get new access and refresh using helpers

    const data = await refreshHandler(refreshToken);

    accessPayload = await verifyAccessToken(session.accessToken);

    if (!data || !data?.success || !data?.data) {
      return handleRefreshFailure(req);
    }

    if (data) {
      //update session and token in cookies
      return await updateSessionAndCookies(
        req,
        session,
        data.accessToken,
        data.refreshToken
      );
    }
    //re verify accessToken
  }

  const user = accessPayload || refreshPayload;
  const isAuthenticated = Boolean(user);

  //reset password middleware
  if (pathname.startsWith(AUTH_CLIENT_ROUTES.RESET_PASSWORD)) {
    if (!resetToken) {
      return redirect(AUTH_CLIENT_ROUTES.FORGOT_PASSWORD, req);
    }
    return response;
  }

  //landing page routes

  if (pathname === "/") {
    return response;
  }

  //public routes
  if (isPublicRoutes(pathname)) {
    if (isAuthenticated && !reason) {
      if (user.role === "superAdmin") {
        return redirect(ADMIN_CLIENT_ROUTES.DASHBOARD, req);
      }

      if (session.hasWorkspace && session.workspaceSlug) {
        return redirect(
          USER_CLIENT_ROUTES.WORKSPACE + "/" + session.workspaceSlug,
          req
        );
      } else {
        return redirect(USER_CLIENT_ROUTES.ONBOARDING, req);
      }
    }
    return response;
  }

  // Invite routes handle their own auth check (redirect to /login?invite=TOKEN)
  if (pathname.startsWith("/invite/")) {
    return response;
  }

  //private routes
  if (!isAuthenticated && !isPublicRoutes(pathname)) {
    return redirect(
      AUTH_CLIENT_ROUTES.LOGIN + `?reason=${AUTH_ERROR_CODE.UNAUTHORIZED}`,
      req
    );
  }

  //admin routes
  if (pathname.startsWith(ADMIN_ROUTE)) {
    if (user.role !== "superAdmin") {
      if (session.hasWorkspace && session.workspaceSlug) {
        return redirect(
          USER_CLIENT_ROUTES.WORKSPACE + "/" + session.workspaceSlug,
          req
        );
      }

      return redirect(USER_CLIENT_ROUTES.ONBOARDING, req);
    }

    if (pathname === "/admin") {
      return redirect(ADMIN_CLIENT_ROUTES.DASHBOARD, req);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)).*)",
  ],
};
