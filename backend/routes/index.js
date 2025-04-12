/**
 * Console Whisperer - Routes
 * 
 * This module exports the routes for the backend server.
 */

const express = require('express');
const router = express.Router();

// Import route modules
const errorRoutes = require('./errorRoutes');
const linkRoutes = require('./linkRoutes');

// Import middleware
const rateLimitMiddleware = require('../middleware/rateLimit');

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Apply routes
router.use('/errors', rateLimitMiddleware, errorRoutes);
router.use('/links', rateLimitMiddleware, linkRoutes);

module.exports = router;
