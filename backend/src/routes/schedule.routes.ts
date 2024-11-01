import scheduleController from "../controllers/schedule.controller";
import express from "express";

const router = express.Router();

router.get("/schedules", scheduleController.getSchedules);
router.get("/schedules/id/:id", scheduleController.readSchedule);
router.get("/schedules/date/:date", scheduleController.readScheduleByDate);
router.post("/schedules", scheduleController.addSchedule);
router.put("/schedules/:id", scheduleController.updateSchedule) 

export default router;
