import { Router } from "express";
import { addAdmission, changeAdmissionStatus, getAdmissions, removeAdmission } from "../controllers/admission.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.js";

const router = Router();

router.get("/", authenticate, authorize(["admin", "teacher"]), getAdmissions);
router.post("/", authenticate, authorize(["admin", "teacher", "student", "parent", "staff"]), addAdmission);
router.patch("/:id/status", authenticate, authorize(["admin", "teacher"]), changeAdmissionStatus);
router.delete("/:id", authenticate, authorize(["admin"]), removeAdmission);

export default router;
