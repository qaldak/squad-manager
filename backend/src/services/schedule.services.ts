import { v4 as uuidv4 } from "uuid";
import schedulesData from "../../tests/__mocks__/mock.schedule";
import { MatchType, Schedule, ScheduleType } from "../models/Schedule";

interface ScheduleData {
  scheduleId: string;
  date: Date;
  type: ScheduleType;
  matchType?: MatchType;
}

class ScheduleService {
  async addSchedule(schedule: ScheduleData): Promise<Schedule> {
    const scheduleId = uuidv4();
    const newSchedule = new Schedule(
      scheduleId,
      schedule.date,
      schedule.type,
      schedule.matchType
    );
    schedulesData.addSchedule(newSchedule);
    return newSchedule;
  }

  async updateSchedule(scheduleDataIn: ScheduleData): Promise<Schedule | undefined> {
    const schedule = schedulesData.readSchedule(scheduleDataIn.scheduleId);

    if (schedule) {
      schedule.date = scheduleDataIn.date;
      schedule.type = scheduleDataIn.type;
      schedule.matchType = scheduleDataIn.matchType;
      return schedule;
    }
    return undefined
  }
}

export default new ScheduleService();
