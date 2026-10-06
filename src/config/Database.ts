import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env["DB_URL"] as string);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);

    }
};

export default connectDB;