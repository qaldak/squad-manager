export class PlayerEngagement {
  id: string;
  playerId: string;
  scheduleId: string;
  status: EngagementStatus;
  manually: boolean;

  constructor(id: string, playerId: string, scheduleId: string, status: EngagementStatus, manually: boolean) {
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

export enum EngagementStatus {
  PROVISIONAL = "provisional",
  DEFINITIVE = "definitive",
  CANCELED = "canceled",
}
