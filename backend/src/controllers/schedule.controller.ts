import ScheduleService from "../services/schedule.services";
import schedulesData from "../../tests/__mocks__/mock.schedule";

const getSchedules = async (req, res): Promise<void> => {
  const schedules = schedulesData.getSchedules();
  res.json(schedules);
};

const readSchedule = async (req, res): Promise<void> => {
  const schedule = schedulesData.readSchedule(req.params.id);
  res.json(schedule);
};

const readScheduleByDate = async (req, res): Promise<void> => {
  const date = new Date(req.params.date);
  const schedule = schedulesData.readScheduleByDate(date);
  res.json(schedule);
};

const addSchedule = async (req, res): Promise<void> => {
  const newSchedule = await ScheduleService.addSchedule(req.body);
  res.status(201).json(newSchedule);
};

const updateSchedule = async (req, res): Promise<void> => {
  const scheduleId = req.params.id;
  const schedule = schedulesData.readSchedule(scheduleId);

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
