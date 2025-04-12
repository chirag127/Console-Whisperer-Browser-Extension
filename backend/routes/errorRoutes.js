/**
 * Console Whisperer - Error Routes
 * 
 * This module defines routes for error processing.
 */

const express = require('express');
const router = express.Router();

// Import controllers
const errorController = require('../controllers/errorController');

// Routes
router.post('/', errorController.processError);
router.get('/:id', errorController.getError);
router.get('/', errorController.getRecentErrors);

module.exports = router;
