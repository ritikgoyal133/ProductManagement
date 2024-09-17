import express from "express";
import { createUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// Authentication routes
router.post("/signup", createUser); // Signup route
router.post("/login", loginUser); // Login route

export default router;
