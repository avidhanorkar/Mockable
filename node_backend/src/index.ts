import express from 'express';
import type { Express, Request, Response } from 'express';
import { configDotenv } from 'dotenv';
import connectDB from './config/db';
import router from './routes/routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';

configDotenv();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOption = {
  origin: "http://localhost:5173",
  credentials: true
}
app.use(cors(corsOption));
connectDB();

app.get("/", (req, res) => res.send("trial Route"));
app.use("/v1", router);


app.listen(process.env.PORT, () => {
  console.log(`Server started at port: ${process.env.PORT}`);
});