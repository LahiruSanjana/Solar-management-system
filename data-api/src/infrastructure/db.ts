import mongoose from 'mongoose';
import dotenv from 'dotenv';

export const connectDB = async () => {
    try {
        console.log('Connecting to mongoDB');

        const MONGODB_URI = process.env.MONGODB_URI;

        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined.");
        }

        await mongoose.connect(MONGODB_URI, {
            dbName: "data-api"   
        });

        console.log('Connected to mongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};
