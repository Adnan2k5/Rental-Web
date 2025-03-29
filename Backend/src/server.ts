import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './db/index';
import corsOption from './configs/corsOption';

dotenv.config({ path: './env' });

const app = express();

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(cookieParser());

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

