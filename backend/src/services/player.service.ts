  import { v4 as uuidv4 } from "uuid";
  import playersData from "../../tests/__mocks__/mock.players";
  import { Player, Position } from "../models/Player";

  interface PlayerData {
    name: string;
    firstname: string;
    birthYear: number;
    position: Position;
  }

  class PlayerService {
    async getPlayers(): Promise<Player[]> {
      return playersData.getPlayers()
    }

    async addPlayer(playerData: PlayerData): Promise<Player> {
      const playerId = uuidv4();
      const newPlayer = new Player(
        playerId,
        playerData.name,
        playerData.firstname,
        playerData.birthYear,
        playerData.position
      );
      playersData.addPlayer(newPlayer);
      return newPlayer;
    };
    
    async updatePlayer(playerId: string, playerDataIn: PlayerData): Promise<Player | undefined> {
      const player = playersData.readPlayer(playerId);
      if (player) {
        player.name = playerDataIn.name;
        player.firstname = playerDataIn.firstname;
        player.birthYear = playerDataIn.birthYear;
        player.position = playerDataIn.position;
        return player;
      }
      return undefined
    };
  }

  export default new PlayerService()