import pino from "pino";
import { env } from "../env/env.config";

export const logger = pino({
  level: env.LOG_LEVEL,
  name: process.env.SERVICE_NAME ?? "portfolio-be",
  ...(env.NODE_ENV === "production"
    ? {
        timestamp: pino.stdTimeFunctions.isoTime
      }
    : {
        transport: {
          target: "pino-pretty",
          options: {
            translateTime: "yyyy-mm-dd HH:MM:ss",
            colorize: true
          }
        }
      })
});
