import express from 'express';
import {
  createDietPlan,
  getUserDietPlans,
  getDietPlanById,
  updateDietPlan,
  deleteDietPlan,
} from '../controllers/dietPlanController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.post('/', protect, createDietPlan);
router.get('/', protect, getUserDietPlans);
router.get('/:id', protect, getDietPlanById);
router.put('/:id', protect, updateDietPlan);
router.delete('/:id', protect, deleteDietPlan);

export default router;
