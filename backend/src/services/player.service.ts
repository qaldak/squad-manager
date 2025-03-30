import dbConfig from "../../db.config";
import dbClient from "../dbClient";
import logger from "../utils/logger";
import {
  mapPlayers,
  mapPlayerForDb,
  mapPlayer,
} from "../mappers/player.mapper";
import { Player, PlayerData } from "../models/Player";

const playersTable = dbConfig[process.env.NODE_ENV]?.playerTable || "players";
logger.debug(`Use playerTable: '${playersTable}'`);

class PlayerService {
  async getPlayers(): Promise<Player[]> {
    try {
      const { data: players, error } = await dbClient
        .from(playersTable)
        .select();
      if (error) {
        logger.error(`Error fetching players: ${error.message}`);
        throw error;
      }
      return mapPlayers(players);
    } catch (error) {
      logger.error(`Error fetching players from db: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async addPlayer(playerDataIn: PlayerData): Promise<Player> {
    try {
      const newPlayer = mapPlayerForDb(playerDataIn);
      logger.debug(`newPlayer (mapped): ${newPlayer}`);

      const { data: player, error } = await dbClient
        .from(playersTable)
        .insert(newPlayer)
        .select();

      if (error) {
        logger.error(`Error adding new player: ${error.message}`);
        throw error;
      }

      return mapPlayer(player[0]);
    } catch (error) {
      logger.error(`Error adding new player in db: ${error.message}`);
      throw error;
    }
  }

  async updatePlayer(playerDataIn: PlayerData): Promise<Player | undefined> {
    try {
      const updatedPlayer = mapPlayerForDb(playerDataIn, true);
      const { data: player, error } = await dbClient
        .from(playersTable)
        .update(updatedPlayer)
        .eq("id", playerDataIn.playerId)
        .select();
      if (error) {
        logger.error(`Error updating player: ${JSON.stringify(error)}`);
        throw error;
      }
      return mapPlayer(player[0]);
    } catch (error) {
      logger.error(`Error updating player in db: ${error.message}`);
      throw error;
    }
  }

  async readPlayer(playerId: string): Promise<Player> {
    try {
      const { data: player, error } = await dbClient
        .from(playersTable)
        .select()
        .eq("id", playerId);
      if (error) {
        logger.error(`Error reading player data: ${error.message}`);
        throw error;
      }
      return mapPlayer(player[0]);
    } catch (error) {
      logger.error(`Error reading player data from db: ${error.message}`);
    }
  }
}

export default new PlayerService();
