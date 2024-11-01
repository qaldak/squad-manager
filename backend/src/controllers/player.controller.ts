import playersData from "../../tests/__mocks__/mock.players";
import PlayerService from "../services/player.service";

const getPlayers = async (req, res): Promise<void> => {
  const players = playersData.getPlayers();
  res.json(players);
};

const addPlayer = async (req, res): Promise<void> => {
  const newPlayer = await PlayerService.addPlayer(req.body);
  res.status(201).json(newPlayer);
};

const readPlayer = async (req, res): Promise<void> => {
  const player = playersData.readPlayer(req.params.id);
  res.json(player);
};

const updatePlayer = async (req, res): Promise<void> => {
  const playerId = req.params.id;
  const player = playersData.readPlayer(playerId);
  try {
    const updatedPlayer = { ...player, ...req.body };
    const result = playersData.updatePlayer(updatedPlayer);
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
