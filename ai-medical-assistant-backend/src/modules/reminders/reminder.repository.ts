import { prisma } from "../../lib/prisma";
import { CreateReminderDTO, UpdateReminderDTO } from "./reminder.types";

class ReminderRepository {
  //create reminder
  async create(userId: string, data: CreateReminderDTO) {
    return prisma.reminder.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        scheduledFor: new Date(data.scheduledFor),
        repeatInterval: data.repeatInterval ?? "NONE",
      },
    });
  }

  //find all reminder by user
  async findAllByUser(userId: string) {
    return prisma.reminder.findMany({
      where: {
        userId,
      },
      orderBy: {
        scheduledFor: "asc",
      },
    });
  }

  //find reminder by id
  async findById(id: string, userId: string) {
    return prisma.reminder.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  //update reminder
  async update(id: string, userId: string, data: UpdateReminderDTO) {
    return prisma.reminder.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        ...(data.title !== undefined && {
          title: data.title,
        }),

        ...(data.description !== undefined && {
          description: data.description,
        }),

        ...(data.scheduledFor !== undefined && {
          scheduledFor: new Date(data.scheduledFor),
        }),

        ...(data.repeatInterval !== undefined && {
          repeatInterval: data.repeatInterval,
        }),
      },
    });
  }

  //delete reminder
  async delete(id: string, userId: string) {
    return prisma.reminder.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }

  //update status
  async updateStatus(
    id: string,
    userId: string,
    status: "ACTIVE" | "PAUSED" | "COMPLETED",
  ) {
    return prisma.reminder.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        status,
      },
    });
  }

  //update scheduled for
  async updateScheduledFor(id: string, userId: string, scheduledFor: Date) {
    return prisma.reminder.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        scheduledFor,
        status: "ACTIVE",
      },
    });
  }

  //find due reminders
  async findDueReminders() {
    return prisma.reminder.findMany({
      where: {
        status: "ACTIVE",
        scheduledFor: {
          lte: new Date(),
        },
      },
    });
  }
}

export const reminderRepository = new ReminderRepository();
