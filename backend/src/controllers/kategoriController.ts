import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

interface Kategori extends RowDataPacket {
  id_kategori: number;
  nama_kategori: string;
}

// Logika untuk Mengambil Semua Kategori
export const getAllKategori = async (req: Request, res: Response) => {
  try {
    const [kategori] = await pool.query<Kategori[]>(
      'SELECT * FROM kategori ORDER BY nama_kategori ASC'
    );
    
    res.status(200).json(kategori);
  } catch (error) {
    console.error('Error saat mengambil kategori:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};