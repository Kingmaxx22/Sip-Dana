import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { checkConnection } from "./config/db";
import mainRouter from "./routes";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5001;

const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.0:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        console.error("CORS Blocked:", origin);
        callback(new Error(`Origin ${origin} not allowed by CORS`), false);
      }
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

checkConnection();

app.get("/api", (req: Request, res: Response) => {
  res.send("API Sip Dana v2");
});

app.use("/api", mainRouter);

app.use((req: Request, res: Response) => {
  console.log(`CATCH-ALL: ${req.method} ${req.originalUrl} not found.`);
  res
    .status(404)
    .json({ message: `Endpoint ${req.originalUrl} tidak ditemukan.` });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(
    `CORS Origin: ${process.env.CLIENT_URL || "http://localhost:5173"}`,
  );
});
