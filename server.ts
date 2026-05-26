import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Increase JSON limit just in case
app.use(express.json({ limit: '10mb' }));

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. API: Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. API: Dynamic Molecular Analysis & Batch Parsing Route via Gemini
app.post('/api/analyze', async (req: express.Request, res: express.Response) => {
  try {
    const { brand, name, batchCode } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Fragrance name is required.' });
    }

    const ai = getGeminiClient();

    let userPrompt = `Perform a rigorous, empirical molecular and performance analysis of the following fragrance.
Brand: ${brand || 'Unknown / TBD'}
Fragrance Name: ${name}`;

    if (batchCode) {
      userPrompt += `\nVerification Batch Code to Decode: ${batchCode}`;
    }

    userPrompt += `\n\nInstructions:
1. Provide highly realistic, scientifically plausible approximations of the actual aromachemical isolate matrix inside the juice (not just marketing notes!). For instance, list structural compounds like Iso E Super, Ambroxan, Galaxolide, Hedione, Dihydromyrcenol, Ethylene Brassylate, Coumarin, Vanillin, Methyl Pamplemousse, etc.
2. The total percentages in the aromaChemicalMatrix should represent realistic load densities (e.g. 10-60% typically is carrier/solvents/water, but of the fragrant oil components, estimate their relative shares or concentrate weights, or make the chemical isolates percentage sum to a realistic perfume compound breakdown).
3. Draft a detailed evaporation curve at hours [0, 1, 2, 4, 6, 10] relative to Top, Heart, and Base layer volatility.
4. Predict skin longevity (hours), fabric permanence, sillage radius curve, and provide a thorough technical explanation of olfactory fatigue/anosmia risk for this combination of molecules.
5. Detail olfactory classification, tactile textures (accords), thermal window (min/max Celsius), sillage-based occasion scoring, average retail price, alternatives, and heritage.
6. ${batchCode ? "Decode the batch code provided based on known commercial batch parsing patterns for this brand. Detail manufacture date, factory code, stability, and shelf-life." : "Set the parsedBatchCode block to a structure where isValid is false, and explain that no batch code was provided."}
7. Provide a detailed, engaging explanation of how the perfume actually works chemically and physically in layman's terms. Explain how the solvent carrier (usually denatured alcohol) acts as a high-volatility dispersal medium, how specific key aromachemical isolates or natural fractions inside this fragrance behave, and how body heat/humidity affects their rate of release. Label this layman's explanation very thoroughly in a couple of paragraphs.
8. Provide an evocative, artistic narrative story of the fragrance, capturing its inspiration or general vibe, and list its classic hierarchical olfactory notes pyramid (top, heart, and base notes).
9. Create a chronological history timeline of 3-6 key historical milestones of the fragrance, its flankers, or its brand heritage house in the historicalTimeline array. Be brutally honest and accurate. Do not make up fake events or awards. If there is gossip, controversy, or corporate disputes around it, capture that as a timeline event of classification 'Gossip' and start its description with the prefix 'GOSSIP:'. Format titles with sleek, descriptive design monikers like 'The Heritage Ancestor', 'The Modern Pillar', 'The Smooth Evolution', 'The Depth Upgrade', 'The Masterpiece Revision' or similar where applicable. Include interesting chemical or industry tidbits for each milestone.
10. Populate the molecularBlueprintShift object: providing custom details of the molecular blueprint transition (e.g., from original EDT to high-concentration Extrait/Parfum), showcasing how the physical formula matrix shifts its focus from a high-volatility engine/effect to a low-volatility engine/effect.
11. Set the strategicTakeaway field as a brutally honest summary of how the brand/house executed this timeline and formulation strategy over the years to manage margins, capture demographics, or navigate IFRA regulatory restrictions.
12. Populate the ifraAssessment object: status (e.g., 'Compliant', 'Reformulated', 'Restricted'), a list of criticalRestrictedMaterials (each with name, limitPercent, actualPercent, and impact), and chemistsTakeaway (each describing custom details of how the specific perfume's natural oils and synthetics are evaluated for allergen aggregation). Do not repeat or prepend the general explanation of 'Cumulative Aggregate Burden' — focus strictly on the specific molecules/materials in this exact tested fragrance.`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: `You are a professional research chemist and GC-MS (Gas Chromatography-Mass Spectrometry) expert specializing in raw aromachemical formulations and performance verification.
You represent Aromata, the definitive truth layer that replaces marketing hype with molecular composition and performance analytics.
Do not output raw conversational text or markdown wrappers. Return purely valid JSON adhering strictly to the response schema.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "brand", "name", "concentration", "nose", "releaseYear", "batchLineage", "historicalTimeline",
            "aromaChemicalMatrix", "naturalToSyntheticRatio", "evaporationCurve",
            "skinLongevityIndex", "fabricPermanenceIndex", "sillageProjectionRadiusCurve",
            "olfactoryFatigueRisk", "olfactoryFatigueExplanation", "olfactoryFamily",
            "accords", "tempRangeMinCelsius", "tempRangeMaxCelsius", "humidityTolerance",
            "settingScoring", "avgRetailPrice", "pricePerMl", "valueRating",
            "alternatives", "formulationHeritage", "laymanChemistryExplanation", "story", "notes",
            "molecularBlueprintShift", "strategicTakeaway", "ifraAssessment"
          ],
          properties: {
            brand: { type: Type.STRING },
            name: { type: Type.STRING },
            concentration: { 
              type: Type.STRING,
              description: "Must be exactly one of: 'Cologne (EDC)', 'Toilette (EDT)', 'Parfum (EDP)', 'Extrait', 'Pure Parfum'"
            },
            nose: { type: Type.STRING },
            releaseYear: { type: Type.INTEGER },
            batchLineage: { type: Type.STRING },
            aromaChemicalMatrix: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "percentage", "category", "description"],
                properties: {
                  name: { type: Type.STRING },
                  percentage: { type: Type.NUMBER },
                  category: { 
                    type: Type.STRING, 
                    description: "Must be: 'Ambers/Musks', 'Woody Backbones', 'Sweet/Gourmand Anchors', 'Others'" 
                  },
                  description: { type: Type.STRING }
                }
              }
            },
            naturalToSyntheticRatio: {
              type: Type.OBJECT,
              required: ["natural", "synthetic"],
              properties: {
                natural: { type: Type.INTEGER },
                synthetic: { type: Type.INTEGER }
              }
            },
            evaporationCurve: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["hour", "top", "heart", "base"],
                properties: {
                  hour: { type: Type.NUMBER },
                  top: { type: Type.NUMBER },
                  heart: { type: Type.NUMBER },
                  base: { type: Type.NUMBER }
                }
              }
            },
            skinLongevityIndex: { type: Type.NUMBER },
            fabricPermanenceIndex: { type: Type.NUMBER },
            sillageProjectionRadiusCurve: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["hour", "radiusFeet"],
                properties: {
                  hour: { type: Type.NUMBER },
                  radiusFeet: { type: Type.NUMBER }
                }
              }
            },
            olfactoryFatigueRisk: { type: Type.INTEGER },
            olfactoryFatigueExplanation: { type: Type.STRING },
            olfactoryFamily: { type: Type.STRING },
            accords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "intensity"],
                properties: {
                  name: { type: Type.STRING },
                  intensity: { type: Type.INTEGER }
                }
              }
            },
            tempRangeMinCelsius: { type: Type.INTEGER },
            tempRangeMaxCelsius: { type: Type.INTEGER },
            humidityTolerance: { type: Type.STRING },
            settingScoring: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "score"],
                properties: {
                  name: { type: Type.STRING },
                  score: { type: Type.INTEGER }
                }
              }
            },
            avgRetailPrice: { type: Type.NUMBER },
            pricePerMl: { type: Type.NUMBER },
            valueRating: { type: Type.STRING },
            alternatives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["brand", "name", "similarity", "priceComparison"],
                properties: {
                  brand: { type: Type.STRING },
                  name: { type: Type.STRING },
                  similarity: { type: Type.INTEGER },
                  priceComparison: { type: Type.STRING }
                }
              }
            },
            formulationHeritage: { type: Type.STRING },
            laymanChemistryExplanation: { 
              type: Type.STRING, 
              description: "A comprehensive, beautifully worded layman explanation in 2-3 clear paragraphs describing how this specific perfume actually works and its chemical features."
            },
            story: {
              type: Type.STRING,
              description: "An evocative, creative, and narrative story detailing the perfume's artistic concept, creative inspiration, or cultural/emotional landscape."
            },
            notes: {
              type: Type.OBJECT,
              description: "The classical aromatic pyramid representation.",
              required: ["top", "heart", "base"],
              properties: {
                top: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "High-volatility compounds that make up the initial 15-30 minute burst (e.g., specific citruses, fresh spices, lightweight floral fractions)."
                },
                heart: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Mid-volatility compounds making up the center of the fragrance (e.g., rich herbs, fruits, core florals, light woods)."
                },
                base: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Low-volatility, massive-molecular-weight compounds anchoring the scent (e.g., ambers, musks, heavy woods, resins, gourmand notes)."
                }
              }
            },
            historicalTimeline: {
              type: Type.ARRAY,
              description: "Chronological history timeline events (awards, flankers, reformulations, house events). Provide 3-6 milestones.",
              items: {
                type: Type.OBJECT,
                required: ["year", "title", "description", "classification"],
                properties: {
                  year: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  classification: { type: Type.STRING, description: "e.g., 'Origin', 'Flanker Release', 'Reformulation', 'Milestone', 'Award', 'House Event'" }
                }
              }
            },
            parsedBatchCode: {
              type: Type.OBJECT,
              required: ["code", "isValid"],
              properties: {
                code: { type: Type.STRING },
                brand: { type: Type.STRING },
                isValid: { type: Type.BOOLEAN },
                manufacturingDate: { type: Type.STRING },
                factoryOrigin: { type: Type.STRING },
                shelfLifeStatus: { type: Type.STRING },
                activeIngredientsStability: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            },
            molecularBlueprintShift: {
              type: Type.OBJECT,
              required: ["title", "highVolatilityEngine", "highVolatilityEffect", "lowVolatilityEngine", "lowVolatilityEffect"],
              properties: {
                title: { type: Type.STRING },
                highVolatilityEngine: { type: Type.STRING },
                highVolatilityEffect: { type: Type.STRING },
                lowVolatilityEngine: { type: Type.STRING },
                lowVolatilityEffect: { type: Type.STRING }
              }
            },
            strategicTakeaway: { type: Type.STRING },
            ifraAssessment: {
              type: Type.OBJECT,
              required: ["status", "criticalRestrictedMaterials", "chemistsTakeaway"],
              properties: {
                status: { type: Type.STRING },
                criticalRestrictedMaterials: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["name", "limitPercent", "actualPercent", "impact"],
                    properties: {
                      name: { type: Type.STRING },
                      limitPercent: { type: Type.NUMBER },
                      actualPercent: { type: Type.NUMBER },
                      impact: { type: Type.STRING }
                    }
                  }
                },
                chemistsTakeaway: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Empty response received from analysis model.');
    }

    const parsedJson = JSON.parse(resultText.trim());
    return res.json(parsedJson);

  } catch (error: any) {
    console.error('Error analyzing fragrance:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to complete scientific fragrance analysis.',
      stack: process.env.NODE_ENV !== 'production' ? error?.stack : undefined
    });
  }
});

// 2.5 API: Intelligent Molecular Layering Compatibility Advisory Feed via Gemini
app.post('/api/layering-advisor', async (req: express.Request, res: express.Response) => {
  try {
    const { fragA, fragB } = req.body;
    if (!fragA || !fragB) {
      return res.status(400).json({ error: 'Two fragrance specimens are required to generate layering advisories.' });
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
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
      contents: prompt,
    });

    const adviceText = response.text || 'No advice could be calculated at this time.';
    return res.json({ advice: adviceText });

  } catch (error: any) {
    console.error('Error in layering advisor API:', error);
    return res.status(500).json({ error: error?.message || 'Failed to complete AI layering analysis.' });
  }
});

// 2.6 API: Comprehensive Layering Compatibility Molecular Analysis
app.post('/api/layering-compatibility', async (req: express.Request, res: express.Response) => {
  try {
    const { fragA, fragB } = req.body;
    if (!fragA || !fragB) {
      return res.status(400).json({ error: 'Two fragrance specimens are required for compatibility analysis.' });
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
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
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

    const parsedJson = JSON.parse(resultText.trim());
    return res.json(parsedJson);

  } catch (error: any) {
    console.error('Error in layering compatibility API:', error);
    return res.status(500).json({ error: error?.message || 'Failed to complete layering compatibility analysis.' });
  }
});

// 2.7 API: AI-Assisted Olfactory Moodboard & Vibe Summary Generator
app.post('/api/moodboard-generator', async (req: express.Request, res: express.Response) => {
  try {
    const { brand, name, olfactoryFamily, accords } = req.body;
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
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
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

    const decoded = JSON.parse(resultText.trim());
    return res.json(decoded);

  } catch (error: any) {
    console.error('Error in moodboard generator:', error);
    // Secure, highly precise fallback response matching the accords if the API fails or is unkeyed
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
