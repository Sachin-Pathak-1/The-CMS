import { Router } from "express";
import { addAttendance, getAttendance, removeAttendance } from "../controllers/attendance.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.js";

const router = Router();

router.get("/", authenticate, authorize(["admin", "teacher", "student"]), getAttendance);
router.post("/", authenticate, authorize(["admin", "teacher"]), addAttendance);
router.delete("/:id", authenticate, authorize(["admin", "teacher"]), removeAttendance);

export default router;
