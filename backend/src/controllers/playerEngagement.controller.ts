import playerEngagementsData from "../../tests/__mocks__/mock.playerEngagement";
import playerEngagementService from "../services/playerEngagement.service";

const getPlayerEngagements = async (req, res): Promise<void> => {
  const playerEngagements = playerEngagementsData.getPlayerEngagements();
  res.json(playerEngagements);
};

const readPlayerEngagement = async (req, res): Promise<void> => {
  const playerEngagement = playerEngagementsData.readPlayerEngagement(
    req.params.playerId,
    req.params.scheduleId
  );
  res.json(playerEngagement);
};

const findPlayerEngagementsByPlayerId = async (req, res): Promise<void> => {
  const playerEngagements = playerEngagementsData.findPlayerEngagementsByPlayer(
    req.params.playerId
  );
  res.json(playerEngagements);
};

const findPlayerEngagementByScheduleId = async (req, res): Promise<void> => {
  const playerEngagements =
    playerEngagementsData.findPlayerEngagementBySchedule(req.params.scheduleId);
  res.json(playerEngagements);
};

const updatePlayerEngagement = async (req, res): Promise<void> => {
  const { playerId, scheduleId } = req.params;
  const engagement = playerEngagementsData.readPlayerEngagement(
    playerId,
    scheduleId
  );

  try {
    const updatedEngagement = { ...engagement, ...req.body };
    const result = await playerEngagementService.updatePlayerEngagement(
      updatedEngagement
    );

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Player engagement not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const addPlayerEngagement = async (req, res): Promise<void> => {
  try {
    const newPlayerEngagement =
      await playerEngagementService.addPlayerEngagement(req.body);
    res.status(201).json(newPlayerEngagement);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const addPlayerEngagementsBulk = async (req, res): Promise<void> => {
  try {
    const newPlayerEngagements =
      await playerEngagementService.addPlayerEngagementsBulk(req.body);
    res.status(201).json(newPlayerEngagements);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deletePlayerEngagement = async (req, res): Promise<void> => {
  const { playerId, scheduleId } = req.params;
  try {
    const deleted = await playerEngagementService.deletePlayerEngagement(playerId, scheduleId);
    if (deleted) {
      res.status(200).json({ message: "Player engagement deleted successfully" });
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
    await playerEngagementService.generateSquadProposal(scheduleId)
    res.status(200).json({ message: "Proposal successfully generated squad proposal" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


export default {
  getPlayerEngagements,
  readPlayerEngagement,
  findPlayerEngagementsByPlayerId,
  findPlayerEngagementByScheduleId,
  updatePlayerEngagement,
  addPlayerEngagement,
  addPlayerEngagementsBulk,
  deletePlayerEngagement,
  generateSquadProposal
};
