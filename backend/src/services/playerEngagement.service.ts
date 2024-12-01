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

        const playerEngagements = playerEngagementsData.findPlayerEngagementBySchedule(scheduleId);
        if (!playerEngagements) {
            throw new Error(`Schedule with Id ${scheduleId} not found`);
        }

        const canceledPlayers: Set<string> = new Set();
        const definitivePlayers: Set<string> = new Set();

        // Remove provisional player engagements and set definitive or canceled players for event
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

        const neededPlayers = squadSize - definitivePlayers.size;
        if (neededPlayers < 1) {
            throw new Error(`No further players needed for this match!`);
        }

        const eligiblePlayers = (await PlayerService.getPlayers()).filter(player =>
            !canceledPlayers.has(player.playerId) && !definitivePlayers.has(player.playerId)).map(player => ({
            ...player,
            participation: 0,
            cancellations: 0
        }));

        const matchDay = await ScheduleServices.readSchedule(scheduleId);

        for (const player of eligiblePlayers) {
            player.participation = await this.determineMatchParticipation(player.playerId)
            player.cancellations = await this.determineCancellations(player.playerId, matchDay.date)
        }

        eligiblePlayers.sort((a, b) => {
            if (a.participation === b.participation) {
                if (b.cancellations === a.cancellations) {
                    // randomize for sort (50% chance for negative and positive number)
                    return Math.random() - 0.5
                }
                return b.cancellations - a.cancellations;
            }
            return a.participation - b.participation;
        })

        console.log('sorted eligible Players', eligiblePlayers)

        const selectedPlayers: PlayerEngagement[] = eligiblePlayers.slice(0, neededPlayers).map(player => ({
            playerId: player.playerId,
            scheduleId: matchDay.scheduleId,
            status: EngagementStatus.PROVISIONAL,
            manually: false
        }))

        try {
            const newPlayerEngagements = await this.addPlayerEngagementsBulk(selectedPlayers)
            console.log(`new players added: ${newPlayerEngagements.length}`)
        } catch (e) {
            throw new Error(`Error adding player engagements (bulk): ${e}`);
        }

    }

    async determineMatchParticipation(playerId: string): Promise<number> {
        let matchCount = 0

        const matchSchedules = (await ScheduleServices.getAllSchedules()).filter(schedule => schedule.type === ScheduleType.MATCH_DAY)
        const matchIds: Set<string> = new Set(matchSchedules.map(schedule => schedule.scheduleId))

        const playerSchedules = playerEngagementsData.findPlayerEngagementsByPlayer(playerId)

        playerSchedules.forEach(schedule => {
            if (matchIds.has(schedule.scheduleId) && schedule.status === 'definitive') {
                matchCount++
                return
            }

            console.log(`training: ${schedule.scheduleId} or status: ${schedule.status}`);

        })

        // TODO: log?
        return matchCount
    }

    async determineCancellations(playerId: string, matchDate: Date): Promise<number> {
        let cancellations = 0

        const matchSchedules = (await ScheduleServices.getAllSchedules()).filter(schedule => schedule.type === ScheduleType.MATCH_DAY && schedule.date >= matchDate)
        const matchIds: Set<string> = new Set(matchSchedules.map(schedule => schedule.scheduleId))

        const playerSchedules = playerEngagementsData.findPlayerEngagementsByPlayer(playerId)

        playerSchedules.forEach(schedule => {
            if (matchIds.has(schedule.scheduleId) && schedule.status === 'canceled') {
                cancellations++
                return
            }

            console.log(`training: ${schedule.scheduleId} or status: ${schedule.status}`);

        })

        // TODO: log?
        return cancellations
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

    async confirmParticipation(scheduleIdIn: string): Promise<void> {
        const playerEngagements = playerEngagementsData.findPlayerEngagementBySchedule(scheduleIdIn)

        for (let engagement of playerEngagements) {
            console.log(`engagement: ${JSON.stringify(engagement, null, 2)}`)
            if (engagement.status === 'provisional') {
                engagement.status = EngagementStatus.DEFINITIVE
                try {
                    engagement = await this.updatePlayerEngagement(engagement)
                    console.log(`engagement definitive: ${JSON.stringify(engagement, null, 2)}`)
                } catch (e) {
                    throw new Error(`Error updating engagement: ${e}`)
                }
            }
        }
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
