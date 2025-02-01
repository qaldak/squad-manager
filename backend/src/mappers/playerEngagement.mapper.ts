import {PlayerEngagementData} from "../models/PlayerEngagement";

export function mapPlayerEngagement(playerEngagement: any): PlayerEngagementData {
  console.log('map', playerEngagement)
  try {
    return {
      id: playerEngagement.id,
      playerId: playerEngagement.player_id,
      scheduleId: playerEngagement.schedule_id,
      status: playerEngagement.participation_status,
      manually: playerEngagement.manually_added
    }
  } catch (error) {
    console.error(`Error mapping player engagement: ${error.message}`);
  }
}

export function mapPlayerEngagements(playerEngagements: any[]): PlayerEngagementData[] {
  console.log('maps', playerEngagements)
  return playerEngagements.map(mapPlayerEngagement)
}

interface MappedPlayerEngagement {
  id?: string,
  player_id: string,
  schedule_id: string,
  participation_status: string,
  manually_added: boolean,
}

export function mapPlayerEngagementForDb(engagementDataIn: PlayerEngagementData, includeId = false): MappedPlayerEngagement {
  try {
    console.log(`engagementDataIn: ${JSON.stringify(engagementDataIn)}`)
    const mappedEngagement: MappedPlayerEngagement = {
      player_id: engagementDataIn.playerId,
      schedule_id: engagementDataIn.scheduleId,
      participation_status: engagementDataIn.status,
      manually_added: engagementDataIn.manually
    }

    if (includeId) {
      mappedEngagement.id = engagementDataIn.id
    }

    console.log("mapped Engagements: ", mappedEngagement)

    return mappedEngagement

  } catch (error) {
    console.error("FOO", error.message)
  }
}