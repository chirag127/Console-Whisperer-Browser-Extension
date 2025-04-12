/**
 * Console Whisperer - Error Types
 * 
 * This module defines error types and categories.
 */

// Common JavaScript error types
export const JS_ERROR_TYPES = {
  SYNTAX_ERROR: 'SyntaxError',
  REFERENCE_ERROR: 'ReferenceError',
  TYPE_ERROR: 'TypeError',
  RANGE_ERROR: 'RangeError',
  URI_ERROR: 'URIError',
  EVAL_ERROR: 'EvalError',
  INTERNAL_ERROR: 'InternalError'
};

// Error categories
export const ERROR_CATEGORIES = {
  SYNTAX: 'syntax',
  RUNTIME: 'runtime',
  NETWORK: 'network',
  PROMISE: 'promise',
  DOM: 'dom',
  UNKNOWN: 'unknown'
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Map error types to categories
export const ERROR_TYPE_TO_CATEGORY = {
  [JS_ERROR_TYPES.SYNTAX_ERROR]: ERROR_CATEGORIES.SYNTAX,
  [JS_ERROR_TYPES.REFERENCE_ERROR]: ERROR_CATEGORIES.RUNTIME,
  [JS_ERROR_TYPES.TYPE_ERROR]: ERROR_CATEGORIES.RUNTIME,
  [JS_ERROR_TYPES.RANGE_ERROR]: ERROR_CATEGORIES.RUNTIME,
  [JS_ERROR_TYPES.URI_ERROR]: ERROR_CATEGORIES.RUNTIME,
  [JS_ERROR_TYPES.EVAL_ERROR]: ERROR_CATEGORIES.RUNTIME,
  [JS_ERROR_TYPES.INTERNAL_ERROR]: ERROR_CATEGORIES.RUNTIME
};

// Common error patterns and their explanations
export const COMMON_ERROR_PATTERNS = [
  {
    pattern: /Cannot read propert(?:y|ies) of (undefined|null)/i,
    category: ERROR_CATEGORIES.RUNTIME,
    severity: ERROR_SEVERITY.MEDIUM
  },
  {
    pattern: /is not a function/i,
    category: ERROR_CATEGORIES.RUNTIME,
    severity: ERROR_SEVERITY.MEDIUM
  },
  {
    pattern: /Unexpected token/i,
    category: ERROR_CATEGORIES.SYNTAX,
    severity: ERROR_SEVERITY.HIGH
  },
  {
    pattern: /Uncaught SyntaxError/i,
    category: ERROR_CATEGORIES.SYNTAX,
    severity: ERROR_SEVERITY.HIGH
  },
  {
    pattern: /Failed to fetch/i,
    category: ERROR_CATEGORIES.NETWORK,
    severity: ERROR_SEVERITY.MEDIUM
  },
  {
    pattern: /NetworkError/i,
    category: ERROR_CATEGORIES.NETWORK,
    severity: ERROR_SEVERITY.MEDIUM
  },
  {
    pattern: /is not defined/i,
    category: ERROR_CATEGORIES.RUNTIME,
    severity: ERROR_SEVERITY.MEDIUM
  }
];
