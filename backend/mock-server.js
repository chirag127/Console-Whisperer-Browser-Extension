/**
 * Console Whisperer - Mock Backend Server
 *
 * This is a simple mock server for testing the extension without setting up the full backend.
 */

// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

// Import the Gemini service for real API calls (if needed)
// const geminiService = require('./services/geminiService');

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

// Process error endpoint
app.post("/api/errors", async (req, res) => {
    const { errorData } = req.body;

    console.log("Received error:", errorData);

    // Check if we should use the real Gemini API
    const useRealAPI = process.env.USE_REAL_API === "true";

    if (
        useRealAPI &&
        process.env.GEMINI_API_KEY &&
        process.env.GEMINI_API_KEY !== "your_gemini_api_key_here"
    ) {
        try {
            // Import the Gemini service dynamically
            const geminiService = require("./services/geminiService");

            // Get a real explanation from Gemini
            const explanation = await geminiService.explainError(errorData);

            // Add the original error and timestamp
            const response = {
                originalError: errorData,
                ...explanation,
                timestamp: Date.now(),
            };

            // Send the response
            res.json(response);
            return;
        } catch (error) {
            console.error("Error using real Gemini API:", error);

            // Fall back to mock response
            sendMockResponse(errorData, res);
            return;
        }
    } else {
        // Use mock response
        sendMockResponse(errorData, res);
        return;
    }
});

// Helper function to send a mock response
function sendMockResponse(errorData, res) {
    // Create a mock response
    const response = {
        originalError: errorData,
        explanation: `This is a mock explanation for the error: "${errorData.message}". The error was detected in ${errorData.type}.`,
        suggestedFix: `// Here's a mock fix for the error:\n// Check if the variable exists before using it\nif (typeof myVariable !== 'undefined') {\n  // Use myVariable here\n}`,
        possibleCauses: [
            "The variable might not be defined",
            "The object might be null or undefined",
            "There might be a typo in the variable name",
        ],
        links: [
            {
                url: "https://stackoverflow.com/questions/14782232/how-to-avoid-cannot-read-property-of-undefined-errors",
                title: "How to avoid 'Cannot read property of undefined' errors",
                source: "stackoverflow",
            },
            {
                url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors",
                title: "JavaScript errors reference - JavaScript | MDN",
                source: "mdn",
            },
        ],
        timestamp: Date.now(),
    };

    // Send the response after a short delay to simulate processing
    setTimeout(() => {
        res.json(response);
    }, 500);
}

// Get links endpoint
app.get("/api/links", (req, res) => {
    const { query } = req.query;

    console.log("Received link query:", query);

    // Create a mock response
    const response = {
        links: [
            {
                url: "https://stackoverflow.com/questions/14782232/how-to-avoid-cannot-read-property-of-undefined-errors",
                title: "How to avoid 'Cannot read property of undefined' errors",
                source: "stackoverflow",
            },
            {
                url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors",
                title: "JavaScript errors reference - JavaScript | MDN",
                source: "mdn",
            },
        ],
    };

    // Send the response
    res.json(response);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Mock server running at http://localhost:${PORT}`);
    console.log("Use this server for testing the extension");
    console.log("Press Ctrl+C to stop the server");
});
