import { Router } from 'express';
import { getAllKategori } from '../controllers/kategoriController';
import { protect } from '../middleware/authMiddleware'; 

const router = Router();

router.get('/', protect, getAllKategori);

export default router;