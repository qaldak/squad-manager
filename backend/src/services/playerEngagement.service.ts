import {EngagementStatus, PlayerEngagement} from '../models/PlayerEngagement'
import playerEngagementsData from '../../tests/__mocks__/mock.playerEngagement'
import PlayerService from "./player.service";
import ScheduleServices from "./schedule.services";
import {ScheduleType} from "../models/Schedule";

interface PlayerEngagementData {
    playerId: string;
    scheduleId: string;
    status: EngagementStatus;
    manually: boolean;
}

class PlayerEngagementService {
    async generateSquadProposal(scheduleId: string, noOfPlayers?: number): Promise<void> {

        const squadSize = noOfPlayers ? noOfPlayers : 9;

        // TODO: remainingPlayers
        const matchDay = await ScheduleServices.readSchedule(scheduleId);

        const playerEngagements = playerEngagementsData.findPlayerEngagementBySchedule(scheduleId);
        if (!playerEngagements) {
            throw new Error(`Schedule with Id ${scheduleId} not found`);
        }

        const canceledPlayers: Set<string> = new Set();
        const definitivePlayers: Set<string> = new Set();

        playerEngagements.forEach((engagement) => {
            switch (engagement.status) {
                case 'provisional':
                    console.log(`delete engagement: ${engagement}`);
                    this.deletePlayerEngagement(engagement.playerId, engagement.scheduleId)
                    break;
                case 'definitive':
                    definitivePlayers.add(engagement.playerId);
                    console.log('definitive Players: ', definitivePlayers)
                    break
                case 'canceled':
                    canceledPlayers.add(engagement.playerId);
                    console.log('canceled Players: ', canceledPlayers);
                    break;
                default:
                    console.log(`Status ${engagement.status} not handled`);
            }
        })

        const eligiblePlayers = (await PlayerService.getPlayers()).filter(player =>
            !canceledPlayers.has(player.playerId) && !definitivePlayers.has(player.playerId));
        console.log('eligible Players', eligiblePlayers)

        const matchSchedules = (await ScheduleServices.getAllSchedules()).filter(schedule => schedule.type === ScheduleType.MATCH_DAY)
        const matchIds: Set<string> = new Set(matchSchedules.map(schedule => schedule.scheduleId))
        console.log(`number of match days found: ${matchSchedules.length}`);
        console.log(`matchScheduleIds ${Array.from(matchIds)}`)

        const playerParticipationCounts: { [playerId: string]: { playedMatches: number, cancellations: number } } = {}
        
        eligiblePlayers.forEach(player => {
            playerParticipationCounts[player.playerId] = {playedMatches: 0, cancellations: 0};
            console.log(`player participation: ${playerParticipationCounts[player.playerId].playedMatches} ${playerParticipationCounts[player.playerId].cancellations}`
            );

            const playerSchedules = playerEngagementsData.findPlayerEngagementsByPlayer(player.playerId)
            console.log(`player schedules: ${playerSchedules.length}`);

            // TODO: function for determineParticipation & determineCancellations
            playerSchedules.forEach(schedule => {
                if (!matchIds.has(schedule.scheduleId)) {
                    console.log(`training: ${schedule.scheduleId}`);
                    return
                }
                console.log(`match: ${schedule.scheduleId}`);

                switch (schedule.status) {
                    case 'canceled':
                        playerParticipationCounts[player.playerId].cancellations += 1;
                        console.log(`player participation canceled: ${playerParticipationCounts[player.playerId].cancellations}`);
                        break
                    case 'definitive':
                        playerParticipationCounts[player.playerId].playedMatches += 1;
                        console.log(`player participation matches: ${playerParticipationCounts[player.playerId].playedMatches}`)
                        break
                    default:
                        console.log(`foo ${schedule.scheduleId} doesn't match any schedule`);
                }

                console.log(`player participation: ${player.playerId} ${JSON.stringify(playerParticipationCounts[player.playerId])}`)
            })
        })
    }

    async addPlayerEngagement(
        playerEngagementDataIn: PlayerEngagementData
    ): Promise<PlayerEngagement> {
        const newPlayerEngagement = new PlayerEngagement(
            playerEngagementDataIn.playerId,
            playerEngagementDataIn.scheduleId,
            playerEngagementDataIn.status,
            playerEngagementDataIn.manually
        )
        playerEngagementsData.addPlayerEngagement(newPlayerEngagement)
        return newPlayerEngagement
    }

    async addPlayerEngagementsBulk(playerEngagementDataIn: PlayerEngagementData[]): Promise<PlayerEngagement[]> {
        const newPlayerEngagements = playerEngagementDataIn.map(data =>
            new PlayerEngagement(data.playerId, data.scheduleId, data.status, data.manually)
        )
        newPlayerEngagements.forEach(engagement => playerEngagementsData.addPlayerEngagement(engagement))
        return newPlayerEngagements
    }

    async deletePlayerEngagement(playerId: string, scheduleId: string): Promise<boolean> {
        const engagement = playerEngagementsData.readPlayerEngagement(playerId, scheduleId)
        if (engagement) {
            playerEngagementsData.deletePlayerEngagement(playerId, scheduleId)
            return true
        }
        return false
    }

    async updatePlayerEngagement(
        playerEngagementDataIn: PlayerEngagementData
    ): Promise<PlayerEngagement | undefined> {
        const playerEngagement = playerEngagementsData.readPlayerEngagement(
            playerEngagementDataIn.playerId,
            playerEngagementDataIn.scheduleId
        )
        if (playerEngagement) {
            playerEngagement.manually = playerEngagementDataIn.manually
            playerEngagement.status = playerEngagementDataIn.status
            return playerEngagement
        }
        return undefined
    }
}

export default new PlayerEngagementService()
