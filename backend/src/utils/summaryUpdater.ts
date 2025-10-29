import pool from '../config/db';
import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2/promise'; // Impor tipe tambahan

// Tipe untuk hasil query summary
interface SummaryQueryResult extends RowDataPacket {
  totalPemasukan: number;
  totalPengeluaran: number;
}
// Tipe untuk hasil query saldo kumulatif
interface SaldoQueryResult extends RowDataPacket {
  saldoKumulatif: number;
}


/**
 * Mengupdate tabel laporankeuangan untuk user dan tanggal tertentu.
 */
export const updateLaporanKeuangan = async (id_user: number, tanggal: string) => {
  console.log(`Updating laporan keuangan for user ${id_user} on ${tanggal}...`);
  try {
    // 1. Hitung ulang summary
    // Ambil HANYA rows (elemen pertama) dari hasil query
    const [summaryRows] = await pool.query<SummaryQueryResult[]>(`
      SELECT
        COALESCE(SUM(CASE WHEN jenis = 'pemasukan' THEN jumlah ELSE 0 END), 0) AS totalPemasukan,
        COALESCE(SUM(CASE WHEN jenis = 'pengeluaran' THEN jumlah ELSE 0 END), 0) AS totalPengeluaran
      FROM transaksi
      WHERE id_user = ? AND tanggal = ?
    `, [id_user, tanggal]);

    // Pastikan ada hasil (meskipun 0)
    const summaryData = summaryRows[0] || { totalPemasukan: 0, totalPengeluaran: 0 };
    const { totalPemasukan, totalPengeluaran } = summaryData;
    const saldoAkhir = totalPemasukan - totalPengeluaran;

    // 2. Simpan/Update ke laporankeuangan
    await pool.query(`
      INSERT INTO laporankeuangan (id_user, tanggal_laporan, totalPemasukan, totalPengeluaran, saldoAkhir, jenisLaporan)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        totalPemasukan = VALUES(totalPemasukan),
        totalPengeluaran = VALUES(totalPengeluaran),
        saldoAkhir = VALUES(saldoAkhir)
    `, [id_user, tanggal, totalPemasukan, totalPengeluaran, saldoAkhir, 'Harian']);

    console.log(`Laporan keuangan updated for user ${id_user} on ${tanggal}.`);

  } catch (error) {
    console.error(`Error updating laporan keuangan for user ${id_user} on ${tanggal}:`, error);
    // throw error; // Pertimbangkan jika perlu rollback
  }
};

export const updateSaldo = async (id_user: number, tanggal: string) => {
   console.log(`Updating saldo for user ${id_user} on ${tanggal}...`);
   try {
     // 1. Hitung saldo kumulatif
     // Ambil HANYA rows (elemen pertama)
     const [saldoRows] = await pool.query<SaldoQueryResult[]>(`
       SELECT COALESCE(SUM(CASE WHEN jenis = 'pemasukan' THEN jumlah ELSE -jumlah END), 0) AS saldoKumulatif
       FROM transaksi
       WHERE id_user = ? AND tanggal <= ?
     `, [id_user, tanggal]);

     // Pastikan ada hasil
     const saldoData = saldoRows[0] || { saldoKumulatif: 0 };
     const saldoSekarang = saldoData.saldoKumulatif;

     // 2. Simpan/Update ke tabel saldo
     await pool.query(`
       INSERT INTO saldo (id_user, tanggal, saldo_sekarang, sumber)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         saldo_sekarang = VALUES(saldo_sekarang)
     `, [id_user, tanggal, saldoSekarang, 'Perhitungan Transaksi']);

    console.log(`Saldo updated for user ${id_user} on ${tanggal}. Saldo: ${saldoSekarang}`);

   } catch (error) {
     console.error(`Error updating saldo for user ${id_user} on ${tanggal}:`, error);
     // throw error;
   }
};

/**
 * Fungsi utama untuk trigger update.
 */
export const triggerSummaryUpdates = async (id_user: number, tanggal: string) => {
    // Jalankan update secara paralel
    await Promise.all([
        updateLaporanKeuangan(id_user, tanggal),
        updateSaldo(id_user, tanggal)
    ]);
};