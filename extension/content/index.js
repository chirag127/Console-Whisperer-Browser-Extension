/**
 * Console Whisperer - Content Script
 * 
 * This is the main content script for the Console Whisperer extension.
 * It intercepts JavaScript errors and displays explanations.
 */

// Import error interceptor
import { initErrorInterceptor } from './errorInterceptor.js';

// Import UI components
import { errorOverlay } from './ui/overlay.js';
import { fixPreview } from './ui/fixPreview.js';

// Initialize the content script
function initialize() {
  console.log('Console Whisperer: Content script initialized');
  
  // Initialize error interceptor
  initErrorInterceptor();
  
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'errorResponse') {
      handleErrorResponse(message.data);
    }
  });
}

// Handle error response from the backend
function handleErrorResponse(data) {
  // Show the error overlay
  errorOverlay.show(
    data.originalError,
    data.explanation,
    data.suggestedFix,
    data.links
  );
}

// Initialize when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
