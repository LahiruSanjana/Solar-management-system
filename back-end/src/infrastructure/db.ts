import moongoose from 'mongoose';
import dotenv from 'dotenv';

export const connectDB = async () => {
    try {
        console.log('Connecting to mongoDB');
        const MONGODB_URL=process.env.MONGODB_URL;
        if(!MONGODB_URL){
               throw new Error("MONGODB_URL is not defined.");            
        }
        await moongoose .connect(MONGODB_URL);
        console.log('connected to mongoDB')
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};