import { MatchType } from "./Schedule";

export class PlayerEngagement {
  id: string;
  playerId: string;
  scheduleId: string;
  status: EngagementStatus;
  manually: boolean;

  constructor(
    id: string,
    playerId: string,
    scheduleId: string,
    status: EngagementStatus,
    manually: boolean,
  ) {
    this.id = id;
    this.playerId = playerId;
    this.scheduleId = scheduleId;
    this.status = status;
    this.manually = manually;
  }
}

export interface PlayerEngagementData {
  id: string;
  playerId: string;
  scheduleId: string;
  status: EngagementStatus;
  manually: boolean;
}

export interface PlayerEngagementSummary {
  totalParticipation: number;
  totalCancellation: number;
  matchTypeSummaries: MatchTypeSummary[];
}

export interface MatchTypeSummary {
  matchType: MatchType;
  totalParticipation: number;
  totalCancellation: number;
}

export enum EngagementStatus {
  PROVISIONAL = "provisional",
  DEFINITIVE = "definitive",
  CANCELED = "canceled",
}
