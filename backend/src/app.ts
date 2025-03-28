import "./utils/loadEnvFile";
import express from "express";
import playerRoutes from "./routes/player.routes";
import scheduleRoutes from "./routes/schedule.routes";
import playerEngagementRoutes from "./routes/playerEngangement.routes";
import { initializeDb, signOutFromDb } from "./dbClient";
import logger from "./utils/logger";

const app = express();
const PORT = process.env.PORT || 3000;

let isShuttingDown = false;

logger.debug(`NODE_ENV = ${process.env.NODE_ENV}`);

(async () => {
  await initializeDb();
  app.use(express.json());
  app.use("/api", [playerRoutes, scheduleRoutes, playerEngagementRoutes]); // Combined routes

  app.listen(PORT, () => {
    logger.debug(`Server started on port: ${PORT}`);
  });
})();

process.on("SIGTERM", async () => {
  logger.debug("SIGTERM received.");
  await shutdownApp();
});

process.on("SIGINT", async () => {
  logger.debug("SIGINT received.");
  await shutdownApp();
});

async function shutdownApp() {
  if (isShuttingDown) {
    logger.debug("Already shutting down...");
    return;
  }

  isShuttingDown = true;
  logger.debug("Shutting down gracefully...");

  try {
    await signOutFromDb();
    logger.debug("Successfully logged out.");
  } catch (error) {
    logger.error("Error during logout:", error);
  } finally {
    process.exit(0);
  }
}
