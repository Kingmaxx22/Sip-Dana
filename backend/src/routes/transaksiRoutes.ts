import { Router } from 'express';
import { 
    createTransaksi, 
    getTransaksiByUser, 
    updateTransaksi, 
    deleteTransaksi 
} from '../controllers/transaksiController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getTransaksiByUser);
router.post('/', protect, createTransaksi);
router.put('/:id', protect, updateTransaksi);
router.delete('/:id', protect, deleteTransaksi);

export default router;