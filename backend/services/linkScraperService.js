/**
 * Console Whisperer - Link Scraper Service
 * 
 * This module handles scraping and aggregating links related to errors.
 */

// Import dependencies
const axios = require('axios');

// Import utilities
const logger = require('../utils/logger');

// Import services
const cacheService = require('./cacheService');

/**
 * Find links related to an error
 * @param {Object} errorData - The error data
 * @returns {Promise<Array>} - The links
 */
exports.findLinks = async (errorData) => {
  try {
    // Check cache first
    const cachedLinks = await cacheService.getLinks(errorData.message);
    if (cachedLinks) {
      return cachedLinks;
    }
    
    // Create search query from error data
    const query = createSearchQuery(errorData);
    
    // Search StackOverflow
    const stackOverflowLinks = await searchStackOverflow(query);
    
    // Search GitHub
    const githubLinks = await searchGitHub(query);
    
    // Combine and rank results
    const links = rankLinks([...stackOverflowLinks, ...githubLinks], errorData);
    
    // Cache the results
    await cacheService.cacheLinks(errorData.message, links);
    
    return links;
  } catch (error) {
    logger.error('Error finding links:', error);
    return [];
  }
};

/**
 * Add a link to the database
 * @param {String} errorQuery - The error query
 * @param {Object} link - The link to add
 * @returns {Promise<void>}
 */
exports.addLink = async (errorQuery, link) => {
  try {
    // Get existing links
    const existingLinks = await cacheService.getLinks(errorQuery) || [];
    
    // Check if the link already exists
    const linkExists = existingLinks.some(existingLink => existingLink.url === link.url);
    
    if (!linkExists) {
      // Add the link
      existingLinks.push({
        ...link,
        votes: 1,
        timestamp: Date.now()
      });
      
      // Cache the updated links
      await cacheService.cacheLinks(errorQuery, existingLinks);
    }
  } catch (error) {
    logger.error('Error adding link:', error);
    throw error;
  }
};

/**
 * Create a search query from error data
 * @param {Object} errorData - The error data
 * @returns {String} - The search query
 */
function createSearchQuery(errorData) {
  // Extract the most relevant parts of the error for searching
  let query = errorData.message;
  
  // Remove specific file paths or line numbers
  query = query.replace(/at\s+.*?:\d+:\d+/g, '');
  
  // Remove common prefixes
  query = query.replace(/^(Uncaught |Exception: )/, '');
  
  return query.trim();
}

/**
 * Search StackOverflow for links
 * @param {String} query - The search query
 * @returns {Promise<Array>} - The links
 */
async function searchStackOverflow(query) {
  try {
    // Use the StackExchange API
    const response = await axios.get('https://api.stackexchange.com/2.3/search', {
      params: {
        site: 'stackoverflow',
        intitle: query,
        order: 'desc',
        sort: 'relevance',
        pagesize: 5,
        filter: 'withbody'
      }
    });
    
    // Format the results
    return response.data.items.map(item => ({
      url: item.link,
      title: item.title,
      source: 'stackoverflow',
      votes: item.score,
      timestamp: item.creation_date * 1000
    }));
  } catch (error) {
    logger.error('Error searching StackOverflow:', error);
    return [];
  }
}

/**
 * Search GitHub for links
 * @param {String} query - The search query
 * @returns {Promise<Array>} - The links
 */
async function searchGitHub(query) {
  try {
    // Use the GitHub API
    const response = await axios.get('https://api.github.com/search/issues', {
      params: {
        q: `${query} is:issue`,
        sort: 'reactions',
        order: 'desc',
        per_page: 5
      },
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    });
    
    // Format the results
    return response.data.items.map(item => ({
      url: item.html_url,
      title: item.title,
      source: 'github',
      votes: item.reactions.total_count,
      timestamp: new Date(item.created_at).getTime()
    }));
  } catch (error) {
    logger.error('Error searching GitHub:', error);
    return [];
  }
}

/**
 * Rank links based on relevance to the error
 * @param {Array} links - The links to rank
 * @param {Object} errorData - The error data
 * @returns {Array} - The ranked links
 */
function rankLinks(links, errorData) {
  // Calculate relevance score for each link
  const scoredLinks = links.map(link => {
    let score = 0;
    
    // Score based on title match
    const titleMatchScore = calculateMatchScore(link.title, errorData.message);
    score += titleMatchScore * 2; // Title match is more important
    
    // Score based on votes/reactions
    score += Math.min(link.votes / 10, 5); // Cap at 5 points
    
    // Score based on recency (newer is better)
    const ageInDays = (Date.now() - link.timestamp) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 5 - Math.min(ageInDays / 30, 5)); // Newer gets up to 5 points
    
    return {
      ...link,
      relevanceScore: score
    };
  });
  
  // Sort by relevance score (descending)
  scoredLinks.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  // Return the top 5 links
  return scoredLinks.slice(0, 5).map(link => ({
    url: link.url,
    title: link.title,
    source: link.source
  }));
}

/**
 * Calculate a match score between two strings
 * @param {String} str1 - The first string
 * @param {String} str2 - The second string
 * @returns {Number} - The match score (0-10)
 */
function calculateMatchScore(str1, str2) {
  if (!str1 || !str2) return 0;
  
  // Normalize strings
  const norm1 = str1.toLowerCase();
  const norm2 = str2.toLowerCase();
  
  // Count matching words
  const words1 = new Set(norm1.split(/\W+/).filter(Boolean));
  const words2 = new Set(norm2.split(/\W+/).filter(Boolean));
  
  let matchCount = 0;
  for (const word of words1) {
    if (words2.has(word)) {
      matchCount++;
    }
  }
  
  // Calculate score based on percentage of matching words
  const totalWords = Math.max(words1.size, words2.size);
  const score = (matchCount / totalWords) * 10;
  
  return score;
}
