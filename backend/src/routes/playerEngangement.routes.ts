import express from "express";
import playerEngagementController from "../controllers/playerEngagement.controller";

const router = express.Router();

router.get(
  "/playerEngagements",
  playerEngagementController.getPlayerEngagements
);
router.get(
  "/playerEngagement/:playerId/:scheduleId",
  playerEngagementController.readPlayerEngagement
);
router.get(
  "/playerEngagements/player/:playerId",
  playerEngagementController.searchPlayerEngagementsByPlayerId
);

router.get(
  "/playerEngagements/schedule/:scheduleId",
  playerEngagementController.searchPlayerEngagementByScheduleId
);

router.put(
  "/playerEngagement/:playerId/:scheduleId",
  playerEngagementController.updatePlayerEngagement
);

router.post(
  "/playerEngagement",
  playerEngagementController.addPlayerEngagement
);

router.post(
  "/playerEngagements/bulk",
  playerEngagementController.addPlayerEngagementsBulk
);

router.delete(
  "/playerEngagement/:playerId/:scheduleId", 
  playerEngagementController.deletePlayerEngagement
)

router.post(
    "/playerEngagements/proposal/:scheduleId",
    playerEngagementController.generateSquadProposal
)

router.patch(
    "/playerEngagements/confirmProposal/:scheduleId",
    playerEngagementController.confirmProposal
)

export default router;
