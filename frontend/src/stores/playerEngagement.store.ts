import { defineStore } from 'pinia'
import {
  addPlayerEngagement,
  getPlayerEngagementsByScheduleId
} from '@/services/playerEngagement.service'
import { readPlayer } from '@/services/player.service'
import {
  EngagementStatus,
  type PlayerEngagement,
  type PlayerEngagementWithPlayerInfo
} from '@/types/playerEngagement.type'

export const usePlayerEngagementStore = defineStore('playerEngagement', {
  state: () => ({
    playerEngagements: [] as PlayerEngagement[],
    playerEngagementsWithPlayerInfo: [] as PlayerEngagementWithPlayerInfo[],
    loading: false,
    totalPlayerEngagements: 0,
    totalPlayerEngagementsWithPlayerInfo: 0
  }),
  actions: {
    async loadPlayerEngagementsByScheduleId(scheduleId: string) {
      this.loading = true
      try {
        console.log(`PlayerEngagement, scheduleId=${scheduleId}`)

        const fetchedPlayerEngagements = await getPlayerEngagementsByScheduleId(scheduleId)
        if (!Array.isArray(fetchedPlayerEngagements)) {
          throw new TypeError('fetchedPlayerEngagements is not an array')
        }

        console.log(`playerEngagement, fetchedPlayerEngagements: ${fetchedPlayerEngagements}`)
        this.playerEngagements = fetchedPlayerEngagements
        this.totalPlayerEngagements = fetchedPlayerEngagements.length

        const playerEngagementsWithPlayerInfo = await Promise.all(
          fetchedPlayerEngagements.map(async (playerEngagements) => {
            const playerInfo = await readPlayer(playerEngagements.playerId)
            return {
              ...playerEngagements,
              playerName: playerInfo.name,
              playerFirstname: playerInfo.firstname,
              playerPosition: playerInfo.position
            }
          })
        )
        this.playerEngagementsWithPlayerInfo = playerEngagementsWithPlayerInfo
        this.totalPlayerEngagementsWithPlayerInfo = playerEngagementsWithPlayerInfo.length

        console.log(
          `Check difference: ${this.totalPlayerEngagements} vs. ${this.totalPlayerEngagementsWithPlayerInfo}`
        )

        console.log(
          `extended Player Engagements: ${JSON.stringify(playerEngagementsWithPlayerInfo)}`
        )
        return playerEngagementsWithPlayerInfo
      } catch (error) {
        console.error(error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async assignNewPlayer(playerEngagementIn: PlayerEngagement) {
      this.loading = true
      try {
        const newPlayerEngagement = await addPlayerEngagement(playerEngagementIn)
        this.playerEngagements.push(newPlayerEngagement)
        return { success: true, message: 'Player successfully assigned!' }
      } catch (error) {
        console.log('Foo Already Assigned')
        console.error(error)
        throw new Error(
          error instanceof Error ? error.message : `An unexpected error occurred: ${error}`
        )
      } finally {
        console.log('BAR')
        this.loading = false
      }
    },
    /**
     * isPlayerAssignable
     *
     * @param playerId
     * @param scheduleId
     * @returns boolean if player is already assigned to schedule
     * */
    async isPlayerAssignable(playerId: string, scheduleId: string) {
      console.log(`Start assignment with playerId ${playerId} and scheduleId ${scheduleId}`)
      const isAlreadyAssigned = this.playerEngagements.some(
        (engagement) => engagement.playerId === playerId && engagement.scheduleId === scheduleId
      )
      console.log('isAlreadyAssigned', isAlreadyAssigned)
      return !isAlreadyAssigned
    },
    formatEngagementsByPlayer() {
      return this.playerEngagementsWithPlayerInfo
        .sort((a, b) => {
          // Multi-stage sorting
          const statusOrder = { definitive: 0, provisional: 1, canceled: 2 }
          const statusComparison = statusOrder[a.status] - statusOrder[b.status]
          if (statusComparison !== 0) return statusComparison
          const nameComparison = a.playerName.localeCompare(b.playerName)
          if (nameComparison !== 0) return nameComparison
          return a.playerFirstname.localeCompare(b.playerFirstname)
        })
        .map((engagement) => ({
          ...engagement
        }))
    }
  }
})
