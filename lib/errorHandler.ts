// lib/errorHandler.ts
import axios from "axios";

export function AxiosErrorHandler(error: unknown): {
  message: string;
  errorCode?: string;
  statusCode?: number;
} {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || "Request failed",
      errorCode: error.response?.data?.errorCode,
      statusCode: error.response?.status,
    };
  }

  return { message: "Something went wrong" };
}
