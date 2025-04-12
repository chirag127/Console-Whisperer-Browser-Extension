/**
 * Console Whisperer - Gemini Service
 * 
 * This module handles communication with the Gemini API.
 */

// Import dependencies
const axios = require('axios');

// Import configuration
const config = require('../config');

// Import utilities
const logger = require('../utils/logger');

/**
 * Explain an error using the Gemini API
 * @param {Object} errorData - The error data
 * @returns {Promise<Object>} - The explanation
 */
exports.explainError = async (errorData) => {
  try {
    // Format the prompt
    const prompt = formatPrompt(errorData);
    
    // Call the Gemini API
    const response = await callGeminiAPI(prompt);
    
    // Parse the response
    return parseGeminiResponse(response);
  } catch (error) {
    logger.error('Error explaining error with Gemini:', error);
    
    // Return a fallback response
    return {
      explanation: "We couldn't generate an explanation for this error. Please try again later.",
      suggestedFix: null,
      possibleCauses: ["Unknown"]
    };
  }
};

/**
 * Format a prompt for the Gemini API
 * @param {Object} errorData - The error data
 * @returns {String} - The formatted prompt
 */
function formatPrompt(errorData) {
  // Get the prompt template
  let prompt = config.gemini.promptTemplates.explainError;
  
  // Replace placeholders
  prompt = prompt.replace('{{errorMessage}}', errorData.message || 'Unknown error');
  prompt = prompt.replace('{{errorContext}}', errorData.stack || 'No stack trace available');
  prompt = prompt.replace('{{errorUrl}}', errorData.url || 'Unknown URL');
  
  return prompt;
}

/**
 * Call the Gemini API
 * @param {String} prompt - The prompt to send
 * @returns {Promise<Object>} - The API response
 */
async function callGeminiAPI(prompt) {
  // Prepare the request
  const url = config.gemini.apiUrl;
  const apiKey = config.gemini.apiKey;
  
  const requestData = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      temperature: config.gemini.defaultParams.temperature,
      maxOutputTokens: config.gemini.defaultParams.maxOutputTokens,
      topK: config.gemini.defaultParams.topK,
      topP: config.gemini.defaultParams.topP
    }
  };
  
  // Send the request
  const response = await axios.post(url, requestData, {
    params: {
      key: apiKey
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  // Return the response
  return response.data;
}

/**
 * Parse the Gemini API response
 * @param {Object} response - The API response
 * @returns {Object} - The parsed response
 */
function parseGeminiResponse(response) {
  try {
    // Extract the text from the response
    const text = response.candidates[0].content.parts[0].text;
    
    // Try to parse as JSON
    try {
      const parsedResponse = JSON.parse(text);
      return {
        explanation: parsedResponse.explanation || "No explanation available",
        suggestedFix: parsedResponse.suggestedFix || null,
        possibleCauses: parsedResponse.possibleCauses || []
      };
    } catch (jsonError) {
      // If JSON parsing fails, use the text as the explanation
      logger.warn('Failed to parse Gemini response as JSON:', jsonError);
      
      return {
        explanation: text,
        suggestedFix: null,
        possibleCauses: []
      };
    }
  } catch (error) {
    logger.error('Error parsing Gemini response:', error);
    
    return {
      explanation: "We couldn't parse the explanation for this error. Please try again later.",
      suggestedFix: null,
      possibleCauses: ["Unknown"]
    };
  }
}
