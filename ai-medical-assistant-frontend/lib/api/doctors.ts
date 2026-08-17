import api from "./client";
import type { Doctor, CreateDoctorPayload } from "@/types/doctor";

export const doctorsApi = {
  list: async () => {
    const response = await api.get<{ data: Doctor[] }>("/doctors");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<{ data: Doctor }>(`/doctors/${id}`);
    return response.data;
  },

  create: async (payload: CreateDoctorPayload) => {
    const response = await api.post<{ data: Doctor }>("/doctors", payload);
    return response.data;
  },

  updateAvailability: async (id: string, isAvailable: boolean) => {
    const response = await api.patch<{ data: Doctor }>(`/doctors/${id}/availability`, { isAvailable });
    return response.data;
  },
};
