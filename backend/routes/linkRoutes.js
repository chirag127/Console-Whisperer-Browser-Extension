/**
 * Console Whisperer - Link Routes
 * 
 * This module defines routes for link aggregation.
 */

const express = require('express');
const router = express.Router();

// Import controllers
const linkController = require('../controllers/linkController');

// Routes
router.get('/', linkController.getLinks);
router.post('/', linkController.submitLink);

module.exports = router;
