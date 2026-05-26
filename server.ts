import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { analysisCache } from "./src/server/cache/analysisCache";
import {
  buildAnalysisPrompt,
  buildAnalysisSchema,
} from "./src/server/gemini/analysisPrompt";
import {
  buildFragranceDataPrompt,
  buildFragranceDataSchema,
} from "./src/server/gemini/fragranceDataPrompt";
import {
  EnhancedFragranceAnalysis,
  AnalyzeResponse,
} from "./src/server/types/analysisTypes";
import { createBlendingRouter } from "./src/server/blending/router";
import { createEducationRouter } from "./src/server/education/router";
import { initializeDatabase } from "./src/server/db/schema";
import { TrialQueries } from "./src/server/db/queries";
import Database from "better-sqlite3";
import { PREDEFINED_FRAGRANCES } from "./src/data";

dotenv.config();

const app = express();
const PORT = 3000;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

// Security headers (XSS, clickjacking, MIME sniffing, HSTS, etc.)
// In development, relax CSP to allow Vite HMR and inline scripts
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
} else {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "ws://localhost:*"],
        connectSrc: ["'self'", "ws://localhost:*", "wss://localhost:*"],
      },
    },
  }));
}

// CORS — allow same origin only (SPA served from same host)
app.use(
  cors({
    origin: process.env.APP_URL || `http://localhost:${PORT}`,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

// 1mb is sufficient for all valid fragrance payloads
app.use(express.json({ limit: "1mb" }));

// Rate limiters for different endpoints
const standardLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
const analysisLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many analysis requests, please try again later.",
});

// Initialize database for Blending Studio
const db = new Database(":memory:"); // or use a file: 'aromata.db'
initializeDatabase(db);
const trialQueries = new TrialQueries(db);

// Input sanitization
function sanitizeInput(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\x00-\x1F\x7F]/g, "")
    .trim()
    .substring(0, maxLength);
}

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.",
      );
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

function handleApiError(res: express.Response, error: any, context: string) {
  if (process.env.NODE_ENV !== "production") {
    console.error(`Error in ${context}:`, error);
  } else {
    console.error(`Error in ${context}`);
  }
  return res.status(500).json({
    error:
      process.env.NODE_ENV !== "production"
        ? error?.message || `Failed to complete ${context}.`
        : "An error occurred. Please try again.",
    stack: process.env.NODE_ENV !== "production" ? error?.stack : undefined,
  });
}

// Helper: Extract compounds from request
function extractCompoundsFromRequest(
  body: any,
): Array<{ name: string; percentage: number }> {
  if (Array.isArray(body.compounds)) {
    return body.compounds.map((c: any) => ({
      name: sanitizeInput(c.name, 100),
      percentage: Math.min(100, Math.max(0, Number(c.percentage) || 0)),
    }));
  }
  return [];
}

// 1. API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. API: Fragrance Data with Complete Information and Analysis
app.post(
  "/api/analyze",
  analysisLimit,
  async (req: express.Request, res: express.Response) => {
    try {
      const brand = sanitizeInput(req.body.brand, 200);
      const name = sanitizeInput(req.body.name, 200);

      if (!name) {
        return res.status(400).json({ error: "Fragrance name is required." });
      }

      // Check cache first (works for both predefined and Gemini-inferred data)
      const cached = analysisCache.get(brand, name);
      if (cached) {
        return res.json({ analysis: cached });
      }

      // Check PREDEFINED_FRAGRANCES first (case-insensitive)
      const predefinedFragrance = PREDEFINED_FRAGRANCES.find(
        (f) =>
          f.brand.toLowerCase() === brand.toLowerCase() &&
          f.name.toLowerCase() === name.toLowerCase(),
      );

      if (predefinedFragrance) {
        // Use predefined data directly
        analysisCache.set(brand, name, predefinedFragrance);
        return res.json({ analysis: predefinedFragrance } as AnalyzeResponse);
      }

      // For unknown fragrances, infer complete data via Gemini
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

      res.json({ analysis: fragranceData } as AnalyzeResponse);
    } catch (error: any) {
      if (error.message?.includes("JSON.parse")) {
        return handleApiError(
          res,
          new Error("Analysis returned invalid JSON. Please try again."),
          "fragrance analysis parsing",
        );
      }
      return handleApiError(res, error, "fragrance analysis");
    }
  },
);

// 2.5 API: Intelligent Molecular Layering Compatibility Advisory Feed via Gemini
app.post(
  "/api/layering-advisor",
  standardLimit,
  async (req: express.Request, res: express.Response) => {
    try {
      const { fragA, fragB } = req.body;
      if (
        !fragA ||
        !fragB ||
        typeof fragA !== "object" ||
        typeof fragB !== "object"
      ) {
        return res
          .status(400)
          .json({
            error:
              "Two fragrance specimens are required to generate layering advisories.",
          });
      }
      if (
        typeof fragA.brand !== "string" ||
        typeof fragA.name !== "string" ||
        typeof fragB.brand !== "string" ||
        typeof fragB.name !== "string"
      ) {
        return res
          .status(400)
          .json({ error: "Invalid fragrance data provided." });
      }

      const ai = getGeminiClient();

      const prompt = `Analyze the layering combination between these two fragrances from an aroma-chemical and structural perspective:
Fragrance A: ${fragA.brand} - ${fragA.name} (Olfactory Family: ${fragA.olfactoryFamily})
Isolates: ${fragA.aromaChemicalMatrix?.map((i: any) => `${i.name} (${i.percentage}%)`).join(", ") || "N/A"}

Fragrance B: ${fragB.brand} - ${fragB.name} (Olfactory Family: ${fragB.olfactoryFamily})
Isolates: ${fragB.aromaChemicalMatrix?.map((i: any) => `${i.name} (${i.percentage}%)`).join(", ") || "N/A"}

Provide professional, scientific, concise feedback (max 180 words) focusing on:
1. Chemical Affinity: Do heavy fixing bases (like Ambroxan, Iso E Super, Musks) create a longevity amplifier?
2. Top-Note Conflict: Do volatile top ingredients crash or complement each other?
3. Application Sequence: Which should be applied first as the molecular base anchor?
Avoid marketing fluff. Keep it objective, laboratory-oriented, and structured.`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const adviceText =
        response.text || "No advice could be calculated at this time.";
      return res.json({ advice: adviceText });
    } catch (error: any) {
      return handleApiError(res, error, "layering advisor analysis");
    }
  },
);

// 2.6 API: Comprehensive Layering Compatibility Molecular Analysis
app.post(
  "/api/layering-compatibility",
  standardLimit,
  async (req: express.Request, res: express.Response) => {
    try {
      const { fragA, fragB } = req.body;
      if (
        !fragA ||
        !fragB ||
        typeof fragA !== "object" ||
        typeof fragB !== "object"
      ) {
        return res
          .status(400)
          .json({
            error:
              "Two fragrance specimens are required for compatibility analysis.",
          });
      }
      if (
        typeof fragA.brand !== "string" ||
        typeof fragA.name !== "string" ||
        typeof fragB.brand !== "string" ||
        typeof fragB.name !== "string"
      ) {
        return res
          .status(400)
          .json({ error: "Invalid fragrance data provided." });
      }

      const ai = getGeminiClient();

      const prompt = `Perform a high-precision molecular layering compatibility analysis between these two fragrances:
Fragrance A: ${fragA.brand} - ${fragA.name} (${fragA.concentration || "EDP"})
  Olfactory Family: ${fragA.olfactoryFamily}
  Isolates Matrix: ${fragA.aromaChemicalMatrix?.map((i: any) => `${i.name} (${i.percentage}%)`).join(", ") || "N/A"}
  Notes Pyramid: Top: ${fragA.notes?.top?.join(", ") || "N/A"}, Heart: ${fragA.notes?.heart?.join(", ") || "N/A"}, Base: ${fragA.notes?.base?.join(", ") || "N/A"}

Fragrance B: ${fragB.brand} - ${fragB.name} (${fragB.concentration || "EDP"})
  Olfactory Family: ${fragB.olfactoryFamily}
  Isolates Matrix: ${fragB.aromaChemicalMatrix?.map((i: any) => `${i.name} (${i.percentage}%)`).join(", ") || "N/A"}
  Notes Pyramid: Top: ${fragB.notes?.top?.join(", ") || "N/A"}, Heart: ${fragB.notes?.heart?.join(", ") || "N/A"}, Base: ${fragB.notes?.base?.join(", ") || "N/A"}

Analyze:
1. Base-Fixative Amplification: How do heavy-weight, low-volatility fixative compounds like Ambroxan, Iso E Super, Evernyl, Galaxolide, or crystalline spices interact? Will they create a synergistic longevity extension or merge into an indistinct, muddy mass?
2. Top-Note Conflict: Do volatile headnotes or light synthetics (such as Citral, Methyl Pamplemousse, or high-diffusion aldehydes) crash, create olfactory noise, or construct a balanced, multi-toned sparkling opening?
3. Scent Development Profile: What is the optimal order of spray administration? Explain exactly which fragrance to lay down first as the physical base-anchor, and which to mist over top as the volatile veil.
4. Molecular Summary: A general high-vibe scientific summary of this layering recipe.`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: [
              "compatibilityScore",
              "compatibilityLevel",
              "baseFixativeAmplification",
              "topNoteConflict",
              "applicationSequence",
              "molecularSummary",
            ],
            properties: {
              compatibilityScore: {
                type: Type.INTEGER,
                description:
                  "Numeric score from 0 (extreme clashing/noise) to 100 (absolute synergy/seamless blending).",
              },
              compatibilityLevel: {
                type: Type.STRING,
                description:
                  "e.g., 'Aroma-Chemical Synergy', 'Harmonious Synthesis', 'Static Interference', 'Olfactory Clash'",
              },
              baseFixativeAmplification: { type: Type.STRING },
              topNoteConflict: { type: Type.STRING },
              applicationSequence: { type: Type.STRING },
              molecularSummary: { type: Type.STRING },
            },
          },
        },
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("Empty response received from compatibility analysis.");
      }

      let parsedJson;
      try {
        parsedJson = JSON.parse(resultText.trim());
      } catch (e) {
        throw new Error(
          `Invalid JSON response from compatibility analysis: ${e instanceof Error ? e.message : String(e)}`,
        );
      }

      if (
        parsedJson.compatibilityScore == null ||
        parsedJson.compatibilityLevel === undefined
      ) {
        throw new Error(
          "Response missing required fields. Schema validation failed.",
        );
      }

      return res.json(parsedJson);
    } catch (error: any) {
      return handleApiError(res, error, "layering compatibility analysis");
    }
  },
);

// 2.7 API: AI-Assisted Olfactory Moodboard & Vibe Summary Generator
app.post(
  "/api/moodboard-generator",
  standardLimit,
  async (req: express.Request, res: express.Response) => {
    try {
      const brand = sanitizeInput(req.body.brand, 200);
      const name = sanitizeInput(req.body.name, 200);
      const olfactoryFamily = sanitizeInput(req.body.olfactoryFamily, 100);
      const accords = req.body.accords;
      if (!name) {
        return res
          .status(400)
          .json({
            error:
              "Fragrance name is required to synthesize moodboard aesthetic.",
          });
      }

      const ai = getGeminiClient();

      const formattedAccords =
        accords?.map((a: any) => `${a.name} (${a.intensity}%)`).join(", ") ||
        "N/A";

      const prompt = `Synthesize an avant-garde aesthetic moodboard design sheet for the following fragrance:
Fragrance: ${brand || ""} ${name}
Olfactory Family: ${olfactoryFamily || "Unknown"}
Accords Matrix: ${formattedAccords}

Provide a visually evocative, art-critic-like "vibe assessment" and tactile descriptions of physical scenes/textures representing these scents. Do NOT use marketing hyperbole. Return purely valid JSON with the following schema:
{
  "aestheticTitle": "A 2-4 word theme name (e.g. 'Raw Mineral Brutalism', 'Gilded Cedarwood Warmth')",
  "vibeAssessment": "A thorough, 2-3 sentence atmospheric vibe review capturing the tactile mood of this olfactory energy.",
  "colors": ["String font colors: 4 cohesive color hex codes representing this mood, from deep base shade to high-contrast accent"],
  "tactileMetaphors": [
    "Four highly detailed, poetically precise physical textures, sensory triggers, or environmental moments (e.g., 'Rough wet volcanic basalt under cold light', 'A warm cashmere warp over brushed industrial steel')"
  ]
}
Avoid ANY markdown wraps or container brackets outside the pure JSON payload.`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: [
              "aestheticTitle",
              "vibeAssessment",
              "colors",
              "tactileMetaphors",
            ],
            properties: {
              aestheticTitle: { type: Type.STRING },
              vibeAssessment: { type: Type.STRING },
              colors: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              tactileMetaphors: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
          },
        },
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("Empty response received from moodboard generator.");
      }

      let decoded;
      try {
        decoded = JSON.parse(resultText.trim());
      } catch (e) {
        throw new Error(
          `Invalid JSON response from moodboard generator: ${e instanceof Error ? e.message : String(e)}`,
        );
      }

      if (
        !decoded.aestheticTitle ||
        !decoded.colors ||
        !decoded.tactileMetaphors
      ) {
        throw new Error(
          "Response missing required fields. Schema validation failed.",
        );
      }

      return res.json(decoded);
    } catch (error: any) {
      if (process.env.NODE_ENV !== "production")
        console.error("Error in moodboard generator:", error);
      const defaultAesthetic = "Minimalist Molecular Frame";
      const defaultVibe = `A clean, structural olfactory layout focusing on key raw material anchors. Balanced evaporation profiles reflect an elegant, low-clutter atmospheric sillage.`;
      const defaultColors = ["#0A0B0E", "#1E293B", "#3B82F6", "#10B981"];
      const defaultMetaphors = [
        "Brushed grey titanium sheets reflecting a matte winter sky",
        "Delicate white linen threads draped over cold slate slabs",
        "A dry, crackling amber wood ember under clinical laboratory conditions",
        "Micro-fine mist droplets suspended in clean denatured transport alcohol",
      ];

      return res.json({
        aestheticTitle: defaultAesthetic,
        vibeAssessment: defaultVibe,
        colors: defaultColors,
        tactileMetaphors: defaultMetaphors,
        note: "Standard molecular local profiling fallback applied safely.",
      });
    }
  },
);

// 2.8 API: Physics Simulation for Compounding Bench
app.post(
  "/api/physics-simulation",
  standardLimit,
  async (req: express.Request, res: express.Response) => {
    try {
      const { ingredients, carrierType, dilutionRatio, blendName, leadPerfumer } =
        req.body;

      // Validate ingredients array
      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({
          error: "Ingredients array is required and must not be empty",
        });
      }

      // Validate carrier type
      if (!["ethanol", "dpg", "ipm"].includes(carrierType)) {
        return res.status(400).json({
          error: "Invalid carrier type. Must be one of: ethanol, dpg, ipm",
        });
      }

      // Validate dilution ratio
      if (
        typeof dilutionRatio !== "number" ||
        dilutionRatio < 0 ||
        dilutionRatio > 100
      ) {
        return res.status(400).json({
          error: "Dilution ratio must be a number between 0 and 100",
        });
      }

      // Format ingredients for Gemini
      const ingredientDescriptions = ingredients
        .map(
          (ing: any) =>
            `${sanitizeInput(ing.name, 100)} (${Number(ing.ppt) || 0} ppt, ${sanitizeInput(ing.category, 50)})`
        )
        .join("; ");

      const carrierMap: Record<string, string> = {
        ethanol: "Ethanol (98%)",
        dpg: "Dipropylene Glycol",
        ipm: "Isopropyl Myristate",
      };

      const prompt = `You are a professional fragrance chemist and GC-MS expert. Analyze this fragrance formula and provide scientific predictions.

Formula:
- Blend Name: ${sanitizeInput(blendName || "Custom Blend", 100)}
- Lead Perfumer: ${sanitizeInput(leadPerfumer || "Unknown", 100)}
- Ingredients (ppt): ${ingredientDescriptions}
- Carrier: ${carrierMap[carrierType]}
- Dilution: ${dilutionRatio}% fragrance oil, ${100 - dilutionRatio}% solvent

Provide your response as valid JSON with this exact structure:
{
  "evaporationCurve": [
    {"timeHours": 0, "volatilityPercent": 100},
    {"timeHours": 1, "volatilityPercent": number},
    {"timeHours": 2, "volatilityPercent": number},
    {"timeHours": 5, "volatilityPercent": number},
    {"timeHours": 10, "volatilityPercent": number}
  ],
  "longevityHours": number,
  "sillageFeetProjection": number,
  "ifraCompliance": {
    "isCompliant": boolean,
    "ingredientAssessments": [
      {
        "chemicalName": "ingredient name",
        "percentageInFormula": number,
        "status": "compliant" or "exceeds-limit",
        "message": "explanation"
      }
    ],
    "overallWarning": null or "warning message"
  }
}

Consider:
1. Volatility profiles of each ingredient (top notes evaporate faster than base notes)
2. Carrier effects on evaporation (ethanol evaporates fastest, allowing top notes to project)
3. Dilution impact (higher oil concentration = stronger longevity and sillage)
4. IFRA limits (Iso E Super max 8%, Ambroxan max 2%, etc. - use your knowledge)
5. Sillage projection in feet (typical range 5-15 feet for well-composed fragrances)

Ensure all numbers are realistic and scientifically grounded.`;

      const ai = getGeminiClient();

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          systemInstruction: `You are a professional fragrance chemist and GC-MS expert. Return ONLY valid JSON matching the requested schema. No markdown or explanations outside JSON.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: [
              "evaporationCurve",
              "longevityHours",
              "sillageFeetProjection",
              "ifraCompliance",
            ],
            properties: {
              evaporationCurve: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    timeHours: { type: Type.INTEGER },
                    volatilityPercent: { type: Type.NUMBER },
                  },
                },
              },
              longevityHours: { type: Type.NUMBER },
              sillageFeetProjection: { type: Type.NUMBER },
              ifraCompliance: {
                type: Type.OBJECT,
                properties: {
                  isCompliant: { type: Type.BOOLEAN },
                  ingredientAssessments: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        chemicalName: { type: Type.STRING },
                        percentageInFormula: { type: Type.NUMBER },
                        status: { type: Type.STRING },
                        message: { type: Type.STRING },
                      },
                    },
                  },
                  overallWarning: { type: Type.STRING },
                },
              },
            },
          },
        },
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("Empty response received from physics simulation.");
      }

      let parsedJson;
      try {
        parsedJson = JSON.parse(resultText.trim());
      } catch (e) {
        throw new Error(
          `Invalid JSON response from physics simulation: ${e instanceof Error ? e.message : String(e)}`
        );
      }

      // Validate required fields
      if (
        !parsedJson.evaporationCurve ||
        parsedJson.longevityHours === undefined ||
        parsedJson.sillageFeetProjection === undefined ||
        !parsedJson.ifraCompliance
      ) {
        throw new Error(
          "Response missing required fields. Schema validation failed."
        );
      }

      return res.json(parsedJson);
    } catch (error: any) {
      return handleApiError(res, error, "physics simulation");
    }
  },
);

// Register blending router
app.use("/api/blending", createBlendingRouter(trialQueries, getGeminiClient()));

// Register education router
app.use("/api/education", createEducationRouter(getGeminiClient()));

// 3. Mount Dev Sever / Static Serve Configuration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aromata server running on http://localhost:${PORT}`);
  });
}

startServer();
