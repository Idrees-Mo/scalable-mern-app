// Step 1: Import required modules
import express from "express";
import cors from "cors";
import { config } from "dotenv";

// Step 2: Load environment variables
config();

// Step 3: Create Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Step 4: Apply middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// Step 5: Create a simple test route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// Step 6: Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
