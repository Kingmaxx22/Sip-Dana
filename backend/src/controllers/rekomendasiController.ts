import { Request, Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { RowDataPacket } from 'mysql2';

interface SpendingByCategory extends RowDataPacket {
  nama_kategori: string;
  total_pengeluaran: number;
}
interface Metode extends RowDataPacket {
  id_metode: number;
  namaMetode: string;
  deskripsiMetode: string;
}
interface SummaryResult extends RowDataPacket {
  totalPemasukan: number;
  totalPengeluaran: number;
}
interface RekomendasiDB extends RowDataPacket {
  id_rekomendasi: number;
  id_laporan: number | null;
  id_user: number | null;
  id_metode: number | null;
  tanggal_dibuat: string;
  tipeRekomendasi: string;
  detailRekomendasi: string;
  status: string;
  namaMetode: string | null;
  deskripsiMetode: string | null;
}

const formatIDR = (value: number | undefined | null | string) => {
   const numValue = Number(value) || 0;
   return new Intl.NumberFormat('id-ID', {
       style: 'currency',
       currency: 'IDR',
       minimumFractionDigits: 0,
       maximumFractionDigits: 0
    }).format(numValue);
};

const saveRekomendasi = async (
    id_user: number,
    tipe: 'Habit' | 'Savings',
    rekomendasiTeks: string,
    id_metode: number | null = null,
    id_laporan: number | null = null
) => {
    try {
        await pool.query(`
            INSERT INTO rekomendasi (id_user, tipeRekomendasi, detailRekomendasi, id_metode, id_laporan, tanggal_dibuat, status)
            VALUES (?, ?, ?, ?, ?, CURDATE(), ?)
        `, [id_user, tipe, rekomendasiTeks, id_metode, id_laporan, 'aktif']);
        console.log(`Rekomendasi ${tipe} disimpan untuk user ${id_user}`);
    } catch (saveError) {
        console.error(`Error menyimpan rekomendasi ${tipe} untuk user ${id_user}:`, saveError);
    }
};

export const generateSpendingHabitRecommendation = async (req: AuthRequest, res: Response) => {
  const id_user = req.user?.userId;
  if (!id_user) return res.status(401).json({ message: 'User tidak terotentikasi' });

  try {
    const [spending] = await pool.query<SpendingByCategory[]>(`
      SELECT k.nama_kategori, SUM(t.jumlah) AS total_pengeluaran
      FROM transaksi t JOIN kategori k ON t.id_kategori = k.id_kategori
      WHERE t.id_user = ? AND t.jenis = 'pengeluaran' AND DATE(t.tanggal) >= CURDATE() - INTERVAL 30 DAY
      GROUP BY k.nama_kategori ORDER BY total_pengeluaran DESC LIMIT 1
    `, [id_user]);

    let rekomendasiTeks: string;
    let selectedMethod: Metode | null = null;
    let id_metode_terpilih: number | null = null;

    if (spending.length === 0) {
      rekomendasiTeks = "Belum ada data pengeluaran 30 hari terakhir untuk dianalisis.";
    } else {
      const topCategory = spending[0];
      const [metodeResult] = await pool.query<Metode[]>(`
          SELECT id_metode, namaMetode, deskripsiMetode FROM metodemengelola ORDER BY RAND() LIMIT 1
      `);
      if (metodeResult.length > 0) {
          selectedMethod = metodeResult[0];
          id_metode_terpilih = selectedMethod.id_metode;
      }
      const totalFormatted = formatIDR(topCategory.total_pengeluaran);
      rekomendasiTeks = `Pengeluaran terbesar Anda bulan ini ada di kategori "${topCategory.nama_kategori}" (${totalFormatted}).`;
    }

    await saveRekomendasi(id_user, 'Habit', rekomendasiTeks, id_metode_terpilih);

    res.status(200).json({
      rekomendasi: rekomendasiTeks,
      metode: selectedMethod
    });

  } catch (error) {
    console.error('Error saat generate rekomendasi habit:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat membuat rekomendasi habit.' });
  }
};

export const generateWeeklySavingsRecommendation = async (req: AuthRequest, res: Response) => {
  const id_user = req.user?.userId;
  if (!id_user) return res.status(401).json({ message: 'User tidak terotentikasi' });

  try {
    const [summary] = await pool.query<SummaryResult[]>(`
      SELECT
        COALESCE(SUM(CASE WHEN jenis = 'pemasukan' THEN jumlah ELSE 0 END), 0) AS totalPemasukan,
        COALESCE(SUM(CASE WHEN jenis = 'pengeluaran' THEN jumlah ELSE 0 END), 0) AS totalPengeluaran
      FROM transaksi
      WHERE id_user = ? AND DATE(tanggal) >= CURDATE() - INTERVAL 7 DAY
    `, [id_user]);

    const weeklyData = summary[0] || { totalPemasukan: 0, totalPengeluaran: 0 };
    const { totalPemasukan, totalPengeluaran } = weeklyData;
    const saldoMingguan = totalPemasukan - totalPengeluaran;

    let rekomendasiTeks = "";
    let targetMenabung: number | null = null;

    if (totalPemasukan === 0 && totalPengeluaran === 0) {
      rekomendasiTeks = "Belum ada transaksi dalam 7 hari terakhir untuk membuat rekomendasi tabungan.";
    } else if (saldoMingguan <= 0) {
      rekomendasiTeks = `Minggu ini, pengeluaran Anda (${formatIDR(totalPengeluaran)}) setara atau melebihi pemasukan (${formatIDR(totalPemasukan)}). Coba evaluasi pengeluaran non-esensial.`;
    } else {
      targetMenabung = Math.round(saldoMingguan * 0.5);
      rekomendasiTeks = `Luar biasa! Minggu ini Anda memiliki sisa dana (surplus) sebesar ${formatIDR(saldoMingguan)}. Kami merekomendasikan menabung setidaknya 50%.`;
    }

    const detailSimpan = `${rekomendasiTeks}|${targetMenabung !== null ? targetMenabung : 'null'}`;
    await saveRekomendasi(id_user, 'Savings', detailSimpan);

    res.status(200).json({
      totalPemasukan,
      totalPengeluaran,
      saldoMingguan,
      rekomendasiTeks,
      targetMenabung
    });

  } catch (error) {
    console.error('Error saat generate rekomendasi tabungan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat membuat rekomendasi tabungan.' });
  }
};

export const getLatestRecommendation = async (req: AuthRequest, res: Response) => {
    const id_user = req.user?.userId;
    const tipe = req.params.type;

    if (!id_user) return res.status(401).json({ message: 'User tidak terotentikasi' });
    if (tipe !== 'habits' && tipe !== 'savings') {
        return res.status(400).json({ message: 'Tipe rekomendasi tidak valid.' });
    }

    let recommendationQueryType: string;
    let totalPemasukan = 0;
    let totalPengeluaran = 0;
    let saldoMingguan = 0;

    try {
        if (tipe === 'habits') {
            const [summary] = await pool.query<SummaryResult[]>(`
                SELECT COALESCE(SUM(CASE WHEN jenis = 'pemasukan' THEN jumlah ELSE 0 END), 0) AS totalPemasukan,
                       COALESCE(SUM(CASE WHEN jenis = 'pengeluaran' THEN jumlah ELSE 0 END), 0) AS totalPengeluaran
                FROM transaksi WHERE id_user = ? AND DATE(tanggal) >= CURDATE() - INTERVAL 30 DAY
            `, [id_user]);
            const summaryRow = summary[0];
            totalPemasukan = summaryRow ? Number(summaryRow.totalPemasukan) : 0;
            totalPengeluaran = summaryRow ? Number(summaryRow.totalPengeluaran) : 0;

            if (totalPemasukan === 0 && totalPengeluaran === 0) recommendationQueryType = 'Umum';
            else if (totalPengeluaran > totalPemasukan) recommendationQueryType = 'Kontrol Pengeluaran';
            else recommendationQueryType = 'Optimasi Keuangan';

        } else {
            const [summary] = await pool.query<SummaryResult[]>(`
                SELECT COALESCE(SUM(CASE WHEN jenis = 'pemasukan' THEN jumlah ELSE 0 END), 0) AS totalPemasukan,
                       COALESCE(SUM(CASE WHEN jenis = 'pengeluaran' THEN jumlah ELSE 0 END), 0) AS totalPengeluaran
                FROM transaksi WHERE id_user = ? AND DATE(tanggal) >= CURDATE() - INTERVAL 7 DAY
            `, [id_user]);
            const summaryRow = summary[0];
            totalPemasukan = summaryRow ? Number(summaryRow.totalPemasukan) : 0;
            totalPengeluaran = summaryRow ? Number(summaryRow.totalPengeluaran) : 0;
            saldoMingguan = totalPemasukan - totalPengeluaran;

            if (totalPemasukan === 0 && totalPengeluaran === 0) recommendationQueryType = 'Umum';
            else if (saldoMingguan > 0) recommendationQueryType = 'Tips Menabung';
            else recommendationQueryType = 'Evaluasi Mingguan';
        }

        console.log(`Mencari rekomendasi tipe: ${recommendationQueryType} untuk user ${id_user} atau global`);

        let [recs] = await pool.query<RekomendasiDB[]>(`
            SELECT r.*, m.namaMetode, m.deskripsiMetode FROM rekomendasi r
            LEFT JOIN metodemengelola m ON r.id_metode = m.id_metode
            WHERE (r.id_user = ? OR r.id_user IS NULL) AND r.tipeRekomendasi = ? AND r.status = 'aktif'
            ORDER BY CASE WHEN r.id_user = ? THEN 0 ELSE 1 END, RAND() LIMIT 1
        `, [id_user, recommendationQueryType, id_user]);

        if (recs.length === 0 && recommendationQueryType !== 'Umum') {
             [recs] = await pool.query<RekomendasiDB[]>(`
                 SELECT r.*, m.namaMetode, m.deskripsiMetode FROM rekomendasi r
                 LEFT JOIN metodemengelola m ON r.id_metode = m.id_metode
                 WHERE r.id_user IS NULL AND r.tipeRekomendasi = 'Umum' AND r.status = 'aktif'
                 ORDER BY RAND() LIMIT 1
              `);
        }
        if (recs.length === 0) {
            const defaultMessage = "Rekomendasi belum tersedia. Terus catat transaksi Anda.";
            if(tipe === 'habits') return res.status(200).json({ rekomendasi: defaultMessage, metode: null });
            else return res.status(200).json({ totalPemasukan: 0, totalPengeluaran: 0, saldoMingguan: 0, rekomendasiTeks: defaultMessage, targetMenabung: null });
        }

        const result = recs[0];

        if (tipe === 'habits') {
             let detailTambahan = "";
             const [spending] = await pool.query<SpendingByCategory[]>(`
                SELECT k.nama_kategori, SUM(t.jumlah) AS total_pengeluaran
                FROM transaksi t JOIN kategori k ON t.id_kategori = k.id_kategori
                WHERE t.id_user = ? AND t.jenis = 'pengeluaran' AND DATE(t.tanggal) >= CURDATE() - INTERVAL 30 DAY
                GROUP BY k.nama_kategori ORDER BY total_pengeluaran DESC LIMIT 1
             `, [id_user]);
             if (spending.length > 0) { detailTambahan = ` Fokus pada "${spending[0].nama_kategori}" (${formatIDR(spending[0].total_pengeluaran)}).`; }

             res.status(200).json({
                rekomendasi: result.detailRekomendasi + detailTambahan,
                metode: result.id_metode ? { namaMetode: result.namaMetode, deskripsiMetode: result.deskripsiMetode } : null,
                tanggal_dibuat: result.tanggal_dibuat
            });
        } else {
             let targetMenabung: number | null = null;
             let rekomendasiTeks = result.detailRekomendasi || "";
             const parts = result.detailRekomendasi?.split('|');
             
             if (parts && parts.length === 2) {
                 rekomendasiTeks = parts[0];
                 if (parts[1] === 'placeholder_target') {
                     if (saldoMingguan > 0) {
                         targetMenabung = Math.round(saldoMingguan * 0.5);
                         rekomendasiTeks = `${rekomendasiTeks} Target 50% surplus: ${formatIDR(targetMenabung)}.`;
                     }
                 } else if (parts[1] !== 'null' && !isNaN(parseInt(parts[1]))) { targetMenabung = parseInt(parts[1]); }
             }

             res.status(200).json({
                 totalPemasukan: totalPemasukan,
                 totalPengeluaran: totalPengeluaran,
                 saldoMingguan: saldoMingguan,
                 rekomendasiTeks: rekomendasiTeks,
                 targetMenabung: targetMenabung,
                 tanggal_dibuat: result.tanggal_dibuat
             });
        }
    } catch (error) {
        console.error(`Error get latest rec (${tipe}):`, error);
        res.status(500).json({ message: 'Server error get recommendation.' });
    }
};