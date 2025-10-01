import moongoose from 'mongoose';
import dotenv from 'dotenv';

export const connectDB = async () => {
    try {
        console.log('Connecting to mongoDB');
        const MONGODB_URI=process.env.MONGODB_URI;
        if(!MONGODB_URI){
               throw new Error("MONGODB_URL is not defined.");            
        }
        await moongoose .connect(MONGODB_URI);
        console.log('connected to mongoDB')
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};