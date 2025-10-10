import express from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/database.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// # Test registration
// curl -X POST http://localhost:5000/api/auth/register \
//   -H "Content-Type: application/json" \
//   -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

// # Test login
// curl -X POST http://localhost:5000/api/auth/login \
//   -H "Content-Type: application/json" \
//   -d '{"email":"test@example.com","password":"password123"}'

// # Test protected route (replace YOUR_TOKEN with actual token)
// curl http://localhost:5000/api/auth/me \
//   -H "Authorization: Bearer YOUR_TOKEN"
