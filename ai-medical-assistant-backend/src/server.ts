import app from "./app";
import { env } from "./config/env";
import { startReminderJob } from "./jobs/reminder.job";
import { logger } from "./utils/logger";

app.listen(env.PORT, () => {
  logger.info("Server started", {
    port: env.PORT,
    environment: env.NODE_ENV,
  });
  startReminderJob();
});
