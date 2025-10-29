import { Router } from 'express';
import { updateUserProfile, updateUserPassword } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, updateUserPassword);

export default router;