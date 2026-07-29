import { AxiosErrorHandler } from "@/lib/errorHandler";
import { companyService } from "@/services/company.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") ?? "";
    const status = searchParams.get("status") ?? "";
    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "9";

    const res = await companyService.getAllCompany({
      search,
      limit,
      page,
      status,
    });

    return NextResponse.json({
      success: res.data.success,
      data: res.data.data,
      message: res.data.message,
    });
  } catch (error) {
    const err = AxiosErrorHandler(error);
    return NextResponse.json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
    });
  }
}
