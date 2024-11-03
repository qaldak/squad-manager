import axios from 'axios'
import type { Schedule } from '@/types/schedule.type'

const API_URL = '/api/schedules'

export const getSchedules = async (): Promise<Schedule[]> => {
  const response = await axios.get(API_URL)
  return response.data
}

export const addSchedule = async (schedule: Schedule): Promise<Schedule> => {
  console.log('schedule added service: ', schedule)
  const response = await axios.post(API_URL, schedule)
  console.log('schedule added response: ', response.data)
  return response.data
}

export const getScheduleById = async (scheduleId: string): Promise<Schedule> => {
  const response = await axios.get(`${API_URL}/id/${scheduleId}`)
  return response.data
}