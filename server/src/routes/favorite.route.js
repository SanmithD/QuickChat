import express from 'express';
import { getFavoriteUsers, toggleFavoriteUser } from '../controllers/favorite.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const favoriteRouter = express.Router();

favoriteRouter.patch('/add/:userId',protectRoute, toggleFavoriteUser);
favoriteRouter.get('/get',protectRoute, getFavoriteUsers);

export default favoriteRouter;