/**
 * Console Whisperer - Logger
 * 
 * This module provides logging functionality.
 */

// Import dependencies
const winston = require('winston');

// Import configuration
const config = require('../config');

// Create logger
const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'console-whisperer' },
  transports: [
    // Write to all logs with level `info` and below to `combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' }),
    // Write all logs with level `error` and below to `error.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  ]
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;
