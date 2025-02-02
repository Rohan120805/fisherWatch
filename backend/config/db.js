import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined");
        }

        // Updated connection options
        const options = {
            retryWrites: true,
            w: 'majority',
            serverSelectionTimeoutMS: 60000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 60000,
            maxPoolSize: 50,
            minPoolSize: 10,
            authSource: 'admin',
            authMechanism: 'SCRAM-SHA-1',
        };

        const conn = await mongoose.connect(mongoUri, options);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};