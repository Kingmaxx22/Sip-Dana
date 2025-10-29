import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkConnection } from './config/db';
import mainRouter from './routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

checkConnection();

app.get('/api', (req: Request, res: Response) => {
  res.send('API Sip Dana v2');
});

app.use('/api', mainRouter);

app.use((req: Request, res: Response) => {
  console.log(`CATCH-ALL: ${req.method} ${req.originalUrl} not found.`);
  res.status(404).json({ message: `Endpoint ${req.originalUrl} not found.` });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});