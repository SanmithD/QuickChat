import express from 'express';
import { getMessages, getUserSidebar, sendMessage } from '../controllers/message.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const messageRouter = express.Router();

messageRouter.get('/users', protectRoute, getUserSidebar);
messageRouter.get('/:id', protectRoute, getMessages);
messageRouter.post('/send/:id', protectRoute, sendMessage);

export default messageRouter;