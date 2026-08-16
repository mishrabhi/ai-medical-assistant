import Redis from "ioredis";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const redis = new Redis(env.REDIS_URL);

redis.on("connect", () => {
  logger.info("Redis connected");
});

redis.on("error", (err) => {
  logger.error("Redis connection error", {
    error: err,
  });
});

export default redis;