import { USER_API_ROUTES } from "@/constants/apiRoutes"
import api from "@/lib/api"
import { ChangePasswordData, GetAllUsersData, ToggleUserStatusData } from "@/types/IUserType"



export const userService = {
    getAllUsers:async(params:GetAllUsersData) => {
        return api.get(USER_API_ROUTES.GET_ALL_USER,{
            params:params
        })
    },
    toggleUserStatus:async (data:ToggleUserStatusData) => {
        return api.patch(USER_API_ROUTES.TOGGLE_USER_STATUS+`/${data.userId}/status`)
    },
    handleChangePassword:async (data:ChangePasswordData) => {
        return api.patch(USER_API_ROUTES.CHANGE_PASSWORD,{
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
        })
    },
    handleListActiveSessions:async () => {
        return api.get(USER_API_ROUTES.ACTIVE_SESSIONS)
    },
}