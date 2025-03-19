import { defineStore } from 'pinia'
import {
  addSchedule,
  getScheduleById,
  getSchedules,
  updateSchedule
} from '@/services/schedule.service'
import type { Schedule } from '@/types/schedule.type'
import log from 'loglevel'

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
        log.error(error)
      } finally {
        this.loading = false
      }
    },
    async getScheduleById(scheduleId: string) {
      this.loading = true
      try {
        log.debug(`scheduleId: ${scheduleId}`)

        const fetchedSchedule = await getScheduleById(scheduleId)
        log.debug(`fetchedSchedule: ${fetchedSchedule}`)

        return fetchedSchedule
      } catch (error) {
        log.error(error)
      } finally {
        this.loading = false
      }
    },
    async addSchedule(schedule: Schedule) {
      const newSchedule = await addSchedule(schedule)
      log.debug(`addSchedule: ${newSchedule}`)
    },
    async updateSchedule(schedule: Schedule) {
      log.debug(`schedule ready to update: ${schedule.matchType}`)
      const updatedSchedule = await updateSchedule(schedule)
      log.debug('updated schedule: ', updatedSchedule)
    }
  }
})
