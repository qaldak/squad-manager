import {PlayerData} from "../models/Player";

export function mapPlayer(player: any): PlayerData {
    return {
        playerId: player.id,
        name: player.name,
        firstname: player.firstname,
        birthYear: player.birthyear,
        position: player.position,
    }
}

export function mapPlayers(players: any[]): PlayerData[] {
    return players.map(mapPlayer)
}

interface MappedPlayer {
    id?: string; // optional
    name: string;
    firstname: string;
    birthyear: number | null;
    position: string;
}

export function mapPlayerForDb(playerDataIn: PlayerData, includeId = false): MappedPlayer {
    const mappedPlayer: MappedPlayer = {
        name: playerDataIn.name,
        firstname: playerDataIn.firstname,
        birthyear: playerDataIn.birthYear,
        position: playerDataIn.position
    };

    // add playerId on update
    if (includeId) {
        mappedPlayer.id = playerDataIn.playerId;
    }

    console.log("mappedPlayer", mappedPlayer)

    return mappedPlayer;
}