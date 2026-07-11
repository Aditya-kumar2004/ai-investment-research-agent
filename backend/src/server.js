import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import analyzeRouter from "./routes/analyze.js";
import subscribeRouter from "./routes/subscribe.js";

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Standard Middlewares
app.use(helmet({
  // Disable contentSecurityPolicy for local development convenience if needed,
  // but keep helmet active for secure headers.
  contentSecurityPolicy: false,
}));
app.use(cors({
  origin: "*", // Allow requests from all origins (suitable for development/sandbox)
}));
app.use(morgan("dev")); // Log HTTP requests to the console
app.use(express.json()); // Parse JSON payloads

// Mount API routes
app.use("/api", analyzeRouter);
app.use("/api", subscribeRouter);

// Base Health Check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Register Global Error Handling Middleware (must be registered last)
app.use(errorHandler);

// Start listening for requests
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`[Server] Express server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
}

export default app;
