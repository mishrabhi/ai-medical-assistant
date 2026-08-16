import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/auth";
import type { SymptomCheck, SymptomCheckInput } from "@/types/symptom";

export const symptomsApi = {
  list: async () => {
    const response = await apiClient.get<ApiResponse<SymptomCheck[]>>("/symptoms");
    return response.data;
  },

  check: async (payload: SymptomCheckInput) => {
    const response = await apiClient.post<ApiResponse<SymptomCheck>>("/symptoms/check", payload);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<SymptomCheck>>(`/symptoms/${id}`);
    return response.data;
  },

  remove: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/symptoms/${id}`);
    return response.data;
  },
};
