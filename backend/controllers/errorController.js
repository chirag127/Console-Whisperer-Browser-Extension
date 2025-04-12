/**
 * Console Whisperer - Error Controller
 * 
 * This module handles error processing requests.
 */

// Import services
const geminiService = require('../services/geminiService');
const linkScraperService = require('../services/linkScraperService');
const cacheService = require('../services/cacheService');

// Import utilities
const logger = require('../utils/logger');

/**
 * Process an error
 * @route POST /api/errors
 */
exports.processError = async (req, res) => {
  try {
    const { errorData } = req.body;
    
    // Validate input
    if (!errorData || !errorData.message) {
      return res.status(400).json({ error: 'Invalid error data' });
    }
    
    // Check cache for similar errors
    const cachedResponse = await cacheService.getErrorResponse(errorData);
    if (cachedResponse) {
      logger.info('Returning cached response for error');
      return res.json(cachedResponse);
    }
    
    // Generate explanation using Gemini
    const explanation = await geminiService.explainError(errorData);
    
    // Find relevant links
    const links = await linkScraperService.findLinks(errorData);
    
    // Combine response
    const response = {
      originalError: errorData,
      explanation: explanation.explanation,
      suggestedFix: explanation.suggestedFix,
      possibleCauses: explanation.possibleCauses,
      links,
      timestamp: Date.now()
    };
    
    // Cache the response
    await cacheService.cacheErrorResponse(errorData, response);
    
    // Return the response
    return res.json(response);
  } catch (error) {
    logger.error('Error processing error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get a specific error
 * @route GET /api/errors/:id
 */
exports.getError = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the error from cache
    const error = await cacheService.getErrorById(id);
    
    if (!error) {
      return res.status(404).json({ error: 'Error not found' });
    }
    
    return res.json(error);
  } catch (error) {
    logger.error('Error getting error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get recent errors
 * @route GET /api/errors
 */
exports.getRecentErrors = async (req, res) => {
  try {
    // Get recent errors from cache
    const recentErrors = await cacheService.getRecentErrors();
    
    return res.json({ errors: recentErrors });
  } catch (error) {
    logger.error('Error getting recent errors:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
