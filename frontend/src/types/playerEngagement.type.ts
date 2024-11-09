export interface PlayerEngagement {
  playerId: string
  scheduleId: string
  status: EngagementStatus
  manually: boolean
}

export enum EngagementStatus {
  PROVISIONAL = 'provisional',
  DEFINITIVE = 'definitive',
  CANCELED = 'canceled',
}