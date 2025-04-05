export interface Schedule {
  scheduleId: string
  date: Date
  type: ScheduleType
  matchType?: MatchType | null
}

export enum ScheduleType {
  GAME_DAY = 'game_day',
  TRAINING = 'training'
}

export enum MatchType {
  CUP = 'cup',
  LEAGUE = 'league',
  INDOOR = 'indoor',
  FRIENDLY = 'friendly'
}
