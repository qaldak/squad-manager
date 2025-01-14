export interface Schedule {
  scheduleId: string
  date: Date
  type: ScheduleType
  matchType?: MatchType | null
}

export enum ScheduleType {
  MATCH_DAY = 'Match',
  TRAINING = 'Training',
}

export enum MatchType {
  CUP_GAME = 'Cup',
  LEAGUE_GAME = 'League',
  INDOOR_GAME = 'Indoor',
  FRIENDLY_GAME = 'Friendly'
}
