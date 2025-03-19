import PlayerEngagementService from "../services/playerEngagement.service";
import { PlayerEngagementData } from "../models/PlayerEngagement";
import logger from "../utils/logger";

const getPlayerEngagements = async (req, res): Promise<void> => {
  const playerEngagements =
    await PlayerEngagementService.getPlayerEngagements();
  res.json(playerEngagements);
};

const searchPlayerEngagementsByPlayerId = async (req, res): Promise<void> => {
  const playerEngagements =
    await PlayerEngagementService.searchPlayerEngagementsByPlayerId(
      req.params.playerId,
    );
  res.json(playerEngagements);
};

const searchPlayerEngagementByScheduleId = async (req, res): Promise<void> => {
  const playerEngagements =
    await PlayerEngagementService.searchPlayerEngagementsByScheduleId(
      req.params.scheduleId,
    );
  res.json(playerEngagements);
};

const updatePlayerEngagement = async (req, res): Promise<void> => {
  // TODO: give query param (id) and validate with req.body.id ???
  try {
    const playerEngagementDataIn: PlayerEngagementData = { ...req.body };
    logger.debug(`updated Engagement: ${playerEngagementDataIn}`);
    const result = await PlayerEngagementService.updatePlayerEngagement(
      playerEngagementDataIn,
    );

    logger.debug(`result updated engagement: ${result}`);

    if (result) {
      res.status(200).json(result);
    } else {
      res
        .status(404)
        .json({ message: "Error: Failed to update player engagement" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const addPlayerEngagement = async (req, res): Promise<void> => {
  try {
    const newPlayerEngagement =
      await PlayerEngagementService.addPlayerEngagement(req.body);
    res.status(201).json(newPlayerEngagement);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const addPlayerEngagementsBulk = async (req, res): Promise<void> => {
  try {
    const newPlayerEngagements =
      await PlayerEngagementService.addPlayerEngagementsBulk(req.body);
    res.status(201).json(newPlayerEngagements);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deletePlayerEngagement = async (req, res): Promise<void> => {
  const { id } = req.params;
  try {
    const deleted = await PlayerEngagementService.deletePlayerEngagement(id);
    logger.info(`player engagement deleted: ${deleted}`);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Player engagement not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateSquadProposal = async (req, res): Promise<void> => {
  try {
    const scheduleId = req.params.scheduleId;
    await PlayerEngagementService.generateSquadProposal(scheduleId);
    res
      .status(200)
      .json({ message: "Proposal successfully generated squad proposal" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const confirmProposal = async (req, res): Promise<void> => {
  try {
    const scheduleId = req.params.scheduleId;
    await PlayerEngagementService.setEngagementDefinitive(scheduleId);
    res.status(200).json({ message: "Participation confirmed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default {
  getPlayerEngagements,
  searchPlayerEngagementsByPlayerId,
  searchPlayerEngagementByScheduleId,
  updatePlayerEngagement,
  addPlayerEngagement,
  addPlayerEngagementsBulk,
  deletePlayerEngagement,
  generateSquadProposal,
  confirmProposal,
};
