import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { RowDataPacket } from 'mysql2';

// Tipe data untuk user dari database
interface User extends RowDataPacket {
  id_user: number;
  username: string;
  email: string;
  password: string;
}

// Logika untuk UPDATE PROFIL
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  const id_user = req.user?.userId;
  if (!id_user) {
    return res.status(401).json({ message: 'User tidak terotentikasi' });
  }

  const { username, email } = req.body;

  // Validasi input dasar
  if (!username || !email) {
    return res.status(400).json({ message: 'Username dan Email wajib diisi.' });
  }

  try {
    // Cek apakah email atau username baru sudah dipakai user lain
    const [existingUsers] = await pool.query<User[]>(
      'SELECT id_user FROM user WHERE (email = ? OR username = ?) AND id_user != ?',
      [email, username, id_user]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Email atau Username sudah digunakan oleh akun lain.' });
    }

    // Update data user di database
    await pool.query(
      'UPDATE user SET username = ?, email = ? WHERE id_user = ?',
      [username, email, id_user]
    );

    // Kirim data user yang sudah diupdate (tanpa password)
    const [updatedUser] = await pool.query<User[]>(
      'SELECT id_user, username, email FROM user WHERE id_user = ?',
      [id_user]
    );

    res.status(200).json({
      message: 'Profil berhasil diperbarui',
      user: updatedUser[0],
    });

  } catch (error) {
    console.error('Error saat update profil:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// Logika untuk GANTI PASSWORD
export const updateUserPassword = async (req: AuthRequest, res: Response) => {
   const id_user = req.user?.userId;
  if (!id_user) {
    return res.status(401).json({ message: 'User tidak terotentikasi' });
  }

  const { currentPassword, newPassword } = req.body;

  // Validasi input
  if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Semua field password wajib diisi.' });
  }
   if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password baru minimal 6 karakter.' });
  }

  try {
    // Ambil hash password saat ini dari database
    const [users] = await pool.query<User[]>(
      'SELECT password FROM user WHERE id_user = ?',
      [id_user]
    );
    
    const user = users[0];
    if (!user) {
         return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    // Bandingkan currentPassword dengan hash di DB
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
       return res.status(401).json({ message: 'Password saat ini salah.' });
    }

    // Buat hash untuk newPassword
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password di database
     await pool.query(
      'UPDATE user SET password = ? WHERE id_user = ?',
      [hashedNewPassword, id_user]
    );

    res.status(200).json({ message: 'Password berhasil diganti.' });

  } catch (error) {
     console.error('Error saat ganti password:', error);
     res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};