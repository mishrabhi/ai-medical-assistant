import { reminderRepository } from "../../modules/reminders/reminder.repository";
import { notificationService } from "../../modules/notifications/notification.service";

class ReminderProcessor {
  async processDueReminders() {
    const reminders = await reminderRepository.findDueReminders();

    for (const reminder of reminders) {
      const claimed = await reminderRepository.claimDueReminder(
        reminder.id,
        reminder.userId,
      );

      if (claimed.count === 0) {
        continue;
      }

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

      if (reminder.repeatInterval === "CUSTOM") {
        // Custom recurrence is not implemented yet.
        // Keep the reminder paused rather than generating
        // duplicate notifications every minute.
        continue;
      }

      const nextScheduledFor = new Date(reminder.scheduledFor);

      if (reminder.repeatInterval === "DAILY") {
        nextScheduledFor.setDate(
          nextScheduledFor.getDate() + 1,
        );
      }

      if (reminder.repeatInterval === "WEEKLY") {
        nextScheduledFor.setDate(
          nextScheduledFor.getDate() + 7,
        );
      }

      if (reminder.repeatInterval === "MONTHLY") {
        nextScheduledFor.setMonth(
          nextScheduledFor.getMonth() + 1,
        );
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