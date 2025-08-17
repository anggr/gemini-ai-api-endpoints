# Gemini API

A simple Node.js API to interact with Google's Gemini AI.

## Features

- 🤖 Integration with Google's Gemini AI
- 🔒 Environment-based API key management
- ✅ Input validation and error handling
- 🌐 CORS support
- 📊 Health check endpoint
- 📝 Request logging

## Prerequisites

- Node.js (v14 or higher)
- Google API key for Gemini AI

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment Configuration:**

   Create a `.env` file in the root directory and add your Google API key:

   ```env
   API_KEY=your_google_gemini_api_key_here
   PORT=3000
   ```

   > **Note:** Never commit your `.env` file to version control. The API key should be at least 20 characters long.

## Running the Server

```bash
npm start
```

The server will be running on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Health Check

- **URL:** `/health`
- **Method:** `GET`
- **Description:** Check if the server is running
- **Response:**
  ```json
  {
    "status": "OK",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
  ```

### Generate Content

- **URL:** `/generate`
- **Method:** `POST`
- **Description:** Generate content using Gemini AI
- **Request Body:**

  ```json
  {
    "prompt": "Your text prompt here"
  }
  ```

- **Input Validation:**
  - Prompt is required
  - Must be a string
  - Minimum length: 3 characters
  - Maximum length: 10,000 characters
  - Cannot be empty or whitespace only

- **Success Response:**

  ```json
  {
    "generated_text": "The generated text from Gemini AI."
  }
  ```

- **Error Responses:**

  **Missing or invalid prompt:**
  ```json
  {
    "error": "Prompt is required"
  }
  ```

  **Prompt too short:**
  ```json
  {
    "error": "Prompt is too short (minimum 3 characters)"
  }
  ```

  **Prompt too long:**
  ```json
  {
    "error": "Prompt is too long (maximum 10,000 characters)"
  }
  ```

  **API error:**
  ```json
  {
    "error": "Failed to generate content"
  }
  ```

## Example Usage

### Using curl

```bash
# Health check
curl http://localhost:3000/health

# Generate content
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a short story about a robot learning to paint"}'
```

### Using JavaScript (fetch)

```javascript
// Generate content
const response = await fetch('http://localhost:3000/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'Explain quantum computing in simple terms'
  })
});

const data = await response.json();
console.log(data.generated_text);
```

## Dependencies

- **@google/generative-ai**: Google's Generative AI SDK
- **express**: Web framework for Node.js
- **cors**: Cross-Origin Resource Sharing middleware
- **dotenv**: Environment variable loader

## Error Handling

The API includes comprehensive error handling for:
- Missing or invalid API keys
- Input validation errors
- Gemini AI service errors
- Server errors

## Security Notes

- API keys are validated on startup
- Input is sanitized and validated
- CORS is enabled for cross-origin requests
- Request logging is implemented for monitoring

## License

ISC
