/**
 * Console Whisperer - Validators
 * 
 * This module provides validation functions.
 */

/**
 * Validate an error object
 * @param {Object} error - The error object to validate
 * @returns {Boolean} - Whether the error is valid
 */
exports.validateError = (error) => {
  if (!error) {
    return false;
  }
  
  // Must have a message or reason
  if (!error.message && !error.reason) {
    return false;
  }
  
  return true;
};

/**
 * Validate a URL
 * @param {String} url - The URL to validate
 * @returns {Boolean} - Whether the URL is valid
 */
exports.validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validate a link object
 * @param {Object} link - The link object to validate
 * @returns {Boolean} - Whether the link is valid
 */
exports.validateLink = (link) => {
  if (!link) {
    return false;
  }
  
  // Must have a URL and title
  if (!link.url || !link.title) {
    return false;
  }
  
  // URL must be valid
  if (!exports.validateUrl(link.url)) {
    return false;
  }
  
  return true;
};

/**
 * Validate a query string
 * @param {String} query - The query string to validate
 * @returns {Boolean} - Whether the query is valid
 */
exports.validateQuery = (query) => {
  if (!query) {
    return false;
  }
  
  // Must be a non-empty string
  if (typeof query !== 'string' || query.trim().length === 0) {
    return false;
  }
  
  return true;
};
