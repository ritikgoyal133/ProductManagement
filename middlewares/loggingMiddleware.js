import logMessage from "../utils/logger.js";

const loggingMiddleware = (req, res, next) => {
  // Log the incoming HTTP request method and URL
  logMessage(
    "INFO",
    `Incoming request: ${req.method} ${req.originalUrl}`,
    req.method,
    req.originalUrl
  );

  // Attach an event listener to log the response status code and message once the response is finished
  res.on("finish", () => {
    logMessage(
      "INFO",
      `Response: ${res.statusCode} ${res.statusMessage}`,
      req.method,
      req.originalUrl,
      res.statusCode
    );
  });

  // Proceed to the next middleware or route handler
  next();
};

export default loggingMiddleware;
