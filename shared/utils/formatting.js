/**
 * Console Whisperer - Formatting Utilities
 * 
 * This module provides utilities for formatting data.
 */

// Format a date
export function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

// Format a file size
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format an error message
export function formatErrorMessage(message) {
  if (!message) return 'Unknown error';
  
  // Remove common prefixes
  let formatted = message.replace(/^(Uncaught |Exception: )/, '');
  
  // Trim whitespace
  formatted = formatted.trim();
  
  return formatted;
}

// Format a stack trace
export function formatStackTrace(stack) {
  if (!stack) return '';
  
  // Split into lines
  const lines = stack.split('\n');
  
  // Remove the first line if it's the error message
  if (lines[0] && !lines[0].includes('at ')) {
    lines.shift();
  }
  
  // Format each line
  return lines
    .map(line => {
      // Highlight function names
      return line.replace(/(at\s+)(.+?)(\s+\(|:)/, '$1<strong>$2</strong>$3');
    })
    .join('<br>');
}

// Truncate a string
export function truncate(str, length = 100) {
  if (!str) return '';
  
  if (str.length <= length) {
    return str;
  }
  
  return str.substring(0, length) + '...';
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

// Unescape HTML
export function unescapeHtml(str) {
  if (!str) return '';
  
  return String(str)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}
