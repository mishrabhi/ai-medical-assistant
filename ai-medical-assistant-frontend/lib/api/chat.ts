import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/auth";
import type {
  ChatMessage,
  ChatSession,
  SendChatMessagePayload,
  SendChatMessageResponse,
} from "@/types/chat";

export const chatApi = {
  createSession: async (title?: string) => {
    const response = await apiClient.post<ApiResponse<ChatSession>>(
      "/chat/sessions",
      { title },
    );

    return response.data;
  },

  listSessions: async () => {
    const response =
      await apiClient.get<ApiResponse<ChatSession[]>>("/chat/sessions");

    return response.data;
  },

  getSession: async (sessionId: string) => {
    const response = await apiClient.get<ApiResponse<ChatSession>>(
      `/chat/sessions/${sessionId}`,
    );

    return response.data;
  },

  getMessages: async (sessionId: string) => {
    const response = await apiClient.get<ApiResponse<ChatMessage[]>>(
      `/chat/sessions/${sessionId}/messages`,
    );

    return response.data;
  },

  sendMessage: async (
    sessionId: string,
    payload: SendChatMessagePayload,
  ) => {
    const response = await apiClient.post<
      ApiResponse<SendChatMessageResponse>
    >(`/chat/sessions/${sessionId}/messages`, payload);

    return response.data;
  },

  archiveSession: async (sessionId: string) => {
    const response = await apiClient.patch<ApiResponse<null>>(
      `/chat/sessions/${sessionId}/archive`,
    );

    return response.data;
  },

  deleteSession: async (sessionId: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/chat/sessions/${sessionId}`,
    );

    return response.data;
  },
};