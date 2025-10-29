// routes/admin.js
import express from "express";
import { protect, authorizeRoles } from "../middleware/auth.js";
import { createAdmin } from "../controllers/adminController.js";

const router = express.Router();

// Only existing admin can create a new admin
router.post("/create", protect, authorizeRoles("admin"), createAdmin);

export default router;
