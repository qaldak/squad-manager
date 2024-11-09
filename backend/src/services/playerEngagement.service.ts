import { EngagementStatus, PlayerEngagement } from '../models/PlayerEngagement'
import playerEngagementsData from '../../tests/__mocks__/mock.playerEngagement'

interface PlayerEngagementData {
  playerId: string;
  scheduleId: string;
  status: EngagementStatus;
  manually: boolean;
}

class PlayerEngangementService {
  async generateSquadProposal(scheduleId: string): Promise<PlayerEngagement[]> {
    return []
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

export default new PlayerEngangementService()
