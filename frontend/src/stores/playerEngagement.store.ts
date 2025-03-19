import { defineStore } from 'pinia'
import {
  addPlayerEngagement,
  confirmProposal,
  deletePlayerEngagement,
  generateProposal,
  getPlayerEngagementsByScheduleId
} from '@/services/playerEngagement.service'
import { readPlayer } from '@/services/player.service'
import {
  type PlayerEngagement,
  type PlayerEngagementWithPlayerInfo
} from '@/types/playerEngagement.type'
import log from 'loglevel'

export const usePlayerEngagementStore = defineStore('playerEngagement', {
  state: () => ({
    playerEngagements: [] as PlayerEngagement[],
    playerEngagementsWithPlayerInfo: [] as PlayerEngagementWithPlayerInfo[],
    loading: false,
    totalPlayerEngagements: 0,
    totalPlayerEngagementsWithPlayerInfo: 0
  }),
  getters: {
    /**
     * isPlayerAssignable
     *
     * @returns boolean if player is already assigned to schedule
     * @param state
     * */
    isPlayerAssignable: (state) => {
      return (playerId: string, scheduleId: string): boolean => {
        log.debug(`Start assignment with playerId ${playerId} and scheduleId ${scheduleId}`)
        return !state.playerEngagements.some(
          (engagement: PlayerEngagement) =>
            engagement.playerId === playerId && engagement.scheduleId === scheduleId
        )
      }
    },
    formatEngagementsByPlayer: (state) => {
      return state.playerEngagementsWithPlayerInfo
        .sort((a, b) => {
          // Multi-stage sorting
          const statusOrder = { definitive: 0, provisional: 1, canceled: 2 }
          const statusComparison = statusOrder[a.status] - statusOrder[b.status]
          if (statusComparison !== 0) return statusComparison
          const nameComparison = a.playerName.localeCompare(b.playerName)
          if (nameComparison !== 0) return nameComparison
          return a.playerFirstname.localeCompare(b.playerFirstname)
        })
        .map((engagement: PlayerEngagementWithPlayerInfo) => ({
          ...engagement
        }))
    }
  },
  actions: {
    async loadPlayerEngagementsByScheduleId(scheduleId: string) {
      this.loading = true
      try {
        log.debug(`PlayerEngagement, scheduleId=${scheduleId}`)

        const fetchedPlayerEngagements = await getPlayerEngagementsByScheduleId(scheduleId)
        if (!Array.isArray(fetchedPlayerEngagements)) {
          throw new TypeError('fetchedPlayerEngagements is not an array')
        }

        log.debug(`playerEngagement, fetchedPlayerEngagements: ${fetchedPlayerEngagements}`)
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

        return playerEngagementsWithPlayerInfo
      } catch (error) {
        log.error(error)
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
        return { success: true, message: 'Player successfully assigned.' }
      } catch (error) {
        log.error(error)
        throw new Error(
          error instanceof Error ? error.message : `An unexpected error occurred: ${error}`
        )
      } finally {
        this.loading = false
      }
    },
    async deletePlayerEngagement(playerEngagementIn: PlayerEngagementWithPlayerInfo) {
      this.loading = true
      try {
        log.debug(`deletePlayerEngagement ${JSON.stringify(playerEngagementIn)}`)
        await deletePlayerEngagement(playerEngagementIn.id)
        const index = this.playerEngagements.findIndex(
          (engagement) => engagement.id === playerEngagementIn.id
        )
        log.debug(`INDEX: ${index})`)
        if (index === -1) {
          throw new Error(
            `An unexpected error occurred: ${playerEngagementIn.playerFirstname} ${playerEngagementIn.playerName} `
          )
        }
        this.playerEngagements.splice(index, 1)

        return { success: true, message: 'Player engagement successfully deleted!' }
      } catch (error) {
        log.error(error)
        return {
          success: false,
          message: error instanceof Error ? error.message : `An unexpected error occurred: ${error}`
        }
      } finally {
        this.loading = false
      }
    },
    async generateProposal(scheduleId: string) {
      this.loading = true
      try {
        const result = await generateProposal(scheduleId)
        log.debug(`Result: ${JSON.stringify(result)}`)
        await this.loadPlayerEngagementsByScheduleId(scheduleId)
      } catch (error) {
        log.error(error)
      } finally {
        this.loading = false
      }
    },
    async confirmProposal(scheduleId: string) {
      this.loading = true
      try {
        const result = await confirmProposal(scheduleId)
        log.debug('Result: ', JSON.stringify(result))
        await this.loadPlayerEngagementsByScheduleId(scheduleId)
      } catch (error) {
        log.error(error)
      } finally {
        this.loading = false
      }
    }
  }
})
