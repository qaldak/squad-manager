import type { PlayerEngagement } from '@/types/playerEngagement.type'
import axios from 'axios'
import log from 'loglevel'

const API_URL = '/api/playerEngagements'

export const getPlayerEngagementsByScheduleId = async (
  scheduleId: string
): Promise<PlayerEngagement[]> => {
  try {
    const response = await axios.get(`${API_URL}/schedule/${scheduleId}`)
    return response.data
  } catch (error) {
    handleAxiosErrors(error)
  }
}

export const addPlayerEngagement = async (
  playerEngagement: PlayerEngagement
): Promise<PlayerEngagement> => {
  try {
    const response = await axios.post(`/api/playerEngagement`, playerEngagement)
    return response.data
  } catch (error) {
    handleAxiosErrors(error)
  }
}

export const deletePlayerEngagement = async (playerIdIn: string | undefined): Promise<void> => {
  try {
    const response = await axios.delete(`/api/playerEngagement/${playerIdIn}`)
    log.debug('deletePlayerEngagement', response)
  } catch (error) {
    handleAxiosErrors(error)
  }
}

export const confirmProposal = async (scheduleId: string): Promise<void> => {
  try {
    const response = await axios.patch(`${API_URL}/confirmProposal/${scheduleId}`)
    return response.data
  } catch (error) {
    handleAxiosErrors(error)
  }
}

export const generateProposal = async (scheduleId: string): Promise<void> => {
  try {
    const response = await axios.post(`${API_URL}/proposal/${scheduleId}`)
    return response.data
  } catch (error) {
    handleAxiosErrors(error)
  }
}

function handleAxiosErrors(error: any): never {
  if (axios.isAxiosError(error)) {
    log.error(error.response?.status, error.response?.data?.message)
    throw new Error(
      error.response?.data?.message || 'Failed to process player engagement operation!'
    )
  } else {
    log.error('Unexpected error:', error)
    throw new Error('An unexpected error occurred!')
  }
}
