import { PlayerEngagementData } from "../models/PlayerEngagement";
import logger from "../utils/logger";

export function mapPlayerEngagement(
  playerEngagement: any,
): PlayerEngagementData {
  logger.debug(`mappedPlayerEngagement: ${JSON.stringify(playerEngagement)}`);
  try {
    return {
      id: playerEngagement.id,
      playerId: playerEngagement.player_id,
      scheduleId: playerEngagement.schedule_id,
      status: playerEngagement.participation_status,
      manually: playerEngagement.manually_added,
    };
  } catch (error) {
    logger.error(`Error mapping player engagement: ${error.message}`);
  }
}

export function mapPlayerEngagements(
  playerEngagements: any[],
): PlayerEngagementData[] {
  logger.debug(`mapPlayerEngagements: ${JSON.stringify(playerEngagements)}`);
  return playerEngagements.map(mapPlayerEngagement);
}

interface MappedPlayerEngagement {
  id?: string;
  player_id: string;
  schedule_id: string;
  participation_status: string;
  manually_added: boolean;
}

export function mapPlayerEngagementForDb(
  engagementDataIn: PlayerEngagementData,
  includeId = false,
): MappedPlayerEngagement {
  try {
    logger.debug(`engagementDataIn: ${JSON.stringify(engagementDataIn)}`);
    const mappedEngagement: MappedPlayerEngagement = {
      player_id: engagementDataIn.playerId,
      schedule_id: engagementDataIn.scheduleId,
      participation_status: engagementDataIn.status,
      manually_added: engagementDataIn.manually,
    };

    if (includeId) {
      mappedEngagement.id = engagementDataIn.id;
    }
    logger.debug(`mapped Engagement: ${JSON.stringify(mappedEngagement)}`);

    return mappedEngagement;
  } catch (error) {
    logger.error(`Error mapped Engagement: ${error.message}`);
  }
}
