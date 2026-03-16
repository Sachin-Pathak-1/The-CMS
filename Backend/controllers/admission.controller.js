import { z } from "zod";
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";
import { createAuditLog } from "../utils/auditLog.js";
import { listAdmissions, createAdmission, updateAdmission, deleteAdmission } from "../services/admission.service.js";

const admissionSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  courseId: z.number().int().positive().optional(),
  notes: z.string().max(500).optional(),
});

const statusSchema = z.object({ status: z.enum(["pending", "approved", "rejected"]) });

export const getAdmissions = async (_req, res) => {
  try {
    const rows = await listAdmissions();
    return sendSuccess(res, rows);
  } catch (error) {
    console.error(error);
    return sendError(res, "Failed to fetch admissions", 500);
  }
};

export const addAdmission = async (req, res) => {
  try {
    const validated = admissionSchema.parse(req.body);
    const record = await createAdmission({ ...validated, status: "pending" });
    await createAuditLog(req.user?.id || null, "ADMISSION", "CREATE", "Admission", record.id, validated);
    return sendCreated(res, record, "Application submitted");
  } catch (error) {
    if (error.name === "ZodError") return sendError(res, "Validation failed", 400, error.errors);
    console.error(error);
    return sendError(res, "Failed to create admission", 500);
  }
};

export const changeAdmissionStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return sendError(res, "Invalid ID", 400);
    const { status } = statusSchema.parse(req.body);
    const updated = await updateAdmission(id, { status });
    await createAuditLog(req.user.id, "ADMISSION", "UPDATE", "Admission", id, { status });
    return sendSuccess(res, updated, "Status updated");
  } catch (error) {
    if (error.name === "ZodError") return sendError(res, "Validation failed", 400, error.errors);
    console.error(error);
    return sendError(res, "Failed to update admission", 500);
  }
};

export const removeAdmission = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return sendError(res, "Invalid ID", 400);
    await deleteAdmission(id);
    await createAuditLog(req.user.id, "ADMISSION", "DELETE", "Admission", id);
    return sendSuccess(res, null, "Admission deleted");
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") return sendError(res, "Admission not found", 404);
    return sendError(res, "Failed to delete admission", 500);
  }
};
