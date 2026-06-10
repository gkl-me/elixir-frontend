import { USER_API_ROUTES } from "@/constants/apiRoutes";
import api from "@/lib/api";
import {
  ChangePasswordData,
  GetAllUsersData,
  ToggleUserStatusData,
  UpdateUserProfileData,
} from "@/types/IUserType";

export const userService = {
  getAllUsers: async (params: GetAllUsersData) => {
    return api.get(USER_API_ROUTES.GET_ALL_USER, {
      params: params,
    });
  },
  toggleUserStatus: async (data: ToggleUserStatusData) => {
    return api.patch(
      USER_API_ROUTES.TOGGLE_USER_STATUS + `/${data.userId}/status`
    );
  },
  handleChangePassword: async (data: ChangePasswordData) => {
    return api.patch(USER_API_ROUTES.CHANGE_PASSWORD, {
      newPassword: data.newPassword,
    });
  },
  handleListActiveSessions: async () => {
    return api.get(USER_API_ROUTES.ACTIVE_SESSIONS);
  },
  handleGetMe: async () => {
    return api.get(USER_API_ROUTES.GET_ME);
  },
  handleUpdateProfile: async (data: UpdateUserProfileData) => {
    return api.put(USER_API_ROUTES.UPDATE_PROFILE, data);
  },
};
