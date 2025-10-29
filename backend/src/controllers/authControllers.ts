import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

// Tipe data untuk user dari database
interface User extends RowDataPacket {
  id_user: number;
  username: string;
  email: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia-default';

// Logika untuk Registrasi
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  try {
    const [existingUsers] = await pool.query<User[]>(
      'SELECT * FROM user WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Email atau username sudah terdaftar' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO user (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    const insertId = (result as any).insertId;
    const token = jwt.sign({ userId: insertId, email: email }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({
      message: 'Registrasi berhasil',
      token: token,
      user: {
        id_user: insertId,
        username: username,
        email: email,
      },
    });
  } catch (error) {
    console.error('Error saat register:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// Logika untuk Login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  try {
    const [users] = await pool.query<User[]>(
      'SELECT * FROM user WHERE email = ?',
      [email]
    );

    const user = users[0];
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const token = jwt.sign(
      { userId: user.id_user, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login berhasil',
      token: token,
      user: {
        id_user: user.id_user,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error saat login:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};