/**
 * Console Whisperer - Backend Server
 * 
 * This is the main entry point for the Console Whisperer backend server.
 */

// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import configuration
const config = require('./config');

// Import routes
const routes = require('./routes');

// Import middleware
const errorMiddleware = require('./middleware/errorMiddleware');

// Import logger
const logger = require('./utils/logger');

// Create Express app
const app = express();

// Apply middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Apply routes
app.use('/api', routes);

// Apply error middleware
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

// Start the server
const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
