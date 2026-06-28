import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} - Error:`, err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';

  // Customize responses based on error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: err.message,
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate Key Error',
      message: 'A record with this unique property already exists'
    });
  }

  res.status(statusCode).json({
    success: false,
    error: err.name || 'InternalServerError',
    message: message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};
