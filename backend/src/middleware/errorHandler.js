/**
 * Global Error Handling Middleware
 * Catch-all handler for any uncaught errors in the Express routes/middlewares.
 * Formats the response to be consistent and safe (hides stack traces in production).
 */
export default function errorHandler(err, req, res, next) {
  console.error("[Server Error]", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected server error occurred.";

  res.status(statusCode).json({
    success: false,
    message,
    // Provide stack trace only in development mode to help debugging
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
