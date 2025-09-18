import moongoose from 'mongoose';
import dotenv from 'dotenv';

export const connectDB = async () => {
    try {
        await moongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};