# Analytical Blindness Enhancement Design
**Date:** 2026-05-25  
**Scope:** Phase 1 of 3 (Analytical Blindness, followed by Creative Limitation and Educational Gap)  
**Status:** Design approved, pending implementation planning

---

## Problem Statement

Current fragrance analysis is shallow: it identifies what's *in* a fragrance but misses why it *works*. Master perfumers lack:
- Understanding of **synergistic interactions** between compounds
- Insight into **accord mechanics** (why a fragrance feels like what it claims)
- Clarity on **diffusion dynamics** (which molecules carry which, volatility hierarchies)
- **Stability predictions** (oxidation, separation, aging)
- **Formulation efficiency** assessment (redundancy, density, balance)

This enhancement addresses all five gaps in a single, unified analysis.

---

## Solution Overview

Enhance the `/api/analyze` endpoint to return comprehensive, interconnected analysis across five analytical dimensions. All dimensions are computed upfront in a single Gemini API call, enabling:
- **Layered exploration** in the UI (click to expand each analysis)
- **Structured queries** (pre-built questions per layer with pre-computed answers)
- **Cross-references** (analyses reference each other, e.g., "diffusion affected by synergies between X and Y")

### Key Design Decisions
- **Single Gemini call** (not five separate calls) → ensures analyses reference each other accurately, lower latency, single API cost
- **Upfront computation** (not on-demand) → summary ready immediately, all layers accessible without additional API calls
- **Structured queries only** (not free-form) → deterministic, accurate, controlled quality

---

## Architecture

### Endpoint: `POST /api/analyze`

**Input:** Fragrance data (compounds, percentages, concentration, known properties)

**Output:** Single JSON response containing five nested analyses + metadata

**Processing:**
1. Backend receives fragrance input
2. Constructs Gemini prompt (positioning model as "research chemist + GC-MS expert")
3. Defines comprehensive JSON schema covering all five analyses
4. Makes single Gemini API call
5. Parses response and returns to frontend

**Caching:** Analyses cached for 5-10 minutes per fragrance (avoid duplicate calls on re-visits)

---

## The Five Analyses

### 1. Synergistic Interactions
**What:** Compound pairs and their interaction effects

**Output Fields:**
- `pairs`: Array of interaction objects
  - `compound_a`, `compound_b`: string names
  - `interaction_type`: "amplifies" | "diminishes" | "transforms" | "neutral"
  - `strength`: 1-10 scale (how strong the effect)
  - `mechanism`: string explanation (e.g., "A's volatility carries B's diffusion")
- `threeWayEffects`: Array of three-compound interactions (if significant)
- `dominantSynergies`: Ranked list of most impactful pairs
- `summary`: 2-3 sentence overview

**Structured Queries:**
- "Which molecules are synergistic?"
- "Where are the dominant synergies in this formula?"
- "How do these synergies shape the overall effect?"

### 2. Dominant Accord Mechanics
**What:** Why the fragrance *feels* like what it claims, despite molecular composition

**Output Fields:**
- `primaryAccord`: string (chypre, floral, fruity, woody, aromatic, etc.) + confidence score
- `secondaryAccords`: Array of subordinate accords
- `accordDrivers`: Array of objects
  - `accord`: string name
  - `compounds`: Array of compound names that drive it
  - `roleDescription`: string (how they create the accord)
  - `confidence`: 1-10
- `psychologicalFactors`: string (olfactory perception vs. chemistry)
- `unexpectedElements`: string (compounds that seem contradictory but work)
- `summary`: 2-3 sentence explanation of the accord identity

**Structured Queries:**
- "Why does this feel like [chord]?"
- "What creates the impression of [descriptor]?"
- "Are there unexpected elements driving the perception?"

### 3. Molecular Diffusion Dynamics
**What:** Volatility hierarchies, which molecules carry which, evaporation sequence

**Output Fields:**
- `volatilityTiers`: Object with tiers
  - `top`: Array of compounds (high volatility, quick diffusion)
  - `heart`: Array (moderate volatility, medium diffusion)
  - `base`: Array (low volatility, persistence)
- `carrierRelationships`: Array of objects
  - `carrier`: string (molecule doing the carrying)
  - `cargo`: Array of strings (molecules being carried)
  - `explanation`: string (mechanism)
- `evaporationSequence`: Array with timing
  - `phase`: "top" | "heart" | "base"
  - `compounds`: Array
  - `timingMinutes`: Approximate evaporation window (e.g., "0-15 min")
- `molecularWeightHierarchy`: Ranked array of compounds by weight
- `projectionPrediction`: Object
  - `topNoteProjection`: "low" | "medium" | "high" + explanation
  - `heartNoteProjection`: "low" | "medium" | "high"
  - `baseNoteProjction`: "low" | "medium" | "high"
- `summary`: 2-3 sentence overview of diffusion character

**Structured Queries:**
- "Which molecules carry the top notes?"
- "How does this project on skin?"
- "What's the evaporation sequence?"

### 4. Stability Predictions
**What:** Oxidation risk, separation likelihood, aging trajectory

**Output Fields:**
- `oxidationRisk`: Object
  - `overallRisk`: "low" | "medium" | "high"
  - `vulnerableCompounds`: Array of objects
    - `compound`: string
    - `riskLevel`: "low" | "medium" | "high"
    - `mechanism`: string (e.g., "aldehydes degrade over time")
- `chemicalReactions`: Array of potential reactions (e.g., "compound A may react with oxygen to form...")
- `separationRisk`: "low" | "medium" | "high" + explanation
- `expectedShelfLife`: "6 months" | "1 year" | "3+ years" (unopened, sealed)
- `agingTimeline`: Object
  - `sixMonths`: string (expected changes)
  - `oneYear`: string
  - `fiveYears`: string
- `storageRecommendations`: Array of strings (cool/dark/sealed, etc.)
- `summary`: 2-3 sentence assessment of stability

**Structured Queries:**
- "How will this age?"
- "What's the shelf life?"
- "Which compounds are at oxidation risk?"

### 5. Formulation Efficiency
**What:** Redundancy, density, balance, improvement suggestions

**Output Fields:**
- `redundancyMap`: Array of objects
  - `role`: string (e.g., "sweet base anchor")
  - `compounds`: Array of compounds serving this role
  - `redundancyScore`: 1-10 (how much overlap)
  - `suggestion`: string (which could be removed, which should stay)
- `densityAssessment`: Object
  - `score`: 1-10 (1=very lean, 10=bloated)
  - `classification`: "lean" | "balanced" | "dense" | "bloated"
  - `explanation`: string
- `missingElements`: Array of strings (e.g., "could benefit from a drying top note")
- `efficiencyScore`: 1-10 overall (how well formulated for its intent)
- `improvementSuggestions`: Array of objects
  - `suggestion`: string
  - `rationale`: string
  - `impact`: "low" | "medium" | "high"
- `summary`: 2-3 sentence assessment

**Structured Queries:**
- "Is this over-formulated?"
- "Where can we tighten this composition?"
- "What's missing for better balance?"

---

## Gemini Integration

### Prompt Strategy
Position the model as "research chemist and GC-MS expert" to ensure scientific accuracy over marketing language.

### Schema Definition
All five analyses are defined in a single `responseSchema` (using @google/genai Type definitions). Each analysis includes pre-computed structured query answers (not separate API calls).

Required fields at top level:
- `synergisticInteractions` (required) — includes pre-answered queries
- `dominantAccordMechanics` (required) — includes pre-answered queries
- `molecularDiffusionDynamics` (required) — includes pre-answered queries
- `stabilityPredictions` (required) — includes pre-answered queries
- `formulationEfficiency` (required) — includes pre-answered queries
- `metadata` (optional): confidence scores, limitations, caveats

Query answers are embedded within each analysis object so frontend can display them without additional API calls.

### Response Parsing
```typescript
const response = await model.generateContent({
  contents: [{role: "user", parts: [{text: prompt}]}],
  generationConfig: {responseMimeType: "application/json"},
  systemInstruction: "You are a professional research chemist...",
});

const analysis = JSON.parse(response.text.trim());
```

---

## Frontend Integration

### UI Flow: Layered Deep-Dive

**Summary View (initial):**
- Fragrance metadata (name, concentration, primary accord)
- Key findings: 1 insight from each of the five analyses
- Five collapsible section headers

**Expanded Layer (on click):**
- Full analysis details for that dimension
- **Structured Query Panel:** 3-4 pre-built questions specific to the layer
- Clicking a question displays the pre-computed answer inline (no API call)
- Visual representations where helpful:
  - Interaction matrices (synergies)
  - Compound relationship diagrams (diffusion)
  - Timeline (stability aging)
  - Radar/gauge charts (efficiency density)

### Data Flow
1. User navigates to fragrance analysis
2. Frontend calls `POST /api/analyze` with fragrance data
3. Backend returns complete analysis object
4. Frontend renders summary immediately
5. User clicks to expand each layer
6. Queries are answered from the same response object (no additional API calls)

---

## Error Handling

### Gemini Failures
- **Complete failure:** Return graceful error; offer fallback to simpler analysis (existing `/api/analyze` output)
- **Partial failure (one analysis fails):** Return all successful analyses; mark failed layer as unavailable with reason
- **Query failure:** Show "query unavailable" inline rather than breaking the entire layer

### Input Validation
- Reject fragrance data missing required fields (compound list, percentages)
- Gracefully handle unknown compounds (analyze them, but flag confidence)
- Return meaningful error messages to user

### Caching & Performance
- Cache per-fragrance analyses for 5-10 minutes (avoid duplicate Gemini calls)
- Cache invalidation on user logout or manual "refresh analysis" action

---

## Testing Strategy

### Schema Validation
- Unit tests: Verify all five analyses return expected structure
- Verify query answers are present for each layer
- Test edge cases: Very few compounds, mostly unknowns, extreme formulations

### Accuracy Testing
- **Known fragrances:** Test against 5-10 iconic fragrances (Chanel No. 5, Dior Sauvage, Creed Aventus, etc.)
  - Verify synergies make chemical sense
  - Verify accords match known composition
  - Verify stability predictions are reasonable
- **Master nose review:** Have 2-3 expert perfumers spot-check analyses for correctness (not just well-formedness)
- Document any limitations (e.g., "Gemini struggles with niche synthetics")

### Performance Testing
- Measure latency: Single Gemini call should complete in <10 seconds
- Verify caching: Repeated calls return cached result instantly
- Monitor API costs (single call vs. previous approach)

### Edge Cases
- Fragrance with only 3-5 compounds
- Fragrance composed entirely of unknowns/new synthetics
- Extremely concentrated (parfum) vs. dilute (eau de cologne)
- Accords that contradict each other

---

## Success Criteria

- ✅ All five analyses computed upfront, returned in single Gemini call
- ✅ UI supports layered exploration + structured queries
- ✅ Structured query answers are accurate and useful (verified by master nose)
- ✅ Error handling prevents partial failures from breaking the entire analysis
- ✅ Caching reduces duplicate API calls
- ✅ Performance: Gemini call <10s, UI renders summary immediately
- ✅ Query accuracy: >90% of queries return correct/useful answers (determined by master nose review)

---

## Scope & Constraints

**In Scope:**
- Enhanced `/api/analyze` endpoint with five analyses
- Backend Gemini integration and schema design
- Frontend UI for layered exploration + structured queries
- Caching layer
- Error handling
- Testing & validation

**Out of Scope:**
- Creative limitation tools (blending workbench) — Phase 2
- Educational gap (teaching interfaces) — Phase 3
- Historical data enrichment
- Batch analysis (analyzing multiple fragrances at once)
- Export/sharing of analyses

---

## Dependencies & Notes

- Requires @google/genai v2.4.0+ (already in project)
- Builds on existing fragrance data structure (FragranceData, AromaChemical)
- No new database dependencies
- Existing `/api/analyze` response should remain compatible; this enhances it

---

## Next Steps

1. ✅ Design approved (this document)
2. → Implementation plan (writing-plans skill)
3. Implement backend Gemini schema + endpoint
4. Implement frontend UI for layers + queries
5. Testing & validation with master noses
6. Launch Phase 1; proceed to Phase 2 (Creative Limitation)
