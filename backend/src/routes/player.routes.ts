import express from "express";
import playerController from "../controllers/player.controller";

const router = express.Router();

router.get("/players", playerController.getPlayers);
router.post("/players", playerController.addPlayer);
router.get("/players/:id", playerController.readPlayer);
router.put("/players/:id", playerController.updatePlayer);

export default router;
