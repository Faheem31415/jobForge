import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB is already connected');
            return;
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log('MongoDB Connection Error:', error);
    }
}
export default connectDB;