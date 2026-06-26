import express from 'express';
import type { Express, Request, Response } from 'express';
import { configDotenv } from 'dotenv';
import connectDB from './config/db';
import router from './routes/routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';

configDotenv();  // secrets access 
const app = express();  // express app created

app.use(express.json()); // json data access
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // cookie access

// CORS - cross origin resource sharing
// Frontend PORT 5173 
// Backend PORT 3000
const allowedOrigins = [
  "https://mockableinterviews.vercel.app",
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

const corsOption = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true);
    if (origin.startsWith("http://localhost") || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
    return callback(new Error(msg), false);
  },
  credentials: true
};
app.use(cors(corsOption));
connectDB();

app.get("/", (req, res) => res.send("trial Route"));
app.use("/v1", router);


app.listen(process.env.PORT, () => {
  console.log(`Server started at port: ${process.env.PORT}`);
});