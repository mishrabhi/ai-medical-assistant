import api from "./client";
import type {
  CreateDoctorPayload,
  Doctor,
  UpdateDoctorPayload,
} from "@/types/doctor";

export interface AdminDashboardStats {
  users: {
    total: number;
    active: number;
  };
  doctors: {
    total: number;
    available: number;
  };
  appointments: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  medicalReports: number;
  symptomChecks: number;
}

export const adminApi = {
  getDashboard: async () => {
    const response = await api.get<{ data: AdminDashboardStats }>(
      "/admin/dashboard",
    );

    return response.data;
  },

  listDoctors: async () => {
    const response = await api.get<{ data: Doctor[] }>("/doctors");

    return response.data;
  },

  createDoctor: async (payload: CreateDoctorPayload) => {
    const response = await api.post<{ data: Doctor }>(
      "/admin/doctors",
      payload,
    );

    return response.data;
  },

  updateDoctor: async (
    id: string,
    payload: UpdateDoctorPayload,
  ) => {
    const response = await api.patch<{ data: Doctor }>(
      `/admin/doctors/${id}`,
      payload,
    );

    return response.data;
  },

  deleteDoctor: async (id: string) => {
    const response = await api.delete<{ message: string }>(
      `/admin/doctors/${id}`,
    );

    return response.data;
  },

  updateDoctorAvailability: async (
    id: string,
    isAvailable: boolean,
  ) => {
    const response = await api.patch<{ data: Doctor }>(
      `/admin/doctors/${id}/availability`,
      { isAvailable },
    );

    return response.data;
  },
};