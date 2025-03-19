import pino from "pino";

const logLevel = process.env.LOG_LEVEL;

const logger = pino({
  level: logLevel,
  transport: {
    targets: [
      {
        target: "pino-pretty",
        level: "logLevel",
        options: {
          colorize: true,
        },
      },
    ],
  },
});

export default logger;
