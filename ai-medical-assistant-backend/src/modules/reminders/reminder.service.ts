import { reminderRepository } from "./reminder.repository";
import { CreateReminderDTO, UpdateReminderDTO } from "./reminder.types";

class ReminderService {
  //create reminder
  async createReminder(userId: string, data: CreateReminderDTO) {
    const scheduledFor = new Date(data.scheduledFor);

    if (scheduledFor <= new Date()) {
      throw new Error("Reminder time must be in the future.");
    }

    return reminderRepository.create(userId, data);
  }

  async getReminders(userId: string) {
    return reminderRepository.findAllByUser(userId);
  }

  //get reminder by id
  async getReminderById(id: string, userId: string) {
    const reminder = await reminderRepository.findById(id, userId);

    if (!reminder) {
      throw new Error("Reminder not found.");
    }

    return reminder;
  }

  //update reminder
  async updateReminder(id: string, userId: string, data: UpdateReminderDTO) {
    const reminder = await reminderRepository.findById(id, userId);

    if (!reminder) {
      throw new Error("Reminder not found.");
    }

    if (data.scheduledFor) {
      const scheduledFor = new Date(data.scheduledFor);

      if (scheduledFor <= new Date()) {
        throw new Error("Reminder time must be in the future.");
      }
    }

    await reminderRepository.update(id, userId, data);

    return reminderRepository.findById(id, userId);
  }

  //delete reminder
  async deleteReminder(id: string, userId: string) {
    const result = await reminderRepository.delete(id, userId);

    if (result.count === 0) {
      throw new Error("Reminder not found.");
    }

    return {
      message: "Reminder deleted successfully.",
    };
  }

  //update status
  async updateStatus(
    id: string,
    userId: string,
    status: "ACTIVE" | "PAUSED" | "COMPLETED",
  ) {
    const reminder = await reminderRepository.findById(id, userId);

    if (!reminder) {
      throw new Error("Reminder not found.");
    }

    if (reminder.status === "COMPLETED") {
      throw new Error("Completed reminder cannot be updated.");
    }

    await reminderRepository.updateStatus(id, userId, status);

    return reminderRepository.findById(id, userId);
  }

  //complete reminder
  async completeReminder(id: string, userId: string) {
    const reminder = await reminderRepository.findById(id, userId);

    if (!reminder) {
      throw new Error("Reminder not found.");
    }

    if (reminder.status === "COMPLETED") {
      throw new Error("Reminder is already completed.");
    }

    if (reminder.repeatInterval === "NONE") {
      await reminderRepository.updateStatus(id, userId, "COMPLETED");

      return reminderRepository.findById(id, userId);
    }

    if (reminder.repeatInterval === "CUSTOM") {
      throw new Error("Custom repeat interval is not supported yet.");
    }

    const nextScheduledFor = new Date(reminder.scheduledFor);

    if (reminder.repeatInterval === "DAILY") {
      nextScheduledFor.setDate(nextScheduledFor.getDate() + 1);
    }

    if (reminder.repeatInterval === "WEEKLY") {
      nextScheduledFor.setDate(nextScheduledFor.getDate() + 7);
    }

    if (reminder.repeatInterval === "MONTHLY") {
      nextScheduledFor.setMonth(nextScheduledFor.getMonth() + 1);
    }

    await reminderRepository.updateScheduledFor(id, userId, nextScheduledFor);

    return reminderRepository.findById(id, userId);
  }
}

export const reminderService = new ReminderService();
