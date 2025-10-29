import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Pindahkan pool ke file terpisah di /config
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'sip_dana',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Fungsi untuk mengecek koneksi
export const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database.');
    connection.release();
  } catch (err: any) {
    console.error('Error connecting to MySQL database:', err.message);
    if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('Database not found. Pastikan nama database di .env benar.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Connection refused. Pastikan XAMPP/MySQL sudah berjalan.');
    }
    if(err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Access denied. Cek username dan password database di .env.');
    }
  }
};

export default pool;