import express from "express";
import { createRestaurant, listRestaurants, getRestaurantById, updateRestaurant, approveRestaurant, rejectRestaurant, getMyRestaurant } from "../controllers/restaurantController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

console.log('🟢 Restaurant routes file loaded');

const router = express.Router();
router.get("/", listRestaurants);
router.get("/my-restaurant", (req, res, next) => {
  console.log('🔥 MY-RESTAURANT ROUTE HIT');
  console.log('Headers:', req.headers.authorization ? 'Auth present' : 'No auth');
  next();
}, protect, authorizeRoles("restaurant"), getMyRestaurant);
router.get("/:id", getRestaurantById);
router.post("/", protect, authorizeRoles("restaurant"), createRestaurant);
router.put("/:id", protect, authorizeRoles("restaurant", "admin"), updateRestaurant);

// admin endpoints
router.put("/:id/approve", protect, authorizeRoles("admin"), approveRestaurant);
router.put("/:id/reject", protect, authorizeRoles("admin"), rejectRestaurant);

export default router;

