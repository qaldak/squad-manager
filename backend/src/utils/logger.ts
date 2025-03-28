import pino from "pino";

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

logger.debug(`loglevel set to '${logLevel}'`);

export default logger;
