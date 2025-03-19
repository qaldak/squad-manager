import {
  EngagementStatus,
  PlayerEngagement,
  PlayerEngagementData,
} from "../models/PlayerEngagement";
import PlayerService from "./player.service";
import ScheduleServices from "./schedule.services";
import { ScheduleType } from "../models/Schedule";
import dbClient from "../dbClient";
import {
  mapPlayerEngagement,
  mapPlayerEngagementForDb,
  mapPlayerEngagements,
} from "../mappers/playerEngagement.mapper";
import logger from "../utils/logger";

class PlayerEngagementService {
  async generateSquadProposal(
    scheduleId: string,
    noOfPlayers?: number,
  ): Promise<void> {
    const squadSize = noOfPlayers ? noOfPlayers : 9;

    const playerEngagements =
      await this.searchPlayerEngagementsByScheduleId(scheduleId);
    if (!playerEngagements) {
      throw new Error(`Schedule with Id ${scheduleId} not found`);
    }

    const canceledPlayers: Set<string> = new Set();
    const definitivePlayers: Set<string> = new Set();

    // Remove provisional player engagements and set definitive or canceled players for event
    playerEngagements.forEach((engagement) => {
      switch (engagement.status) {
        case "provisional":
          logger.debug(`delete engagement: ${engagement}`);
          this.deletePlayerEngagement(engagement.id);
          break;
        case "definitive":
          definitivePlayers.add(engagement.playerId);
          logger.debug("definitive Players: ", definitivePlayers);
          break;
        case "canceled":
          canceledPlayers.add(engagement.playerId);
          logger.debug("canceled Players: ", canceledPlayers);
          break;
        default:
          logger.debug(`Status ${engagement.status} not handled`);
      }
    });

    const neededPlayers = squadSize - definitivePlayers.size;
    if (neededPlayers < 1) {
      throw new Error(`No further players needed for this match!`);
    }

    const eligiblePlayers = (await PlayerService.getPlayers())
      .filter(
        (player) =>
          !canceledPlayers.has(player.playerId) &&
          !definitivePlayers.has(player.playerId),
      )
      .map((player) => ({
        ...player,
        participation: 0,
        cancellations: 0,
      }));

    const matchDay = await ScheduleServices.readSchedule(scheduleId);

    for (const player of eligiblePlayers) {
      player.participation = await this.determineMatchParticipation(
        player.playerId,
      );
      player.cancellations = await this.determineCancellations(
        player.playerId,
        matchDay.date,
      );
    }

    eligiblePlayers.sort((a, b) => {
      if (a.participation === b.participation) {
        if (b.cancellations === a.cancellations) {
          // randomize for sort (50% chance for negative and positive number)
          return Math.random() - 0.5;
        }
        return b.cancellations - a.cancellations;
      }
      return a.participation - b.participation;
    });

    logger.debug(`Sorted eligible players: ${eligiblePlayers}`);

    const selectedPlayers: PlayerEngagement[] = eligiblePlayers
      .slice(0, neededPlayers)
      .map((player) => ({
        id: undefined,
        playerId: player.playerId,
        scheduleId: matchDay.scheduleId,
        status: EngagementStatus.PROVISIONAL,
        manually: false,
      }));

    try {
      const newPlayerEngagements =
        await this.addPlayerEngagementsBulk(selectedPlayers);
      logger.debug(`new players added: ${newPlayerEngagements.length}`);
    } catch (error) {
      throw new Error(
        `Error adding player engagements (bulk): ${error.message}`,
      );
    }
  }

  async determineMatchParticipation(playerId: string): Promise<number> {
    let matchCount = 0;

    const matchSchedules = (await ScheduleServices.getAllSchedules()).filter(
      (schedule) => schedule.type === ScheduleType.MATCH_DAY,
    );
    logger.debug("Matches: ", matchSchedules);
    const matchIds: Set<string> = new Set(
      matchSchedules.map((schedule) => schedule.scheduleId),
    );

    const playerSchedules =
      await this.searchPlayerEngagementsByPlayerId(playerId);
    logger.debug("Player Schedules: ", playerSchedules);

    playerSchedules.forEach((schedule) => {
      if (
        matchIds.has(schedule.scheduleId) &&
        schedule.status === "definitive"
      ) {
        matchCount++;
        return;
      }

      logger.debug(
        `Training: ${schedule.scheduleId}, Status: ${schedule.status}`,
      );
    });

    // TODO: log?
    return matchCount;
  }

  async determineCancellations(
    playerId: string,
    matchDate: Date,
  ): Promise<number> {
    let cancellations = 0;

    const matchSchedules = (await ScheduleServices.getAllSchedules()).filter(
      (schedule) =>
        schedule.type === ScheduleType.MATCH_DAY && schedule.date >= matchDate,
    );
    const matchIds: Set<string> = new Set(
      matchSchedules.map((schedule) => schedule.scheduleId),
    );

    const playerSchedules =
      await this.searchPlayerEngagementsByPlayerId(playerId);

    playerSchedules.forEach((schedule) => {
      if (
        matchIds.has(schedule.scheduleId) &&
        schedule.status === EngagementStatus.CANCELED
      ) {
        cancellations++;
        return;
      }

      logger.debug(
        `training: ${schedule.scheduleId}, Status: ${schedule.status}`,
      );
    });

    // TODO: log?
    return cancellations;
  }

  async getPlayerEngagements(): Promise<PlayerEngagement[]> {
    try {
      const { data: playerEngagements, error } = await dbClient
        .from("player_engagements")
        .select();
      if (error) {
        logger.error(`Error fetching player engagements: ${error.message}`);
      }
      return mapPlayerEngagements(playerEngagements);
    } catch (error) {
      logger.error(
        `Error fetching player engagements from db: ${error.message}`,
      );
      throw error;
    }
  }

  async addPlayerEngagement(
    playerEngagementDataIn: PlayerEngagementData,
  ): Promise<PlayerEngagement> {
    try {
      const newPlayerEngagement = mapPlayerEngagementForDb(
        playerEngagementDataIn,
      );
      const { data: playerEngagement, error } = await dbClient
        .from("player_engagements")
        .insert(newPlayerEngagement)
        .select();
      if (error) {
        logger.error(`Error adding new player engagement: ${error.message}`);
      }
      return mapPlayerEngagement(playerEngagement[0]);
    } catch (error) {
      logger.error(
        `Error insert new player engagement in db: ${error.message}`,
      );
      throw error;
    }
  }

  async addPlayerEngagementsBulk(
    playerEngagementDataIn: PlayerEngagementData[],
  ): Promise<PlayerEngagement[]> {
    return await Promise.all(
      playerEngagementDataIn.map(async (engagementData) => {
        return this.addPlayerEngagement(engagementData);
      }),
    );
  }

  async setEngagementDefinitive(scheduleIdIn: string): Promise<void> {
    const playerEngagements =
      await this.searchPlayerEngagementsByScheduleId(scheduleIdIn);

    for (let engagement of playerEngagements) {
      logger.debug(`engagement: ${JSON.stringify(engagement, null, 2)}`);
      if (engagement.status === EngagementStatus.PROVISIONAL) {
        engagement.status = EngagementStatus.DEFINITIVE;
        try {
          engagement = await this.updatePlayerEngagement(engagement);
          logger.debug(
            `engagement definitive: ${JSON.stringify(engagement, null, 2)}`,
          );
        } catch (error) {
          logger.error(`Error updating engagement: ${error.message}`);
          throw new Error(`Error updating engagement: ${error.message}`);
        }
      }
    }
  }

  async deletePlayerEngagement(engagementId: string): Promise<boolean> {
    try {
      const {
        data: deletedEngagement,
        status,
        statusText,
      } = await dbClient
        .from("player_engagements")
        .delete()
        .eq("id", engagementId)
        .select();
      logger.debug("deleted Engagement: ", JSON.stringify(deletedEngagement));
      if (deletedEngagement.length === 1 && status === 200) {
        return true;
      }

      let errMsg = `Failed to delete engagement ${engagementId}, status: ${status} ${statusText}`;
      logger.error(errMsg);
      return false;
    } catch (error) {
      logger.error(`Error deleting engagement: ${error.message}`);
      return false;
    }
  }

  async searchPlayerEngagementsByPlayerId(
    playerId: string,
  ): Promise<PlayerEngagement[] | undefined> {
    try {
      const { data: engagementsByPlayer, error } = await dbClient
        .from("player_engagements")
        .select()
        .eq("player_id", playerId);
      if (error) {
        logger.error(`Error search engagements by playerId: ${error.message}`);
      }
      return mapPlayerEngagements(engagementsByPlayer);
    } catch (error) {
      logger.error(
        `Error search player engagements by playerId from db: ${error.message}`,
      );
      throw error;
    }
  }

  async searchPlayerEngagementsByScheduleId(
    scheduleId: string,
  ): Promise<PlayerEngagement[] | undefined> {
    try {
      const { data: engagementsBySchedule, error } = await dbClient
        .from("player_engagements")
        .select()
        .eq("schedule_id", scheduleId);
      if (error) {
        logger.error(
          `Error search engagements by scheduleId: ${error.message}`,
        );
      }
      return mapPlayerEngagements(engagementsBySchedule);
    } catch (error) {
      logger.error(
        `Error search player engagements by scheduleId from db: ${error.message}`,
      );
      throw error;
    }
  }

  async updatePlayerEngagement(
    playerEngagementDataIn: PlayerEngagementData,
  ): Promise<PlayerEngagement | undefined> {
    try {
      const engagementUpdateData = mapPlayerEngagementForDb(
        playerEngagementDataIn,
        true,
      );
      logger.debug("updated player Engagement: ", engagementUpdateData);

      const { data: updatedPlayer, error } = await dbClient
        .from("player_engagements")
        .update(engagementUpdateData)
        .eq("id", playerEngagementDataIn.id)
        .select();
      if (error) {
        logger.error(`Error on update player engagement: ${error.message}`);
        return undefined;
      }
      logger.debug(`updatedPlayer: `, updatedPlayer);
      return mapPlayerEngagement(updatedPlayer[0]);
    } catch (error) {
      logger.error(`Error on update player engagement in db: ${error.message}`);
      throw error;
      // return undefined // TODO: return undefined vs. throw error?
    }
  }
}

export default new PlayerEngagementService();
