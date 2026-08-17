import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/auth";
import type {
  ChangePasswordPayload,
  UpdateProfilePayload,
  UserProfile,
} from "@/types/user";

export const usersApi = {
  getProfile: async () => {
    const response = await apiClient.get<ApiResponse<UserProfile>>("/users/me");
    return response.data;
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const response = await apiClient.patch<ApiResponse<UserProfile>>(
      "/users/me",
      payload,
    );

    return response.data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const response = await apiClient.patch<ApiResponse<null>>(
      "/users/change-password",
      payload,
    );

    return response.data;
  },

  updateAvatar: async (avatar: string) => {
    const response = await apiClient.patch<ApiResponse<UserProfile>>(
      "/users/avatar",
      { avatar },
    );

    return response.data;
  },

  deactivateAccount: async () => {
    const response = await apiClient.patch<ApiResponse<null>>(
      "/users/deactivate",
    );

    return response.data;
  },
};