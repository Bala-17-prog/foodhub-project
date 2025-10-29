import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// 👥 Admin can view all users
router.get("/", protect, authorizeRoles("admin"), getAllUsers);

// 👤 Get logged-in user profile
router.get("/me", protect, (req, res) => {
  res.status(200).json(req.user);
});

// 🔍 Get single user by ID (admin)
router.get("/:id", protect, authorizeRoles("admin"), getUserById);

// ✏️ Update user profile (self)
router.put("/update", protect, updateUser);

// ❌ Delete user (self or admin)
router.delete("/:id", protect, deleteUser);

export default router;
