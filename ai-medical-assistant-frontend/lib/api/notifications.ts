import api from "./client";
import type { Notification } from "@/types/notification";

interface NotificationActionResponse {
  success: boolean;
  message: string;
}

export const notificationsApi = {
  list: async () => {
    const response = await api.get<{ data: Notification[] }>(
      "/notifications",
    );

    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.patch<NotificationActionResponse>(
      `/notifications/${id}/read`,
      {},
    );

    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch<NotificationActionResponse>(
      "/notifications/read-all",
      {},
    );

    return response.data;
  },
};