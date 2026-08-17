import { reminderRepository } from "../../modules/reminders/reminder.repository";
import { notificationService } from "../../modules/notifications/notification.service";

class ReminderProcessor {
  async processDueReminders() {
    const reminders = await reminderRepository.findDueReminders();

    for (const reminder of reminders) {
      await notificationService.createReminderNotification(
        reminder.userId,
        reminder.title,
      );

      if (reminder.repeatInterval === "NONE") {
        await reminderRepository.updateStatus(
          reminder.id,
          reminder.userId,
          "COMPLETED",
        );

        continue;
      }

      // if (reminder.repeatInterval === "CUSTOM") {
      //   continue;
      // }

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

      await reminderRepository.updateScheduledFor(
        reminder.id,
        reminder.userId,
        nextScheduledFor,
      );
    }
  }
}

export const reminderProcessor = new ReminderProcessor();
