import dbClient from "../dbClient";
import {mapPlayers, mapPlayerForDb, mapPlayer} from "../mappers/player.mapper";
import {Player, PlayerData} from "../models/Player";

class PlayerService {
  async getPlayers(): Promise<Player[]> {
    try {
      const {data: players, error} = await dbClient.from('players').select()
      if (error) {
        console.log(`Error fetching players: ${error.message}`);
        throw error;
      }
      return mapPlayers(players);
    } catch (error) {
        console.error(`Error fetching players from db: ${JSON.stringify(error)}`);
        throw error;
    }
  }

  async addPlayer(playerDataIn: PlayerData): Promise<Player> {
    try {
      const newPlayer = mapPlayerForDb(playerDataIn)
      console.log("newPlayer:", newPlayer);

      const {data: player, error} = await dbClient.from('players').insert(newPlayer).select();

      if (error) {
        console.log(`Error adding new player: ${error.message}`);
        throw error
      }

      return mapPlayer(player[0]);
    } catch (error) {
      console.error(`Error adding new player in db: ${error.message}`);
      throw error
    }
  }

  async updatePlayer(playerDataIn: PlayerData): Promise<Player | undefined> {
    try {
      const updatedPlayer = mapPlayerForDb(playerDataIn, true)
      const {
        data: player,
        error
      } = await dbClient.from('players').update(updatedPlayer).eq('id', playerDataIn.playerId).select();
      if (error) {
        console.log(`Error updating player: ${error.message}`);
        console.log(`Error updating player: ${JSON.stringify(error)}`);
        throw error;
      }
      return mapPlayer(player[0])
    } catch (error) {
      console.error(`Error updating player in db: ${error.message}`);
      throw error
    }
  };

  async readPlayer(playerId: string): Promise<Player> {
    try {
      const {data: player, error} = await dbClient.from('players').select().eq('id', playerId)
      if (error) {
        console.log(`Error reading player data: ${error.message}`)
        throw error;
      }
      return mapPlayer(player[0])
    } catch (error) {
      console.error(`Error reading player data from db: ${error.message}`);
    }
  }
}

export default new PlayerService()