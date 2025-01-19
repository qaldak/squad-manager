import {PlayerEngagementData} from "../models/PlayerEngagement";

export function mapPlayerEngagement(playerEngagement: any): PlayerEngagementData {
  return {
    id: playerEngagement.id,
    playerId: playerEngagement.player_id,
    scheduleId: playerEngagement.schedule_id,
    status: playerEngagement.participation_status,
    manually: playerEngagement.manually_added
  }
}

export function mapPlayerEngagements(playerEngagements: any[]): PlayerEngagementData[] {
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
}

export function mapMultiplePlayerEngagementsForDb(
  engagementsDataIn: PlayerEngagementData[],
  includeId = false
): MappedPlayerEngagement[] {
  return engagementsDataIn.map(engagementData =>
    mapPlayerEngagementForDb(engagementData, includeId)
  );
}