import { getGeminiClient, sanitizeInput, handleApiError, applyCorsHeaders } from "../src/server/utils.js";
import {
  buildMoodboardPrompt,
  buildMoodboardSchema,
} from "../src/server/gemini/moodboardPrompt.js";

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
    const { brand, name, concentration } = req.body;

    if (!brand || !name) {
      return res.status(400).json({
        error: "Fragrance brand and name are required.",
      });
    }

    const ai = getGeminiClient();
    const userPrompt = buildMoodboardPrompt(brand, name, concentration);
    const schema = buildMoodboardSchema();

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: `You are an expert in aesthetic and sensory perception. Return ONLY valid JSON matching the schema. No markdown or explanations outside JSON.`,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const resultText = response.text.trim();
    const result = JSON.parse(resultText);

    res.json(result);
  } catch (error) {
    // Fallback for moodboard (graceful degradation)
    if (error.message?.includes("JSON.parse") || error.message?.includes("GEMINI")) {
      const fallbackAesthetic = "Minimalist Molecular Frame";
      const fallbackVibe = `A clean, structural olfactory layout focusing on key raw material anchors. Balanced evaporation profiles reflect an elegant, low-clutter atmospheric sillage.`;
      const fallbackColors = ["#0A0B0E", "#1E293B", "#3B82F6", "#10B981"];
      const fallbackMetaphors = [
        "Brushed grey titanium sheets reflecting a matte winter sky",
        "Delicate white linen threads draped over cold slate slabs",
        "A dry, crackling amber wood ember under clinical laboratory conditions",
        "Micro-fine mist droplets suspended in clean denatured transport alcohol",
      ];

      return res.json({
        aestheticTitle: fallbackAesthetic,
        vibeAssessment: fallbackVibe,
        colors: fallbackColors,
        tactileMetaphors: fallbackMetaphors,
        note: "Standard molecular local profiling fallback applied safely.",
      });
    }
    return handleApiError(res, error, "moodboard generator");
  }
};
