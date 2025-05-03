import type { Position } from '@/types/player.type'

export interface PlayerEngagement {
  id: string
  playerId: string
  scheduleId: string
  status: EngagementStatus
  manually: boolean
}

export interface PlayerEngagementWithPlayerInfo extends PlayerEngagement {
  playerName: string
  playerFirstname: string
  playerPosition?: Position
}

// Todo: Check usage and delete if not necessary
export interface PlayerEngagementWithScheduleInfo extends PlayerEngagement {
  scheduleDate: Date
}

export interface PlayerEngagementSummary {
  totalParticipation: number
  totalCancellation: number
}

export enum EngagementStatus {
  PROVISIONAL = 'provisional',
  DEFINITIVE = 'definitive',
  CANCELED = 'canceled'
}
