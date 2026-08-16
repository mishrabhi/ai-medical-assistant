export type ChatMessageRole = "USER" | "ASSISTANT";

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: ChatMessageRole;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title?: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  messages?: ChatMessage[];
}

export interface CreateChatSessionPayload {
  title?: string;
}

export interface SendChatMessagePayload {
  message: string;
}

export interface SendChatMessageResponse {
  userMessage: string;
  assistantMessage: string;
}
