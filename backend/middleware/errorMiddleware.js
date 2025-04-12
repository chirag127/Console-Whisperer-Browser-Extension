/**
 * Console Whisperer - Error Middleware
 * 
 * This module provides middleware for handling errors.
 */

// Import utilities
const logger = require('../utils/logger');

/**
 * Handle 404 errors
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Handle all errors
 * @param {Object} err - The error object
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
exports.errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  
  // Set the status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  
  // Send the error response
  res.json({
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
};
