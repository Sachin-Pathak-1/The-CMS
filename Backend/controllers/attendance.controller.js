import { z } from "zod";
import { listAttendance, createAttendance, deleteAttendance } from "../services/attendance.service.js";
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";
import { createAuditLog } from "../utils/auditLog.js";
import prisma from "../utils/prisma.js";
import { creditWallet } from "../services/wallet.service.js";

const attendanceSchema = z.object({
  userId: z.string().uuid().optional(),
  username: z.string().min(1).optional(),
  courseId: z.number().int().positive().optional(),
  status: z.enum(["Present", "Late", "Absent"]),
  date: z.string().optional(),
}).refine((data) => data.userId || data.username, {
  path: ["userId"],
  message: "userId or username is required",
});

export const getAttendance = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 200;
    const rows = await listAttendance(limit);
    const data = rows.map((row) => ({
      id: row.id,
      studentName:
        [row.user?.userDetails?.firstName, row.user?.userDetails?.lastName].filter(Boolean).join(" ") ||
        row.user?.username ||
        "Student",
      class: row.course?.name || "N/A",
      status: row.status,
      date: row.date,
      userId: row.userId,
      courseId: row.courseId,
    }));
    return sendSuccess(res, data);
  } catch (error) {
    console.error(error);
    return sendError(res, "Failed to fetch attendance", 500);
  }
};

export const addAttendance = async (req, res) => {
  try {
    const validated = attendanceSchema.parse(req.body);
    const date = validated.date ? new Date(validated.date) : new Date();

    let userId = validated.userId;
    if (!userId && validated.username) {
      const user = await prisma.user.findUnique({ where: { username: validated.username } });
      if (!user) return sendError(res, "User not found", 404);
      userId = user.id;
    }

    const record = await createAttendance({ ...validated, userId, date });
    // Reward attendance: +5 pts
    await creditWallet(userId, 5, "Attendance bonus");
    await createAuditLog(req.user.id, "ATTENDANCE", "CREATE", "Attendance", record.id, validated);
    return sendCreated(res, record, "Attendance recorded");
  } catch (error) {
    if (error.name === "ZodError")
      return sendError(res, "Validation failed", 400, error.errors.map((e) => ({ field: e.path.join("."), message: e.message })));
    console.error(error);
    return sendError(res, "Failed to add attendance", 500);
  }
};

export const removeAttendance = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return sendError(res, "Invalid ID", 400);
    await deleteAttendance(id);
    await createAuditLog(req.user.id, "ATTENDANCE", "DELETE", "Attendance", id);
    return sendSuccess(res, null, "Attendance deleted");
  } catch (error) {
    if (error.code === "P2025") return sendError(res, "Attendance not found", 404);
    console.error(error);
    return sendError(res, "Failed to delete attendance", 500);
  }
};
