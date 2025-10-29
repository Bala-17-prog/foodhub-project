import express from "express";
import { createFood, getFoods, getMyFoods, updateFood, deleteFood } from "../controllers/foodController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();
router.get("/", getFoods);
router.post("/", protect, authorizeRoles("restaurant","admin"), createFood);
router.get("/my-foods", protect, authorizeRoles("restaurant", "admin"), getMyFoods);
router.put("/:id", protect, authorizeRoles("restaurant", "admin"), updateFood);
router.delete("/:id", protect, authorizeRoles("restaurant", "admin"), deleteFood);
export default router;
