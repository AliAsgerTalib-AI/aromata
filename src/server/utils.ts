import express from "express";

/**
 * Initialize Gemini client (can be called per request or cached)
 * Since serverless functions are stateless, initialize fresh per request
 */
export function getGeminiClient() {
  const { GoogleGenAI } = require("@google/genai");
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is required. Please set it in Vercel secrets."
    );
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Input sanitization helper
 */
export function sanitizeInput(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\x00-\x1F\x7F]/g, "")
    .trim()
    .substring(0, maxLength);
}

/**
 * Standard API error handler for serverless functions
 */
export function handleApiError(
  res: any,
  error: any,
  context: string
): void {
  const message = error?.message || "Unknown error";
  const statusCode = error?.statusCode || 500;

  console.error(`Error in ${context}:`, message);

  res.status(statusCode).json({
    error: message,
    context,
  });
}

/**
 * CORS headers for serverless functions
 */
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * Apply CORS headers to response
 */
export function applyCorsHeaders(res: any): void {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}
