import { ScheduleData } from "../models/Schedule";
import logger from "../utils/logger";

export function mapSchedule(schedule: any): ScheduleData {
  return {
    scheduleId: schedule.id,
    date: schedule.date,
    type: schedule.type,
    matchType: schedule.matchtype,
    location: schedule.location,
  };
}

export function mapSchedules(schedules: any[]): ScheduleData[] {
  return schedules.map(mapSchedule);
}

interface MappedSchedule {
  id?: string;
  date: Date;
  type: string;
  matchtype: string | null;
  location: string | null;
}

export function mapScheduleForDb(
  scheduleDataIn: ScheduleData,
  includeId = false,
): MappedSchedule {
  const mappedSchedule: MappedSchedule = {
    date: scheduleDataIn.date,
    type: scheduleDataIn.type,
    matchtype: scheduleDataIn.matchType,
    location: scheduleDataIn.location,
  };

  // add scheduleId on update
  if (includeId) {
    mappedSchedule.id = scheduleDataIn.scheduleId;
  }

  logger.debug(`mappedSchedule: ${JSON.stringify(mappedSchedule)}`);

  return mappedSchedule;
}
