import type { PlayerEngagement } from '@/types/playerEngagement.type'
import axios from 'axios'

const API_URL = '/api/playerEngagements'

export const getPlayerEngagementsByScheduleId = async (scheduleId: string): Promise<PlayerEngagement[]> => {
  const response = await axios.get(`${API_URL}/schedule/${scheduleId}`)
  return response.data
}

export const confirmParticipation = async (scheduleId: string): Promise<PlayerEngagement[]> => {
  const response = await axios.get(`${API_URL}/confirmProposal/${scheduleId}`)
  return response.data
}

export const generateProposal = async (scheduleId: string): Promise<PlayerEngagement[]> => {
  const response = await axios.get(`${API_URL}/proposal/${scheduleId}`)
  return response.data
}