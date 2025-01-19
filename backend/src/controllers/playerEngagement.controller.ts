import PlayerEngagementService from "../services/playerEngagement.service";

const getPlayerEngagements = async (req, res): Promise<void> => {
  const playerEngagements = await PlayerEngagementService.getPlayerEngagements()
  res.json(playerEngagements);
};

const readPlayerEngagement = async (req, res): Promise<void> => {
  const playerEngagement = await PlayerEngagementService.readPlayerEngagement(
    req.params.playerId,
    req.params.scheduleId
  );
  res.json(playerEngagement);
};

const searchPlayerEngagementsByPlayerId = async (req, res): Promise<void> => {
  const playerEngagements = await PlayerEngagementService.searchPlayerEngagementsByPlayerId(
    req.params.playerId
  );
  res.json(playerEngagements);
};

const searchPlayerEngagementByScheduleId = async (req, res): Promise<void> => {
  const playerEngagements = await PlayerEngagementService.searchPlayerEngagementsByScheduleId(req.params.scheduleId);
  res.json(playerEngagements);
};

const updatePlayerEngagement = async (req, res): Promise<void> => {
  const { playerId, scheduleId } = req.params;
  const engagement = await PlayerEngagementService.readPlayerEngagement(
    playerId,
    scheduleId
  );

  try {
    const updatedEngagement = { ...engagement, ...req.body };
    const result = await PlayerEngagementService.updatePlayerEngagement(
      updatedEngagement
    );

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Player engagement not found" });
    }
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

const addPlayerEngagement = async (req, res): Promise<void> => {
  try {
    const newPlayerEngagement =
      await PlayerEngagementService.addPlayerEngagement(req.body);
    res.status(201).json(newPlayerEngagement);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

const addPlayerEngagementsBulk = async (req, res): Promise<void> => {
  try {
    const newPlayerEngagements =
      await PlayerEngagementService.addPlayerEngagementsBulk(req.body);
    res.status(201).json(newPlayerEngagements);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

const deletePlayerEngagement = async (req, res): Promise<void> => {
  const { playerId, scheduleId } = req.params;
  try {
    const deleted = await PlayerEngagementService.deletePlayerEngagement(playerId, scheduleId);
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
    await PlayerEngagementService.generateSquadProposal(scheduleId)
    res.status(200).json({ message: "Proposal successfully generated squad proposal" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

const confirmProposal = async (req, res): Promise<void> => {
  try {
    const scheduleId = req.params.scheduleId;
    await PlayerEngagementService.setEngagementDefinitive(scheduleId)
    res.status(200).json({ message: "Participation confirmed" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}


export default {
  getPlayerEngagements,
  readPlayerEngagement,
  searchPlayerEngagementsByPlayerId,
  searchPlayerEngagementByScheduleId,
  updatePlayerEngagement,
  addPlayerEngagement,
  addPlayerEngagementsBulk,
  deletePlayerEngagement,
  generateSquadProposal,
  confirmProposal
};
