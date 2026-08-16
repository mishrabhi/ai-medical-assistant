"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { chatApi } from "@/lib/api/chat";

const CHAT_SESSIONS_QUERY_KEY = ["chat-sessions"];

export function useChatSessions() {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: CHAT_SESSIONS_QUERY_KEY,
    queryFn: chatApi.listSessions,
  });

  const createSessionMutation = useMutation({
    mutationFn: (title?: string) => chatApi.createSession(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_SESSIONS_QUERY_KEY });
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (sessionId: string) => chatApi.deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_SESSIONS_QUERY_KEY });
    },
  });

  return {
    listQuery,
    createSessionMutation,
    deleteSessionMutation,
  };
}

export function useChatSession(sessionId: string) {
  return useQuery({
    queryKey: ["chat-session", sessionId],
    queryFn: () => chatApi.getSession(sessionId),
    enabled: Boolean(sessionId),
  });
}

export function useChatMessages(sessionId: string) {
  return useQuery({
    queryKey: ["chat-messages", sessionId],
    queryFn: () => chatApi.getMessages(sessionId),
    enabled: Boolean(sessionId),
  });
}

export function useSendChatMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, message }: { sessionId: string; message: string }) =>
      chatApi.sendMessage(sessionId, { message }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chat-session", variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ["chat-messages", variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    },
  });
}
