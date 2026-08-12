"use server";

import { handlerServerError } from "@/lib/authHelper";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { issueService } from "@/services/issue.service";
import { CreateBacklogIssueData } from "@/types/IIssueType";

export async function createIssueAction(data: CreateBacklogIssueData) {
  try {
    const res = await issueService.handleCreateBacklogIssue(data);
    return {
      success: res.data.success,
      message: res.data.message,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error).message,
    };
  }
}
