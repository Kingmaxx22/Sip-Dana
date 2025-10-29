-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 29, 2025 at 04:30 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sip_dana`
--

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id_kategori` int(11) NOT NULL,
  `nama_kategori` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`id_kategori`, `nama_kategori`, `created_at`) VALUES
(1, 'Gaji', '2025-10-27 06:08:27'),
(2, 'Bonus', '2025-10-27 06:08:27'),
(3, 'Investasi', '2025-10-27 06:08:27'),
(4, 'Makanan', '2025-10-27 06:08:27'),
(5, 'Transportasi', '2025-10-27 06:08:27'),
(6, 'Hiburan', '2025-10-27 06:08:27'),
(7, 'Pendidikan', '2025-10-27 06:08:27'),
(8, 'Kesehatan', '2025-10-27 06:08:27'),
(9, 'Utilitas', '2025-10-27 06:08:27'),
(10, 'Belanja', '2025-10-27 06:08:27');

-- --------------------------------------------------------

--
-- Table structure for table `laporankeuangan`
--

CREATE TABLE `laporankeuangan` (
  `id_laporan` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `jenisLaporan` varchar(50) DEFAULT NULL,
  `totalPemasukan` decimal(15,2) NOT NULL DEFAULT 0.00,
  `totalPengeluaran` decimal(15,2) NOT NULL DEFAULT 0.00,
  `saldoAkhir` decimal(15,2) NOT NULL DEFAULT 0.00,
  `tanggal_laporan` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `laporankeuangan`
--

INSERT INTO `laporankeuangan` (`id_laporan`, `id_user`, `jenisLaporan`, `totalPemasukan`, `totalPengeluaran`, `saldoAkhir`, `tanggal_laporan`, `created_at`) VALUES
(1, 1, 'Harian', 2000000.00, 0.00, 2000000.00, '2025-10-22', '2025-10-29 02:44:28'),
(2, 1, 'Harian', 0.00, 1500000.00, -1500000.00, '2025-10-23', '2025-10-29 02:57:00');

-- --------------------------------------------------------

--
-- Table structure for table `metodemengelola`
--

CREATE TABLE `metodemengelola` (
  `id_metode` int(11) NOT NULL,
  `namaMetode` varchar(100) NOT NULL,
  `deskripsiMetode` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `metodemengelola`
--

INSERT INTO `metodemengelola` (`id_metode`, `namaMetode`, `deskripsiMetode`, `created_at`) VALUES
(1, 'Budget 50/30/20', 'Alokasikan 50% untuk kebutuhan, 30% untuk keinginan, 20% untuk tabungan', '2025-10-27 06:08:27'),
(2, 'Envelope System', 'Pisahkan uang untuk setiap kategori pengeluaran dalam amplop terpisah', '2025-10-27 06:08:27'),
(3, 'Zero-Based Budgeting', 'Setiap rupiah yang masuk dialokasikan untuk pengeluaran atau tabungan', '2025-10-27 06:08:27'),
(4, 'Pay Yourself First', 'Prioritaskan menabung sebelum menggunakan uang untuk pengeluaran lain', '2025-10-27 06:08:27');

-- --------------------------------------------------------

--
-- Table structure for table `rekomendasi`
--

CREATE TABLE `rekomendasi` (
  `id_rekomendasi` int(11) NOT NULL,
  `id_laporan` int(11) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL COMMENT 'NULL jika global, ID user jika spesifik',
  `id_metode` int(11) DEFAULT NULL,
  `tanggal_dibuat` date NOT NULL,
  `tipeRekomendasi` varchar(100) DEFAULT NULL,
  `detailRekomendasi` text DEFAULT NULL COMMENT 'Teks atau detail isi rekomendasi',
  `status` varchar(50) DEFAULT 'aktif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rekomendasi`
--

INSERT INTO `rekomendasi` (`id_rekomendasi`, `id_laporan`, `id_user`, `id_metode`, `tanggal_dibuat`, `tipeRekomendasi`, `detailRekomendasi`, `status`, `created_at`) VALUES
(1, NULL, 1, 1, '0000-00-00', 'Kontrol Pengeluaran', 'Pengeluaran bulananmu terlihat lebih besar dari pemasukan. Coba tinjau kembali pos \"Keinginan\" (Wants) kamu. Metode 50/30/20 bisa membantu memetakannya.', 'aktif', '2025-10-29 02:14:07'),
(2, NULL, 1, 2, '0000-00-00', 'Kontrol Pengeluaran', 'Pengeluaranmu cukup tinggi. Coba gunakan \"Sistem Amplop\" untuk kategori variabel seperti makan dan hiburan agar tidak melebihi budget.', 'aktif', '2025-10-29 02:14:07'),
(3, NULL, 1, 3, '0000-00-00', 'Kontrol Pengeluaran', 'Ada kebocoran pada budget bulananmu. Metode \"Zero-Based Budgeting\" bisa memaksamu untuk memberi tujuan pada setiap rupiah, sehingga tidak ada pengeluaran tak terduga.', 'aktif', '2025-10-29 02:14:07'),
(4, NULL, 1, 4, '0000-00-00', 'Optimasi Keuangan', 'Kerja bagus! Kamu berhasil surplus bulan ini. Pertimbangkan untuk \"Membayar Diri Sendiri Dulu\" (Pay Yourself First) agar surplus ini bisa langsung masuk ke tabungan di awal bulan.', 'aktif', '2025-10-29 02:14:07'),
(5, NULL, 1, 1, '0000-00-00', 'Optimasi Keuangan', 'Kamu punya sisa dana yang bagus bulan ini. Metode 50/30/20 bisa membantumu mengalokasikan sisa dana itu ke pos Tabungan/Investasi agar lebih optimal.', 'aktif', '2025-10-29 02:14:07'),
(6, NULL, 1, NULL, '0000-00-00', 'Tips Menabung', 'Luar biasa! Minggu ini Anda memiliki sisa dana (surplus). Kami merekomendasikan menabung setidaknya 50%.|placeholder_target', 'aktif', '2025-10-29 02:14:07'),
(7, NULL, 1, NULL, '0000-00-00', 'Tips Menabung', 'Surplus mingguan ini adalah awal yang baik. Coba buat target menabung kecil-kecilan untuk minggu depan.|placeholder_target', 'aktif', '2025-10-29 02:14:07'),
(8, NULL, 1, NULL, '0000-00-00', 'Evaluasi Mingguan', 'Minggu ini pengeluaranmu cukup tinggi. Coba lihat kembali riwayat transaksi dan identifikasi 3 pengeluaran non-esensial terbesar yang bisa dikurangi.|null', 'aktif', '2025-10-29 02:14:07'),
(9, NULL, 1, NULL, '0000-00-00', 'Evaluasi Mingguan', 'Kamu impas minggu ini. Ini lebih baik daripada minus, tapi tidak ada dana untuk ditabung. Coba cari satu kategori yang bisa kamu hemat 10% untuk minggu depan.|null', 'aktif', '2025-10-29 02:14:07'),
(10, NULL, 1, NULL, '0000-00-00', 'Umum', 'Konsistensi adalah kunci. Terus catat setiap transaksi, sekecil apapun, agar analisis keuanganmu semakin akurat.', 'aktif', '2025-10-29 02:14:07'),
(11, NULL, 1, NULL, '0000-00-00', 'Umum', 'Sudah cek kategori pengeluaranmu? Pastikan kamu menggunakan kategori yang tepat untuk setiap transaksi agar mudah dievaluasi.', 'aktif', '2025-10-29 02:14:07'),
(12, NULL, NULL, 1, '0000-00-00', 'Kontrol Pengeluaran', 'Pengeluaran bulananmu nampaknya tinggi. Coba alokasikan danamu pakai metode 50/30/20 untuk mengontrol pos \"Keinginan\".', 'aktif', '2025-10-29 02:20:03'),
(13, NULL, NULL, 2, '0000-00-00', 'Kontrol Pengeluaran', 'Untuk mengendalikan pengeluaran variabel, Sistem Amplop bisa sangat membantu membatasi budget harian/mingguan.', 'aktif', '2025-10-29 02:20:03'),
(14, NULL, NULL, 4, '0000-00-00', 'Optimasi Keuangan', 'Manajemen keuanganmu sudah baik! Pertimbangkan untuk otomatis menyisihkan sebagian dana di awal bulan (Pay Yourself First) ke tabungan/investasi.', 'aktif', '2025-10-29 02:20:03'),
(15, NULL, NULL, NULL, '0000-00-00', 'Tips Menabung', 'Ada sisa dana minggu ini! Segera amankan ke pos tabungan agar tidak terpakai untuk hal konsumtif.', 'aktif', '2025-10-29 02:20:03'),
(16, NULL, NULL, NULL, '0000-00-00', 'Evaluasi Mingguan', 'Pengeluaran minggu ini cukup besar. Luangkan waktu sejenak untuk melihat riwayat transaksi dan cari area penghematan.', 'aktif', '2025-10-29 02:20:03'),
(17, NULL, NULL, NULL, '0000-00-00', 'Umum', 'Mencatat transaksi secara rutin adalah langkah awal terpenting dalam mengelola keuangan.', 'aktif', '2025-10-29 02:20:03');

-- --------------------------------------------------------

--
-- Table structure for table `saldo`
--

CREATE TABLE `saldo` (
  `id_saldo` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `sumber` varchar(100) DEFAULT NULL,
  `saldo_sekarang` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `saldo`
--

INSERT INTO `saldo` (`id_saldo`, `id_user`, `tanggal`, `sumber`, `saldo_sekarang`, `created_at`) VALUES
(1, 1, '2025-10-22', 'Perhitungan Transaksi', 2000000.00, '2025-10-29 02:44:28'),
(2, 1, '2025-10-23', 'Perhitungan Transaksi', 500000.00, '2025-10-29 02:57:00');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id_transaksi` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_kategori` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `jumlah` decimal(15,2) NOT NULL,
  `jenis` enum('pemasukan','pengeluaran') NOT NULL,
  `saldo` decimal(15,2) DEFAULT NULL,
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaksi`
--

INSERT INTO `transaksi` (`id_transaksi`, `id_user`, `id_kategori`, `tanggal`, `jumlah`, `jenis`, `saldo`, `keterangan`, `created_at`) VALUES
(10, 1, 1, '2025-10-22', 2000000.00, 'pemasukan', NULL, 'Kerja', '2025-10-29 02:44:28'),
(11, 1, 6, '2025-10-23', 1500000.00, 'pengeluaran', NULL, 'Beli Monitor', '2025-10-29 02:57:00');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `username`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'Reyhan', 'reyhan@gmail.com', '$2b$10$u/3vKHd8Rot0HRv6scBOhuGwWpv6S3vs5gUG/RMXLIdU5vtTv4ISS', '2025-10-27 08:30:06', '2025-10-28 17:11:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id_kategori`),
  ADD UNIQUE KEY `nama_kategori` (`nama_kategori`);

--
-- Indexes for table `laporankeuangan`
--
ALTER TABLE `laporankeuangan`
  ADD PRIMARY KEY (`id_laporan`),
  ADD UNIQUE KEY `unique_user_date` (`id_user`,`tanggal_laporan`),
  ADD KEY `idx_user` (`id_user`);

--
-- Indexes for table `metodemengelola`
--
ALTER TABLE `metodemengelola`
  ADD PRIMARY KEY (`id_metode`);

--
-- Indexes for table `rekomendasi`
--
ALTER TABLE `rekomendasi`
  ADD PRIMARY KEY (`id_rekomendasi`),
  ADD KEY `id_laporan` (`id_laporan`),
  ADD KEY `id_metode` (`id_metode`),
  ADD KEY `idx_user` (`id_user`);

--
-- Indexes for table `saldo`
--
ALTER TABLE `saldo`
  ADD PRIMARY KEY (`id_saldo`),
  ADD UNIQUE KEY `unique_user_date` (`id_user`,`tanggal`),
  ADD KEY `idx_user_date` (`id_user`,`tanggal`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `id_kategori` (`id_kategori`),
  ADD KEY `idx_user` (`id_user`),
  ADD KEY `idx_tanggal` (`tanggal`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id_kategori` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `laporankeuangan`
--
ALTER TABLE `laporankeuangan`
  MODIFY `id_laporan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `metodemengelola`
--
ALTER TABLE `metodemengelola`
  MODIFY `id_metode` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `rekomendasi`
--
ALTER TABLE `rekomendasi`
  MODIFY `id_rekomendasi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `saldo`
--
ALTER TABLE `saldo`
  MODIFY `id_saldo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id_transaksi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `laporankeuangan`
--
ALTER TABLE `laporankeuangan`
  ADD CONSTRAINT `laporankeuangan_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

--
-- Constraints for table `rekomendasi`
--
ALTER TABLE `rekomendasi`
  ADD CONSTRAINT `rekomendasi_ibfk_1` FOREIGN KEY (`id_laporan`) REFERENCES `laporankeuangan` (`id_laporan`) ON DELETE SET NULL,
  ADD CONSTRAINT `rekomendasi_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE,
  ADD CONSTRAINT `rekomendasi_ibfk_3` FOREIGN KEY (`id_metode`) REFERENCES `metodemengelola` (`id_metode`) ON DELETE SET NULL;

--
-- Constraints for table `saldo`
--
ALTER TABLE `saldo`
  ADD CONSTRAINT `saldo_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE,
  ADD CONSTRAINT `transaksi_ibfk_2` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
