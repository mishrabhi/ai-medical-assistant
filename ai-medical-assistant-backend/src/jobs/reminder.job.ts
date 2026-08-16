import cron from "node-cron";
import { reminderProcessor } from "../services/reminders/reminder.processor";
import { logger } from "../utils/logger";

export const startReminderJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await reminderProcessor.processDueReminders();
    } catch (error) {
      logger.error("Reminder job failed", {
        error,
      });
    }
  });

  logger.info("Reminder scheduler started");
};
