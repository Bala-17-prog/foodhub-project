import express from "express";
import { protect, authorizeRoles } from "../middleware/auth.js";
import { placeOrder, getUserOrders, getOrdersForRestaurant, updateOrderStatus, getAllOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("user"), placeOrder);
router.get("/my-orders", protect, authorizeRoles("user"), getUserOrders);

// restaurant endpoints
router.get("/restaurant-orders", protect, authorizeRoles("restaurant","admin"), getOrdersForRestaurant);
router.put("/:id/status", protect, authorizeRoles("restaurant","admin"), updateOrderStatus);

// admin endpoints
router.get("/", protect, authorizeRoles("admin"), getAllOrders);

export default router;
    