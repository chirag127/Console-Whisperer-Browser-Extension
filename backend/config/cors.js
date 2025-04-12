/**
 * Console Whisperer - CORS Configuration
 * 
 * This module exports the configuration for CORS.
 */

module.exports = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};
