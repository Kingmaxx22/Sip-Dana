import { Request, Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware'; // Pastikan path middleware benar
import { RowDataPacket } from 'mysql2';
// Import helper updater
import { triggerSummaryUpdates } from '../utils/summaryUpdater'; // Pastikan path utils benar

// Tipe data untuk hasil join (sama seperti sebelumnya)
interface TransaksiWithKategori extends RowDataPacket {
  id_transaksi: number;
  id_user: number;
  id_kategori: number;
  tanggal: string; // Tipe data dari DB adalah DATE (string 'YYYY-MM-DD')
  jumlah: number | string; // Bisa string ".00" dari DB Decimal
  jenis: 'pemasukan' | 'pengeluaran';
  keterangan: string | null;
  created_at: string; // Tipe data dari DB adalah TIMESTAMP/DATETIME (string)
  nama_kategori: string;
}

// === Logika untuk Membuat Transaksi Baru ===
export const createTransaksi = async (req: AuthRequest, res: Response) => {
  const id_user = req.user?.userId;
  if (!id_user) {
    return res.status(401).json({ message: 'User tidak terotentikasi' });
  }

  const { tanggal, jenis, jumlah, id_kategori, keterangan } = req.body;

  if (!tanggal || !jenis || !jumlah || !id_kategori || (jenis !== 'pemasukan' && jenis !== 'pengeluaran') || isNaN(Number(jumlah)) || Number(jumlah) <= 0) {
    return res.status(400).json({ message: 'Input tidak valid. Pastikan semua field wajib diisi dan jumlah valid.' });
  }

  const jumlahDb = parseFloat(jumlah);

  try {
    await pool.query(
      'INSERT INTO transaksi (id_user, id_kategori, tanggal, jumlah, jenis, keterangan) VALUES (?, ?, ?, ?, ?, ?)',
      [id_user, id_kategori, tanggal, jumlahDb, jenis, keterangan || null]
    );
    await triggerSummaryUpdates(id_user, tanggal);
    res.status(201).json({ message: 'Transaksi berhasil dicatat' });
  } catch (error) {
    console.error('Error saat mencatat transaksi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat mencatat transaksi.' });
  }
};

// === Logika untuk Mengambil Transaksi User ===
export const getTransaksiByUser = async (req: AuthRequest, res: Response) => {
  const id_user = req.user?.userId;
  if (!id_user) {
    return res.status(401).json({ message: 'User tidak terotentikasi' });
  }
  const { startDate, endDate, limit } = req.query;

  try {
    let sqlQuery = `
      SELECT t.*, k.nama_kategori
      FROM transaksi t
      JOIN kategori k ON t.id_kategori = k.id_kategori
      WHERE t.id_user = ?
    `;
    const params: (string | number)[] = [id_user];

    if (startDate && endDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(startDate as string) || !dateRegex.test(endDate as string)) {
         return res.status(400).json({ message: 'Format tanggal tidak valid (harus YYYY-MM-DD).' });
      }
      sqlQuery += " AND t.tanggal BETWEEN ? AND ? ";
      params.push(startDate as string, endDate as string);
    }
    sqlQuery += " ORDER BY t.tanggal DESC, t.created_at DESC";
    if (limit && !isNaN(Number(limit)) && Number(limit) > 0) {
        sqlQuery += " LIMIT ?";
        params.push(Number(limit));
    }
    const [transaksi] = await pool.query<TransaksiWithKategori[]>(sqlQuery, params);
    const formattedTransaksi = transaksi.map(trx => ({
        ...trx,
        jumlah: Number(trx.jumlah)
    }));
    res.status(200).json(formattedTransaksi);
  } catch (error) {
    console.error('Error saat mengambil transaksi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat mengambil transaksi.' });
  }
};

// === Logika untuk Update Transaksi ===
export const updateTransaksi = async (req: AuthRequest, res: Response) => {
    const id_user = req.user?.userId;
    const id_transaksi = parseInt(req.params.id);

    if (!id_user) return res.status(401).json({ message: 'User tidak terotentikasi' });
    if (isNaN(id_transaksi)) return res.status(400).json({ message: 'ID Transaksi tidak valid.' });

    const { tanggal, jenis, jumlah, id_kategori, keterangan } = req.body;

    if (!tanggal || !jenis || !jumlah || !id_kategori || (jenis !== 'pemasukan' && jenis !== 'pengeluaran') || isNaN(Number(jumlah)) || Number(jumlah) <= 0) {
        return res.status(400).json({ message: 'Input tidak valid.' });
    }
    const jumlahDb = parseFloat(jumlah);

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [oldTransaksi] = await connection.query<TransaksiWithKategori[]>(
            'SELECT tanggal FROM transaksi WHERE id_transaksi = ? AND id_user = ?',
            [id_transaksi, id_user]
        );

        if (oldTransaksi.length === 0) {
            await connection.rollback(); connection.release();
            return res.status(404).json({ message: 'Transaksi tidak ditemukan atau bukan milik Anda.' });
        }
        const tanggalLama = new Date(oldTransaksi[0].tanggal).toISOString().split('T')[0];

        await connection.query(
            'UPDATE transaksi SET tanggal = ?, jenis = ?, jumlah = ?, id_kategori = ?, keterangan = ? WHERE id_transaksi = ? AND id_user = ?',
            [tanggal, jenis, jumlahDb, id_kategori, keterangan || null, id_transaksi, id_user]
        );

        // Idealnya fungsi triggerSummaryUpdates menerima connection
        await triggerSummaryUpdates(id_user, tanggal);
        if (tanggalLama !== tanggal) {
             await triggerSummaryUpdates(id_user, tanggalLama);
        }

        await connection.commit();
        connection.release();
        res.status(200).json({ message: 'Transaksi berhasil diperbarui' });

    } catch (error) {
        if (connection) { await connection.rollback(); connection.release(); }
        console.error('Error saat update transaksi:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server saat update transaksi.' });
    }
};

// === Logika untuk Delete Transaksi (PERBAIKAN STRUKTUR TRY CATCH) ===
export const deleteTransaksi = async (req: AuthRequest, res: Response) => {
  const id_user = req.user?.userId;
  const id_transaksi = parseInt(req.params.id);

  if (!id_user) return res.status(401).json({ message: 'User tidak terotentikasi' });
  if (isNaN(id_transaksi)) return res.status(400).json({ message: 'ID Transaksi tidak valid.' });

  let connection;
  try { // <-- Pastikan try dimulai di sini
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // 1. Ambil tanggal transaksi yang akan dihapus
       const [transaksiToDelete] = await connection.query<TransaksiWithKategori[]>(
          'SELECT tanggal FROM transaksi WHERE id_transaksi = ? AND id_user = ?',
          [id_transaksi, id_user]
      );

      if (transaksiToDelete.length === 0) {
           await connection.rollback();
           connection.release();
          return res.status(404).json({ message: 'Transaksi tidak ditemukan atau bukan milik Anda.' });
      }
      // Pastikan konversi tanggal benar
      const tanggalTransaksi = new Date(transaksiToDelete[0].tanggal).toISOString().split('T')[0];


      // 2. Hapus transaksi dari database
      const [result] = await connection.query(
          'DELETE FROM transaksi WHERE id_transaksi = ? AND id_user = ?',
          [id_transaksi, id_user]
      );

      // Cek apakah ada baris yang terhapus
      if ((result as any).affectedRows === 0) {
           // Ini seharusnya tidak terjadi jika cek di atas lolos, tapi sebagai pengaman
           await connection.rollback();
           connection.release();
           return res.status(404).json({ message: 'Gagal menghapus transaksi (tidak ditemukan).' });
      }

      // 3. Trigger update summary untuk tanggal transaksi yang dihapus
      // Idealnya fungsi ini menerima 'connection'
      await triggerSummaryUpdates(id_user, tanggalTransaksi);

      await connection.commit(); // Commit jika semua OK
      connection.release(); // Selalu release koneksi
      res.status(200).json({ message: 'Transaksi berhasil dihapus' });

  } catch (error) {
       if (connection) {
          try {
             await connection.rollback(); 
          } catch (rollbackError) {
             console.error('Error during rollback:', rollbackError);
          } finally {
             connection.release(); 
          }
       }
      console.error('Error saat hapus transaksi:', error);
      res.status(500).json({ message: 'Terjadi kesalahan pada server saat menghapus transaksi.' });
  } 
}; 