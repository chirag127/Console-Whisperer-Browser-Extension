/**
 * Console Whisperer - Configuration
 * 
 * This module exports the configuration for the backend server.
 */

// Import specific configurations
const geminiConfig = require('./gemini');
const corsConfig = require('./cors');

// Main configuration
const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // 100 requests per minute
  },
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Gemini API configuration
  gemini: geminiConfig,
  
  // CORS configuration
  cors: corsConfig
};

module.exports = config;
