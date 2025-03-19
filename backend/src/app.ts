import express from "express";
import playerRoutes from "./routes/player.routes";
import scheduleRoutes from "./routes/schedule.routes";
import playerEngagementRoutes from "./routes/playerEngangement.routes";
import logger from "./utils/logger";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", playerRoutes);
app.use("/api", scheduleRoutes);
app.use("/api", playerEngagementRoutes);

app.listen(PORT, () => {
  logger.info(`Server started on port: ${PORT}`);
});
