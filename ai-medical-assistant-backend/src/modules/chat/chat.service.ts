import { aiService } from "../../services/ai/ai.service";
import { chatRepository } from "./chat.repository";
import { CreateChatSessionDTO, SendMessageDTO } from "./chat.types";

class ChatService {
  //create session
  async createSession(userId: string, data: CreateChatSessionDTO) {
    return chatRepository.createSession(userId, data.title);
  }

  //send-messages
  async sendMessage(userId: string, sessionId: string, data: SendMessageDTO) {
    const session = await chatRepository.findSessionById(sessionId, userId);

    if (!session) {
      throw new Error("Chat session not found.");
    }

    await chatRepository.createMessage(sessionId, "USER", data.message);

    if (!session.title) {
      const title =
        data.message.length > 50
          ? `${data.message.substring(0, 50)}...`
          : data.message;

      await chatRepository.updateSessionTitle(sessionId, userId, title);
    }

    const previousMessages = await chatRepository.getMessages(sessionId);

    const aiMessages = previousMessages.map((message) => ({
      role:
        message.role === "USER" ? ("user" as const) : ("assistant" as const),
      content: message.message,
    }));

    const aiResponse = await aiService.chat(aiMessages);

    const assistantMessage = await chatRepository.createMessage(
      sessionId,
      "ASSISTANT",
      aiResponse,
    );

    return {
      userMessage: data.message,
      assistantMessage: assistantMessage.message,
    };
  }

  //get-session by Id
  async getSessions(userId: string) {
    return chatRepository.findAllSessions(userId);
  }

  //get session by user and session Id
  async getSession(userId: string, sessionId: string) {
    const session = await chatRepository.findSessionWithMessages(
      sessionId,
      userId,
    );

    if (!session) {
      throw new Error("Chat session not found.");
    }

    return session;
  }

  //get messages
  async getMessages(userId: string, sessionId: string) {
    const session = await chatRepository.findSessionById(sessionId, userId);

    if (!session) {
      throw new Error("Chat session not found.");
    }

    return chatRepository.findMessages(sessionId);
  }

  //archive session
  async archiveSession(userId: string, sessionId: string) {
    const result = await chatRepository.archiveSession(sessionId, userId);

    if (result.count === 0) {
      throw new Error("Chat session not found.");
    }

    return {
      message: "Chat session archived successfully.",
    };
  }
  //delete session
  async deleteSession(userId: string, sessionId: string) {
    const result = await chatRepository.deleteSession(sessionId, userId);

    if (result.count === 0) {
      throw new Error("Chat session not found.");
    }

    return {
      message: "Chat session deleted successfully.",
    };
  }
}

export const chatService = new ChatService();
