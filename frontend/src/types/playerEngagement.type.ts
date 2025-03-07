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

// Todo: braucht's den? Oder packen wir alles zusammen in ExtendedPlayerEngagement?
export interface PlayerEngagementWithScheduleInfo extends PlayerEngagement {
  scheduleDate: Date
}

export enum EngagementStatus {
  PROVISIONAL = 'provisional',
  DEFINITIVE = 'definitive',
  CANCELED = 'canceled'
}
