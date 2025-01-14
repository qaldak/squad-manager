import {v4 as uuidv4} from 'uuid'
import schedulesData from '../../tests/__mocks__/mock.schedule'
import {ScheduleData, Schedule} from '../models/Schedule'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'
import dbClient from "../dbClient";
import {mapSchedule, mapScheduleForDb, mapSchedules} from "../mappers/schedule.mapper";

dayjs.extend(utc)

class ScheduleService {
  async addSchedule(scheduleDataIn: ScheduleData): Promise<Schedule> {
    try {
      console.log('gespeicherte Daten 1', scheduleDataIn)
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      console.log(`Die aktuelle Zeitzone ist: ${timeZone}`)
      const dateUtc = dayjs.utc(scheduleDataIn.date) // Todo: remove?
      console.log('dateUtc: ', dateUtc)
      const newSchedule = mapScheduleForDb(scheduleDataIn)

      const {data: schedule, error} = await dbClient.from('schedules').insert(newSchedule).select()
      if (error) {
        console.log(`Error adding new schedule: ${error.message}`)
      }
      return mapSchedule(schedule[0])
    } catch (error) {
      console.log(`Error adding new schedule in db: ${error.message}`)
      throw error
    }
  }

  async getAllSchedules(): Promise<Schedule[]> {
    try {
      const {data: schedules, error} = await dbClient.from('schedules').select()
      if (error) {
        console.log(`Error fetching players: ${error.message}`);
      }
      return mapSchedules(schedules)
    } catch (error) {
      console.error(`Error fetching schedules from db: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async readSchedule(scheduleId: string): Promise<Schedule> {
    try {
      const {data: schedule, error} = await dbClient.from('schedules').select().eq('id', scheduleId)
      if (error) {
        console.log(`Error reading schedule data: ${error.message}`)
        throw error;
      }
      return mapSchedule(schedule[0])
    } catch (error) {
      console.error(`Error reading schedule data from db: ${error.message}`);
      throw error
    }
  }

  async readScheduleByDate(dateIn: Date): Promise<Schedule> | undefined {
    console.log("Schedules Date In: ", dateIn)
    try {
      const {data: schedule, error} = await dbClient.from('schedules').select().eq('date', dateIn)
      if (error) {
        console.log(`Error reading schedule data: ${error.message}`)
      }
      if (!schedule[0]) {
        console.error('No schedule found for this date: ', dateIn)
        return undefined
      }
      return mapSchedule(schedule[0])
    } catch (error) {
      console.error(`Error reading schedule data from db: ${error.message}`);
      throw error
    }
  }

  async updateSchedule(scheduleDataIn: ScheduleData): Promise<Schedule | undefined> {
    try {
      const updatedSchedule = mapScheduleForDb(scheduleDataIn, true)
      const {
        data: schedule,
        error
      } = await dbClient.from('schedules').update(updatedSchedule).eq('id', scheduleDataIn.scheduleId).select()

      if (error) {
        console.log(`Error updating schedule: ${error.message}`)
      }
      return mapSchedule(schedule[0])

    } catch (error) {
      console.error(`Error updating schedule in db: ${error.message}`)
      throw error;
    }

  }

}

export default new ScheduleService()
