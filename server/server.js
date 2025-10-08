import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// Test error route
app.get("/api/error-test", (req, res) => {
  throw new Error("This is a test error!");
});

// 404 Handler - MUST be after all routes
app.use(notFoundHandler);

// Error Handler - MUST be last middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// # Test successful route
// curl http://localhost:5000/api/health

// # Test error route
// curl http://localhost:5000/api/error-test

// # Test 404 route
// curl http://localhost:5000/api/nonexistent
