import { AxiosErrorHandler } from "@/lib/errorHandler";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { workspaceSlug } = await req.json();

    const session = await getSession();
    session.hasWorkspace = true;
    session.workspaceSlug = workspaceSlug;
    await session.save();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    const err = AxiosErrorHandler(error);
    return NextResponse.json(
      {
        success: false,
        message: err.message,
        errorCode: err.errorCode,
      },
      {
        status: err.statusCode ?? 500,
      }
    );
  }
}
