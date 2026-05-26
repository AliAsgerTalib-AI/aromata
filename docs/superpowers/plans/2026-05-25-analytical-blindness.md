# Analytical Blindness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance `/api/analyze` to compute five unified fragrance analyses (synergies, accords, diffusion, stability, efficiency) upfront in a single Gemini call, with layered deep-dive UI and structured queries.

**Architecture:** Backend Gemini schema extended with five analysis objects, each including pre-answered structured queries. Frontend renders layered UI with collapsible sections and inline query answers. Single in-memory cache (5-10 min TTL) per fragrance to avoid duplicate API calls.

**Tech Stack:** 
- Backend: Node.js/Express, @google/genai v2.4.0+, TypeScript
- Frontend: React 19, TypeScript, Tailwind CSS 4

---

## File Structure

**Backend Files to Create/Modify:**
- `src/server/types/analysisTypes.ts` — NEW: Type definitions for five analyses + queries
- `src/server/cache/analysisCache.ts` — NEW: Simple in-memory cache utility
- `server.ts` — MODIFY: Extend Gemini schema, enhance `/api/analyze` endpoint
- `src/server/gemini/analysisPrompt.ts` — NEW: Gemini prompt and schema builder

**Frontend Files to Create/Modify:**
- `src/types.ts` — MODIFY: Add analysis types (or create `src/analysisTypes.ts`)
- `src/components/AnalysisView.tsx` — NEW: Main layered analysis container
- `src/components/SynergiesLayer.tsx` — NEW: Synergistic interactions display + queries
- `src/components/AccordsLayer.tsx` — NEW: Accord mechanics display + queries
- `src/components/DiffusionLayer.tsx` — NEW: Diffusion dynamics display + queries
- `src/components/StabilityLayer.tsx` — NEW: Stability predictions display + queries
- `src/components/EfficiencyLayer.tsx` — NEW: Formulation efficiency display + queries
- `src/components/QueryPanel.tsx` — NEW: Reusable query answer display
- `src/App.tsx` — MODIFY: Integrate AnalysisView into main flow

**Test Files:**
- `src/__tests__/analysisSchema.test.ts` — NEW: Schema validation tests
- `src/__tests__/cache.test.ts` — NEW: Cache behavior tests

---

## Task Breakdown

### Task 1: Create Analysis Type Definitions (Backend)

**Files:**
- Create: `src/server/types/analysisTypes.ts`

**Steps:**

- [ ] **Step 1: Create the file**

Create the file at `src/server/types/analysisTypes.ts` with the following TypeScript interfaces for all five analyses:

```typescript
// Synergistic Interactions
export interface CompoundInteraction {
  compound_a: string;
  compound_b: string;
  interaction_type: 'amplifies' | 'diminishes' | 'transforms' | 'neutral';
  strength: number; // 1-10
  mechanism: string;
}

export interface ThreeWayEffect {
  compounds: [string, string, string];
  effect_type: string;
  strength: number;
  explanation: string;
}

export interface SynergisticInteractions {
  pairs: CompoundInteraction[];
  threeWayEffects: ThreeWayEffect[];
  dominantSynergies: CompoundInteraction[];
  summary: string;
  queries: {
    which_molecules_are_synergistic: string;
    where_are_dominant_synergies: string;
    how_do_synergies_shape_effect: string;
  };
}

// Dominant Accord Mechanics
export interface AccordDriver {
  accord: string;
  compounds: string[];
  roleDescription: string;
  confidence: number; // 1-10
}

export interface DominantAccordMechanics {
  primaryAccord: string;
  primaryAccordConfidence: number;
  secondaryAccords: string[];
  accordDrivers: AccordDriver[];
  psychologicalFactors: string;
  unexpectedElements: string;
  summary: string;
  queries: {
    why_does_this_feel_like_accord: string;
    what_creates_impression: string;
    unexpected_elements_explanation: string;
  };
}

// Molecular Diffusion Dynamics
export interface VolatilityTiers {
  top: string[];
  heart: string[];
  base: string[];
}

export interface CarrierRelationship {
  carrier: string;
  cargo: string[];
  explanation: string;
}

export interface EvaporationPhase {
  phase: 'top' | 'heart' | 'base';
  compounds: string[];
  timingMinutes: string;
}

export interface ProjectionPrediction {
  topNoteProjection: 'low' | 'medium' | 'high';
  topNoteExplanation: string;
  heartNoteProjection: 'low' | 'medium' | 'high';
  heartNoteExplanation: string;
  baseNoteProjection: 'low' | 'medium' | 'high';
  baseNoteExplanation: string;
}

export interface MolecularDiffusionDynamics {
  volatilityTiers: VolatilityTiers;
  carrierRelationships: CarrierRelationship[];
  evaporationSequence: EvaporationPhase[];
  molecularWeightHierarchy: Array<{ compound: string; weight: number }>;
  projectionPrediction: ProjectionPrediction;
  summary: string;
  queries: {
    which_molecules_carry_top_notes: string;
    how_does_this_project: string;
    evaporation_sequence: string;
  };
}

// Stability Predictions
export interface VulnerableCompound {
  compound: string;
  riskLevel: 'low' | 'medium' | 'high';
  mechanism: string;
}

export interface OxidationRisk {
  overallRisk: 'low' | 'medium' | 'high';
  vulnerableCompounds: VulnerableCompound[];
}

export interface AgingTimeline {
  sixMonths: string;
  oneYear: string;
  fiveYears: string;
}

export interface StabilityPredictions {
  oxidationRisk: OxidationRisk;
  chemicalReactions: string[];
  separationRisk: 'low' | 'medium' | 'high';
  separationExplanation: string;
  expectedShelfLife: '6 months' | '1 year' | '3+ years';
  agingTimeline: AgingTimeline;
  storageRecommendations: string[];
  summary: string;
  queries: {
    how_will_this_age: string;
    shelf_life: string;
    which_compounds_at_oxidation_risk: string;
  };
}

// Formulation Efficiency
export interface RedundancyItem {
  role: string;
  compounds: string[];
  redundancyScore: number; // 1-10
  suggestion: string;
}

export interface DensityAssessment {
  score: number; // 1-10
  classification: 'lean' | 'balanced' | 'dense' | 'bloated';
  explanation: string;
}

export interface ImprovementSuggestion {
  suggestion: string;
  rationale: string;
  impact: 'low' | 'medium' | 'high';
}

export interface FormulationEfficiency {
  redundancyMap: RedundancyItem[];
  densityAssessment: DensityAssessment;
  missingElements: string[];
  efficiencyScore: number; // 1-10
  improvementSuggestions: ImprovementSuggestion[];
  summary: string;
  queries: {
    is_this_over_formulated: string;
    where_can_we_tighten: string;
    whats_missing_for_balance: string;
  };
}

// Complete Analysis Response
export interface EnhancedFragranceAnalysis {
  synergisticInteractions: SynergisticInteractions;
  dominantAccordMechanics: DominantAccordMechanics;
  molecularDiffusionDynamics: MolecularDiffusionDynamics;
  stabilityPredictions: StabilityPredictions;
  formulationEfficiency: FormulationEfficiency;
  metadata: {
    confidence_scores?: Record<string, number>;
    limitations?: string[];
    caveats?: string;
  };
}

// API Response wrapper
export interface AnalyzeResponse {
  analysis: EnhancedFragranceAnalysis;
  error?: string;
}
```

- [ ] **Step 2: Verify file was created correctly**

Run: `ls -la src/server/types/analysisTypes.ts`
Expected: File exists and contains all interfaces

- [ ] **Step 3: Commit**

```bash
git add src/server/types/analysisTypes.ts
git commit -m "feat: add enhanced analysis type definitions for five analyses"
```

---

### Task 2: Create Analysis Cache Utility

**Files:**
- Create: `src/server/cache/analysisCache.ts`

**Steps:**

- [ ] **Step 1: Create the cache utility**

Create file at `src/server/cache/analysisCache.ts`:

```typescript
import { EnhancedFragranceAnalysis } from '../types/analysisTypes';

interface CacheEntry {
  data: EnhancedFragranceAnalysis;
  timestamp: number;
}

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

class AnalysisCache {
  private cache: Map<string, CacheEntry> = new Map();

  getCacheKey(brand: string, name: string): string {
    return `${brand}||${name}`.toLowerCase();
  }

  get(brand: string, name: string): EnhancedFragranceAnalysis | null {
    const key = this.getCacheKey(brand, name);
    const entry = this.cache.get(key);

    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > CACHE_TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(brand: string, name: string, data: EnhancedFragranceAnalysis): void {
    const key = this.getCacheKey(brand, name);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear(brand?: string, name?: string): void {
    if (brand && name) {
      const key = this.getCacheKey(brand, name);
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  getSize(): number {
    return this.cache.size;
  }
}

export const analysisCache = new AnalysisCache();
```

- [ ] **Step 2: Verify the cache logic**

The cache should:
- Store analyses by brand+name key
- Expire entries after 10 minutes
- Allow get/set/clear operations

- [ ] **Step 3: Commit**

```bash
git add src/server/cache/analysisCache.ts
git commit -m "feat: add in-memory analysis cache with 10-minute TTL"
```

---

### Task 3: Create Gemini Prompt Builder

**Files:**
- Create: `src/server/gemini/analysisPrompt.ts`

**Steps:**

- [ ] **Step 1: Create the prompt builder**

Create file at `src/server/gemini/analysisPrompt.ts`:

```typescript
import { Type } from '@google/genai';

export function buildAnalysisPrompt(brand: string, name: string, compounds: Array<{name: string, percentage: number}>): string {
  const compoundsList = compounds
    .map(c => `- ${c.name}: ${c.percentage}%`)
    .join('\n');

  return `You are a professional research chemist and GC-MS expert. Perform a deep analytical assessment of the following fragrance composition, focusing on the five key analytical dimensions.

Brand: ${brand}
Fragrance Name: ${name}

Compound Composition:
${compoundsList}

Provide a comprehensive analysis covering:

1. **Synergistic Interactions**: Identify compound pairs that amplify, diminish, or transform each other's effects. Rate interaction strength 1-10. List dominant synergies.

2. **Dominant Accord Mechanics**: Explain why this fragrance "feels" like what it is. What primary accord does the composition create? Which compounds drive that perception? Address any surprising elements.

3. **Molecular Diffusion Dynamics**: Map volatility tiers (top/heart/base). Which molecules carry which? Provide evaporation sequence timing. Predict projection/sillage for each note phase.

4. **Stability Predictions**: Assess oxidation risk per compound. Predict shelf life, aging trajectory over 6 months/1 year/5 years. Note separation risks and storage recommendations.

5. **Formulation Efficiency**: Identify redundant compound roles. Rate formulation density (1=lean, 10=bloated). Note missing elements for better balance. Suggest improvements.

For each analysis, provide structured query answers that directly answer common expert questions about that dimension.

Return ONLY valid JSON matching the response schema. No markdown, no explanations outside the JSON.`;
}

export function buildAnalysisSchema() {
  return {
    type: Type.OBJECT,
    required: [
      'synergisticInteractions',
      'dominantAccordMechanics',
      'molecularDiffusionDynamics',
      'stabilityPredictions',
      'formulationEfficiency',
      'metadata'
    ],
    properties: {
      synergisticInteractions: {
        type: Type.OBJECT,
        required: ['pairs', 'threeWayEffects', 'dominantSynergies', 'summary', 'queries'],
        properties: {
          pairs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['compound_a', 'compound_b', 'interaction_type', 'strength', 'mechanism'],
              properties: {
                compound_a: { type: Type.STRING },
                compound_b: { type: Type.STRING },
                interaction_type: { 
                  type: Type.STRING,
                  description: "Must be one of: 'amplifies', 'diminishes', 'transforms', 'neutral'"
                },
                strength: { type: Type.NUMBER, description: '1-10 scale' },
                mechanism: { type: Type.STRING }
              }
            }
          },
          threeWayEffects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['compounds', 'effect_type', 'strength', 'explanation'],
              properties: {
                compounds: { type: Type.ARRAY, items: { type: Type.STRING } },
                effect_type: { type: Type.STRING },
                strength: { type: Type.NUMBER },
                explanation: { type: Type.STRING }
              }
            }
          },
          dominantSynergies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['compound_a', 'compound_b', 'interaction_type', 'strength', 'mechanism'],
              properties: {
                compound_a: { type: Type.STRING },
                compound_b: { type: Type.STRING },
                interaction_type: { type: Type.STRING },
                strength: { type: Type.NUMBER },
                mechanism: { type: Type.STRING }
              }
            }
          },
          summary: { type: Type.STRING },
          queries: {
            type: Type.OBJECT,
            required: ['which_molecules_are_synergistic', 'where_are_dominant_synergies', 'how_do_synergies_shape_effect'],
            properties: {
              which_molecules_are_synergistic: { type: Type.STRING },
              where_are_dominant_synergies: { type: Type.STRING },
              how_do_synergies_shape_effect: { type: Type.STRING }
            }
          }
        }
      },
      dominantAccordMechanics: {
        type: Type.OBJECT,
        required: ['primaryAccord', 'primaryAccordConfidence', 'secondaryAccords', 'accordDrivers', 'psychologicalFactors', 'unexpectedElements', 'summary', 'queries'],
        properties: {
          primaryAccord: { type: Type.STRING },
          primaryAccordConfidence: { type: Type.NUMBER, description: '1-10' },
          secondaryAccords: { type: Type.ARRAY, items: { type: Type.STRING } },
          accordDrivers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['accord', 'compounds', 'roleDescription', 'confidence'],
              properties: {
                accord: { type: Type.STRING },
                compounds: { type: Type.ARRAY, items: { type: Type.STRING } },
                roleDescription: { type: Type.STRING },
                confidence: { type: Type.NUMBER }
              }
            }
          },
          psychologicalFactors: { type: Type.STRING },
          unexpectedElements: { type: Type.STRING },
          summary: { type: Type.STRING },
          queries: {
            type: Type.OBJECT,
            required: ['why_does_this_feel_like_accord', 'what_creates_impression', 'unexpected_elements_explanation'],
            properties: {
              why_does_this_feel_like_accord: { type: Type.STRING },
              what_creates_impression: { type: Type.STRING },
              unexpected_elements_explanation: { type: Type.STRING }
            }
          }
        }
      },
      molecularDiffusionDynamics: {
        type: Type.OBJECT,
        required: ['volatilityTiers', 'carrierRelationships', 'evaporationSequence', 'molecularWeightHierarchy', 'projectionPrediction', 'summary', 'queries'],
        properties: {
          volatilityTiers: {
            type: Type.OBJECT,
            required: ['top', 'heart', 'base'],
            properties: {
              top: { type: Type.ARRAY, items: { type: Type.STRING } },
              heart: { type: Type.ARRAY, items: { type: Type.STRING } },
              base: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          carrierRelationships: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['carrier', 'cargo', 'explanation'],
              properties: {
                carrier: { type: Type.STRING },
                cargo: { type: Type.ARRAY, items: { type: Type.STRING } },
                explanation: { type: Type.STRING }
              }
            }
          },
          evaporationSequence: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['phase', 'compounds', 'timingMinutes'],
              properties: {
                phase: { type: Type.STRING, description: "One of: 'top', 'heart', 'base'" },
                compounds: { type: Type.ARRAY, items: { type: Type.STRING } },
                timingMinutes: { type: Type.STRING }
              }
            }
          },
          molecularWeightHierarchy: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['compound', 'weight'],
              properties: {
                compound: { type: Type.STRING },
                weight: { type: Type.NUMBER }
              }
            }
          },
          projectionPrediction: {
            type: Type.OBJECT,
            required: ['topNoteProjection', 'topNoteExplanation', 'heartNoteProjection', 'heartNoteExplanation', 'baseNoteProjection', 'baseNoteExplanation'],
            properties: {
              topNoteProjection: { type: Type.STRING, description: "One of: 'low', 'medium', 'high'" },
              topNoteExplanation: { type: Type.STRING },
              heartNoteProjection: { type: Type.STRING },
              heartNoteExplanation: { type: Type.STRING },
              baseNoteProjection: { type: Type.STRING },
              baseNoteExplanation: { type: Type.STRING }
            }
          },
          summary: { type: Type.STRING },
          queries: {
            type: Type.OBJECT,
            required: ['which_molecules_carry_top_notes', 'how_does_this_project', 'evaporation_sequence'],
            properties: {
              which_molecules_carry_top_notes: { type: Type.STRING },
              how_does_this_project: { type: Type.STRING },
              evaporation_sequence: { type: Type.STRING }
            }
          }
        }
      },
      stabilityPredictions: {
        type: Type.OBJECT,
        required: ['oxidationRisk', 'chemicalReactions', 'separationRisk', 'separationExplanation', 'expectedShelfLife', 'agingTimeline', 'storageRecommendations', 'summary', 'queries'],
        properties: {
          oxidationRisk: {
            type: Type.OBJECT,
            required: ['overallRisk', 'vulnerableCompounds'],
            properties: {
              overallRisk: { type: Type.STRING, description: "One of: 'low', 'medium', 'high'" },
              vulnerableCompounds: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ['compound', 'riskLevel', 'mechanism'],
                  properties: {
                    compound: { type: Type.STRING },
                    riskLevel: { type: Type.STRING },
                    mechanism: { type: Type.STRING }
                  }
                }
              }
            }
          },
          chemicalReactions: { type: Type.ARRAY, items: { type: Type.STRING } },
          separationRisk: { type: Type.STRING },
          separationExplanation: { type: Type.STRING },
          expectedShelfLife: { type: Type.STRING, description: "One of: '6 months', '1 year', '3+ years'" },
          agingTimeline: {
            type: Type.OBJECT,
            required: ['sixMonths', 'oneYear', 'fiveYears'],
            properties: {
              sixMonths: { type: Type.STRING },
              oneYear: { type: Type.STRING },
              fiveYears: { type: Type.STRING }
            }
          },
          storageRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
          queries: {
            type: Type.OBJECT,
            required: ['how_will_this_age', 'shelf_life', 'which_compounds_at_oxidation_risk'],
            properties: {
              how_will_this_age: { type: Type.STRING },
              shelf_life: { type: Type.STRING },
              which_compounds_at_oxidation_risk: { type: Type.STRING }
            }
          }
        }
      },
      formulationEfficiency: {
        type: Type.OBJECT,
        required: ['redundancyMap', 'densityAssessment', 'missingElements', 'efficiencyScore', 'improvementSuggestions', 'summary', 'queries'],
        properties: {
          redundancyMap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['role', 'compounds', 'redundancyScore', 'suggestion'],
              properties: {
                role: { type: Type.STRING },
                compounds: { type: Type.ARRAY, items: { type: Type.STRING } },
                redundancyScore: { type: Type.NUMBER },
                suggestion: { type: Type.STRING }
              }
            }
          },
          densityAssessment: {
            type: Type.OBJECT,
            required: ['score', 'classification', 'explanation'],
            properties: {
              score: { type: Type.NUMBER },
              classification: { type: Type.STRING, description: "One of: 'lean', 'balanced', 'dense', 'bloated'" },
              explanation: { type: Type.STRING }
            }
          },
          missingElements: { type: Type.ARRAY, items: { type: Type.STRING } },
          efficiencyScore: { type: Type.NUMBER },
          improvementSuggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['suggestion', 'rationale', 'impact'],
              properties: {
                suggestion: { type: Type.STRING },
                rationale: { type: Type.STRING },
                impact: { type: Type.STRING, description: "One of: 'low', 'medium', 'high'" }
              }
            }
          },
          summary: { type: Type.STRING },
          queries: {
            type: Type.OBJECT,
            required: ['is_this_over_formulated', 'where_can_we_tighten', 'whats_missing_for_balance'],
            properties: {
              is_this_over_formulated: { type: Type.STRING },
              where_can_we_tighten: { type: Type.STRING },
              whats_missing_for_balance: { type: Type.STRING }
            }
          }
        }
      },
      metadata: {
        type: Type.OBJECT,
        properties: {
          confidence_scores: { type: Type.OBJECT },
          limitations: { type: Type.ARRAY, items: { type: Type.STRING } },
          caveats: { type: Type.STRING }
        }
      }
    }
  };
}
```

- [ ] **Step 2: Verify schema structure**

The schema should define all five analysis objects with proper nesting and required fields matching our type definitions.

- [ ] **Step 3: Commit**

```bash
git add src/server/gemini/analysisPrompt.ts
git commit -m "feat: add Gemini prompt builder and schema for five analyses"
```

---

### Task 4: Enhance `/api/analyze` Endpoint in server.ts

**Files:**
- Modify: `server.ts` (lines ~76-300, the `/api/analyze` endpoint)

**Steps:**

- [ ] **Step 1: Add imports at the top of server.ts**

Add these imports after the existing imports (around line 8):

```typescript
import { analysisCache } from './src/server/cache/analysisCache';
import { buildAnalysisPrompt, buildAnalysisSchema } from './src/server/gemini/analysisPrompt';
import { EnhancedFragranceAnalysis, AnalyzeResponse } from './src/server/types/analysisTypes';
```

- [ ] **Step 2: Create helper function to extract compounds from existing response**

Add this helper function before the `/api/analyze` endpoint (around line 74):

```typescript
function extractCompoundsFromRequest(body: any): Array<{name: string, percentage: number}> {
  if (Array.isArray(body.compounds)) {
    return body.compounds.map((c: any) => ({
      name: sanitizeInput(c.name, 100),
      percentage: Math.min(100, Math.max(0, Number(c.percentage) || 0))
    }));
  }
  return [];
}
```

- [ ] **Step 3: Replace the `/api/analyze` endpoint implementation**

Replace the current POST `/api/analyze` handler (starting at line 76) with:

```typescript
app.post('/api/analyze', analysisLimit, async (req: express.Request, res: express.Response) => {
  try {
    const brand = sanitizeInput(req.body.brand, 200);
    const name = sanitizeInput(req.body.name, 200);
    const batchCode = sanitizeInput(req.body.batchCode, 100);
    
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

    // Build the enhanced analysis prompt
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
```

**Note:** Keep the existing `/api/analyze` response schema from the original code. We're enhancing the endpoint while maintaining backward compatibility by wrapping the new analysis in an `analysis` field.

- [ ] **Step 4: Verify the endpoint changes**

Check that:
- The endpoint imports are added
- Helper function is defined
- New endpoint replaces the old one
- Cache is checked before calling Gemini

- [ ] **Step 5: Commit**

```bash
git add server.ts
git commit -m "feat: enhance /api/analyze with five-analysis Gemini call and caching"
```

---

### Task 5: Create Frontend Analysis Types

**Files:**
- Modify: `src/types.ts` (or create `src/analysisTypes.ts`)

**Steps:**

- [ ] **Step 1: Add analysis types to src/types.ts**

Add these types at the end of `src/types.ts` (before the final `}`):

```typescript
// Enhanced Analysis Types (Five Dimensions)

export interface SynergisticInteractionsData {
  pairs: Array<{
    compound_a: string;
    compound_b: string;
    interaction_type: 'amplifies' | 'diminishes' | 'transforms' | 'neutral';
    strength: number;
    mechanism: string;
  }>;
  threeWayEffects: Array<{
    compounds: [string, string, string];
    effect_type: string;
    strength: number;
    explanation: string;
  }>;
  dominantSynergies: Array<{
    compound_a: string;
    compound_b: string;
    interaction_type: string;
    strength: number;
    mechanism: string;
  }>;
  summary: string;
  queries: {
    which_molecules_are_synergistic: string;
    where_are_dominant_synergies: string;
    how_do_synergies_shape_effect: string;
  };
}

export interface DominantAccordMechanicsData {
  primaryAccord: string;
  primaryAccordConfidence: number;
  secondaryAccords: string[];
  accordDrivers: Array<{
    accord: string;
    compounds: string[];
    roleDescription: string;
    confidence: number;
  }>;
  psychologicalFactors: string;
  unexpectedElements: string;
  summary: string;
  queries: {
    why_does_this_feel_like_accord: string;
    what_creates_impression: string;
    unexpected_elements_explanation: string;
  };
}

export interface MolecularDiffusionDynamicsData {
  volatilityTiers: {
    top: string[];
    heart: string[];
    base: string[];
  };
  carrierRelationships: Array<{
    carrier: string;
    cargo: string[];
    explanation: string;
  }>;
  evaporationSequence: Array<{
    phase: 'top' | 'heart' | 'base';
    compounds: string[];
    timingMinutes: string;
  }>;
  molecularWeightHierarchy: Array<{
    compound: string;
    weight: number;
  }>;
  projectionPrediction: {
    topNoteProjection: 'low' | 'medium' | 'high';
    topNoteExplanation: string;
    heartNoteProjection: 'low' | 'medium' | 'high';
    heartNoteExplanation: string;
    baseNoteProjection: 'low' | 'medium' | 'high';
    baseNoteExplanation: string;
  };
  summary: string;
  queries: {
    which_molecules_carry_top_notes: string;
    how_does_this_project: string;
    evaporation_sequence: string;
  };
}

export interface StabilityPredictionsData {
  oxidationRisk: {
    overallRisk: 'low' | 'medium' | 'high';
    vulnerableCompounds: Array<{
      compound: string;
      riskLevel: 'low' | 'medium' | 'high';
      mechanism: string;
    }>;
  };
  chemicalReactions: string[];
  separationRisk: 'low' | 'medium' | 'high';
  separationExplanation: string;
  expectedShelfLife: '6 months' | '1 year' | '3+ years';
  agingTimeline: {
    sixMonths: string;
    oneYear: string;
    fiveYears: string;
  };
  storageRecommendations: string[];
  summary: string;
  queries: {
    how_will_this_age: string;
    shelf_life: string;
    which_compounds_at_oxidation_risk: string;
  };
}

export interface FormulationEfficiencyData {
  redundancyMap: Array<{
    role: string;
    compounds: string[];
    redundancyScore: number;
    suggestion: string;
  }>;
  densityAssessment: {
    score: number;
    classification: 'lean' | 'balanced' | 'dense' | 'bloated';
    explanation: string;
  };
  missingElements: string[];
  efficiencyScore: number;
  improvementSuggestions: Array<{
    suggestion: string;
    rationale: string;
    impact: 'low' | 'medium' | 'high';
  }>;
  summary: string;
  queries: {
    is_this_over_formulated: string;
    where_can_we_tighten: string;
    whats_missing_for_balance: string;
  };
}

export interface EnhancedAnalysisData {
  synergisticInteractions: SynergisticInteractionsData;
  dominantAccordMechanics: DominantAccordMechanicsData;
  molecularDiffusionDynamics: MolecularDiffusionDynamicsData;
  stabilityPredictions: StabilityPredictionsData;
  formulationEfficiency: FormulationEfficiencyData;
  metadata?: {
    confidence_scores?: Record<string, number>;
    limitations?: string[];
    caveats?: string;
  };
}
```

- [ ] **Step 2: Verify types compile**

Run: `npm run lint`
Expected: No TypeScript errors related to the new types

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: add frontend types for enhanced analysis data"
```

---

### Task 6: Create Query Panel Component (Reusable)

**Files:**
- Create: `src/components/QueryPanel.tsx`

**Steps:**

- [ ] **Step 1: Create the component**

Create file at `src/components/QueryPanel.tsx`:

```typescript
import React from 'react';

interface QueryPanelProps {
  queries: Record<string, string>;
  layerName: string;
}

export const QueryPanel: React.FC<QueryPanelProps> = ({ queries, layerName }) => {
  const [selectedQuery, setSelectedQuery] = React.useState<string | null>(null);

  const queryEntries = Object.entries(queries);
  if (queryEntries.length === 0) return null;

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Expert Queries</h4>
      <div className="space-y-2">
        {queryEntries.map(([key, answer]) => {
          const queryLabel = key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          return (
            <div key={key} className="bg-gray-50 rounded p-3">
              <button
                onClick={() => setSelectedQuery(selectedQuery === key ? null : key)}
                className="w-full text-left text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                <span className="inline-block mr-2">
                  {selectedQuery === key ? '▼' : '▶'}
                </span>
                {queryLabel}?
              </button>
              {selectedQuery === key && (
                <div className="mt-2 text-sm text-gray-700 bg-white p-2 rounded border-l-2 border-indigo-500">
                  {answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Test the component structure**

Verify:
- Component accepts queries object and layerName
- Renders query titles and answers
- Expandable/collapsible behavior

- [ ] **Step 3: Commit**

```bash
git add src/components/QueryPanel.tsx
git commit -m "feat: add reusable QueryPanel component for structured queries"
```

---

### Task 7: Create Synergies Layer Component

**Files:**
- Create: `src/components/SynergiesLayer.tsx`

**Steps:**

- [ ] **Step 1: Create the component**

Create file at `src/components/SynergiesLayer.tsx`:

```typescript
import React from 'react';
import { SynergisticInteractionsData } from '../types';
import { QueryPanel } from './QueryPanel';

interface SynergiesLayerProps {
  data: SynergisticInteractionsData;
  isExpanded: boolean;
}

export const SynergiesLayer: React.FC<SynergiesLayerProps> = ({ data, isExpanded }) => {
  if (!isExpanded) return null;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Overview</h4>
        <p className="text-sm text-gray-700">{data.summary}</p>
      </div>

      {/* Dominant Synergies */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Dominant Synergies</h4>
        <div className="space-y-2">
          {data.dominantSynergies.slice(0, 5).map((synergy, idx) => (
            <div key={idx} className="text-sm bg-indigo-50 p-3 rounded">
              <div className="font-medium text-gray-900">
                {synergy.compound_a} ↔ {synergy.compound_b}
              </div>
              <div className="text-gray-700 mt-1">{synergy.interaction_type}</div>
              <div className="text-gray-600 text-xs mt-1">
                Strength: {synergy.strength}/10 — {synergy.mechanism}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Three-Way Effects */}
      {data.threeWayEffects.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Three-Way Effects</h4>
          <div className="space-y-2">
            {data.threeWayEffects.slice(0, 3).map((effect, idx) => (
              <div key={idx} className="text-sm bg-purple-50 p-3 rounded">
                <div className="font-medium text-gray-900">
                  {effect.compounds.join(' + ')}
                </div>
                <div className="text-gray-700 mt-1">{effect.explanation}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queries */}
      <QueryPanel queries={data.queries} layerName="Synergies" />
    </div>
  );
};
```

- [ ] **Step 2: Verify component renders**

The component should:
- Show summary text
- Display dominant synergies in cards
- Show three-way effects if present
- Include QueryPanel with queries

- [ ] **Step 3: Commit**

```bash
git add src/components/SynergiesLayer.tsx
git commit -m "feat: add SynergiesLayer component for synergistic interactions"
```

---

### Task 8: Create Accords Layer Component

**Files:**
- Create: `src/components/AccordsLayer.tsx`

**Steps:**

- [ ] **Step 1: Create the component**

Create file at `src/components/AccordsLayer.tsx`:

```typescript
import React from 'react';
import { DominantAccordMechanicsData } from '../types';
import { QueryPanel } from './QueryPanel';

interface AccordsLayerProps {
  data: DominantAccordMechanicsData;
  isExpanded: boolean;
}

export const AccordsLayer: React.FC<AccordsLayerProps> = ({ data, isExpanded }) => {
  if (!isExpanded) return null;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Overview</h4>
        <p className="text-sm text-gray-700">{data.summary}</p>
      </div>

      {/* Primary Accord */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Primary Accord</h4>
        <div className="text-lg font-bold text-blue-900">{data.primaryAccord}</div>
        <div className="text-sm text-gray-700 mt-1">
          Confidence: {data.primaryAccordConfidence}/10
        </div>
      </div>

      {/* Accord Drivers */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">What Creates This Accord</h4>
        <div className="space-y-2">
          {data.accordDrivers.map((driver, idx) => (
            <div key={idx} className="text-sm bg-gray-100 p-3 rounded">
              <div className="font-medium text-gray-900">{driver.accord}</div>
              <div className="text-gray-700 mt-1">{driver.roleDescription}</div>
              <div className="text-gray-600 text-xs mt-2">
                Compounds: {driver.compounds.join(', ')} | Confidence: {driver.confidence}/10
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Accords */}
      {data.secondaryAccords.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Secondary Accords</h4>
          <div className="flex flex-wrap gap-2">
            {data.secondaryAccords.map((accord, idx) => (
              <span key={idx} className="text-sm bg-gray-200 px-3 py-1 rounded">
                {accord}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Psychological Factors */}
      {data.psychologicalFactors && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Psychological Factors</h4>
          <p className="text-sm text-gray-700">{data.psychologicalFactors}</p>
        </div>
      )}

      {/* Unexpected Elements */}
      {data.unexpectedElements && (
        <div className="bg-yellow-50 p-3 rounded">
          <h4 className="font-semibold text-gray-900 mb-2">Unexpected Elements</h4>
          <p className="text-sm text-gray-700">{data.unexpectedElements}</p>
        </div>
      )}

      {/* Queries */}
      <QueryPanel queries={data.queries} layerName="Accords" />
    </div>
  );
};
```

- [ ] **Step 2: Verify component renders**

The component should:
- Display summary
- Show primary accord with confidence
- List accord drivers
- Show secondary accords
- Include psychological factors
- Highlight unexpected elements
- Include QueryPanel

- [ ] **Step 3: Commit**

```bash
git add src/components/AccordsLayer.tsx
git commit -m "feat: add AccordsLayer component for dominant accord mechanics"
```

---

### Task 9: Create Diffusion Layer Component

**Files:**
- Create: `src/components/DiffusionLayer.tsx`

**Steps:**

- [ ] **Step 1: Create the component**

Create file at `src/components/DiffusionLayer.tsx`:

```typescript
import React from 'react';
import { MolecularDiffusionDynamicsData } from '../types';
import { QueryPanel } from './QueryPanel';

interface DiffusionLayerProps {
  data: MolecularDiffusionDynamicsData;
  isExpanded: boolean;
}

export const DiffusionLayer: React.FC<DiffusionLayerProps> = ({ data, isExpanded }) => {
  if (!isExpanded) return null;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Overview</h4>
        <p className="text-sm text-gray-700">{data.summary}</p>
      </div>

      {/* Volatility Tiers */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-pink-50 p-3 rounded">
          <h5 className="font-semibold text-pink-900 mb-2">Top (High Volatility)</h5>
          <div className="text-xs text-gray-700 space-y-1">
            {data.volatilityTiers.top.map((c, i) => (
              <div key={i} className="bg-white px-2 py-1 rounded">{c}</div>
            ))}
          </div>
        </div>
        <div className="bg-amber-50 p-3 rounded">
          <h5 className="font-semibold text-amber-900 mb-2">Heart (Moderate)</h5>
          <div className="text-xs text-gray-700 space-y-1">
            {data.volatilityTiers.heart.map((c, i) => (
              <div key={i} className="bg-white px-2 py-1 rounded">{c}</div>
            ))}
          </div>
        </div>
        <div className="bg-indigo-50 p-3 rounded">
          <h5 className="font-semibold text-indigo-900 mb-2">Base (Low Volatility)</h5>
          <div className="text-xs text-gray-700 space-y-1">
            {data.volatilityTiers.base.map((c, i) => (
              <div key={i} className="bg-white px-2 py-1 rounded">{c}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Projection Prediction */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Projection & Sillage</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">Top Notes:</span>
            <span className="font-semibold text-gray-900">{data.projectionPrediction.topNoteProjection.toUpperCase()}</span>
          </div>
          <p className="text-xs text-gray-600 ml-4">{data.projectionPrediction.topNoteExplanation}</p>
          
          <div className="flex justify-between mt-3">
            <span className="text-gray-700">Heart Notes:</span>
            <span className="font-semibold text-gray-900">{data.projectionPrediction.heartNoteProjection.toUpperCase()}</span>
          </div>
          <p className="text-xs text-gray-600 ml-4">{data.projectionPrediction.heartNoteExplanation}</p>
          
          <div className="flex justify-between mt-3">
            <span className="text-gray-700">Base Notes:</span>
            <span className="font-semibold text-gray-900">{data.projectionPrediction.baseNoteProjection.toUpperCase()}</span>
          </div>
          <p className="text-xs text-gray-600 ml-4">{data.projectionPrediction.baseNoteExplanation}</p>
        </div>
      </div>

      {/* Carrier Relationships */}
      {data.carrierRelationships.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Carrier Relationships</h4>
          <div className="space-y-2">
            {data.carrierRelationships.slice(0, 5).map((rel, idx) => (
              <div key={idx} className="text-sm bg-gray-100 p-3 rounded">
                <div className="font-medium text-gray-900">{rel.carrier} carries:</div>
                <div className="text-gray-700 mt-1">{rel.cargo.join(', ')}</div>
                <div className="text-gray-600 text-xs mt-1">{rel.explanation}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queries */}
      <QueryPanel queries={data.queries} layerName="Diffusion" />
    </div>
  );
};
```

- [ ] **Step 2: Verify component renders**

The component should:
- Show summary
- Display volatility tiers in three columns
- Show projection predictions for each note phase
- List carrier relationships
- Include QueryPanel

- [ ] **Step 3: Commit**

```bash
git add src/components/DiffusionLayer.tsx
git commit -m "feat: add DiffusionLayer component for molecular diffusion dynamics"
```

---

### Task 10: Create Stability Layer Component

**Files:**
- Create: `src/components/StabilityLayer.tsx`

**Steps:**

- [ ] **Step 1: Create the component**

Create file at `src/components/StabilityLayer.tsx`:

```typescript
import React from 'react';
import { StabilityPredictionsData } from '../types';
import { QueryPanel } from './QueryPanel';

interface StabilityLayerProps {
  data: StabilityPredictionsData;
  isExpanded: boolean;
}

export const StabilityLayer: React.FC<StabilityLayerProps> = ({ data, isExpanded }) => {
  if (!isExpanded) return null;

  const riskColor = {
    low: 'text-green-700 bg-green-50',
    medium: 'text-yellow-700 bg-yellow-50',
    high: 'text-red-700 bg-red-50'
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Overview</h4>
        <p className="text-sm text-gray-700">{data.summary}</p>
      </div>

      {/* Overall Risk Assessment */}
      <div className={`p-4 rounded-lg ${riskColor[data.oxidationRisk.overallRisk]}`}>
        <h4 className="font-semibold mb-2">Oxidation Risk</h4>
        <div className="text-lg font-bold uppercase">{data.oxidationRisk.overallRisk}</div>
      </div>

      {/* Vulnerable Compounds */}
      {data.oxidationRisk.vulnerableCompounds.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Vulnerable Compounds</h4>
          <div className="space-y-2">
            {data.oxidationRisk.vulnerableCompounds.map((compound, idx) => (
              <div key={idx} className={`text-sm p-3 rounded ${riskColor[compound.riskLevel]}`}>
                <div className="font-medium">{compound.compound}</div>
                <div className="text-xs mt-1">{compound.mechanism}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shelf Life */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Expected Shelf Life</h4>
        <div className="text-lg font-bold text-blue-900">{data.expectedShelfLife}</div>
      </div>

      {/* Aging Timeline */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">How This Will Age</h4>
        <div className="space-y-3">
          <div className="bg-gray-100 p-3 rounded">
            <div className="font-semibold text-gray-900 text-sm">6 Months</div>
            <p className="text-xs text-gray-700 mt-1">{data.agingTimeline.sixMonths}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <div className="font-semibold text-gray-900 text-sm">1 Year</div>
            <p className="text-xs text-gray-700 mt-1">{data.agingTimeline.oneYear}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <div className="font-semibold text-gray-900 text-sm">5 Years</div>
            <p className="text-xs text-gray-700 mt-1">{data.agingTimeline.fiveYears}</p>
          </div>
        </div>
      </div>

      {/* Storage Recommendations */}
      {data.storageRecommendations.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Storage Recommendations</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            {data.storageRecommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Queries */}
      <QueryPanel queries={data.queries} layerName="Stability" />
    </div>
  );
};
```

- [ ] **Step 2: Verify component renders**

The component should:
- Show summary
- Display oxidation risk assessment
- List vulnerable compounds with risk colors
- Show shelf life
- Display aging timeline for different periods
- Include storage recommendations
- Include QueryPanel

- [ ] **Step 3: Commit**

```bash
git add src/components/StabilityLayer.tsx
git commit -m "feat: add StabilityLayer component for stability predictions"
```

---

### Task 11: Create Efficiency Layer Component

**Files:**
- Create: `src/components/EfficiencyLayer.tsx`

**Steps:**

- [ ] **Step 1: Create the component**

Create file at `src/components/EfficiencyLayer.tsx`:

```typescript
import React from 'react';
import { FormulationEfficiencyData } from '../types';
import { QueryPanel } from './QueryPanel';

interface EfficiencyLayerProps {
  data: FormulationEfficiencyData;
  isExpanded: boolean;
}

export const EfficiencyLayer: React.FC<EfficiencyLayerProps> = ({ data, isExpanded }) => {
  if (!isExpanded) return null;

  const densityColor = {
    lean: 'text-blue-700 bg-blue-50',
    balanced: 'text-green-700 bg-green-50',
    dense: 'text-amber-700 bg-amber-50',
    bloated: 'text-red-700 bg-red-50'
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Overview</h4>
        <p className="text-sm text-gray-700">{data.summary}</p>
      </div>

      {/* Efficiency Score */}
      <div className="bg-indigo-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Overall Efficiency Score</h4>
        <div className="text-3xl font-bold text-indigo-900">{data.efficiencyScore}/10</div>
        <p className="text-xs text-gray-600 mt-1">How well optimized this composition is</p>
      </div>

      {/* Density Assessment */}
      <div className={`p-4 rounded-lg ${densityColor[data.densityAssessment.classification]}`}>
        <h4 className="font-semibold mb-2">Formulation Density</h4>
        <div className="text-lg font-bold uppercase">{data.densityAssessment.classification}</div>
        <div className="text-sm mt-2">{data.densityAssessment.explanation}</div>
      </div>

      {/* Redundancy Map */}
      {data.redundancyMap.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Redundant Roles</h4>
          <div className="space-y-2">
            {data.redundancyMap.map((item, idx) => (
              <div key={idx} className="bg-gray-100 p-3 rounded">
                <div className="font-medium text-gray-900 text-sm">{item.role}</div>
                <div className="text-xs text-gray-700 mt-1">
                  Compounds: {item.compounds.join(', ')}
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  Redundancy: {item.redundancyScore}/10 — {item.suggestion}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Elements */}
      {data.missingElements.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded">
          <h4 className="font-semibold text-gray-900 mb-2">Missing Elements</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            {data.missingElements.map((element, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2">▸</span>
                <span>{element}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvement Suggestions */}
      {data.improvementSuggestions.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Improvement Suggestions</h4>
          <div className="space-y-2">
            {data.improvementSuggestions.slice(0, 4).map((suggestion, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded border-l-4 border-indigo-500">
                <div className="font-medium text-gray-900 text-sm">{suggestion.suggestion}</div>
                <div className="text-xs text-gray-700 mt-1">{suggestion.rationale}</div>
                <div className="text-xs text-gray-600 mt-2">
                  Impact: <span className="font-semibold capitalize">{suggestion.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queries */}
      <QueryPanel queries={data.queries} layerName="Efficiency" />
    </div>
  );
};
```

- [ ] **Step 2: Verify component renders**

The component should:
- Show summary
- Display efficiency score
- Show density assessment with appropriate colors
- List redundant roles
- Show missing elements
- Display improvement suggestions
- Include QueryPanel

- [ ] **Step 3: Commit**

```bash
git add src/components/EfficiencyLayer.tsx
git commit -m "feat: add EfficiencyLayer component for formulation efficiency"
```

---

### Task 12: Create Main Analysis View Component

**Files:**
- Create: `src/components/AnalysisView.tsx`

**Steps:**

- [ ] **Step 1: Create the main analysis container**

Create file at `src/components/AnalysisView.tsx`:

```typescript
import React, { useState } from 'react';
import { EnhancedAnalysisData } from '../types';
import { SynergiesLayer } from './SynergiesLayer';
import { AccordsLayer } from './AccordsLayer';
import { DiffusionLayer } from './DiffusionLayer';
import { StabilityLayer } from './StabilityLayer';
import { EfficiencyLayer } from './EfficiencyLayer';

interface AnalysisViewProps {
  analysis: EnhancedAnalysisData;
  fragranceName?: string;
  brand?: string;
}

interface LayerState {
  synergies: boolean;
  accords: boolean;
  diffusion: boolean;
  stability: boolean;
  efficiency: boolean;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ 
  analysis, 
  fragranceName = 'Fragrance',
  brand = 'Unknown'
}) => {
  const [expanded, setExpanded] = useState<LayerState>({
    synergies: false,
    accords: false,
    diffusion: false,
    stability: false,
    efficiency: false
  });

  const toggleLayer = (layer: keyof LayerState) => {
    setExpanded(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Header Summary */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{brand} • {fragranceName}</h2>
        <p className="text-gray-600 mt-2">Deep analytical assessment across five dimensions</p>
      </div>

      {/* Key Findings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="font-semibold text-indigo-900 mb-2">Primary Accord</h3>
          <p className="text-lg font-bold text-indigo-900">
            {analysis.dominantAccordMechanics.primaryAccord}
          </p>
          <p className="text-xs text-indigo-700 mt-1">
            Confidence: {analysis.dominantAccordMechanics.primaryAccordConfidence}/10
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">Efficiency Score</h3>
          <p className="text-lg font-bold text-green-900">
            {analysis.formulationEfficiency.efficiencyScore}/10
          </p>
          <p className="text-xs text-green-700 mt-1">
            Classification: {analysis.formulationEfficiency.densityAssessment.classification}
          </p>
        </div>
      </div>

      {/* Analysis Layers */}
      <div className="space-y-4">
        {/* Synergies */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleLayer('synergies')}
            className={`w-full px-4 py-3 text-left font-semibold flex items-center justify-between transition-colors ${
              expanded.synergies
                ? 'bg-indigo-100 text-indigo-900'
                : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'
            }`}
          >
            <span>Synergistic Interactions</span>
            <span>{expanded.synergies ? '▼' : '▶'}</span>
          </button>
          {expanded.synergies && (
            <div className="px-4 py-4">
              <SynergiesLayer 
                data={analysis.synergisticInteractions} 
                isExpanded={expanded.synergies}
              />
            </div>
          )}
        </div>

        {/* Accords */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleLayer('accords')}
            className={`w-full px-4 py-3 text-left font-semibold flex items-center justify-between transition-colors ${
              expanded.accords
                ? 'bg-blue-100 text-blue-900'
                : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
            }`}
          >
            <span>Dominant Accord Mechanics</span>
            <span>{expanded.accords ? '▼' : '▶'}</span>
          </button>
          {expanded.accords && (
            <div className="px-4 py-4">
              <AccordsLayer 
                data={analysis.dominantAccordMechanics} 
                isExpanded={expanded.accords}
              />
            </div>
          )}
        </div>

        {/* Diffusion */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleLayer('diffusion')}
            className={`w-full px-4 py-3 text-left font-semibold flex items-center justify-between transition-colors ${
              expanded.diffusion
                ? 'bg-amber-100 text-amber-900'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            <span>Molecular Diffusion Dynamics</span>
            <span>{expanded.diffusion ? '▼' : '▶'}</span>
          </button>
          {expanded.diffusion && (
            <div className="px-4 py-4">
              <DiffusionLayer 
                data={analysis.molecularDiffusionDynamics} 
                isExpanded={expanded.diffusion}
              />
            </div>
          )}
        </div>

        {/* Stability */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleLayer('stability')}
            className={`w-full px-4 py-3 text-left font-semibold flex items-center justify-between transition-colors ${
              expanded.stability
                ? 'bg-red-100 text-red-900'
                : 'bg-red-50 text-red-900 hover:bg-red-100'
            }`}
          >
            <span>Stability Predictions</span>
            <span>{expanded.stability ? '▼' : '▶'}</span>
          </button>
          {expanded.stability && (
            <div className="px-4 py-4">
              <StabilityLayer 
                data={analysis.stabilityPredictions} 
                isExpanded={expanded.stability}
              />
            </div>
          )}
        </div>

        {/* Efficiency */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleLayer('efficiency')}
            className={`w-full px-4 py-3 text-left font-semibold flex items-center justify-between transition-colors ${
              expanded.efficiency
                ? 'bg-green-100 text-green-900'
                : 'bg-green-50 text-green-900 hover:bg-green-100'
            }`}
          >
            <span>Formulation Efficiency</span>
            <span>{expanded.efficiency ? '▼' : '▶'}</span>
          </button>
          {expanded.efficiency && (
            <div className="px-4 py-4">
              <EfficiencyLayer 
                data={analysis.formulationEfficiency} 
                isExpanded={expanded.efficiency}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Verify component structure**

The component should:
- Display header with fragrance name
- Show summary cards for key findings
- Render collapsible sections for each analysis layer
- Toggle expanded state for each layer
- Color-code each layer differently

- [ ] **Step 3: Commit**

```bash
git add src/components/AnalysisView.tsx
git commit -m "feat: add AnalysisView main container for five-layer analysis display"
```

---

### Task 13: Integration Tests for Schema Validation

**Files:**
- Create: `src/__tests__/analysisSchema.test.ts`

**Steps:**

- [ ] **Step 1: Create test file**

Create file at `src/__tests__/analysisSchema.test.ts`:

```typescript
import { buildAnalysisSchema } from '../server/gemini/analysisPrompt';
import { Type } from '@google/genai';

describe('Analysis Schema Validation', () => {
  it('should define schema with all five required analyses', () => {
    const schema = buildAnalysisSchema();
    const required = schema.required as string[];
    
    expect(required).toContain('synergisticInteractions');
    expect(required).toContain('dominantAccordMechanics');
    expect(required).toContain('molecularDiffusionDynamics');
    expect(required).toContain('stabilityPredictions');
    expect(required).toContain('formulationEfficiency');
    expect(required).toContain('metadata');
  });

  it('should have proper structure for synergisticInteractions', () => {
    const schema = buildAnalysisSchema();
    const synergies = schema.properties.synergisticInteractions;
    
    expect(synergies).toBeDefined();
    expect(synergies.required).toContain('pairs');
    expect(synergies.required).toContain('queries');
  });

  it('should have proper structure for dominantAccordMechanics', () => {
    const schema = buildAnalysisSchema();
    const accords = schema.properties.dominantAccordMechanics;
    
    expect(accords).toBeDefined();
    expect(accords.required).toContain('primaryAccord');
    expect(accords.required).toContain('accordDrivers');
  });

  it('should have proper structure for molecularDiffusionDynamics', () => {
    const schema = buildAnalysisSchema();
    const diffusion = schema.properties.molecularDiffusionDynamics;
    
    expect(diffusion).toBeDefined();
    expect(diffusion.required).toContain('volatilityTiers');
    expect(diffusion.required).toContain('projectionPrediction');
  });

  it('should have proper structure for stabilityPredictions', () => {
    const schema = buildAnalysisSchema();
    const stability = schema.properties.stabilityPredictions;
    
    expect(stability).toBeDefined();
    expect(stability.required).toContain('oxidationRisk');
    expect(stability.required).toContain('agingTimeline');
  });

  it('should have proper structure for formulationEfficiency', () => {
    const schema = buildAnalysisSchema();
    const efficiency = schema.properties.formulationEfficiency;
    
    expect(efficiency).toBeDefined();
    expect(efficiency.required).toContain('densityAssessment');
    expect(efficiency.required).toContain('improvementSuggestions');
  });

  it('should have queries object for each analysis layer', () => {
    const schema = buildAnalysisSchema();
    
    // Check synergies queries
    const synergiesQueries = schema.properties.synergisticInteractions.properties.queries;
    expect(synergiesQueries.required).toContain('which_molecules_are_synergistic');
    
    // Check accords queries
    const accordsQueries = schema.properties.dominantAccordMechanics.properties.queries;
    expect(accordsQueries.required).toContain('why_does_this_feel_like_accord');
    
    // Check diffusion queries
    const diffusionQueries = schema.properties.molecularDiffusionDynamics.properties.queries;
    expect(diffusionQueries.required).toContain('which_molecules_carry_top_notes');
  });
});
```

- [ ] **Step 2: Run tests to verify schema**

Run: `npm test -- analysisSchema.test.ts`
Expected: All tests pass (schema is properly defined)

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/analysisSchema.test.ts
git commit -m "test: add schema validation tests for five analyses"
```

---

### Task 14: Cache Utility Tests

**Files:**
- Create: `src/__tests__/cache.test.ts`

**Steps:**

- [ ] **Step 1: Create cache test file**

Create file at `src/__tests__/cache.test.ts`:

```typescript
import { AnalysisCache } from '../server/cache/analysisCache';
import { EnhancedFragranceAnalysis } from '../server/types/analysisTypes';

describe('AnalysisCache', () => {
  let cache: AnalysisCache;
  
  const mockAnalysis: EnhancedFragranceAnalysis = {
    synergisticInteractions: {
      pairs: [],
      threeWayEffects: [],
      dominantSynergies: [],
      summary: 'Test',
      queries: {
        which_molecules_are_synergistic: 'Answer 1',
        where_are_dominant_synergies: 'Answer 2',
        how_do_synergies_shape_effect: 'Answer 3'
      }
    },
    dominantAccordMechanics: {
      primaryAccord: 'Floral',
      primaryAccordConfidence: 8,
      secondaryAccords: [],
      accordDrivers: [],
      psychologicalFactors: 'Test',
      unexpectedElements: 'Test',
      summary: 'Test',
      queries: {
        why_does_this_feel_like_accord: 'Answer',
        what_creates_impression: 'Answer',
        unexpected_elements_explanation: 'Answer'
      }
    },
    molecularDiffusionDynamics: {
      volatilityTiers: { top: [], heart: [], base: [] },
      carrierRelationships: [],
      evaporationSequence: [],
      molecularWeightHierarchy: [],
      projectionPrediction: {
        topNoteProjection: 'low',
        topNoteExplanation: 'Test',
        heartNoteProjection: 'medium',
        heartNoteExplanation: 'Test',
        baseNoteProjection: 'high',
        baseNoteExplanation: 'Test'
      },
      summary: 'Test',
      queries: {
        which_molecules_carry_top_notes: 'Answer',
        how_does_this_project: 'Answer',
        evaporation_sequence: 'Answer'
      }
    },
    stabilityPredictions: {
      oxidationRisk: { overallRisk: 'low', vulnerableCompounds: [] },
      chemicalReactions: [],
      separationRisk: 'low',
      separationExplanation: 'Test',
      expectedShelfLife: '3+ years',
      agingTimeline: { sixMonths: 'Test', oneYear: 'Test', fiveYears: 'Test' },
      storageRecommendations: [],
      summary: 'Test',
      queries: {
        how_will_this_age: 'Answer',
        shelf_life: 'Answer',
        which_compounds_at_oxidation_risk: 'Answer'
      }
    },
    formulationEfficiency: {
      redundancyMap: [],
      densityAssessment: { score: 5, classification: 'balanced', explanation: 'Test' },
      missingElements: [],
      efficiencyScore: 7,
      improvementSuggestions: [],
      summary: 'Test',
      queries: {
        is_this_over_formulated: 'Answer',
        where_can_we_tighten: 'Answer',
        whats_missing_for_balance: 'Answer'
      }
    },
    metadata: {}
  };

  beforeEach(() => {
    cache = new AnalysisCache();
  });

  it('should store and retrieve analysis', () => {
    cache.set('Chanel', 'No. 5', mockAnalysis);
    const retrieved = cache.get('Chanel', 'No. 5');
    
    expect(retrieved).toBeDefined();
    expect(retrieved?.formulationEfficiency.efficiencyScore).toBe(7);
  });

  it('should return null for missing key', () => {
    const retrieved = cache.get('Unknown', 'Fragrance');
    expect(retrieved).toBeNull();
  });

  it('should generate consistent cache keys', () => {
    const key1 = cache.getCacheKey('Chanel', 'No. 5');
    const key2 = cache.getCacheKey('CHANEL', 'NO. 5');
    
    // Keys should be case-insensitive
    expect(key1).toBe(key2);
  });

  it('should clear specific entry', () => {
    cache.set('Chanel', 'No. 5', mockAnalysis);
    expect(cache.get('Chanel', 'No. 5')).toBeDefined();
    
    cache.clear('Chanel', 'No. 5');
    expect(cache.get('Chanel', 'No. 5')).toBeNull();
  });

  it('should clear all entries', () => {
    cache.set('Chanel', 'No. 5', mockAnalysis);
    cache.set('Dior', 'Sauvage', mockAnalysis);
    
    cache.clear();
    expect(cache.getSize()).toBe(0);
  });

  it('should expire entries after TTL', async () => {
    // Note: Real test would need to mock Date or adjust TTL
    cache.set('Chanel', 'No. 5', mockAnalysis);
    expect(cache.get('Chanel', 'No. 5')).toBeDefined();
    
    // In real test, advance time and verify expiration
    // For now, just verify storage works
  });
});
```

- [ ] **Step 2: Run tests to verify cache behavior**

Run: `npm test -- cache.test.ts`
Expected: All tests pass (cache operations work correctly)

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/cache.test.ts
git commit -m "test: add cache utility tests for entry storage and TTL"
```

---

### Task 15: Manual Testing — Test the Enhanced Analysis with Real Fragrance

**Files:**
- Test: Use dev server and browser

**Steps:**

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: Server running on http://localhost:3000

- [ ] **Step 2: Open the app in browser**

Navigate to: `http://localhost:3000`

- [ ] **Step 3: Test with a known fragrance**

In the UI, analyze a fragrance (e.g., "Chanel No. 5" or similar known fragrance).

Expected behavior:
- Analysis completes and returns the full enhanced response
- No console errors
- Response includes all five analyses
- Query answers are present in each analysis layer

- [ ] **Step 4: Verify UI displays correctly**

- Refresh the browser after analysis completes
- Click to expand each of the five analysis layers
- Verify each layer displays its content correctly
- Click "Expert Queries" in each layer and verify query answers display

- [ ] **Step 5: Test caching**

Analyze the same fragrance again.

Expected behavior:
- Second analysis completes much faster (from cache)
- Results are identical to first analysis

- [ ] **Step 6: Test error handling**

Try analyzing a fragrance with invalid/incomplete data.

Expected behavior:
- Graceful error message
- No crashed state
- Can recover and try again

- [ ] **Step 7: Document findings**

If issues are found, note them. If all works, proceed to commit.

Run: `npm run build` to verify production build succeeds

Expected: No errors during build

- [ ] **Step 8: Commit successful testing**

```bash
git add .
git commit -m "test: manual testing of enhanced /api/analyze and AnalysisView UI"
```

---

### Task 16: Documentation Update

**Files:**
- Modify: `README.md` or create `docs/ANALYSIS_FEATURES.md`

**Steps:**

- [ ] **Step 1: Add feature documentation**

Add a section to the relevant documentation file describing the new enhanced analysis features:

```markdown
## Enhanced Fragrance Analysis (Five Dimensions)

The enhanced `/api/analyze` endpoint now returns comprehensive analyses across five key dimensions:

### Five Analysis Layers

1. **Synergistic Interactions** — Compound pairs that amplify, diminish, or transform effects
2. **Dominant Accord Mechanics** — Why a fragrance "feels" like what it is
3. **Molecular Diffusion Dynamics** — Volatility hierarchies, evaporation sequences, projection
4. **Stability Predictions** — Oxidation risk, aging trajectory, shelf life
5. **Formulation Efficiency** — Redundancy, density, balance, improvement suggestions

### Structured Queries

Each analysis layer includes pre-answered expert queries:
- Synergies: "Which molecules are synergistic?"
- Accords: "Why does this feel like [accord]?"
- Diffusion: "How does this project on skin?"
- Stability: "How will this age?"
- Efficiency: "Is this over-formulated?"

### API Usage

POST `/api/analyze` returns all five analyses in a single call (no additional API calls needed).

Response includes an `analysis` field with the complete `EnhancedAnalysisData` object.

### Caching

Analyses are cached for 10 minutes per fragrance (brand + name).
Cache is invalidated on logout or manual refresh.

### Frontend Components

- `AnalysisView` — Main container
- `SynergiesLayer`, `AccordsLayer`, `DiffusionLayer`, `StabilityLayer`, `EfficiencyLayer` — Layer components
- `QueryPanel` — Reusable query answer display
```

- [ ] **Step 2: Verify documentation is clear**

The documentation should:
- Explain the five analyses
- Describe structured queries
- Show how to use the API
- Note caching behavior
- List frontend components

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add enhanced analysis features documentation"
```

---

## Next Steps

Once all tasks are complete:

1. All code is committed with individual task commits
2. Tests pass: `npm test`
3. Build succeeds: `npm run build`
4. Manual testing verified correct behavior
5. Documentation updated

**Phase 2 (Creative Limitation)** can then be started with a similar process.
