export class Schedule {
  scheduleId: string;
  date: Date;
  type: ScheduleType;
  matchType?: MatchType;

  constructor(scheduleId, date, type, matchType?) {
    this.scheduleId = scheduleId;
    this.date = date;
    this.type = type;
    this.matchType = matchType;
  }
}

export interface ScheduleData {
  scheduleId: string;
  date: Date;
  type: ScheduleType;
  matchType: MatchType;
  location: string;
}

export enum ScheduleType {
  TRAINING = "training",
  GAME_DAY = "game_day",
}

export enum MatchType {
  CUP = "cup",
  LEAGUE = "league",
  INDOOR = "indoor",
  FRIENDLY = "friendly",
}
