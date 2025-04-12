# Console Whisperer Backend

This directory contains the backend server for Console Whisperer.

## Structure

- `index.js`: Entry point
- `config/`: Configuration
- `controllers/`: Route controllers
- `routes/`: API routes
- `services/`: Business logic
- `utils/`: Utility functions
- `middleware/`: Express middleware
- `tests/`: Tests

## Development

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example` and add your Gemini API key:
   ```
   cp .env.example .env
   ```

3. Edit the `.env` file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Process Error

```
POST /api/errors
```

Processes an error and returns an explanation, suggested fix, and relevant links.

### Get Links

```
GET /api/links?query=TypeError+Cannot+read+properties+of+undefined
```

Returns links related to the specified error query.

## Testing

Run the tests:

```
npm test
```

## Docker

Build and run the Docker container:

```
docker build -t console-whisperer-backend .
docker run -p 3000:3000 -e GEMINI_API_KEY=your_gemini_api_key console-whisperer-backend
```

Or use docker-compose:

```
docker-compose up
```
