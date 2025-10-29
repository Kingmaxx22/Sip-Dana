import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia-default';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
      req.user = decoded;
      return next(); // Tambahkan return
    } catch (error) {
      console.error('❌ Token error:', error);
      return res.status(401).json({ message: 'Token tidak valid, otorisasi ditolak' });
    }
  }

  // Token tidak ada
  console.log('❌ No token provided');
  return res.status(401).json({ message: 'Tidak ada token, otorisasi ditolak' });
};