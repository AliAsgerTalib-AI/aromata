import { getGeminiClient, sanitizeInput, handleApiError, applyCorsHeaders } from "../src/server/utils.js";
import {
  buildLayeringCompatibilityPrompt,
  buildLayeringCompatibilitySchema,
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
        error: "Both fragA and fragB are required for compatibility analysis.",
      });
    }

    const ai = getGeminiClient();
    const userPrompt = buildLayeringCompatibilityPrompt(fragA, fragB);
    const schema = buildLayeringCompatibilitySchema();

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: `You are a professional fragrance chemist analyzing molecular compatibility. Return ONLY valid JSON matching the schema. No markdown or explanations outside JSON.`,
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
        new Error("Compatibility analysis returned invalid JSON. Please try again."),
        "layering compatibility parsing"
      );
    }
    return handleApiError(res, error, "layering compatibility");
  }
};
