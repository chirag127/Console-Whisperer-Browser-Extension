/**
 * Console Whisperer - Validation Utilities
 * 
 * This module provides utilities for validating data.
 */

// Validate an error object
export function validateError(error) {
  if (!error) {
    return false;
  }
  
  // Must have a message or reason
  if (!error.message && !error.reason) {
    return false;
  }
  
  return true;
}

// Validate a URL
export function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

// Validate an email
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validate a stack trace
export function validateStackTrace(stack) {
  if (!stack) {
    return false;
  }
  
  // Should have at least one line with "at" in it
  return stack.includes('at ');
}

// Validate settings
export function validateSettings(settings) {
  if (!settings) {
    return false;
  }
  
  // Check if backendUrl is a valid URL
  if (settings.backendUrl && !validateUrl(settings.backendUrl)) {
    return false;
  }
  
  return true;
}

// Validate an API response
export function validateApiResponse(response) {
  if (!response) {
    return false;
  }
  
  // Should have originalError, explanation, and links
  if (!response.originalError || !response.explanation) {
    return false;
  }
  
  return true;
}
