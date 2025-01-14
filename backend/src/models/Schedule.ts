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

export interface ScheduleData{
  scheduleId: string
  date: Date,
  type: ScheduleType,
  matchType: MatchType,
  location: string,
}

export enum ScheduleType {
  TRAINING = "Training",
  MATCH_DAY = "Match",
}

export enum MatchType {
  CUP_GAME = "Cup",
  LEAGUE_GAME = "League",
  INDOOR_GAME = "Indoor",
  FRIENDLY_GAME = "Friendly"
}
