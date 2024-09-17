import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import logMessage from "../utils/logger.js";

// Signup Controller: Handles user creation
const createUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const message = "User already exists";
      logMessage(
        "INFO",
        `${message} - Email: ${email}`,
        req.method,
        req.originalUrl,
        res.statusCode,
        req.headers,
        JSON.stringify(req.body)
      );
      return res.status(400).json({ message });
    }

    // Create a new user
    const newUser = new User({ firstName, lastName, email, password });

    // Hash the password before saving the user to the database
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Generate a JWT token for the newly created user
    const token = jwt.sign(
      { email: savedUser.email, id: savedUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Update the user with the generated token
    savedUser.token = token;
    await savedUser.save();

    // Log user creation success
    logMessage(
      "INFO",
      `User created successfully - Email: ${savedUser.email}, ID: ${savedUser._id}`,
      req.method,
      req.originalUrl,
      res.statusCode,
      req.headers,
      JSON.stringify(req.body)
    );

    // Respond with a success message and the generated token
    res.status(201).json({ message: "User created successfully!", token });
  } catch (err) {
    // Log error during user creation
    logMessage(
      "ERROR",
      `Error creating user - ${err.message}`,
      req.method,
      req.originalUrl,
      res.statusCode,
      req.headers,
      JSON.stringify(req.body)
    );

    res.status(500).json({ message: "Error creating user" });
  }
};

// Login Controller: Handles user authentication
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      const message = "Invalid credentials";
      logMessage(
        "WARN",
        `${message} - Email: ${email}`,
        req.method,
        req.originalUrl,
        res.statusCode,
        req.headers,
        JSON.stringify(req.body)
      );
      return res.status(401).json({ message });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const message = "Invalid credentials";
      logMessage(
        "WARN",
        `${message} - Email: ${email}`,
        req.method,
        req.originalUrl,
        res.statusCode,
        req.headers,
        JSON.stringify(req.body)
      );
      return res.status(401).json({ message });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Update the user with the generated token
    user.token = token;
    await user.save();

    // Log login success
    logMessage(
      "INFO",
      `Login successful - Email: ${user.email}, ID: ${user._id}`,
      req.method,
      req.originalUrl,
      res.statusCode,
      req.headers,
      JSON.stringify(req.body)
    );

    // Respond with a success message and the generated token
    res.status(200).json({ message: "Login successful!", token });
  } catch (err) {
    // Log error during login
    logMessage(
      "ERROR",
      `Error during login - ${err.message}`,
      req.method,
      req.originalUrl,
      res.statusCode,
      req.headers,
      JSON.stringify(req.body)
    );

    // Handle errors during login and respond with a generic error message
    res.status(500).json({ message: "Error during login" });
  }
};

// Export the controller functions
export { createUser, loginUser };
