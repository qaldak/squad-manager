import pino from "pino";
import dotenv from "dotenv";

dotenv.config();

const logLevel = process.env.LOG_LEVEL || "warn";

const logger = pino({
  level: logLevel,
  transport: {
    targets: [
      {
        target: "pino-pretty",
        level: logLevel,
        options: {
          colorize: true,
        },
      },
    ],
  },
});

export default logger;
