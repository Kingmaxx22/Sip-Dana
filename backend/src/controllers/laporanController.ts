import { Request, Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { RowDataPacket } from 'mysql2';

interface Laporan extends RowDataPacket {
  id_laporan: number;
  id_user: number;
  jenisLaporan: string;
  totalPemasukan: number | string;
  totalPengeluaran: number | string;
  saldoAkhir: number | string;
  tanggal_laporan: string;
}

export const getLaporanKeuangan = async (req: AuthRequest, res: Response) => {
  const id_user = req.user?.userId;
  if (!id_user) return res.status(401).json({ message: 'User tidak terotentikasi' });

  const { startDate, endDate, type = 'Harian' } = req.query;

  if (type !== 'Harian' && type !== 'Bulanan' && type !== 'Tahunan') {
      return res.status(400).json({ message: 'Jenis laporan tidak valid.' });
  }
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (startDate && !dateRegex.test(startDate as string)) {
       return res.status(400).json({ message: 'Format startDate tidak valid.' });
  }
   if (endDate && !dateRegex.test(endDate as string)) {
       return res.status(400).json({ message: 'Format endDate tidak valid.' });
  }

  try {
    let sqlQuery = `
      SELECT * FROM laporankeuangan
      WHERE id_user = ? AND jenisLaporan = ?
    `;
    const params: (string | number)[] = [id_user, type as string];

    if (startDate && endDate) {
      sqlQuery += " AND tanggal_laporan BETWEEN ? AND ?";
      params.push(startDate as string, endDate as string);
    } else if (startDate) {
        sqlQuery += " AND tanggal_laporan = ?";
        params.push(startDate as string);
    }
    sqlQuery += " ORDER BY tanggal_laporan ASC";

    const [laporan] = await pool.query<Laporan[]>(sqlQuery, params);
    const formattedLaporan = laporan.map(l => ({
        ...l,
        totalPemasukan: Number(l.totalPemasukan) || 0,
        totalPengeluaran: Number(l.totalPengeluaran) || 0,
        saldoAkhir: Number(l.saldoAkhir) || 0,
    }));
    res.status(200).json(formattedLaporan);
  } catch (error) {
    console.error('Error saat mengambil laporan keuangan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat mengambil laporan.' });
  }
};