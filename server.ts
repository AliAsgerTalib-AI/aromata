import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { analysisCache } from './src/server/cache/analysisCache';
import { buildAnalysisPrompt, buildAnalysisSchema } from './src/server/gemini/analysisPrompt';
import { EnhancedFragranceAnalysis, AnalyzeResponse } from './src/server/types/analysisTypes';
import { createBlendingRouter } from './src/server/blending/router';
import { initializeDatabase } from './src/server/db/schema';
import { TrialQueries } from './src/server/db/queries';
import Database from 'better-sqlite3';

dotenv.config();

const app = express();
const PORT = 3000;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

// Security headers (XSS, clickjacking, MIME sniffing, HSTS, etc.)
app.use(helmet());

// CORS — allow same origin only (SPA served from same host)
app.use(cors({
  origin: process.env.APP_URL || `http://localhost:${PORT}`,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// 1mb is sufficient for all valid fragrance payloads
app.use(express.json({ limit: '1mb' }));

// Rate limiters for different endpoints
const standardLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
const analysisLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many analysis requests, please try again later.'
});

// Initialize database for Blending Studio
const db = new Database(':memory:'); // or use a file: 'aromata.db'
initializeDatabase(db);
const trialQueries = new TrialQueries(db);

// Input sanitization
function sanitizeInput(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\x00-\x1F\x7F]/g, '').trim().substring(0, maxLength);
}

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

function handleApiError(res: express.Response, error: any, context: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`Error in ${context}:`, error);
  } else {
    console.error(`Error in ${context}`);
  }
  return res.status(500).json({
    error: process.env.NODE_ENV !== 'production'
      ? (error?.message || `Failed to complete ${context}.`)
      : 'An error occurred. Please try again.',
    stack: process.env.NODE_ENV !== 'production' ? error?.stack : undefined
  });
}

// Helper: Extract compounds from request
function extractCompoundsFromRequest(body: any): Array<{name: string, percentage: number}> {
  if (Array.isArray(body.compounds)) {
    return body.compounds.map((c: any) => ({
      name: sanitizeInput(c.name, 100),
      percentage: Math.min(100, Math.max(0, Number(c.percentage) || 0))
    }));
  }
  return [];
}

// 1. API: Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. API: Enhanced Dynamic Molecular Analysis with Five Deep Analyses
app.post('/api/analyze', analysisLimit, async (req: express.Request, res: express.Response) => {
  try {
    const brand = sanitizeInput(req.body.brand, 200);
    const name = sanitizeInput(req.body.name, 200);

    if (!name) {
      return res.status(400).json({ error: 'Fragrance name is required.' });
    }

    // Check cache first
    const cached = analysisCache.get(brand, name);
    if (cached) {
      return res.json({ analysis: cached });
    }

    const ai = getGeminiClient();
    const compounds = extractCompoundsFromRequest(req.body);

    // Build the enhanced analysis prompt and schema
    const userPrompt = buildAnalysisPrompt(brand, name, compounds);
    const schema = buildAnalysisSchema();

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{role: "user", parts: [{text: userPrompt}]}],
      config: {
        systemInstruction: `You are a professional research chemist and GC-MS expert. Perform rigorous analytical assessment of fragrances. Return ONLY valid JSON matching the schema. No markdown or explanations outside JSON.`,
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    });

    const analysisText = response.text.trim();
    const analysis: EnhancedFragranceAnalysis = JSON.parse(analysisText);

    // Cache the result
    analysisCache.set(brand, name, analysis);

    res.json({ analysis } as AnalyzeResponse);
  } catch (error: any) {
    if (error.message?.includes('JSON.parse')) {
      return handleApiError(res, new Error('Analysis returned invalid JSON. Please try again.'), 'analysis parsing');
    }
    return handleApiError(res, error, 'fragrance analysis');
  }
});

// 2.5 API: Intelligent Molecular Layering Compatibility Advisory Feed via Gemini
app.post('/api/layering-advisor', standardLimit, async (req: express.Request, res: express.Response) => {
  try {
    const { fragA, fragB } = req.body;
    if (!fragA || !fragB || typeof fragA !== 'object' || typeof fragB !== 'object') {
      return res.status(400).json({ error: 'Two fragrance specimens are required to generate layering advisories.' });
    }
    if (typeof fragA.brand !== 'string' || typeof fragA.name !== 'string' || typeof fragB.brand !== 'string' || typeof fragB.name !== 'string') {
      return res.status(400).json({ error: 'Invalid fragrance data provided.' });
    }

    const ai = getGeminiClient();
    
    const prompt = `Analyze the layering combination between these two fragrances from an aroma-chemical and structural perspective:
Fragrance A: ${fragA.brand} - ${fragA.name} (Olfactory Family: ${fragA.olfactoryFamily})
Isolates: ${fragA.aromaChemicalMatrix?.map((i: any) => `${i.name} (${i.percentage}%)`).join(', ') || 'N/A'}

Fragrance B: ${fragB.brand} - ${fragB.name} (Olfactory Family: ${fragB.olfactoryFamily})
Isolates: ${fragB.aromaChemicalMatrix?.map((i: any) => `${i.name} (${i.percentage}%)`).join(', ') || 'N/A'}

Provide professional, scientific, concise feedback (max 180 words) focusing on:
1. Chemical Affinity: Do heavy fixing bases (like Ambroxan, Iso E Super, Musks) create a longevity amplifier?
2. Top-Note Conflict: Do volatile top ingredients crash or complement each other?
3. Application Sequence: Which should be applied first as the molecular base anchor?
Avoid marketing fluff. Keep it objective, laboratory-oriented, and structured.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    const adviceText = response.text || 'No advice could be calculated at this time.';
    return res.json({ advice: adviceText });

  } catch (error: any) {
    return handleApiError(res, error, 'layering advisor analysis');
  }
});

// 2.6 API: Comprehensive Layering Compatibility Molecular Analysis
app.post('/api/layering-compatibility', standardLimit, async (req: express.Request, res: express.Response) => {
  try {
    const { fragA, fragB } = req.body;
    if (!fragA || !fragB || typeof fragA !== 'object' || typeof fragB !== 'object') {
      return res.status(400).json({ error: 'Two fragrance specimens are required for compatibility analysis.' });
    }
    if (typeof fragA.brand !== 'string' || typeof fragA.name !== 'string' || typeof fragB.brand !== 'string' || typeof fragB.name !== 'string') {
      return res.status(400).json({ error: 'Invalid fragrance data provided.' });
    }

    const ai = getGeminiClient();
    
    const prompt = `Perform a high-precision molecular layering compatibility analysis between these two fragrances:
Fragrance A: ${fragA.brand} - ${fragA.name} (${fragA.concentration || 'EDP'})
  Olfactory Family: ${fragA.olfactoryFamily}
  Isolates Matrix: ${fragA.aromaChemicalMatrix?.map((i: any) => `${i.name} (${i.percentage}%)`).join(', ') || 'N/A'}
  Notes Pyramid: Top: ${fragA.notes?.top?.join(', ') || 'N/A'}, Heart: ${fragA.notes?.heart?.join(', ') || 'N/A'}, Base: ${fragA.notes?.base?.join(', ') || 'N/A'}

Fragrance B: ${fragB.brand} - ${fragB.name} (${fragB.concentration || 'EDP'})
  Olfactory Family: ${fragB.olfactoryFamily}
  Isolates Matrix: ${fragB.aromaChemicalMatrix?.map((i: any) => `${i.name} (${i.percentage}%)`).join(', ') || 'N/A'}
  Notes Pyramid: Top: ${fragB.notes?.top?.join(', ') || 'N/A'}, Heart: ${fragB.notes?.heart?.join(', ') || 'N/A'}, Base: ${fragB.notes?.base?.join(', ') || 'N/A'}

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
            "molecularSummary"
          ],
          properties: {
            compatibilityScore: { 
              type: Type.INTEGER, 
              description: "Numeric score from 0 (extreme clashing/noise) to 100 (absolute synergy/seamless blending)." 
            },
            compatibilityLevel: { 
              type: Type.STRING, 
              description: "e.g., 'Aroma-Chemical Synergy', 'Harmonious Synthesis', 'Static Interference', 'Olfactory Clash'" 
            },
            baseFixativeAmplification: { type: Type.STRING },
            topNoteConflict: { type: Type.STRING },
            applicationSequence: { type: Type.STRING },
            molecularSummary: { type: Type.STRING }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Empty response received from compatibility analysis.');
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(resultText.trim());
    } catch (e) {
      throw new Error(`Invalid JSON response from compatibility analysis: ${e instanceof Error ? e.message : String(e)}`);
    }

    if (parsedJson.compatibilityScore == null || parsedJson.compatibilityLevel === undefined) {
      throw new Error('Response missing required fields. Schema validation failed.');
    }

    return res.json(parsedJson);

  } catch (error: any) {
    return handleApiError(res, error, 'layering compatibility analysis');
  }
});

// 2.7 API: AI-Assisted Olfactory Moodboard & Vibe Summary Generator
app.post('/api/moodboard-generator', standardLimit, async (req: express.Request, res: express.Response) => {
  try {
    const brand = sanitizeInput(req.body.brand, 200);
    const name = sanitizeInput(req.body.name, 200);
    const olfactoryFamily = sanitizeInput(req.body.olfactoryFamily, 100);
    const accords = req.body.accords;
    if (!name) {
      return res.status(400).json({ error: 'Fragrance name is required to synthesize moodboard aesthetic.' });
    }

    const ai = getGeminiClient();

    const formattedAccords = accords?.map((a: any) => `${a.name} (${a.intensity}%)`).join(', ') || 'N/A';

    const prompt = `Synthesize an avant-garde aesthetic moodboard design sheet for the following fragrance:
Fragrance: ${brand || ''} ${name}
Olfactory Family: ${olfactoryFamily || 'Unknown'}
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
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ["aestheticTitle", "vibeAssessment", "colors", "tactileMetaphors"],
          properties: {
            aestheticTitle: { type: Type.STRING },
            vibeAssessment: { type: Type.STRING },
            colors: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            tactileMetaphors: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Empty response received from moodboard generator.');
    }

    let decoded;
    try {
      decoded = JSON.parse(resultText.trim());
    } catch (e) {
      throw new Error(`Invalid JSON response from moodboard generator: ${e instanceof Error ? e.message : String(e)}`);
    }

    if (!decoded.aestheticTitle || !decoded.colors || !decoded.tactileMetaphors) {
      throw new Error('Response missing required fields. Schema validation failed.');
    }

    return res.json(decoded);

  } catch (error: any) {
    if (process.env.NODE_ENV !== 'production') console.error('Error in moodboard generator:', error);
    const defaultAesthetic = "Minimalist Molecular Frame";
    const defaultVibe = `A clean, structural olfactory layout focusing on key raw material anchors. Balanced evaporation profiles reflect an elegant, low-clutter atmospheric sillage.`;
    const defaultColors = ["#0A0B0E", "#1E293B", "#3B82F6", "#10B981"];
    const defaultMetaphors = [
      "Brushed grey titanium sheets reflecting a matte winter sky",
      "Delicate white linen threads draped over cold slate slabs",
      "A dry, crackling amber wood ember under clinical laboratory conditions",
      "Micro-fine mist droplets suspended in clean denatured transport alcohol"
    ];

    return res.json({
      aestheticTitle: defaultAesthetic,
      vibeAssessment: defaultVibe,
      colors: defaultColors,
      tactileMetaphors: defaultMetaphors,
      note: "Standard molecular local profiling fallback applied safely."
    });
  }
});

// Register blending router
app.use('/api/blending', createBlendingRouter(trialQueries, getGeminiClient()));

// 3. Mount Dev Sever / Static Serve Configuration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aromata server running on http://localhost:${PORT}`);
  });
}

startServer();
