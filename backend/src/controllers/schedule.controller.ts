import ScheduleService from "../services/schedule.services";
import logger from "../utils/logger";

const getSchedules = async (req, res): Promise<void> => {
  const schedules = await ScheduleService.getAllSchedules();
  res.json(schedules);
};

const readSchedule = async (req, res): Promise<void> => {
  const schedule = await ScheduleService.readSchedule(req.params.id);
  res.json(schedule);
};

const readScheduleByDate = async (req, res): Promise<void> => {
  const date = new Date(req.params.date);
  const schedule = await ScheduleService.readScheduleByDate(date);
  res.json(schedule);
};

const addSchedule = async (req, res): Promise<void> => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  logger.debug(`timezone: ${timeZone}`);
  logger.debug(`scheduleController: ${JSON.stringify(req.body)}`);
  const newSchedule = await ScheduleService.addSchedule(req.body);
  res.status(201).json(newSchedule);
};

const updateSchedule = async (req, res): Promise<void> => {
  const scheduleId = req.params.id;
  const schedule = await ScheduleService.readSchedule(scheduleId);

  logger.debug(
    `req: ${JSON.stringify(req.body)}, schedule: ${JSON.stringify(schedule)}`,
  );
  try {
    const updatedSchedule = { ...schedule, ...req.body };
    const result = await ScheduleService.updateSchedule(updatedSchedule);

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Schedule not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default {
  getSchedules,
  readSchedule,
  readScheduleByDate,
  addSchedule,
  updateSchedule,
};
