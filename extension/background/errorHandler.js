/**
 * Console Whisperer - Error Handler
 * 
 * This module processes error data received from content scripts.
 */

import { getFromStorage } from '../utils/storage.js';

// Process error data
export async function processError(errorData) {
  // Add additional context
  const processedError = {
    ...errorData,
    processed: true,
    processedAt: Date.now()
  };
  
  // Clean up the error message
  if (processedError.message) {
    processedError.message = cleanErrorMessage(processedError.message);
  }
  
  // Extract relevant information from stack trace
  if (processedError.stack) {
    const stackInfo = parseStackTrace(processedError.stack);
    if (stackInfo) {
      processedError.parsedStack = stackInfo;
    }
  }
  
  // Check if we've seen this error before
  const isSimilarToKnown = await checkSimilarErrors(processedError);
  if (isSimilarToKnown) {
    processedError.isSimilarToKnown = true;
  }
  
  return processedError;
}

// Clean up error message
function cleanErrorMessage(message) {
  // Remove common prefixes
  let cleaned = message.replace(/^(Uncaught |Exception: )/, '');
  
  // Trim whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
}

// Parse stack trace to extract file, line, and column information
function parseStackTrace(stack) {
  // Simple regex to extract file, line, and column from stack trace
  const regex = /at\s+(?:(.+?)\s+\()?(?:(.+?):(\d+):(\d+))\)?/;
  const lines = stack.split('\n');
  
  const frames = [];
  
  for (const line of lines) {
    const match = regex.exec(line.trim());
    if (match) {
      const [, functionName, fileName, lineNumber, columnNumber] = match;
      frames.push({
        functionName: functionName || 'anonymous',
        fileName: fileName,
        lineNumber: parseInt(lineNumber, 10),
        columnNumber: parseInt(columnNumber, 10)
      });
    }
  }
  
  return frames.length > 0 ? frames : null;
}

// Check if we've seen similar errors before
async function checkSimilarErrors(errorData) {
  // Get recent errors from storage
  const recentErrors = await getFromStorage('recentErrors') || [];
  
  // Check if any recent error is similar to this one
  return recentErrors.some(error => {
    // Compare error messages
    if (error.message === errorData.message) {
      return true;
    }
    
    // Compare stack traces if available
    if (error.parsedStack && errorData.parsedStack) {
      // Check if the first frame is similar
      const frame1 = error.parsedStack[0];
      const frame2 = errorData.parsedStack[0];
      
      if (frame1 && frame2) {
        return frame1.fileName === frame2.fileName && 
               Math.abs(frame1.lineNumber - frame2.lineNumber) <= 5;
      }
    }
    
    return false;
  });
}
