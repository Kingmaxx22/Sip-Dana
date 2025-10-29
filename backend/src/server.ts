import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkConnection } from './config/db'; 
import mainRouter from './routes'; 

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

checkConnection();

app.get('/api', (req: Request, res: Response) => {
  res.send('API Sip Dana v2');
});

app.use('/api', mainRouter);

app.use((req: Request, res: Response) => {
  console.log(`CATCH-ALL: ${req.method} ${req.originalUrl} not found.`);
  res.status(404).json({ message: `Endpoint ${req.originalUrl} tidak ditemukan.` });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`CORS Origin: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});