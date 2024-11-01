import { defineStore } from 'pinia'
import { getSchedules } from '@/services/schedule.service'
import type { Schedule } from '@/types/schedule.type'

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    schedules: [] as Schedule[],
    loading: false,
    totalSchedules: 0
  }),
  actions: {
    async loadSchedules() {
      this.loading = true
      try {
        const fetchedSchedules = await getSchedules()
        this.schedules = fetchedSchedules
        this.totalSchedules = fetchedSchedules.length
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
})
