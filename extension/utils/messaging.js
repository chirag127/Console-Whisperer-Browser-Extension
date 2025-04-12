/**
 * Console Whisperer - Messaging Utilities
 * 
 * This module provides utilities for messaging between different parts of the extension.
 */

// Send a message to the background script
export function sendToBackground(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

// Send a message to a specific tab
export function sendToTab(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

// Send a message to all tabs
export async function sendToAllTabs(message) {
  const tabs = await chrome.tabs.query({});
  
  return Promise.all(
    tabs.map(tab => {
      return new Promise((resolve) => {
        chrome.tabs.sendMessage(tab.id, message, (response) => {
          resolve({ tabId: tab.id, response });
        });
      });
    })
  );
}

// Add a listener for messages
export function addMessageListener(action, callback) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === action) {
      const response = callback(message, sender);
      
      // If the callback returns a promise, wait for it to resolve
      if (response instanceof Promise) {
        response
          .then(result => sendResponse(result))
          .catch(error => sendResponse({ error: error.message }));
        
        // Return true to indicate that the response will be sent asynchronously
        return true;
      }
      
      // Otherwise, send the response immediately
      sendResponse(response);
    }
  });
}
