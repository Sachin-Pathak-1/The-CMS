import express from "express";
import {
  getPublicList,
  getPublicTeacherById,
  getPublicStudentById,
  getPublicCalendarEvents,
  getPublicSummary,
} from "../controllers/public.controller.js";

const router = express.Router();

router.get("/lists/:type", getPublicList);
router.get("/details/teachers/:id", getPublicTeacherById);
router.get("/details/students/:id", getPublicStudentById);
router.get("/calendar-events", getPublicCalendarEvents);
router.get("/summary", getPublicSummary);

export default router;
