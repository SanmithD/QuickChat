import jwt from 'jsonwebtoken';
import { authModel } from '../models/auth.model.js';

export const protectRoute = async(req, res, next) =>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(400).json({
                success: false,
                message: "Unauthorized"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            });
        }
        const user = await authModel.findById(decoded.userId).select("password");
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({
                success: false,
                message: "Server error"
            });
    }
}