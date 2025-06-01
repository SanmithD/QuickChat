import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import path from 'path';
import connectDB from './lib/db.lib.js';
import { app, server } from './lib/socket.js';
import authRouter from './routes/auth.route.js';
import favoriteRouter from './routes/favorite.route.js';
import messageRouter from './routes/message.route.js';

connectDB();

const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: 'quick-chat-omega-eight.vercel.app',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/favorites', favoriteRouter);

server.listen(PORT,()=>{
    console.log(`server stated at ${PORT}`);
})