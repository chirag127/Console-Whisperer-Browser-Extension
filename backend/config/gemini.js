/**
 * Console Whisperer - Gemini API Configuration
 * 
 * This module exports the configuration for the Gemini API.
 */

module.exports = {
  apiKey: process.env.GEMINI_API_KEY,
  apiUrl: process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  
  // Default parameters for the Gemini API
  defaultParams: {
    temperature: 0.4,
    maxOutputTokens: 1024,
    topK: 40,
    topP: 0.95
  },
  
  // Prompt templates
  promptTemplates: {
    explainError: `Explain this JavaScript error in plain English and suggest a fix.
Error: "{{errorMessage}}"
Context: "{{errorContext}}"
URL: "{{errorUrl}}"

Please format your response as JSON with the following structure:
{
  "explanation": "A clear explanation of what the error means in plain English",
  "suggestedFix": "Code or steps to fix the error",
  "possibleCauses": ["List of possible causes"]
}`,
    
    generateFix: `Generate a code fix for this JavaScript error:
Error: "{{errorMessage}}"
Context: "{{errorContext}}"
Code: "{{errorCode}}"

Please provide only the fixed code without any explanation or markdown formatting.`
  }
};
