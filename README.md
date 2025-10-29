# Sip-Dana

![Uploading image.png…]()

# Sip Dana 💸
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
