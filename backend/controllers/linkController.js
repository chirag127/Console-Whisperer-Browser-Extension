/**
 * Console Whisperer - Link Controller
 * 
 * This module handles link aggregation requests.
 */

// Import services
const linkScraperService = require('../services/linkScraperService');
const cacheService = require('../services/cacheService');

// Import utilities
const logger = require('../utils/logger');

/**
 * Get links related to an error
 * @route GET /api/links
 */
exports.getLinks = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    // Check cache for links
    const cachedLinks = await cacheService.getLinks(query);
    if (cachedLinks) {
      logger.info('Returning cached links for query');
      return res.json({ links: cachedLinks });
    }
    
    // Find links
    const links = await linkScraperService.findLinks({ message: query });
    
    // Cache the links
    await cacheService.cacheLinks(query, links);
    
    return res.json({ links });
  } catch (error) {
    logger.error('Error getting links:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Submit a link
 * @route POST /api/links
 */
exports.submitLink = async (req, res) => {
  try {
    const { url, title, errorQuery } = req.body;
    
    // Validate input
    if (!url || !title || !errorQuery) {
      return res.status(400).json({ error: 'URL, title, and errorQuery are required' });
    }
    
    // Add the link
    await linkScraperService.addLink(errorQuery, { url, title });
    
    return res.status(201).json({ success: true });
  } catch (error) {
    logger.error('Error submitting link:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
