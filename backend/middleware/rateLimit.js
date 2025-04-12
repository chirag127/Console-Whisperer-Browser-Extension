/**
 * Console Whisperer - Rate Limiting Middleware
 * 
 * This module provides middleware for rate limiting.
 */

// Import dependencies
const rateLimit = require('express-rate-limit');

// Import configuration
const config = require('../config');

// Create rate limiter
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.'
  }
});

module.exports = limiter;
