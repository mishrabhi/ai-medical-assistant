import api from "./client";
import type {
  Appointment,
  CreateAppointmentPayload,
  UpdateAppointmentStatusPayload,
} from "@/types/appointment";

export const appointmentsApi = {
  list: async () => {
    const response = await api.get<{ data: Appointment[] }>("/appointments");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<{ data: Appointment }>(
      `/appointments/${id}`,
    );
    return response.data;
  },

  create: async (payload: CreateAppointmentPayload) => {
    const response = await api.post<{ data: Appointment }>(
      "/appointments",
      payload,
    );
    return response.data;
  },

  updateStatus: async (id: string, payload: UpdateAppointmentStatusPayload) => {
  const response = await api.patch<{ data: Appointment }>(
    `/appointments/${id}/status`,
    payload,
  );
  return response.data;
},

  delete: async (id: string) => {
  const response = await api.delete<{
    success: boolean;
    message: string;
  }>(`/appointments/${id}`);

  return response.data;
},
};
