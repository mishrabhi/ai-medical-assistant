import { env } from "../config/env";

const formatMessage = (level: string, message: string, meta?: unknown) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta !== undefined ? { meta } : {}),
  });
};

export const logger = {
  info(message: string, meta?: unknown) {
    console.log(formatMessage("info", message, meta));
  },

  warn(message: string, meta?: unknown) {
    console.warn(formatMessage("warn", message, meta));
  },

  error(message: string, meta?: unknown) {
    console.error(formatMessage("error", message, meta));
  },

  debug(message: string, meta?: unknown) {
    if (env.NODE_ENV !== "production") {
      console.debug(formatMessage("debug", message, meta));
    }
  },
};
