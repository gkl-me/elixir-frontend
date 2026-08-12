"use server";

import { handlerServerError } from "@/lib/authHelper";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { companyService } from "@/services/company.service";

export async function toggleCompanyStatusAction(companyId: string) {
  try {
    const res = await companyService.toggleCompanyStatus({
      companyId,
    });

    return {
      success: res.data.success,
      message: res.data.message,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error),
    };
  }
}
