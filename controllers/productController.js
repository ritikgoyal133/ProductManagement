import Product from "../models/productModel.js";
import logToFile from "../utils/logger.js";

// Read all products with optional filtering
const getAllProducts = async (req, res) => {
  const { filter } = req.query;

  try {
    const filterCriteria = filter ? JSON.parse(filter) : {};
    const products = await Product.find(filterCriteria).sort({ createdAt: -1 });

    logToFile(
      `INFO`,
      `GET /products - Filter: ${filter || "None"}, Products Count: ${
        products.length
      }`,
      req.method,
      req.url
    );
    res.status(200).json({ message: "Products fetched!", products });
  } catch (err) {
    logToFile(
      `ERROR`,
      `GET /products - Error: ${err.message}`,
      req.method,
      req.url
    );
    res
      .status(500)
      .json({ message: "Error while fetching products", error: err.message });
  }
};

// Read a single product by ID
const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).exec();

    if (!product) {
      logToFile(
        `WARN`,
        `GET /products/${id} - Product not found`,
        req.method,
        req.url
      );
      return res.status(404).json({ message: "Product not found!" });
    }

    logToFile(
      `INFO`,
      `GET /products/${id} - Product fetched`,
      req.method,
      req.url
    );
    res.status(200).json({ message: "Product fetched!", product });
  } catch (err) {
    logToFile(
      `ERROR`,
      `GET /products/${id} - Error: ${err.message}`,
      req.method,
      req.url
    );
    res
      .status(500)
      .json({ message: "Error while fetching product", error: err.message });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  const product = new Product(req.body);

  try {
    const savedProduct = await product.save();
    logToFile(
      `INFO`,
      `POST /products - Product created: ${savedProduct._id}`,
      req.method,
      req.url
    );
    res
      .status(201)
      .json({ message: "Product created!", product: savedProduct });
  } catch (err) {
    if (err.code === 11000) {
      logToFile(
        `WARN`,
        `POST /products - Duplicate key error: ${err.message}`,
        req.method,
        req.url
      );
      return res
        .status(400)
        .json({ message: "Product with this name already exists" });
    }
    logToFile(
      `ERROR`,
      `POST /products - Error: ${err.message}`,
      req.method,
      req.url
    );
    res
      .status(500)
      .json({ message: "Error saving product", error: err.message });
  }
};

// Update an existing product by ID
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedProduct) {
      logToFile(
        `WARN`,
        `PUT /products/${id} - Product not found`,
        req.method,
        req.url
      );
      return res.status(404).json({ message: "Product not found" });
    }

    logToFile(
      `INFO`,
      `PUT /products/${id} - Product updated`,
      req.method,
      req.url
    );
    res
      .status(200)
      .json({ message: "Product updated!", product: updatedProduct });
  } catch (err) {
    logToFile(
      `ERROR`,
      `PUT /products/${id} - Error: ${err.message}`,
      req.method,
      req.url
    );
    res
      .status(500)
      .json({ message: "Error while updating product", error: err.message });
  }
};

// Replace an existing product by ID
const replaceProduct = async (req, res) => {
  const { id } = req.params;
  const replacementData = req.body;

  try {
    const replacedProduct = await Product.findOneAndReplace(
      { _id: id },
      replacementData,
      { new: true }
    );

    if (!replacedProduct) {
      logToFile(
        `WARN`,
        `PUT /products/${id} - Product not found`,
        req.method,
        req.url
      );
      return res.status(404).json({ message: "Product not found" });
    }

    logToFile(
      `INFO`,
      `PUT /products/${id} - Product replaced`,
      req.method,
      req.url
    );
    res
      .status(200)
      .json({ message: "Product replaced!", product: replacedProduct });
  } catch (err) {
    logToFile(
      `ERROR`,
      `PUT /products/${id} - Error: ${err.message}`,
      req.method,
      req.url
    );
    res
      .status(500)
      .json({ message: "Error while replacing product", error: err.message });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      logToFile(
        `WARN`,
        `DELETE /products/${id} - Product not found`,
        req.method,
        req.url
      );
      return res.status(404).json({ message: "Product not found" });
    }

    logToFile(
      `INFO`,
      `DELETE /products/${id} - Product deleted`,
      req.method,
      req.url
    );
    res
      .status(200)
      .json({ message: "Product deleted!", product: deletedProduct });
  } catch (err) {
    logToFile(
      `ERROR`,
      `DELETE /products/${id} - Error: ${err.message}`,
      req.method,
      req.url
    );
    res
      .status(500)
      .json({ message: "Error while deleting product", error: err.message });
  }
};

export {
  getAllProducts,
  createProduct,
  updateProduct,
  replaceProduct,
  deleteProduct,
  getProduct,
};
