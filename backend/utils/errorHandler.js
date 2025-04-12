/**
 * Console Whisperer - Error Handler Utilities
 * 
 * This module provides utilities for handling errors.
 */

// Import logger
const logger = require('./logger');

/**
 * Async handler to catch errors in async route handlers
 * @param {Function} fn - The async function to wrap
 * @returns {Function} - The wrapped function
 */
exports.asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Create a custom error with status code
 * @param {String} message - The error message
 * @param {Number} statusCode - The HTTP status code
 * @returns {Error} - The custom error
 */
exports.createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Log an error
 * @param {Error} error - The error to log
 * @param {String} context - The context in which the error occurred
 */
exports.logError = (error, context = '') => {
  logger.error(`${context ? `[${context}] ` : ''}${error.message}`, {
    stack: error.stack,
    statusCode: error.statusCode
  });
};

/**
 * Handle API errors
 * @param {Error} error - The error to handle
 * @param {Object} res - The response object
 */
exports.handleApiError = (error, res) => {
  const statusCode = error.statusCode || 500;
  
  // Log the error
  exports.logError(error, 'API');
  
  // Send the error response
  res.status(statusCode).json({
    error: error.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
  });
};
