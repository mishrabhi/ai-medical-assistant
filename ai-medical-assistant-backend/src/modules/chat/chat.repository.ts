import { prisma } from "../../lib/prisma";

class ChatRepository {
  //create session
  async createSession(userId: string, title?: string) {
    return prisma.chatSession.create({
      data: {
        userId,
        title,
      },
    });
  }

  //find session by session Id
  async findSessionById(sessionId: string, userId: string) {
    return prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
    });
  }

  //create-messages
  async createMessage(
    sessionId: string,
    role: "USER" | "ASSISTANT",
    message: string,
  ) {
    return prisma.chatMessage.create({
      data: {
        sessionId,
        role,
        message,
      },
    });
  }

  //get messages
  async getMessages(sessionId: string) {
    return prisma.chatMessage.findMany({
      where: {
        sessionId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  //find all sessions
  async findAllSessions(userId: string) {
    return prisma.chatSession.findMany({
      where: {
        userId,
        isArchived: false,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  //find session with messages
  async findSessionWithMessages(sessionId: string, userId: string) {
    return prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  //find messages
  async findMessages(sessionId: string) {
    return prisma.chatMessage.findMany({
      where: {
        sessionId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  //update-session-title
  async updateSessionTitle(sessionId: string, userId: string, title: string) {
    return prisma.chatSession.updateMany({
      where: {
        id: sessionId,
        userId,
      },
      data: {
        title,
      },
    });
  }

  //archive session
  async archiveSession(sessionId: string, userId: string) {
    return prisma.chatSession.updateMany({
      where: {
        id: sessionId,
        userId,
      },
      data: {
        isArchived: true,
      },
    });
  }
  //delete session
  async deleteSession(sessionId: string, userId: string) {
    return prisma.chatSession.deleteMany({
      where: {
        id: sessionId,
        userId,
      },
    });
  }
}

export const chatRepository = new ChatRepository();
