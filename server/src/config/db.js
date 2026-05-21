import { MongoClient } from 'mongodb';
let client;
let db;
export const connectDB = async () => {
  if (db) return db;
  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db();
    console.log('MongoDB connected');
    return db;
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};
export const getDB = () => {
  if (!db) throw new Error('Database not initialized');
  return db;
};
export const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};