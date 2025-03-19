import PlayerService from "../services/player.service";
import logger from "../utils/logger";

const getPlayers = async (req, res): Promise<void> => {
  const players = await PlayerService.getPlayers();
  res.json(players);
};

const addPlayer = async (req, res): Promise<void> => {
  const newPlayer = await PlayerService.addPlayer(req.body);
  res.status(201).json(newPlayer);
};

const readPlayer = async (req, res): Promise<void> => {
  const player = await PlayerService.readPlayer(req.params.id);
  res.json(player);
};

const updatePlayer = async (req, res): Promise<void> => {
  try {
    const playerId = req.params.id;
    const player = await PlayerService.readPlayer(playerId);
    const updatedPlayer = { ...player, ...req.body };
    const result = await PlayerService.updatePlayer(updatedPlayer);
    logger.debug(`Result updated player: ${result}`);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Player not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default {
  getPlayers,
  addPlayer,
  readPlayer,
  updatePlayer,
};
