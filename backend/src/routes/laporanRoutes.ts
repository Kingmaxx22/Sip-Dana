import { Router } from 'express';
import { getLaporanKeuangan } from '../controllers/laporanController'; // Singular
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getLaporanKeuangan);

export default router;