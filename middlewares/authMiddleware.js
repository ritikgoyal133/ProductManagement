import jwt from "jsonwebtoken";
import logMessage from "../utils/logger.js";

const authenticateToken = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const message = "Authorization token missing or invalid";
    logMessage("WARN", message, req.method, req.originalUrl);
    return res.status(401).json({ message });
  }

  const token = authHeader.split("Bearer ")[1];

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      const message = "Token verification failed";
      logMessage(
        "ERROR",
        `${message} - ${err.message}`,
        req.method,
        req.originalUrl
      );
      return res.status(403).json({ message, error: err.message });
    }

    // Attach the decoded payload to the request object
    req.user = decoded;
    logMessage(
      "INFO",
      `Token verified successfully - User ID: ${decoded.id}`,
      req.method,
      req.originalUrl
    );
    next();
  });
};

export default authenticateToken;
