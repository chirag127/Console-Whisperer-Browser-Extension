/**
 * Console Whisperer - Cache Service
 * 
 * This module handles caching of error responses and links.
 */

// Import dependencies
const NodeCache = require('node-cache');

// Import utilities
const logger = require('../utils/logger');

// Create cache instances
const errorCache = new NodeCache({ stdTTL: 86400 }); // 24 hours
const linkCache = new NodeCache({ stdTTL: 86400 * 7 }); // 7 days

// Error ID counter
let errorIdCounter = 1;

/**
 * Get a cached error response
 * @param {Object} errorData - The error data
 * @returns {Promise<Object|null>} - The cached response or null
 */
exports.getErrorResponse = async (errorData) => {
  try {
    // Create a cache key from the error message
    const cacheKey = `error_${hashString(errorData.message)}`;
    
    // Check if the error is in the cache
    return errorCache.get(cacheKey) || null;
  } catch (error) {
    logger.error('Error getting cached error response:', error);
    return null;
  }
};

/**
 * Cache an error response
 * @param {Object} errorData - The error data
 * @param {Object} response - The response to cache
 * @returns {Promise<void>}
 */
exports.cacheErrorResponse = async (errorData, response) => {
  try {
    // Create a cache key from the error message
    const cacheKey = `error_${hashString(errorData.message)}`;
    
    // Add an ID to the response
    const errorId = errorIdCounter++;
    response.id = errorId;
    
    // Cache the response
    errorCache.set(cacheKey, response);
    
    // Also cache by ID for direct access
    errorCache.set(`id_${errorId}`, response);
    
    // Update recent errors list
    updateRecentErrors(errorId, response);
  } catch (error) {
    logger.error('Error caching error response:', error);
  }
};

/**
 * Get links from cache
 * @param {String} query - The query
 * @returns {Promise<Array|null>} - The cached links or null
 */
exports.getLinks = async (query) => {
  try {
    // Create a cache key from the query
    const cacheKey = `links_${hashString(query)}`;
    
    // Check if the links are in the cache
    return linkCache.get(cacheKey) || null;
  } catch (error) {
    logger.error('Error getting cached links:', error);
    return null;
  }
};

/**
 * Cache links
 * @param {String} query - The query
 * @param {Array} links - The links to cache
 * @returns {Promise<void>}
 */
exports.cacheLinks = async (query, links) => {
  try {
    // Create a cache key from the query
    const cacheKey = `links_${hashString(query)}`;
    
    // Cache the links
    linkCache.set(cacheKey, links);
  } catch (error) {
    logger.error('Error caching links:', error);
  }
};

/**
 * Get an error by ID
 * @param {Number} id - The error ID
 * @returns {Promise<Object|null>} - The error or null
 */
exports.getErrorById = async (id) => {
  try {
    // Check if the error is in the cache
    return errorCache.get(`id_${id}`) || null;
  } catch (error) {
    logger.error('Error getting error by ID:', error);
    return null;
  }
};

/**
 * Get recent errors
 * @returns {Promise<Array>} - The recent errors
 */
exports.getRecentErrors = async () => {
  try {
    // Get the recent errors list
    const recentErrors = errorCache.get('recent_errors') || [];
    
    // Return the list
    return recentErrors;
  } catch (error) {
    logger.error('Error getting recent errors:', error);
    return [];
  }
};

/**
 * Update the recent errors list
 * @param {Number} errorId - The error ID
 * @param {Object} response - The error response
 */
function updateRecentErrors(errorId, response) {
  try {
    // Get the current list
    const recentErrors = errorCache.get('recent_errors') || [];
    
    // Add the new error
    recentErrors.unshift({
      id: errorId,
      message: response.originalError.message,
      url: response.originalError.url,
      timestamp: response.timestamp
    });
    
    // Limit to 50 errors
    if (recentErrors.length > 50) {
      recentErrors.pop();
    }
    
    // Update the cache
    errorCache.set('recent_errors', recentErrors);
  } catch (error) {
    logger.error('Error updating recent errors:', error);
  }
}

/**
 * Create a hash from a string
 * @param {String} str - The string to hash
 * @returns {String} - The hash
 */
function hashString(str) {
  if (!str) return '';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return hash.toString(36);
}
