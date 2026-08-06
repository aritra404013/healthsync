import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthsync';
  const isAtlas = uri.startsWith('mongodb+srv://');
  console.log(`Connecting to MongoDB (${isAtlas ? 'MongoDB Atlas Cloud' : 'Local MongoDB'})...`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Connected Successfully: Host = ${conn.connection.host}, DB = ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.log(`❌ MongoDB Connection Failed: ${error.message}`);
    console.log(`Notice: Running server in fallback in-memory mode.`);
    return null;
  }
};

export default connectDB;
