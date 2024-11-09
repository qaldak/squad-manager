import type { PlayerEngagement } from '@/types/playerEngagement.type'
import axios from 'axios'

const API_URL = '/api/playerEngagement'

export const getPlayerEngagementsByScheduleId = async (scheduleId: string): Promise<PlayerEngagement> => {
  const response = await axios.get(`${API_URL}/schedule/${scheduleId}`)
  return response.data
}