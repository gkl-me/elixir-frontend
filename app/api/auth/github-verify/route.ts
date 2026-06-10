import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { setCookies } from "@/lib/cookies";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_CLIENT_ROUTES,
  USER_CLIENT_ROUTES,
} from "@/constants/clientRoutes";
import { AUTH_ERROR_CODE } from "@/constants/errorCode";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.redirect(
      new URL(
        AUTH_CLIENT_ROUTES.LOGIN + `?reason=${AUTH_ERROR_CODE.SESSION_EXPIRED}`,
        req.url
      )
    );
  }

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  allCookies.forEach((c) => {
    cookieStore.delete(c.name);
  });

  // save iron session
  const ironSession = await getSession();
  ironSession.accessToken = session.accessToken;
  ironSession.hasWorkspace = session.hasWorkspace;
  ironSession.workspaceSlug = session.workspaceSlug;
  await ironSession.save();

  // set refresh cookie
  setCookies(session.refreshToken);

  const inviteToken = req.nextUrl.searchParams.get("invite");
  if (inviteToken) {
    return NextResponse.redirect(new URL(`/invite/${inviteToken}`, req.url));
  }

  return NextResponse.redirect(
    new URL(
      USER_CLIENT_ROUTES.WORKSPACE + "/" + session.workspaceSlug,
      req.url
    )
  );
}
