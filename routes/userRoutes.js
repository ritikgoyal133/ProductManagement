import express from "express";
import {
  getAllUsers,
  getUser,
  updateUser,
  replaceUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();
//It creates a new router object. This allows you to define routes and middleware separately from your main app instance. It promotes modularity and scalability by letting you organize your route handlers into distinct files or modules.

router
  .get("/", getAllUsers) // Get all users
  .get("/:id", getUser) // Get a specific user by ID
  .patch("/:id", updateUser) // Update user by ID
  .put("/:id", replaceUser) // Replace user by ID
  .delete("/:id", deleteUser); // Delete user by ID

export default router;
