import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log('✅ MongoDB is already connected');
            return;
        }

        mongoose.connection.on('connected', () => {
            console.log('🚀 MongoDB connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB Connection Error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
        });

        await mongoose.connect(process.env.MONGO_URI, {
            autoIndex: true,
        });

    } catch (error) {
        console.error('💥 Initial MongoDB Connection Error:', error);
        process.exit(1);
    }
}

export default connectDB;