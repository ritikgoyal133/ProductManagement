import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the product schema
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [30, "Name cannot be more than 30 characters"],
      minlength: [3, "Name cannot be less than 3 characters"],
      unique: true, // Ensure each product has a unique name
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Product description is required"],
    },
    price: {
      type: mongoose.Types.Decimal128, // Handle decimal values more precisely
      required: [true, "Price is required"],
      min: [0.0, "Price must be a positive decimal number"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true, // Index for better search performance
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
      default: 0,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
