import { defineStore } from 'pinia'
import { getPlayerEngagementsByScheduleId } from '@/services/playerEngagement.service'
import type { PlayerEngagement } from '@/types/playerEngagement.type'

export const usePlayerEngagementStore = defineStore('playerEngagement', {
  state: () => ({
    playerEngagements: [] as PlayerEngagement[],
    loading: false,
    totalPlayerEngagements: 0
  }),
  actions: {
    async getPlayerEngagementsByScheduleId(scheduleId: string) {
      this.loading = true
      try {
        console.log(`PlayerEngagement, scheduleId=${scheduleId}`)

        const fetchedPlayerEngagements = await getPlayerEngagementsByScheduleId(scheduleId)
        console.log(`playerEngagement, fetchedPlayerEngagements: ${fetchedPlayerEngagements}`)

        return fetchedPlayerEngagements
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    }
  }
})