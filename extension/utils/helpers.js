/**
 * Console Whisperer - Helper Functions
 * 
 * This module provides various helper functions.
 */

// Generate a unique ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Format a date
export function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

// Truncate a string
export function truncate(str, length = 100) {
  if (!str) return '';
  
  if (str.length <= length) {
    return str;
  }
  
  return str.substring(0, length) + '...';
}

// Parse a stack trace
export function parseStackTrace(stack) {
  if (!stack) return [];
  
  const lines = stack.split('\n');
  const frames = [];
  
  // Regular expression to match stack frames
  const regex = /at\s+(?:(.+?)\s+\()?(?:(.+?):(\d+):(\d+))\)?/;
  
  for (const line of lines) {
    const match = regex.exec(line.trim());
    if (match) {
      const [, functionName, fileName, lineNumber, columnNumber] = match;
      frames.push({
        functionName: functionName || 'anonymous',
        fileName,
        lineNumber: parseInt(lineNumber, 10),
        columnNumber: parseInt(columnNumber, 10)
      });
    }
  }
  
  return frames;
}

// Clean an error message
export function cleanErrorMessage(message) {
  if (!message) return '';
  
  // Remove common prefixes
  let cleaned = message.replace(/^(Uncaught |Exception: )/, '');
  
  // Trim whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
}

// Escape HTML
export function escapeHtml(str) {
  if (!str) return '';
  
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Debounce a function
export function debounce(func, wait) {
  let timeout;
  
  return function(...args) {
    const context = this;
    
    clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

// Throttle a function
export function throttle(func, limit) {
  let inThrottle;
  
  return function(...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
