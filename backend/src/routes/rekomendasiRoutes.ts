import { Router } from 'express';
import {
  generateSpendingHabitRecommendation,
  generateWeeklySavingsRecommendation,
  getLatestRecommendation
} from '../controllers/rekomendasiController'; // Singular
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/generate/habits', protect, generateSpendingHabitRecommendation);
router.get('/generate/savings', protect, generateWeeklySavingsRecommendation);
router.get('/latest/:type', protect, getLatestRecommendation);

export default router;