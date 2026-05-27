import { analysisCache } from "../src/server/cache/analysisCache.js";
import {
  buildFragranceDataPrompt,
  buildFragranceDataSchema,
} from "../src/server/gemini/fragranceDataPrompt.js";
import { PREDEFINED_FRAGRANCES } from "../src/data.js";
import { getGeminiClient, sanitizeInput, handleApiError, applyCorsHeaders } from "../src/server/utils.js";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

export default async (req, res) => {
  // Handle OPTIONS for CORS
  if (req.method === "OPTIONS") {
    applyCorsHeaders(res);
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  applyCorsHeaders(res);

  try {
    const brand = sanitizeInput(req.body?.brand, 200);
    const name = sanitizeInput(req.body?.name, 200);

    if (!name) {
      return res.status(400).json({ error: "Fragrance name is required." });
    }

    // Check cache first
    const cached = analysisCache.get(brand, name);
    if (cached) {
      return res.json({ analysis: cached });
    }

    // Check PREDEFINED_FRAGRANCES (case-insensitive)
    const predefinedFragrance = PREDEFINED_FRAGRANCES.find(
      (f) =>
        f.brand.toLowerCase() === brand.toLowerCase() &&
        f.name.toLowerCase() === name.toLowerCase()
    );

    if (predefinedFragrance) {
      analysisCache.set(brand, name, predefinedFragrance);
      return res.json({ analysis: predefinedFragrance });
    }

    // For unknown fragrances, infer via Gemini
    const ai = getGeminiClient();
    const userPrompt = buildFragranceDataPrompt(brand, name);
    const schema = buildFragranceDataSchema();

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: `You are a world-class fragrance expert. Return ONLY valid JSON matching the schema. No markdown or explanations outside JSON.`,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const fragranceText = response.text.trim();
    const fragranceData = JSON.parse(fragranceText);

    // Cache the result
    analysisCache.set(brand, name, fragranceData);

    res.json({ analysis: fragranceData });
  } catch (error) {
    if (error.message?.includes("JSON.parse")) {
      return handleApiError(
        res,
        new Error("Analysis returned invalid JSON. Please try again."),
        "fragrance analysis parsing"
      );
    }
    return handleApiError(res, error, "fragrance analysis");
  }
};
