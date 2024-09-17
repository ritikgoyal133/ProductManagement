import express from "express";
import morgan from "morgan";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import authenticateToken from "./middlewares/authMiddleware.js";
import connectDB from "./config/db.js"; // MongoDB connection
import cors from "cors";

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware for logging HTTP requests
app.use(morgan("combined"));

// Middleware to enable Cross-Origin Resource Sharing (CORS)
// Allows the API to be accessed from different origins (domains)
app.use(cors());

// Connect to MongoDB
connectDB();

// Route
// Authentication routes (signup/login) are public
app.use("/auth", authRoutes);

// Product routes are protected and require authentication
// Use `authenticateToken` middleware to secure these endpoints
app.use("/products", authenticateToken, productRoutes);

// User-related routes (e.g., profile updates) are also protected
// Use `authenticateToken` middleware to secure these endpoints
app.use("/users", authenticateToken, userRoutes);

// Centralized error-handling middleware
// Catches errors from routes and middleware and responds with a generic error message
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

// Simple health check route
// Useful for monitoring and ensuring the server is up and running
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start the server
// Use environment variable for port to allow flexibility in different environments
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
