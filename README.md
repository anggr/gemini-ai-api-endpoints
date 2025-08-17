# Gemini API

A simple Node.js API to interact with Google's Gemini AI.

## Setup

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Add your API Key:**

    Open `index.js` and replace `YOUR_API_KEY` with your Google API key for Gemini.

    ```javascript
    const API_KEY = 'YOUR_API_KEY';
    ```

## Running the server

```bash
npm start
```

The server will be running on `http://localhost:3000`.

## API Endpoint

*   **URL:** `/generate`
*   **Method:** `POST`
*   **Body:**

    ```json
    {
      "prompt": "Your text prompt here"
    }
    ```

*   **Success Response:**

    ```json
    {
      "generated_text": "The generated text from Gemini AI."
    }
    ```

*   **Error Response:**

    If the prompt is missing:

    ```json
    {
      "error": "Prompt is required"
    }
    ```

    If there is an error with the Gemini API call:

    ```json
    {
      "error": "Failed to generate content"
    }
    ```# gemini-ai-api-endpoints
