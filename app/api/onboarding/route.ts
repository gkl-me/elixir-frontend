import { AxiosErrorHandler } from "@/lib/errorHandler";
import { onboardingService } from "@/services/onboarding.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await onboardingService.getUserOnboarding();

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
