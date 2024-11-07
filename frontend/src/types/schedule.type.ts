export interface Schedule {
  scheduleId: string
  date: Date
  type: ScheduleType
  matchType?: MatchType | null
}

export enum ScheduleType {
  TRAINING = 'Training',
  MATCH_DAY = 'Match day'
}

export enum MatchType {
  CUP_GAME = 'Cup Game',
  LEAGUE_GAME = 'League Game',
  INDOOR_GAME = 'Indoor Game',
  FRIENDLY_GAME = 'Friendly Game'
}
