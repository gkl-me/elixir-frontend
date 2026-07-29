import { AxiosErrorHandler } from "@/lib/errorHandler";
import { workspaceService } from "@/services/workspace.service";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    const search = searchParams.get("search") ?? "";
    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "9";

    if (!workspaceId) {
      return NextResponse.json(
        { success: false, message: "Workspace ID is required" },
        { status: 400 }
      );
    }

    const res = await workspaceService.getInvites({
      workspaceId,
      limit: parseInt(limit),
      page: parseInt(page),
      search
    });

    return NextResponse.json({
      success: res.data.success,
      data: res.data.data,
      message: res.data.message,
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
