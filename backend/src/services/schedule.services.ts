import { Schedule, ScheduleData } from "../models/Schedule";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import dbClient from "../dbClient";
import {
  mapSchedule,
  mapScheduleForDb,
  mapSchedules,
} from "../mappers/schedule.mapper";
import logger from "../utils/logger";

dayjs.extend(utc);

class ScheduleService {
  async addSchedule(scheduleDataIn: ScheduleData): Promise<Schedule> {
    try {
      logger.debug(`scheduleDataIn: ${scheduleDataIn}`);
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      logger.debug(`Timezone is ${timeZone}`);
      const dateUtc = dayjs.utc(scheduleDataIn.date); // Todo: remove?
      logger.debug(`dateUtc: ${dateUtc}`);
      const newSchedule = mapScheduleForDb(scheduleDataIn);

      const { data: schedule, error } = await dbClient
        .from("schedules")
        .insert(newSchedule)
        .select();
      if (error) {
        logger.error(`Error adding new schedule: ${error.message}`);
      }
      return mapSchedule(schedule[0]);
    } catch (error) {
      logger.error(`Error adding new schedule in db: ${error.message}`);
      throw error;
    }
  }

  async getAllSchedules(): Promise<Schedule[]> {
    try {
      const { data: schedules, error } = await dbClient
        .from("schedules")
        .select();
      if (error) {
        logger.error(`Error fetching schedules: ${error.message}`);
      }
      return mapSchedules(schedules);
    } catch (error) {
      logger.error(
        `Error fetching schedules from db: ${JSON.stringify(error)}`,
      );
      throw error;
    }
  }

  async readSchedule(scheduleId: string): Promise<Schedule> {
    try {
      const { data: schedule, error } = await dbClient
        .from("schedules")
        .select()
        .eq("id", scheduleId);
      if (error) {
        logger.error(`Error reading schedule data: ${error.message}`);
        throw error;
      }
      return mapSchedule(schedule[0]);
    } catch (error) {
      logger.error(`Error reading schedule data from db: ${error.message}`);
      throw error;
    }
  }

  async readScheduleByDate(dateIn: Date): Promise<Schedule> | undefined {
    logger.debug(`Schedules Date In: ${dateIn}`);
    try {
      const { data: schedule, error } = await dbClient
        .from("schedules")
        .select()
        .eq("date", dateIn);
      if (error) {
        logger.error(`Error reading schedule data: ${error.message}`);
      }
      if (!schedule[0]) {
        logger.error(`No schedule found for this date: ${dateIn}`);
        return undefined;
      }
      return mapSchedule(schedule[0]);
    } catch (error) {
      logger.error(`Error reading schedule data from db: ${error.message}`);
      throw error;
    }
  }

  async updateSchedule(
    scheduleDataIn: ScheduleData,
  ): Promise<Schedule | undefined> {
    try {
      const updatedSchedule = mapScheduleForDb(scheduleDataIn, true);
      const { data: schedule, error } = await dbClient
        .from("schedules")
        .update(updatedSchedule)
        .eq("id", scheduleDataIn.scheduleId)
        .select();

      if (error) {
        logger.error(`Error updating schedule: ${error.message}`);
      }
      return mapSchedule(schedule[0]);
    } catch (error) {
      logger.error(`Error updating schedule in db: ${error.message}`);
      throw error;
    }
  }
}

export default new ScheduleService();
