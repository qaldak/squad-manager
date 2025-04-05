import { ScheduleType, MatchType } from "../../src/models/Schedule";
import logger from "../../src/utils/logger";

const mockSchedules = [
  {
    id: "M0810",
    date: new Date("2024-08-10"),
    type: ScheduleType.GAME_DAY,
    matchtype: MatchType.LEAGUE,
  },
  {
    id: "M0817",
    date: new Date("2024-08-17"),
    type: ScheduleType.GAME_DAY,
    matchtype: MatchType.LEAGUE,
  },
  {
    id: "M0824",
    date: new Date("2024-08-24"),
    type: ScheduleType.GAME_DAY,
    matchtype: MatchType.LEAGUE,
  },
  {
    id: "M0827",
    date: new Date("2024-08-27"),
    type: ScheduleType.GAME_DAY,
    matchtype: MatchType.CUP,
  },
  {
    id: "M0831",
    date: new Date("2024-08-31"),
    type: ScheduleType.GAME_DAY,
    matchtype: MatchType.LEAGUE,
  },
  {
    id: "T0813",
    date: new Date("2024-08-13"),
    type: ScheduleType.TRAINING,
    matchtype: undefined,
  },
  {
    id: "T0815",
    date: new Date("2024-08-15"),
    type: ScheduleType.TRAINING,
    matchtype: undefined,
  },
  {
    id: "T0820",
    date: new Date("2024-08-20"),
    type: ScheduleType.TRAINING,
    matchtype: undefined,
  },
  {
    id: "T0822",
    date: new Date("2024-08-22"),
    type: ScheduleType.TRAINING,
    matchtype: undefined,
  },
  {
    id: "T0827",
    date: new Date("2024-08-27"),
    type: ScheduleType.TRAINING,
    matchtype: undefined,
  },
  {
    id: "T0829",
    date: new Date("2024-08-29"),
    type: ScheduleType.TRAINING,
    matchtype: undefined,
  },
  {
    id: "M0903",
    date: new Date("2024-09-03"),
    type: ScheduleType.GAME_DAY,
    matchtype: MatchType.INDOOR,
  },
];

const getSchedules = () => mockSchedules;

const readSchedule = (scheduleId: string) => {
  return mockSchedules.find((schedule) => schedule.id === scheduleId);
};

const readScheduleByDate = (date: Date) => {
  return mockSchedules.find(
    (schedule) => schedule.date.toISOString() === date.toISOString(),
  );
};

const addSchedule = (schedule) => {
  schedule.id = "987z4321-e89b-12d3-a456-426614174000";
  mockSchedules.push(schedule);
  return mockSchedules[mockSchedules.length - 1];
};

const updateSchedule = (updatedSchedule) => {
  const index = mockSchedules.findIndex(
    (schedule) => schedule.id === updatedSchedule.id,
  );
  logger.debug(`index: ${index}`);

  if (index !== -1) {
    mockSchedules[index] = { ...mockSchedules[index], ...updatedSchedule };
    return mockSchedules[index];
  }
};

export default {
  mockSchedules,
  getSchedules,
  readSchedule,
  readScheduleByDate,
  addSchedule,
  updateSchedule,
};
