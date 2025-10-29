# Sip Dana 💸

<img width="1827" height="999" alt="image" src="https://github.com/user-attachments/assets/af839bf4-4b3d-4491-af52-376d7f944c17" />

**Aplikasi Web Pengelola Pendapatan Digital**

`Sip Dana` adalah perangkat lunak berbasis digital untuk mencatat pemasukan, pengeluaran, melihat laporan keuangan, dan menerima rekomendasi finansial secara otomatis. Ini adalah aplikasi *full-stack* yang dibangun untuk membantu pengguna mengambil kendali penuh atas keuangan pribadi mereka.

Aplikasi ini menggunakan sistem ringkasan data otomatis di *backend* untuk memastikan performa tetap cepat, serta sistem rekomendasi cerdas yang memilih saran terbaik untuk pengguna berdasarkan kondisi keuangan mereka.

---

## 🚀 Fitur Utama

* **Autentikasi Pengguna:** Registrasi dan Login aman menggunakan JWT (JSON Web Tokens).
* **Manajemen Transaksi:** CRUD (*Create, Read*) penuh untuk transaksi pemasukan dan pengeluaran.
* **Dashboard Interaktif:** Ringkasan keuangan dinamis dengan filter berdasarkan Mingguan, Bulanan (default), dan Tahunan.
* **Laporan Otomatis:** *Backend* secara otomatis mengagregasi transaksi ke dalam tabel `laporankeuangan` dan `saldo` setiap ada perubahan data, membuat *loading* dashboard menjadi super cepat.
* **Analitik Keuangan:** Halaman analitik dengan filter tanggal untuk melihat tren pemasukan dan pengeluaran dalam bentuk grafik.
* **Rekomendasi Cerdas:**
    * **Metode Mengelola:** Menganalisis kondisi keuangan bulanan (surplus/defisit) untuk menyarankan metode pengelolaan yang relevan dari database.
    * **Target Menabung:** Menganalisis data 7 hari terakhir untuk memberikan rekomendasi target tabungan.
* **Manajemen Profil:** Pengguna dapat memperbarui *username*, *email*, dan *password* mereka.

---

## 🛠️ Teknologi yang Digunakan

* **Frontend:**
    * React 18+
    * TypeScript
    * Vite (Build Tool)
    * React Router v6 (Navigasi)
    * Axios (HTTP Requests)
    * React-Bootstrap & Bootstrap 5 (UI)
    * Recharts (Grafik)
    * Lucide React (Ikon)

* **Backend:**
    * Node.js
    * Express.js
    * TypeScript
    * MySQL 2 (Koneksi Database)
    * JSON Web Token (JWT) (Autentikasi)
    * Bcrypt.js (Hashing Password)
    * CORS
    * Dotenv
    * PM2 (Process Manager untuk produksi)

* **Database:**
    * MySQL
    * phpMyAdmin (untuk manajemen)
    * (Dijalankan via XAMPP atau Docker)

---

## 💡 Arsitektur & Alur Data

Aplikasi ini dirancang dengan arsitektur *3-tier* yang dioptimalkan untuk performa:

1.  **Client (Frontend):** Dibuat dengan React dan di-deploy ke **Vercel**. Bertugas menampilkan data dan mengirim *request* ke Backend.
2.  **Server (Backend):** Dibuat dengan Node.js/Express dan di-deploy ke **Server Pribadi** (misal: Ubuntu) menggunakan **PM2**. Bertugas menangani logika bisnis, autentikasi, dan (yang paling penting) mengolah data sebelum menyimpannya.
3.  **Database (MySQL):** Dijalankan di **Server Pribadi** (bisa sama dengan backend, atau terpisah), dikelola dengan **phpMyAdmin**. Menyimpan data mentah *dan* data ringkasan.

---

## ⚙️ Instalasi & Menjalankan (Lokal)

Ikuti langkah ini untuk menjalankan project di komputermu.

### 1. Prasyarat

* **XAMPP:** Pastikan **Apache** dan **MySQL** berjalan.
* **Node.js:** Versi LTS (18.x atau 20.x) direkomendasikan.

### 2. Database (MySQL via phpMyAdmin)

1.  Buka `http://localhost/phpmyadmin`.
2.  Buat database baru dengan nama `sip_dana`.
3.  Klik database `sip_dana`, lalu pilih tab **SQL**.
4.  Jalankan *query* SQL (yang sudah kamu siapkan) untuk membuat semua tabel: `user`, `kategori`, `transaksi`, `saldo`, `laporankeuangan`, `metodemengelola`, dan `rekomendasi`.
5.  **PENTING:** Isi data awal untuk tabel `kategori` dan `metodemengelola`.
6.  **PENTING:** Isi data "global" (dengan `id_user = NULL`) untuk tabel `rekomendasi` sesuai contoh yang telah kita buat.

### 3. Backend (Server)

1.  Buka terminal baru.
2.  Masuk ke direktori `backend`: `cd path/ke/SipDana/backend`
3.  Install semua dependensi:
    ```bash
    npm install
    ```
4.  Buat file `.env` di dalam folder `backend`:
    ```bash
    nano .env
    ```
5.  Isi file `.env` dengan kredensial databasemu:
    ```ini
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=
    DB_NAME=sip_dana
    DB_PORT=3306

    PORT=5001
    JWT_SECRET=rahasia_super_aman_dan_panjang_buat_sendiri
    
    CLIENT_URL=http://localhost:5173 
    ```
6.  Jalankan server *development*:
    ```bash
    npm run dev
    ```
    Server akan berjalan di `http://localhost:5001`.

### 4. Frontend (Client)

1.  Buka terminal **baru** (biarkan terminal backend berjalan).
2.  Masuk ke direktori `frontend`: `cd path/ke/SipDana/frontend`
3.  Install semua dependensi:
    ```bash
    npm install
    ```
4.  **PENTING:** Pastikan file `frontend/src/services/api.ts` sudah diatur untuk membaca alamat API:
    ```typescript
    // frontend/src/services/api.ts
    import axios from 'axios';
    const api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
    });
    // ...
    export default api;
    ```
5.  Jalankan aplikasi React:
    ```bash
    npm run dev
    ```
    Aplikasi akan terbuka di browser (`http://localhost:5173`).

---

## ⭐ Penjelasan: Sistem Laporan & Rekomendasi

Ini adalah "otak" dari aplikasi Sip Dana yang membuatnya cepat dan cerdas.

### 1. Laporan Otomatis (Tabel `laporankeuangan`)

**Masalah:** Jika kamu punya 1 juta transaksi, menghitung total pemasukan bulanan setiap kali kamu membuka Dashboard akan sangat lambat (membutuhkan `SUM` pada 1 juta baris).

**Solusi (yang kita implementasikan):**
* **Penulisan (Write):** Setiap kali kamu **membuat, mengedit, atau menghapus** transaksi (di `transaksiController.ts`), *backend* secara otomatis memanggil fungsi `triggerSummaryUpdates`.
* **Proses:** Fungsi ini **langsung menghitung ulang** total pemasukan, pengeluaran, dan saldo akhir **hanya untuk hari itu** (`tanggal` transaksi).
* **Penyimpanan:** Hasil perhitungan (misal: 28 Okt, Pemasukan=50rb, Pengeluaran=15rb) disimpan dalam **satu baris** di tabel `laporankeuangan`.
* **Pembacaan (Read):** Saat kamu membuka **Dashboard** atau **Analytics** dengan filter 30 hari (misal 1-30 Okt), *frontend* memanggil `laporanService.getLaporan`. *Backend* **tidak lagi** membaca tabel `transaksi`, melainkan **hanya mengambil 30 baris** dari `laporankeuangan` (yang sudah jadi).
* **Hasil:** Aplikasi terasa instan dan super cepat, berapapun jumlah transaksinya.

### 2. Rekomendasi Cerdas (Tabel `rekomendasi`)

**Masalah:** Bagaimana cara memberikan saran yang relevan dan bisa berlaku untuk semua pengguna (global)?

**Solusi (yang kita implementasikan):**
* **Data Saran (Disiapkan Manual):** Kamu (sebagai admin) mengisi tabel `rekomendasi` dengan berbagai teks saran. Setiap saran diberi `tipeRekomendasi` (misal: 'Kontrol Pengeluaran', 'Tips Menabung', 'Umum') dan `id_user = NULL` (artinya berlaku global).
* **Logika Backend:** Saat pengguna membuka halaman **Metode Mengelola** (Wallet) atau **Target Menabung** (Record):
    1.  Backend memanggil `getLatestRecommendation`.
    2.  Fungsi ini **menganalisis kondisi keuangan pengguna saat ini** (miscal: "Apakah defisit dalam 30 hari terakhir?" atau "Apakah surplus dalam 7 hari terakhir?").
    3.  Berdasarkan kondisi itu, backend **menentukan `tipeRekomendasi`** yang harus dicari (misal: 'Kontrol Pengeluaran' atau 'Tips Menabung').
    4.  Backend melakukan *query* ke tabel `rekomendasi` untuk mencari saran yang:
        * `tipeRekomendasi` = tipe yang dicari ('Kontrol Pengeluaran')
        * DAN (`id_user` = ID user yang login ATAU `id_user` IS NULL).
    5.  Backend **memprioritaskan** saran yang spesifik untuk user itu, tapi jika tidak ada, ia akan mengambil saran **global** (`id_user IS NULL`).
    6.  Jika tidak ada yang cocok, ia akan mengambil tipe `'Umum'`.
    7.  Saran (teks dan metode terkait) dikirim ke frontend.
* **Hasil:** Pengguna selalu mendapat saran yang **relevan** dengan kondisinya (surplus atau defisit), dan kamu bisa **dengan mudah menambah atau mengubah** isi saran langsung di database tanpa menyentuh kode backend.
