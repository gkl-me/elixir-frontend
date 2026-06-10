"use server";

import { handlerServerError } from "@/lib/authHelper";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { userService } from "@/services/user.service";
import { UpdateUserProfileData } from "@/types/IUserType";

export async function toggleUserStatusAction(userId: string) {
  try {
    const res = await userService.toggleUserStatus({
      userId,
    });

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

export async function handleChangePassword(newPassword: string) {
  try {
    const res = await userService.handleChangePassword({
      newPassword,
    });

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
export async function handleUpdateProfile(data: UpdateUserProfileData) {
  try {
    const res = await userService.handleUpdateProfile(data);

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
