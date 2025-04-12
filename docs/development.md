# Console Whisperer Development Guide

This document provides information for developers who want to contribute to the Console Whisperer project.

## Development Environment Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Chrome or Edge browser

### Extension Development

1. Clone the repository:
   ```
   git clone https://github.com/chirag127/Console-Whisperer-Browser-Extension.git
   ```

2. Navigate to the extension directory:
   ```
   cd Console-Whisperer-Browser-Extension/extension
   ```

3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top-right corner
   - Click "Load unpacked" and select the `extension` folder from the cloned repository

4. Make your changes and reload the extension to see them

### Backend Development

1. Navigate to the backend directory:
   ```
   cd Console-Whisperer-Browser-Extension/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and add your Gemini API key:
   ```
   cp .env.example .env
   ```

4. Edit the `.env` file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

The project is organized into three main parts:

1. **Extension**: The browser extension that intercepts errors and displays explanations
2. **Backend**: The Node.js server that processes errors and generates explanations
3. **Shared**: Code shared between the extension and backend

### Extension Structure

```
extension/
├── manifest.json                # Extension manifest
├── assets/                      # Static assets
│   └── icons/                   # Extension icons
├── background/                  # Background scripts
│   ├── index.js                 # Main background script
│   ├── errorHandler.js          # Error handling logic
│   └── api.js                   # API communication
├── content/                     # Content scripts
│   ├── index.js                 # Main content script
│   ├── errorInterceptor.js      # Error interception logic
│   └── ui/                      # UI components
│       ├── overlay.js           # Overlay UI component
│       ├── fixPreview.js        # Fix preview component
│       └── templates.js         # HTML templates
├── popup/                       # Popup UI
│   ├── index.html               # Popup HTML
│   ├── popup.js                 # Popup logic
│   └── popup.css                # Popup styles
├── styles/                      # Shared styles
│   ├── common.css               # Common styles
│   └── themes.css               # Theme-related styles
└── utils/                       # Utility functions
    ├── storage.js               # Storage utilities
    ├── messaging.js             # Messaging utilities
    └── helpers.js               # Helper functions
```

### Backend Structure

```
backend/
├── package.json                 # Node.js package file
├── .env.example                 # Example environment variables
├── index.js                     # Entry point
├── config/                      # Configuration
│   ├── index.js                 # Main config
│   ├── gemini.js                # Gemini API config
│   └── cors.js                  # CORS config
├── controllers/                 # Route controllers
│   ├── errorController.js       # Error handling controller
│   └── linkController.js        # Link aggregation controller
├── routes/                      # API routes
│   ├── index.js                 # Route index
│   ├── errorRoutes.js           # Error-related routes
│   └── linkRoutes.js            # Link-related routes
├── services/                    # Business logic
│   ├── geminiService.js         # Gemini API service
│   ├── linkScraperService.js    # Link scraping service
│   └── cacheService.js          # Caching service
├── utils/                       # Utility functions
│   ├── logger.js                # Logging utility
│   ├── errorHandler.js          # Error handling utility
│   └── validators.js            # Input validation
├── middleware/                  # Express middleware
│   ├── auth.js                  # Authentication middleware
│   ├── rateLimit.js             # Rate limiting middleware
│   └── errorMiddleware.js       # Error handling middleware
└── tests/                       # Tests
    ├── unit/                    # Unit tests
    └── integration/             # Integration tests
```

### Shared Structure

```
shared/
├── constants.js                 # Shared constants
├── errorTypes.js                # Error type definitions
└── utils/                       # Shared utilities
    ├── formatting.js            # Text formatting utilities
    └── validation.js            # Validation utilities
```

## Development Workflow

1. **Create a feature branch**: Always create a new branch for your changes
   ```
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**: Implement your feature or fix

3. **Test your changes**: Make sure your changes work as expected
   - For extension changes, reload the extension in Chrome
   - For backend changes, restart the development server

4. **Commit your changes**: Use descriptive commit messages
   ```
   git commit -m "Add feature: your feature description"
   ```

5. **Push your changes**: Push your branch to GitHub
   ```
   git push origin feature/your-feature-name
   ```

6. **Create a pull request**: Open a pull request on GitHub

## Coding Standards

- Use ES6+ features
- Use async/await for asynchronous code
- Use descriptive variable and function names
- Add comments for complex logic
- Follow the existing code style

## Testing

### Extension Testing

1. Load the extension in Chrome
2. Open the developer console (F12)
3. Test error interception by generating errors:
   ```javascript
   // Reference error
   console.log(undefinedVariable);
   
   // Type error
   const obj = null;
   obj.property;
   
   // Syntax error (in console)
   eval('if (true) {');
   ```

### Backend Testing

1. Start the backend server
2. Use a tool like Postman or curl to test the API endpoints
3. Example curl command:
   ```
   curl -X POST -H "Content-Type: application/json" -d '{"errorData":{"message":"Uncaught TypeError: Cannot read properties of undefined (reading \"foo\")","stack":"TypeError: Cannot read properties of undefined (reading \"foo\")\n    at bar (app.js:45)\n    at foo (app.js:30)","url":"https://example.com","type":"window.onerror"}}' http://localhost:3000/api/errors
   ```

## Debugging

### Extension Debugging

1. Open Chrome and navigate to `chrome://extensions/`
2. Find the Console Whisperer extension and click "background page" under "Inspect views"
3. Use the Chrome DevTools to debug the background script
4. To debug content scripts, open the DevTools on the page where the content script is running

### Backend Debugging

1. Start the backend server with the `--inspect` flag:
   ```
   node --inspect index.js
   ```
2. Open Chrome and navigate to `chrome://inspect`
3. Click "Open dedicated DevTools for Node"
4. Use the Chrome DevTools to debug the backend

## Building for Production

### Extension

1. Update the version in `manifest.json`
2. Zip the extension directory:
   ```
   cd extension
   zip -r ../console-whisperer-extension-v1.0.0.zip *
   ```

### Backend

1. Update the version in `package.json`
2. Build the Docker image:
   ```
   docker build -t console-whisperer-backend:1.0.0 .
   ```

## Deployment

### Extension

1. Upload the zip file to the Chrome Web Store Developer Dashboard
2. Fill in the required information
3. Submit for review

### Backend

1. Deploy the Docker image to your preferred hosting platform
2. Set up environment variables
3. Configure a domain name and SSL certificate
