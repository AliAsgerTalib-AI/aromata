import { getGeminiClient, sanitizeInput, handleApiError, applyCorsHeaders } from "../src/server/utils.js";
import {
  buildLayeringAdvisoryPrompt,
  buildLayeringAdvisorySchema,
} from "../src/server/gemini/layeringPrompt.js";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

export default async (req, res) => {
  if (req.method === "OPTIONS") {
    applyCorsHeaders(res);
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  applyCorsHeaders(res);

  try {
    const { fragA, fragB } = req.body;

    if (!fragA || !fragB) {
      return res.status(400).json({
        error: "Both fragA and fragB are required for layering analysis.",
      });
    }

    const ai = getGeminiClient();
    const userPrompt = buildLayeringAdvisoryPrompt(fragA, fragB);
    const schema = buildLayeringAdvisorySchema();

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: `You are a professional fragrance layering expert. Return ONLY valid JSON matching the schema. No markdown or explanations outside JSON.`,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const resultText = response.text.trim();
    const result = JSON.parse(resultText);

    res.json(result);
  } catch (error) {
    if (error.message?.includes("JSON.parse")) {
      return handleApiError(
        res,
        new Error("Layering analysis returned invalid JSON. Please try again."),
        "layering advisor parsing"
      );
    }
    return handleApiError(res, error, "layering advisor");
  }
};
