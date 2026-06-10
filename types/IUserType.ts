export interface GetAllUsersData {
  search?: string;
  status?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface ToggleUserStatusData {
  userId: string;
}

export interface ChangePasswordData {
  newPassword: string;
}

export interface UpdateUserProfileData {
  name?: string,
  jobTitle?: string,
  bio?: string,
  avatarUrl?: string
}
