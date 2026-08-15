import cron from "node-cron";
import { reminderProcessor } from "../services/reminders/reminder.processor";

export const startReminderJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await reminderProcessor.processDueReminders();
    } catch (error) {
      console.error(
        "Reminder job error:",
        error
      );
    }
  });

  console.log("Reminder scheduler started");
};