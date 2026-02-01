const mongoose = require('mongoose');

const maxRetries = 5;
const retryDelayMs = 3000;

/**
 * Connect to MongoDB using MONGODB_URI from environment.
 * Retries on failure (e.g. when MongoDB is still starting in Docker).
 */
const connectDB = async (retries = maxRetries) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    if (retries > 1) {
      console.log(`Retrying in ${retryDelayMs / 1000}s... (${retries - 1} left)`);
      await new Promise((r) => setTimeout(r, retryDelayMs));
      return connectDB(retries - 1);
    }
    process.exit(1);
  }
};

module.exports = { connectDB };
