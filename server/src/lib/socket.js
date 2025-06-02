import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: ['https://quick-chat-omega-eight.vercel.app'],
        methods: ["GET, POST"],
        credentials: true
    }
});

export const getReceiverSocketId = (userId) =>{
    return userSocketMap[userId]
}

//store online users
const userSocketMap = {}; //userId

io.on('connection', (socket) =>{
    console.log('A user connected', socket.id);
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on('disconnect', ()=>{
        console.log('A user disconnected', socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });
})

export { app, io, server };
