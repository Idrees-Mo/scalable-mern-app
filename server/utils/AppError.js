// Custom error class for consistent error handling
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Mark as operational error (not programming error)

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
