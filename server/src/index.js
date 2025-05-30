import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import connectDB from './lib/db.lib.js';
import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';
// import http from 'http';
// import { Socket } from 'socket.io';

connectDB();
const app = express();
// const server = http.createServer(app);
// const io = new Socket(server);
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);

app.listen(PORT,()=>{
    console.log(`server stated at ${PORT}`);
})