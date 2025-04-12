# 🔧 Console Whisperer

A browser extension that translates cryptic JavaScript console errors into plain English explanations with AI-powered fix suggestions.

## 📋 Overview

Console Whisperer is a developer tool that helps you understand and fix JavaScript errors faster. It intercepts browser console errors in real-time and uses Gemini 2.0 Flash Lite to:

-   💡 Explain the error in plain English
-   🛠️ Suggest potential fixes with code examples
-   🔗 Provide relevant StackOverflow and GitHub links
-   📊 Show the error context and stack trace

All of this happens inline with your development workflow, so you can stay focused on coding instead of Googling error messages.

## ✨ Features

### 🔍 Real-time Error Detection

-   Intercepts errors via `window.onerror`
-   Captures `console.error` calls
-   Listens for unhandled promise rejections

### 🧠 AI-Powered Explanations

-   Translates technical errors into plain English
-   Explains the likely cause of the error
-   Suggests specific fixes for your code

### 🌐 Contextual Link Aggregation

-   Finds relevant StackOverflow answers
-   Discovers related GitHub issues
-   Ranks links by relevance to your specific error

### 💬 Elegant UI

-   Non-intrusive overlay that appears when errors occur
-   Copy-to-clipboard functionality for suggested fixes
-   Collapsible sections for detailed information

## 🚀 Installation

### Chrome Web Store

Coming soon!

### Manual Installation

1. Clone this repository:
    ```
    git clone https://github.com/chirag127/Console-Whisperer-Browser-Extension.git
    ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the `extension` folder from the cloned repository

## 🛠️ Development

### Prerequisites

-   Node.js (v14 or higher)
-   npm (v6 or higher)

### Extension Development

1. Clone the repository:
    ```
    git clone https://github.com/chirag127/Console-Whisperer-Browser-Extension.git
    ```
2. Navigate to the extension directory:
    ```
    cd Console-Whisperer-Browser-Extension/extension
    ```
3. Load the extension in Chrome as described in the installation section
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
3. Create a `.env` file based on `.env.example` and add your Gemini API key
4. Start the development server:
    ```
    npm run dev
    ```

## 🏗️ Architecture

### Extension

-   **Manifest V3** compliant browser extension
-   **Background Service Worker** for handling API communication
-   **Content Scripts** for intercepting errors and displaying UI
-   **Storage API** for caching responses and settings

### Backend

-   **Node.js + Express** server
-   **Gemini 2.0 Flash Lite** for AI-powered error explanations
-   **Caching** for improved performance
-   **Rate limiting** to prevent abuse

## 📄 API

### Error Processing

```
POST /api/errors
```

Processes an error and returns an explanation, suggested fix, and relevant links.

**Request Body:**

```json
{
    "errorData": {
        "message": "Uncaught TypeError: Cannot read properties of undefined (reading 'foo')",
        "stack": "TypeError: Cannot read properties of undefined (reading 'foo')\n    at bar (app.js:45)\n    at foo (app.js:30)",
        "url": "https://example.com",
        "type": "window.onerror"
    }
}
```

**Response:**

```json
{
    "originalError": {
        /* Error data */
    },
    "explanation": "You're trying to access a property 'foo' on an object that is undefined...",
    "suggestedFix": "Make sure the object exists before accessing its properties:\n\nif (myObject) {\n  myObject.foo();\n}",
    "possibleCauses": [
        "The object hasn't been initialized",
        "The object is null or undefined"
    ],
    "links": [
        {
            "url": "https://stackoverflow.com/questions/...",
            "title": "How to fix 'Cannot read property of undefined'",
            "source": "stackoverflow"
        }
    ]
}
```

### Link Aggregation

```
GET /api/links?query=TypeError+Cannot+read+properties+of+undefined
```

Returns links related to the specified error query.

**Response:**

```json
{
    "links": [
        {
            "url": "https://stackoverflow.com/questions/...",
            "title": "How to fix 'Cannot read property of undefined'",
            "source": "stackoverflow"
        },
        {
            "url": "https://github.com/...",
            "title": "Fix for TypeError: Cannot read properties of undefined",
            "source": "github"
        }
    ]
}
```

## 📊 Project Structure

```
console-whisperer/
├── extension/               # Browser extension
│   ├── manifest.json        # Extension manifest
│   ├── assets/              # Static assets
│   ├── background/          # Background scripts
│   ├── content/             # Content scripts
│   ├── popup/               # Popup UI
│   ├── styles/              # Shared styles
│   └── utils/               # Utility functions
├── backend/                 # Node.js backend
│   ├── index.js             # Entry point
│   ├── config/              # Configuration
│   ├── controllers/         # Route controllers
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   └── middleware/          # Express middleware
├── shared/                  # Shared code
│   ├── constants.js         # Shared constants
│   ├── errorTypes.js        # Error type definitions
│   └── utils/               # Shared utilities
└── docs/                    # Documentation
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📬 Contact

Chirag Singhal - [GitHub](https://github.com/chirag127)

Project Link: [https://github.com/chirag127/Console-Whisperer-Browser-Extension](https://github.com/chirag127/Console-Whisperer-Browser-Extension)
