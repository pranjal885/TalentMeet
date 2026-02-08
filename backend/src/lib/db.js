import mongoose from 'mongoose';
import {ENV} from "./env.js";
//connect to mongodb database
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV.DB_URL)   
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }catch (error) {
        console.error("Error connecting to database", error);
        process.exit(1);//0 means success, 1 means failure
    }
};