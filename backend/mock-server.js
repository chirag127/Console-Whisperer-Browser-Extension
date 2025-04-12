/**
 * Console Whisperer - Mock Backend Server
 * 
 * This is a simple mock server for testing the extension without setting up the full backend.
 */

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Process error endpoint
app.post('/api/errors', (req, res) => {
  const { errorData } = req.body;
  
  console.log('Received error:', errorData);
  
  // Create a mock response
  const response = {
    originalError: errorData,
    explanation: `This is a mock explanation for the error: "${errorData.message}". The error was detected in ${errorData.type}.`,
    suggestedFix: `// Here's a mock fix for the error:\n// Check if the variable exists before using it\nif (typeof myVariable !== 'undefined') {\n  // Use myVariable here\n}`,
    possibleCauses: [
      "The variable might not be defined",
      "The object might be null or undefined",
      "There might be a typo in the variable name"
    ],
    links: [
      {
        url: "https://stackoverflow.com/questions/14782232/how-to-avoid-cannot-read-property-of-undefined-errors",
        title: "How to avoid 'Cannot read property of undefined' errors",
        source: "stackoverflow"
      },
      {
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors",
        title: "JavaScript errors reference - JavaScript | MDN",
        source: "mdn"
      }
    ],
    timestamp: Date.now()
  };
  
  // Send the response after a short delay to simulate processing
  setTimeout(() => {
    res.json(response);
  }, 500);
});

// Get links endpoint
app.get('/api/links', (req, res) => {
  const { query } = req.query;
  
  console.log('Received link query:', query);
  
  // Create a mock response
  const response = {
    links: [
      {
        url: "https://stackoverflow.com/questions/14782232/how-to-avoid-cannot-read-property-of-undefined-errors",
        title: "How to avoid 'Cannot read property of undefined' errors",
        source: "stackoverflow"
      },
      {
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors",
        title: "JavaScript errors reference - JavaScript | MDN",
        source: "mdn"
      }
    ]
  };
  
  // Send the response
  res.json(response);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
  console.log('Use this server for testing the extension');
  console.log('Press Ctrl+C to stop the server');
});
