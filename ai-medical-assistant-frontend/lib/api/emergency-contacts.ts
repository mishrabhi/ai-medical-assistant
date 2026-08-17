import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/auth";
import type {
  CreateEmergencyContactPayload,
  EmergencyContact,
  UpdateEmergencyContactPayload,
} from "@/types/emergency-contact";

export const emergencyContactsApi = {
  list: async () => {
    const response = await apiClient.get<ApiResponse<EmergencyContact[]>>(
      "/emergency-contacts",
    );

    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<EmergencyContact>>(
      `/emergency-contacts/${id}`,
    );

    return response.data;
  },

  create: async (payload: CreateEmergencyContactPayload) => {
    const response = await apiClient.post<ApiResponse<EmergencyContact>>(
      "/emergency-contacts",
      payload,
    );

    return response.data;
  },

  update: async (
    id: string,
    payload: UpdateEmergencyContactPayload,
  ) => {
    const response = await apiClient.patch<ApiResponse<EmergencyContact>>(
      `/emergency-contacts/${id}`,
      payload,
    );

    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/emergency-contacts/${id}`,
    );

    return response.data;
  },

  getEmergencyContacts: async () => {
    const response = await apiClient.get<ApiResponse<EmergencyContact[]>>(
      "/emergency-contacts/emergency",
    );

    return response.data;
  },
};