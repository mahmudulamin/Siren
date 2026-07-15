import logger from '../utils/logger.js';
import ApiError from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle Mongoose CastError
  if (err.name === 'CastError') {
    const message = `Resource not found with ID: ${err.value}`;
    error = new ApiError(400, message);
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = new ApiError(409, message);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token has expired');
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error = new ApiError(400, 'Validation Error', messages);
  }

  // Log the error
  logger.error('Application Error', {
    message: error.message,
    statusCode: error.statusCode,
    errors: error.errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Send response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
