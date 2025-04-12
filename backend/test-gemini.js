/**
 * Console Whisperer - Gemini API Test
 * 
 * This script tests the Gemini API integration.
 */

// Load environment variables
require('dotenv').config();

// Import the Gemini service
const geminiService = require('./services/geminiService');

// Test error data
const errorData = {
  message: "Uncaught TypeError: Cannot read properties of undefined (reading 'foo')",
  stack: "TypeError: Cannot read properties of undefined (reading 'foo')\n    at bar (app.js:45)\n    at foo (app.js:30)",
  url: "https://example.com",
  type: "window.onerror"
};

// Test the Gemini API
async function testGeminiAPI() {
  try {
    console.log('Testing Gemini API...');
    console.log('Error data:', errorData);
    
    // Call the explainError function
    const explanation = await geminiService.explainError(errorData);
    
    console.log('Explanation:', explanation);
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Error testing Gemini API:', error);
  }
}

// Run the test
testGeminiAPI();
