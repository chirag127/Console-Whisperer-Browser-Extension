/**
 * Console Whisperer - Popup Script
 * 
 * This script handles the popup UI.
 */

import { getFromStorage, saveToStorage, getAllStorage } from '../utils/storage.js';
import { formatDate, truncate } from '../utils/helpers.js';

// Initialize the popup
async function initialize() {
  // Load settings
  const settings = await getFromStorage('settings') || {
    autoShow: true,
    saveHistory: true,
    backendUrl: 'https://api.consolewhisperer.com'
  };
  
  // Set checkbox states
  document.getElementById('auto-show').checked = settings.autoShow !== false;
  document.getElementById('save-history').checked = settings.saveHistory !== false;
  
  // Add event listeners
  document.getElementById('auto-show').addEventListener('change', handleAutoShowChange);
  document.getElementById('save-history').addEventListener('change', handleSaveHistoryChange);
  
  // Load recent errors
  await loadRecentErrors();
}

// Handle auto-show setting change
async function handleAutoShowChange(event) {
  const settings = await getFromStorage('settings') || {};
  settings.autoShow = event.target.checked;
  await saveToStorage('settings', settings);
}

// Handle save-history setting change
async function handleSaveHistoryChange(event) {
  const settings = await getFromStorage('settings') || {};
  settings.saveHistory = event.target.checked;
  await saveToStorage('settings', settings);
}

// Load recent errors
async function loadRecentErrors() {
  const allStorage = await getAllStorage();
  const recentErrors = [];
  
  // Find error entries in storage
  for (const key in allStorage) {
    if (key.startsWith('error_')) {
      recentErrors.push({
        key,
        ...allStorage[key]
      });
    }
  }
  
  // Sort by timestamp (newest first)
  recentErrors.sort((a, b) => b.timestamp - a.timestamp);
  
  // Display recent errors
  displayRecentErrors(recentErrors.slice(0, 5));
}

// Display recent errors
function displayRecentErrors(errors) {
  const container = document.getElementById('recent-errors');
  
  if (errors.length === 0) {
    container.innerHTML = '<div class="empty-state">No recent errors detected</div>';
    return;
  }
  
  container.innerHTML = '';
  
  for (const error of errors) {
    const errorItem = document.createElement('div');
    errorItem.className = 'error-item';
    errorItem.dataset.key = error.key;
    
    const message = error.error?.message || 'Unknown error';
    const timestamp = error.timestamp ? formatDate(error.timestamp) : 'Unknown time';
    const url = error.error?.url ? new URL(error.error.url).hostname : 'Unknown page';
    
    errorItem.innerHTML = `
      <div class="error-message">${truncate(message, 40)}</div>
      <div class="error-details">${url} • ${timestamp}</div>
    `;
    
    errorItem.addEventListener('click', () => {
      // Open the error in a new tab
      chrome.tabs.create({
        url: `error-details.html?key=${error.key}`
      });
    });
    
    container.appendChild(errorItem);
  }
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', initialize);
