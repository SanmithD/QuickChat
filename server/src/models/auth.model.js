import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        index: true
    },
    fullName:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    profilePic:{
        type: String,
        default: ""
    }
},{ timestamps: true });

export const authModel = mongoose.model('User', authSchema);