import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
    },
    favorite: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
},{ timestamps: true });

export const favoriteModel = mongoose.model("Favorite", favoriteSchema);