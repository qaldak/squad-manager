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

export enum ScheduleType {
  TRAINING = "Training",
  MATCH_DAY = "Match day",
}

export enum MatchType {
  CUP_GAME = "Cup Game",
  LEAGUE_GAME = "League Game",
  INDOOR_GAME = "Indoor Game",
  FRIENDLY_GAME = "Friendly Game",
}
