import 'dotenv/config';
import mongoose from 'mongoose';

const connectDB = async() =>{
    try {
        const response = await mongoose.connect(process.env.MONGO);
        console.log(`connected to ${response.connection.host}`)
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;