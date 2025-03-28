import express from "express";
import playerRoutes from "./routes/player.routes";
import scheduleRoutes from "./routes/schedule.routes";
import playerEngagementRoutes from "./routes/playerEngangement.routes";
import { initializeDb, signOutFromDb } from "./dbClient";
import logger from "./utils/logger";

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  await initializeDb();
  app.use(express.json());
  app.use("/api", [playerRoutes, scheduleRoutes, playerEngagementRoutes]); // Combined routes

  app.listen(PORT, () => {
    logger.debug(`Server started on port: ${PORT}`);
  });
})();

process.on("SIGTERM", async () => {
  logger.debug("SIGTERM");
  await signOutFromDb();
  logger.debug("Successfully logged out.");
});

process.on("SIGINT", async () => {
  logger.debug("SIGINT");
  await signOutFromDb();
  logger.debug("Successfully logged out.");
});
