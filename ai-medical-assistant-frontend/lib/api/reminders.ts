import api from "./client";
import type {
  Reminder,
  CreateReminderPayload,
  UpdateReminderPayload,
  ReminderStatus,
} from "@/types/reminder";

export const remindersApi = {
  list: async () => {
    const response = await api.get<{ data: Reminder[] }>("/reminders");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<{ data: Reminder }>(`/reminders/${id}`);
    return response.data;
  },

  create: async (payload: CreateReminderPayload) => {
    const response = await api.post<{ data: Reminder }>("/reminders", payload);
    return response.data;
  },

  update: async (id: string, payload: UpdateReminderPayload) => {
    const response = await api.patch<{ data: Reminder }>(
      `/reminders/${id}`,
      payload,
    );
    return response.data;
  },

  updateStatus: async (id: string, status: ReminderStatus) => {
    const response = await api.patch<{ data: Reminder }>(
      `/reminders/${id}/status`,
      { status },
    );

    return response.data;
  },

  complete: async (id: string) => {
    const response = await api.patch<{ data: Reminder }>(
      `/reminders/${id}/complete`,
    );

    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<{ data: Reminder }>(`/reminders/${id}`);
    return response.data;
  },
};
