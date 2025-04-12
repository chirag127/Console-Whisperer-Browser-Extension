/**
 * Console Whisperer - Background Script
 * 
 * This is the main background script for the Console Whisperer extension.
 * It handles communication between content scripts and the backend API.
 */

import { processError } from './errorHandler.js';
import { sendToBackend } from './api.js';
import { getFromStorage, saveToStorage } from '../utils/storage.js';

// Initialize the extension
async function initialize() {
  console.log('Console Whisperer: Background script initialized');
  
  // Set default settings if not already set
  const settings = await getFromStorage('settings') || {};
  if (!settings.backendUrl) {
    settings.backendUrl = 'https://api.consolewhisperer.com';
    await saveToStorage('settings', settings);
  }
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'processError') {
    handleErrorMessage(message, sender)
      .then(response => sendResponse(response))
      .catch(error => {
        console.error('Error handling message:', error);
        sendResponse({ error: error.message });
      });
    
    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});

// Handle error messages from content scripts
async function handleErrorMessage(message, sender) {
  try {
    // Process the error
    const processedError = await processError(message.errorData);
    
    // Send to backend
    const response = await sendToBackend(processedError);
    
    // Store the response
    await saveToStorage(`error_${Date.now()}`, {
      error: processedError,
      response,
      timestamp: Date.now()
    });
    
    // Send the response back to the content script
    chrome.tabs.sendMessage(sender.tab.id, {
      action: 'errorResponse',
      data: response
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error processing error:', error);
    return { error: error.message };
  }
}

// Initialize the extension
initialize();
