/**
 * Console Whisperer - Gemini Service
 *
 * This module handles communication with the Gemini API using the official Google Generative AI SDK.
 */

// Import dependencies
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const mime = require("mime-types");

// Import configuration
const config = require("../config");

// Import utilities
const logger = require("../utils/logger");

// Initialize the Gemini API client
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Get the model
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite",
});

// Set generation config
const generationConfig = {
    temperature: config.gemini.defaultParams.temperature,
    topP: config.gemini.defaultParams.topP,
    topK: config.gemini.defaultParams.topK,
    maxOutputTokens: config.gemini.defaultParams.maxOutputTokens,
    responseMimeType: "text/plain",
};

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
        logger.error("Error explaining error with Gemini:", error);

        // Return a fallback response
        return {
            explanation:
                "We couldn't generate an explanation for this error. Please try again later.",
            suggestedFix: null,
            possibleCauses: ["Unknown"],
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
    prompt = prompt.replace(
        "{{errorMessage}}",
        errorData.message || "Unknown error"
    );
    prompt = prompt.replace(
        "{{errorContext}}",
        errorData.stack || "No stack trace available"
    );
    prompt = prompt.replace("{{errorUrl}}", errorData.url || "Unknown URL");

    return prompt;
}

/**
 * Call the Gemini API
 * @param {String} prompt - The prompt to send
 * @returns {Promise<Object>} - The API response
 */
async function callGeminiAPI(prompt) {
    try {
        // Create a chat session
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        // Send the message
        const result = await chatSession.sendMessage(prompt);

        // Return the response
        return result.response;
    } catch (error) {
        logger.error("Error calling Gemini API:", error);
        throw error;
    }
}

/**
 * Parse the Gemini API response
 * @param {Object} response - The API response
 * @returns {Object} - The parsed response
 */
function parseGeminiResponse(response) {
    try {
        // Get the text from the response
        const text = response.text();

        // Log the raw response for debugging
        logger.debug("Raw Gemini response:", text);

        // Try to parse as JSON
        try {
            const parsedResponse = JSON.parse(text);
            return {
                explanation:
                    parsedResponse.explanation || "No explanation available",
                suggestedFix: parsedResponse.suggestedFix || null,
                possibleCauses: parsedResponse.possibleCauses || [],
            };
        } catch (jsonError) {
            // If JSON parsing fails, use the text as the explanation
            logger.warn("Failed to parse Gemini response as JSON:", jsonError);

            return {
                explanation: text,
                suggestedFix: null,
                possibleCauses: [],
            };
        }
    } catch (error) {
        logger.error("Error parsing Gemini response:", error);

        return {
            explanation:
                "We couldn't parse the explanation for this error. Please try again later.",
            suggestedFix: null,
            possibleCauses: ["Unknown"],
        };
    }
}
