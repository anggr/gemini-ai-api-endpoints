require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

// Validate API key on startup
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("ERROR: API_KEY is not set in environment variables");
  process.exit(1);
}

if (API_KEY.length < 20) {
  console.error("ERROR: API_KEY appears to be invalid (too short)");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Note: Removed local rate limiting to rely on Google's API rate limits

// Input validation helper
const validatePrompt = (prompt) => {
  if (!prompt) {
    return { valid: false, error: "Prompt is required" };
  }

  if (typeof prompt !== "string") {
    return { valid: false, error: "Prompt must be a string" };
  }

  if (prompt.trim().length === 0) {
    return { valid: false, error: "Prompt cannot be empty" };
  }

  if (prompt.length > 10000) {
    return {
      valid: false,
      error: "Prompt is too long (maximum 10,000 characters)",
    };
  }

  if (prompt.length < 3) {
    return {
      valid: false,
      error: "Prompt is too short (minimum 3 characters)",
    };
  }

  return { valid: true };
};

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "1.0.0",
  });
});

// Main generation endpoint
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate input
    const validation = validatePrompt(prompt);
    if (!validation.valid) {
      return res.status(400).json({
        error: "Invalid input",
        message: validation.error,
        timestamp: new Date().toISOString(),
      });
    }

    // Sanitize prompt
    const sanitizedPrompt = prompt.trim();

    console.log(
      `Processing request with prompt length: ${sanitizedPrompt.length}`
    );

    // Generate content
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(sanitizedPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      generated_text: text,
      prompt_length: sanitizedPrompt.length,
      timestamp: new Date().toISOString(),
      success: true,
    });
  } catch (error) {
    console.error("Generation error:", error);

    // Handle specific Google AI errors
    if (error.message && error.message.includes("API_KEY")) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid or expired API key",
        timestamp: new Date().toISOString(),
      });
    }

    if (error.message && error.message.includes("quota")) {
      return res.status(429).json({
        error: "Quota exceeded",
        message: "API quota has been exceeded. Please try again later.",
        timestamp: new Date().toISOString(),
      });
    }

    if (error.message && error.message.includes("safety")) {
      return res.status(400).json({
        error: "Content filtered",
        message:
          "The prompt was blocked due to safety concerns. Please modify your request.",
        timestamp: new Date().toISOString(),
      });
    }

    // Generic error response
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to generate content. Please try again later.",
      timestamp: new Date().toISOString(),
    });
  }
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    error: "Internal server error",
    message: "An unexpected error occurred",
    timestamp: new Date().toISOString(),
  });
});

// Graceful shutdown
const server = app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
  console.log(`📊 Health check available at http://localhost:${port}/health`);
  console.log(
    `🤖 Generate endpoint available at http://localhost:${port}/generate`
  );
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
