import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/index.js';
import mainRouter from './routes/index.js';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1",mainRouter);


app.listen(8080, () => {
    connectDB();
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});