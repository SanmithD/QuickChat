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
const __dirname = path.resolve();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/favorites', favoriteRouter);

if(process.env.NODE_ENV == "production"){
    app.use(express.static(path.join(__dirname, "../../client/dist")));

    app.get("*", (req, res)=>{
        res.sendFile(path.join(__dirname, "../../client","dist","index.html"));
    })
}

server.listen(PORT,()=>{
    console.log(`server stated at ${PORT}`);
})