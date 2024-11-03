import { ScheduleType, MatchType } from '../../src/models/Schedule'

const schedules = [
  {
    scheduleId: 'M0810',
    date: new Date('2024-08-10'),
    type: ScheduleType.MATCH_DAY,
    matchType: MatchType.LEAGUE_GAME
  },
  {
    scheduleId: 'M0817',
    date: new Date('2024-08-17'),
    type: ScheduleType.MATCH_DAY,
    matchType: MatchType.LEAGUE_GAME
  },
  {
    scheduleId: 'M0824',
    date: new Date('2024-08-24'),
    type: ScheduleType.MATCH_DAY,
    matchType: MatchType.LEAGUE_GAME
  },
  {
    scheduleId: 'M0831',
    date: new Date('2024-08-31'),
    type: ScheduleType.MATCH_DAY,
    matchType: MatchType.LEAGUE_GAME
  },
  {
    scheduleId: 'T0813',
    date: new Date('2024-08-13'),
    type: ScheduleType.TRAINING
  },
  {
    scheduleId: 'T0815',
    date: new Date('2024-08-15'),
    type: ScheduleType.TRAINING
  },
  {
    scheduleId: 'M0820',
    date: new Date('2024-08-20'),
    type: ScheduleType.TRAINING
  },
  {
    scheduleId: 'M0822',
    date: new Date('2024-08-22'),
    type: ScheduleType.TRAINING
  },
  {
    scheduleId: 'M0827',
    date: new Date('2024-08-27'),
    type: ScheduleType.TRAINING
  },
  {
    scheduleId: 'M0829',
    date: new Date('2024-08-29'),
    type: ScheduleType.TRAINING
  },
  {
    scheduleId: 'M0903',
    date: new Date('2024-09-03'),
    type: ScheduleType.MATCH_DAY,
    matchType: MatchType.INDOOR_GAME
  }
]

const getSchedules = () => schedules

const readSchedule = (scheduleId: string) => {
  return schedules.find((schedule) => schedule.scheduleId === scheduleId)
}

const readScheduleByDate = (date: Date) => {
  return schedules.find(
    (schedule) => schedule.date.toISOString() === date.toISOString()
  )
}

const addSchedule = (schedule) => {
  schedules.push(schedule)
}

const updateSchedule = (updatedSchedule) => {
  const index = schedules.findIndex(
    (schedule) =>
      schedule.date.toISOString() === updatedSchedule.date.toISOString()
  )
  if (index !== -1) {
    schedules[index] = { ...schedules[index], ...updatedSchedule }
    return schedules[index]
  }
}

export default {
  schedules,
  getSchedules,
  readSchedule,
  readScheduleByDate,
  addSchedule,
  updateSchedule
}
