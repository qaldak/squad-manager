export class PlayerEngagement {
  playerId: string;
  scheduleId: string;
  status: EngagementStatus;
  manually: boolean;

  constructor(playerId: string, scheduleId: string, status: EngagementStatus, manually: boolean) {
    this.playerId = playerId;
    this.scheduleId = scheduleId;
    this.status = status;
    this.manually = manually;
  }
}

export enum EngagementStatus {
  PROVISIONAL = "provisional",
  DEFINITIVE = "definitive",
  CANCELED = "canceled",
}
