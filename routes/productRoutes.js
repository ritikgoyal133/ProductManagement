import express from "express";
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  replaceProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router
  .get("/", getAllProducts)
  .get("/:id", getProduct)
  .post("/", createProduct)
  .patch("/:id", updateProduct)
  .put("/:id", replaceProduct)
  .delete("/:id", deleteProduct);

export default router;
