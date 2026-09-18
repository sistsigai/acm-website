import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Validate MongoDB URI
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        const options: mongoose.ConnectOptions = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 5,
            maxIdleTimeMS: 10000,
            retryWrites: true,
            w: 'majority' as const // Use 'as const' or proper type
        };

        console.log("🔄 Attempting to connect to MongoDB...");
        
        await mongoose.connect(process.env.MONGO_URI, options);
        
        console.log("✅ MongoDB Connected Successfully");

    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error instanceof Error ? error.message : error);
        
        // Graceful shutdown if we can't connect to DB in production
        if (process.env.NODE_ENV === 'production') {
            console.error("🛑 Critical: Cannot connect to database in production. Exiting...");
            process.exit(1);
        }
        
        throw error;
    }
};

export default connectDB;