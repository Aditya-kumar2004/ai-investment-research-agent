import mongoose from "mongoose";

/**
 * Connect to MongoDB Database
 * Gracefully logs connections and handles errors so that the server
 * can continue running even if database services are unavailable.
 */
export default async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("[MongoDB] MONGO_URI is not defined. Offline caching will be used.");
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection failed: ${error.message}`);
    console.warn("[MongoDB] Running in fallback mode. Search results will not be persisted.");
  }
}
