/**
 * Console Whisperer - Authentication Middleware
 * 
 * This module provides middleware for authentication.
 */

// Import utilities
const logger = require('../utils/logger');

/**
 * Validate API key
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
exports.validateApiKey = (req, res, next) => {
  // Get the API key from the request
  const apiKey = req.headers['x-api-key'];
  
  // Check if the API key is valid
  if (!apiKey || !isValidApiKey(apiKey)) {
    logger.warn(`Invalid API key: ${apiKey}`);
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  // API key is valid, continue
  next();
};

/**
 * Check if an API key is valid
 * @param {String} apiKey - The API key to check
 * @returns {Boolean} - Whether the API key is valid
 */
function isValidApiKey(apiKey) {
  // In a real application, this would check against a database of valid API keys
  // For now, we'll just check if it's a non-empty string
  return typeof apiKey === 'string' && apiKey.length > 0;
}
