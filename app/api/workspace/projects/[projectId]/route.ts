import { AxiosErrorHandler } from "@/lib/errorHandler";
import { projectService } from "@/services/project.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { success: false, message: "workspaceId is required" },
        { status: 400 }
      );
    }
    const res = await projectService.handleGetProjectDetails({
      workspaceId,
      projectId,
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
