/**
 * Global Error Handling Middleware
 * Catch-all handler for any uncaught errors in the Express routes/middlewares.
 * Formats the response to be consistent and safe (hides stack traces in production).
 */
export default function errorHandler(err, req, res, next) {
  console.error("[Server Error]", err);

  // Handle Groq/OpenAI Rate Limit errors (429)
  const isRateLimitError =
    err?.status === 429 ||
    err?.error?.error?.code === "rate_limit_exceeded" ||
    (err?.message && err.message.includes("rate_limit_exceeded"));

  if (isRateLimitError) {
    // Extract retry time from message if available
    const retryMatch = err?.message?.match(/try again in ([\d.]+s)/i);
    const retryIn = retryMatch ? ` Please wait ${retryMatch[1]} and try again.` : " Please wait 30 seconds and try again.";

    return res.status(429).json({
      success: false,
      message: `⚠️ Groq API rate limit reached.${retryIn} This happens on the free tier when too many requests are made quickly. You can also switch to the Llama 3.1 8B (Instant) model in Settings for higher limits.`,
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected server error occurred.";

  res.status(statusCode).json({
    success: false,
    message,
    // Provide stack trace only in development mode to help debugging
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
