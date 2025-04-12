/**
 * Console Whisperer - Shared Constants
 * 
 * This module defines constants shared between the extension and backend.
 */

// API endpoints
export const API_ENDPOINTS = {
  PROCESS_ERROR: '/api/errors',
  GET_LINKS: '/api/links',
  HEALTH: '/api/health'
};

// Error types
export const ERROR_TYPES = {
  WINDOW_ONERROR: 'window.onerror',
  CONSOLE_ERROR: 'console.error',
  UNHANDLED_REJECTION: 'unhandledrejection'
};

// Storage keys
export const STORAGE_KEYS = {
  SETTINGS: 'settings',
  RECENT_ERRORS: 'recentErrors'
};

// Default settings
export const DEFAULT_SETTINGS = {
  autoShow: true,
  saveHistory: true,
  backendUrl: 'https://api.consolewhisperer.com',
  maxErrorsToStore: 50
};

// Extension version
export const VERSION = '1.0.0';
