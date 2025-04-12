/**
 * Console Whisperer - Gemini Service Tests
 * 
 * This file contains unit tests for the Gemini service.
 */

// Mock dependencies
jest.mock('axios');
jest.mock('../../config', () => ({
  gemini: {
    apiKey: 'test-api-key',
    apiUrl: 'https://test-api-url',
    defaultParams: {
      temperature: 0.4,
      maxOutputTokens: 1024,
      topK: 40,
      topP: 0.95
    },
    promptTemplates: {
      explainError: 'Explain this JavaScript error: {{errorMessage}}'
    }
  }
}));
jest.mock('../../utils/logger');

// Import dependencies
const axios = require('axios');
const geminiService = require('../../services/geminiService');

describe('Gemini Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('explainError', () => {
    it('should format the prompt and call the Gemini API', async () => {
      // Mock axios response
      axios.post.mockResolvedValueOnce({
        data: {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      explanation: 'This is an explanation',
                      suggestedFix: 'This is a fix',
                      possibleCauses: ['Cause 1', 'Cause 2']
                    })
                  }
                ]
              }
            }
          ]
        }
      });

      // Call the function
      const errorData = {
        message: 'Test error message',
        stack: 'Test stack trace',
        url: 'https://example.com'
      };
      const result = await geminiService.explainError(errorData);

      // Check that axios was called with the correct arguments
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post.mock.calls[0][0]).toBe('https://test-api-url');
      expect(axios.post.mock.calls[0][1].contents[0].parts[0].text).toContain('Test error message');

      // Check the result
      expect(result).toEqual({
        explanation: 'This is an explanation',
        suggestedFix: 'This is a fix',
        possibleCauses: ['Cause 1', 'Cause 2']
      });
    });

    it('should handle API errors gracefully', async () => {
      // Mock axios to throw an error
      axios.post.mockRejectedValueOnce(new Error('API error'));

      // Call the function
      const errorData = {
        message: 'Test error message',
        stack: 'Test stack trace',
        url: 'https://example.com'
      };
      const result = await geminiService.explainError(errorData);

      // Check the result
      expect(result).toEqual({
        explanation: "We couldn't generate an explanation for this error. Please try again later.",
        suggestedFix: null,
        possibleCauses: ["Unknown"]
      });
    });

    it('should handle non-JSON responses gracefully', async () => {
      // Mock axios response with non-JSON text
      axios.post.mockResolvedValueOnce({
        data: {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: 'This is not JSON'
                  }
                ]
              }
            }
          ]
        }
      });

      // Call the function
      const errorData = {
        message: 'Test error message',
        stack: 'Test stack trace',
        url: 'https://example.com'
      };
      const result = await geminiService.explainError(errorData);

      // Check the result
      expect(result).toEqual({
        explanation: 'This is not JSON',
        suggestedFix: null,
        possibleCauses: []
      });
    });
  });
});
