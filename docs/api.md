# Console Whisperer API Documentation

This document provides detailed information about the Console Whisperer API endpoints.

## Base URL

```
https://api.consolewhisperer.com
```

## Authentication

Currently, the API does not require authentication. However, rate limiting is applied to prevent abuse.

## Endpoints

### Process Error

```
POST /api/errors
```

Processes a JavaScript error and returns an explanation, suggested fix, and relevant links.

#### Request

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "errorData": {
    "message": "Uncaught TypeError: Cannot read properties of undefined (reading 'foo')",
    "stack": "TypeError: Cannot read properties of undefined (reading 'foo')\n    at bar (app.js:45)\n    at foo (app.js:30)",
    "url": "https://example.com",
    "type": "window.onerror",
    "timestamp": 1637012345678
  }
}
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| errorData.message | string | The error message |
| errorData.stack | string | The error stack trace |
| errorData.url | string | The URL where the error occurred |
| errorData.type | string | The type of error (window.onerror, console.error, unhandledrejection) |
| errorData.timestamp | number | The timestamp when the error occurred |

#### Response

**Status Code:** 200 OK

**Body:**

```json
{
  "originalError": {
    "message": "Uncaught TypeError: Cannot read properties of undefined (reading 'foo')",
    "stack": "TypeError: Cannot read properties of undefined (reading 'foo')\n    at bar (app.js:45)\n    at foo (app.js:30)",
    "url": "https://example.com",
    "type": "window.onerror",
    "timestamp": 1637012345678
  },
  "explanation": "You're trying to access a property 'foo' on an object that is undefined. This means you're trying to use an object that doesn't exist or hasn't been initialized yet.",
  "suggestedFix": "Make sure the object exists before accessing its properties:\n\nif (myObject) {\n  myObject.foo();\n}",
  "possibleCauses": [
    "The object hasn't been initialized",
    "The object is null or undefined",
    "The object is being accessed before it's available"
  ],
  "links": [
    {
      "url": "https://stackoverflow.com/questions/14782232/how-to-avoid-cannot-read-property-of-undefined-errors",
      "title": "How to avoid 'Cannot read property of undefined' errors",
      "source": "stackoverflow"
    },
    {
      "url": "https://github.com/facebook/react/issues/15732",
      "title": "Fix for TypeError: Cannot read property of undefined",
      "source": "github"
    }
  ],
  "timestamp": 1637012345679,
  "id": 12345
}
```

**Error Responses:**

- 400 Bad Request: Invalid error data
- 500 Internal Server Error: Server error

### Get Error

```
GET /api/errors/:id
```

Retrieves a previously processed error by its ID.

#### Request

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | The error ID |

#### Response

**Status Code:** 200 OK

**Body:** Same as the response from the Process Error endpoint.

**Error Responses:**

- 404 Not Found: Error not found
- 500 Internal Server Error: Server error

### Get Recent Errors

```
GET /api/errors
```

Retrieves a list of recently processed errors.

#### Response

**Status Code:** 200 OK

**Body:**

```json
{
  "errors": [
    {
      "id": 12345,
      "message": "Uncaught TypeError: Cannot read properties of undefined (reading 'foo')",
      "url": "https://example.com",
      "timestamp": 1637012345678
    },
    {
      "id": 12344,
      "message": "Uncaught SyntaxError: Unexpected token '}'",
      "url": "https://example.com",
      "timestamp": 1637012345677
    }
  ]
}
```

**Error Responses:**

- 500 Internal Server Error: Server error

### Get Links

```
GET /api/links?query=TypeError+Cannot+read+properties+of+undefined
```

Retrieves links related to the specified error query.

#### Request

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| query | string | The error query |

#### Response

**Status Code:** 200 OK

**Body:**

```json
{
  "links": [
    {
      "url": "https://stackoverflow.com/questions/14782232/how-to-avoid-cannot-read-property-of-undefined-errors",
      "title": "How to avoid 'Cannot read property of undefined' errors",
      "source": "stackoverflow"
    },
    {
      "url": "https://github.com/facebook/react/issues/15732",
      "title": "Fix for TypeError: Cannot read property of undefined",
      "source": "github"
    }
  ]
}
```

**Error Responses:**

- 400 Bad Request: Query parameter is required
- 500 Internal Server Error: Server error

### Submit Link

```
POST /api/links
```

Submits a link related to an error query.

#### Request

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "url": "https://stackoverflow.com/questions/14782232/how-to-avoid-cannot-read-property-of-undefined-errors",
  "title": "How to avoid 'Cannot read property of undefined' errors",
  "errorQuery": "TypeError Cannot read properties of undefined"
}
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| url | string | The link URL |
| title | string | The link title |
| errorQuery | string | The error query |

#### Response

**Status Code:** 201 Created

**Body:**

```json
{
  "success": true
}
```

**Error Responses:**

- 400 Bad Request: URL, title, and errorQuery are required
- 500 Internal Server Error: Server error

## Rate Limiting

The API is rate-limited to prevent abuse. The current limits are:

- 100 requests per minute per IP address

If you exceed the rate limit, you will receive a 429 Too Many Requests response with a Retry-After header indicating how long to wait before making another request.
