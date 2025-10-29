import { Router } from 'express';
import authRoutes from './authRoutes';
import kategoriRoutes from './kategoriRoutes';
import transaksiRoutes from './transaksiRoutes';
import rekomendasiRoutes from './rekomendasiRoutes'; // Plural
import userRoutes from './userRoutes';
import laporanRoutes from './laporanRoutes'; // Plural

const router = Router();

router.use('/auth', authRoutes);
router.use('/kategori', kategoriRoutes);
router.use('/transaksi', transaksiRoutes);
router.use('/rekomendasi', rekomendasiRoutes); // Plural
router.use('/users', userRoutes);
router.use('/laporan', laporanRoutes); // Plural

export default router;