import { apiClient } from "@/lib/api/client";
import type { ApiResponse, AuthSuccessData, LoginPayload, RegisterPayload } from "@/types/auth";

export const authApi = {
  register: async (payload: RegisterPayload) => {
    const response = await apiClient.post<ApiResponse<AuthSuccessData>>("/auth/register", payload);
    return response.data;
  },

  login: async (payload: LoginPayload) => {
    const response = await apiClient.post<ApiResponse<AuthSuccessData>>("/auth/login", payload);
    return response.data;
  },

  me: async () => {
    const response = await apiClient.get<ApiResponse<any>>("/auth/me");
    return response.data;
  },

  refresh: async () => {
    const response = await apiClient.post<ApiResponse<{ accessToken: string }>>("/auth/refresh");
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post<ApiResponse<null>>("/auth/logout");
    return response.data;
  },
};
