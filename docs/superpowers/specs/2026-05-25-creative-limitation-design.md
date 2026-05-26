# Creative Limitation Implementation Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Date:** 2026-05-25  
**Scope:** Phase 2 of 3 (Creative Limitation, following Analytical Blindness completion)  
**Status:** Design approved, pending implementation planning

---

## Problem Statement

Phase 1 (Analytical Blindness) solved the analysis problem: understanding *why* fragrances work. Phase 2 solves the **creation problem**: enabling master perfumers to **compose and refine fragrances iteratively** with intelligent guidance.

Current gap:
- Users can analyze existing fragrances deeply (Phase 1)
- But cannot *compose* new fragrances or *refine* existing ones
- No tools for trial-and-error creative iteration
- No guidance on what changes improve or degrade a composition

Phase 2 enables:
- **Iterative composition** — Start with existing fragrance or blank slate, adjust compounds and percentages
- **Real-time feedback** — Immediate re-analysis showing impact of each change
- **Intelligent guidance** — Three types of suggestions (intent-based, what-if, balance hints)
- **Version management** — Save snapshots, compare versions, branch from any point
- **Persistent trials** — All compositions saved for future refinement

---

## Solution Overview

**New "Blending Studio" section** in Aromata with:

1. **Composition Editor** — Adjust compound percentages, add/remove compounds
2. **Real-Time Analysis Panel** — Five-layer analysis updates instantly on edits (reuses Phase 1 engine)
3. **Guidance System** — Three suggestion types for creative direction
4. **Version Manager** — Save, compare, undo, branch, restore versions
5. **Backend Storage** — Persistent trial database with full version history

### Key Design Decisions
- **Real-time re-analysis** on every edit (not batch processing) — provides immediate creative feedback
- **Reuse Phase 1 analysis engine** — same `/api/analyze` endpoint, same five analyses
- **Three guidance systems** — intent-based (user describes goal), what-if (test a change), balance hints (redundancy/imbalance detection)
- **Full version history** — every snapshot saved; branches create independent iteration paths
- **Persistent storage** — trials and versions persist across sessions

---

## Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────┐
│           Blending Studio (Frontend)             │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Composition  │  │ Analysis Panel (Phase│   │
│  │ Editor       │  │ 1 five analyses)     │   │
│  │ - Add/Remove │  │ - Synergies          │   │
│  │ - Adjust %   │  │ - Accords            │   │
│  └──────────────┘  │ - Diffusion          │   │
│                    │ - Stability          │   │
│  ┌──────────────┐  │ - Efficiency         │   │
│  │ Guidance     │  └──────────────────────┘   │
│  │ Panel        │                             │
│  │ - Intent     │  ┌──────────────────────┐   │
│  │ - What-If    │  │ Version Manager      │   │
│  │ - Balance    │  │ - Save snapshots     │   │
│  └──────────────┘  │ - Compare versions   │   │
│                    │ - Undo/Redo          │   │
│                    │ - Restore version    │   │
│                    └──────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│        Backend API Layer                        │
├─────────────────────────────────────────────────┤
│ POST /api/blending/trials                       │
│ POST /api/blending/analyze                      │
│ POST /api/blending/guidance                     │
│ POST /api/blending/versions/{trialId}/save      │
│ GET  /api/blending/trials/{trialId}             │
│ GET  /api/blending/trials                       │
│ DELETE /api/blending/versions/{versionId}       │
└─────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│        Data & Analysis Services                 │
├─────────────────────────────────────────────────┤
│ Phase 1 Analysis Engine (POST /api/analyze)     │
│ Gemini Guidance Engine (new prompts)             │
│ Persistent Trial Database                       │
└─────────────────────────────────────────────────┘
```

---

## Core Features

### 1. Composition Editor

**Responsibility:** Allow users to build or modify fragrance compositions

**Operations:**
- **Add compound**: Select from database (existing Phase 1 compounds) or enter custom name, set percentage
- **Remove compound**: Delete from current composition
- **Adjust percentage**: Change existing compound's percentage (0-100 range)
- **Set intent**: Describe goal ("Make more floral", "Increase projection", etc.)

**Validation:**
- Total percentage can exceed 100% (system normalizes or warns user)
- Total percentage < 50%: warn "very dilute" but allow
- Unknown compounds: accept, flag in analysis as "lower confidence"

**UI Layout:**
```
Compound List:
- Iso E Super: 15% [slider to adjust] [remove]
- Hedione: 12% [slider] [remove]
- Rose Absolute: 8% [slider] [remove]
[+ Add Compound]

Intent (optional):
[Describe your goal: "make more floral"]
```

### 2. Real-Time Re-Analysis

**Trigger:** Every edit (add/remove/adjust compound)

**Process:**
1. User makes change
2. Debounce 500ms (collect rapid edits)
3. Send composition to `POST /api/blending/analyze`
4. Backend calls Phase 1 Gemini engine with new compound list
5. Returns EnhancedFragranceAnalysis (five analyses)
6. Frontend updates:
   - Analysis panel (synergies, accords, diffusion, stability, efficiency)
   - Guidance panel (fresh suggestions based on new analysis)
   - Version manager shows "unsaved changes"

**Performance:** ~3-5 seconds per Gemini call. UI shows "Analyzing..." loading state.

### 3. Guidance System (Three Types)

#### Type 1: Intent-Based Guidance
**Trigger:** User fills in "Intent" field or clicks "Get Suggestions"

**Process:**
1. Extract user's intent: "Make this more floral"
2. Call `POST /api/blending/guidance` with type="intent"
3. Gemini prompt:
   ```
   Current composition: [compound list]
   Current analysis: [five analyses summary]
   User's intent: "Make more floral"
   
   Suggest 3-5 specific compound changes (add/remove/adjust %).
   For each: explain reasoning and expected impact.
   Format as JSON: [{compound, action, percentage?, reasoning}]
   ```
4. Display suggestions in Guidance Panel:
   ```
   Increase Hedione: 12% → 18%
   "Hedione is a floral ester that amplifies rose-like character"
   
   Add Rose Absolute: 0% → 5%
   "Direct floral note; low percentage for subtlety"
   
   Remove Iso E Super: 15% → 8%
   "Iso E Super is woody/ambery; reducing it de-emphasizes woody character"
   ```
5. User can: [Accept All] [Accept One] [Ignore] [Edit Manually]

#### Type 2: What-If Analysis
**Trigger:** User proposes a change or clicks a suggestion

**Process:**
1. User: "What if I increase Iso E Super to 20%?"
2. System auto-applies change, re-analyzes
3. Shows delta between old and new analysis:
   ```
   Efficiency Score: 7 → 8 (+1) ✓
   Oxidation Risk: low → low (no change)
   Primary Accord: Floral (9/10) → Woody-Floral (8/10)
   Synergies: +2 new pairings detected
   ```
4. User can: [Keep Change] [Undo] [Build On This]

#### Type 3: Balance & Redundancy Hints
**Trigger:** Continuous analysis of current composition

**Hints Shown:**
- **Redundancy**: "Iso E Super, Ambroxan, Galaxolide all serve base-anchoring role. Redundancy 8/10. Consider removing one."
- **Imbalance**: "Heart layer underdeveloped (18% of composition). Add floral or fruity accent."
- **Missing Elements**: "No aldehydes. Formulation lacks top-note brightness."

**User Interaction:**
- Click hint → see detailed reasoning
- [Show Suggestions] → intent-based guidance to fix
- Hints update in real-time as user edits

### 4. Version Management

**Workflow:**

1. **Draft State**: User edits composition
   - Changes accumulate in "draft" version
   - Indicator: "v5 (unsaved changes)"
   - Undo/Redo available within draft

2. **Save Snapshot**: User clicks "Save as v6"
   - Prompted for snapshot name: "Increased Floral"
   - Saves: composition + full analysis + timestamp
   - Creates new TrialVersion in database
   - Draft becomes v6, ready for new edits

3. **Version History Browser**:
   ```
   v5: "Increased Floral" — 2 hours ago
       [Compare] [Restore] [Delete]
   v4: "Base Focus" — 5 hours ago
       [Compare] [Restore] [Delete]
   v3: "Original" — Start
       [Compare] [Restore] [Delete]
   ```

4. **Compare Versions**: Side-by-side view
   ```
   v5: "Increased Floral" | v4: "Base Focus"
   ─────────────────────────────────────────
   Hedione: 18%         | Hedione: 12%
   Rose: 8% (NEW)       | Rose: —
   Ambroxan: 15%        | Ambroxan: 20%
   ─────────────────────────────────────────
   Primary Accord:      | Primary Accord:
   Floral (9/10)        | Woody (8/10)
   ✓ Gained floral      |
   ─────────────────────────────────────────
   Efficiency: 7→8      | Efficiency: 6
   ↑ Score improved     |
   ```

5. **Restore to Version**: "Go back to v4"
   - Loads v4 composition
   - Creates new draft for continued iteration
   - Original v5 preserved for comparison

6. **Branch from Version**: Independent iteration paths
   - v4 → v4a → v4b (separate from v5, v6, etc.)
   - All branches saved; user can compare across branches

### 5. Persistent Storage

**Trial Data:**
```typescript
interface Trial {
  id: string;
  userId: string;
  name: string;
  intent: string;
  baseFragrance?: { brand: string; name: string };
  createdAt: timestamp;
  updatedAt: timestamp;
}

interface TrialVersion {
  id: string;
  trialId: string;
  composition: {
    compounds: Array<{
      name: string;
      percentage: number;
    }>;
  };
  analysis: EnhancedFragranceAnalysis; // Full Phase 1 analysis
  snapshotName: string; // "v5: Increased Floral"
  isDraft: boolean;
  createdAt: timestamp;
}
```

**Persistence:**
- Trials and versions saved to database
- User can close Blending Studio and return later
- Full version history maintained for each trial
- Analysis data cached with each version (no recomputation on load)

---

## Backend Endpoints

### `POST /api/blending/trials`
**Create new trial**

Request:
```json
{
  "name": "Chanel No. 5 Iteration",
  "intent": "Make more floral",
  "baseFragrance": { "brand": "Chanel", "name": "No. 5" }
}
```

Response:
```json
{
  "id": "trial-123",
  "name": "Chanel No. 5 Iteration",
  "intent": "Make more floral",
  "baseFragrance": { "brand": "Chanel", "name": "No. 5" },
  "currentVersionId": "version-1-draft",
  "createdAt": "2026-05-25T10:00:00Z"
}
```

### `POST /api/blending/analyze`
**Re-analyze composition**

Request:
```json
{
  "trialId": "trial-123",
  "composition": {
    "compounds": [
      { "name": "Iso E Super", "percentage": 15 },
      { "name": "Hedione", "percentage": 18 },
      { "name": "Rose Absolute", "percentage": 8 }
    ]
  }
}
```

Response:
```json
{
  "analysis": {
    "synergisticInteractions": { ... },
    "dominantAccordMechanics": { ... },
    "molecularDiffusionDynamics": { ... },
    "stabilityPredictions": { ... },
    "formulationEfficiency": { ... },
    "metadata": { ... }
  }
}
```

### `POST /api/blending/guidance`
**Get suggestions**

Request:
```json
{
  "trialId": "trial-123",
  "composition": { "compounds": [...] },
  "analysis": { ... },
  "type": "intent",
  "intent": "Make more floral"
}
```

Response (for intent type):
```json
{
  "suggestions": [
    {
      "compound": "Hedione",
      "action": "increase",
      "currentPercentage": 12,
      "suggestedPercentage": 18,
      "reasoning": "Hedione is a floral ester that amplifies rose-like character"
    },
    {
      "compound": "Rose Absolute",
      "action": "add",
      "suggestedPercentage": 5,
      "reasoning": "Direct floral note; low percentage for subtlety"
    }
  ]
}
```

### `POST /api/blending/versions/{trialId}/save`
**Save version snapshot**

Request:
```json
{
  "composition": { "compounds": [...] },
  "snapshotName": "v6: Increased Floral",
  "analysis": { ... }
}
```

Response:
```json
{
  "versionId": "version-6",
  "snapshotName": "v6: Increased Floral",
  "createdAt": "2026-05-25T11:30:00Z"
}
```

### `GET /api/blending/trials/{trialId}`
**Fetch trial + versions**

Response:
```json
{
  "trial": { ... },
  "versions": [
    { "id": "version-1", "snapshotName": "v1: Original", "createdAt": "..." },
    { "id": "version-2", "snapshotName": "v2: More Floral", "createdAt": "..." }
  ],
  "currentDraft": { "id": "draft", "isDraft": true, "composition": {...} }
}
```

### `GET /api/blending/trials`
**List all user's trials**

Response:
```json
{
  "trials": [
    {
      "id": "trial-123",
      "name": "Chanel No. 5 Iteration",
      "intent": "Make more floral",
      "versionCount": 6,
      "createdAt": "2026-05-25T10:00:00Z",
      "updatedAt": "2026-05-25T12:00:00Z"
    }
  ]
}
```

### `DELETE /api/blending/versions/{versionId}`
**Delete version snapshot**

Response: 200 OK

---

## Error Handling

### Real-Time Re-Analysis Failures
- **Gemini call fails**: Show "Analysis unavailable. Retrying..."
- **Keep UI state**: User's edits not lost
- **Fallback**: Show previous analysis with stale indicator
- **Retry button**: User can re-trigger analysis

### Invalid Compositions
- **Total > 100%**: Warn "Exceeds 100%. Normalize?" with auto-normalize button
- **Total < 50%**: Warn "Very dilute. Typical formulations are 50%+." Allow proceeding
- **Unknown compounds**: Accept, flag "Contains unknown compounds. Results may be less accurate."

### Guidance Failures
- **Intent-based guidance fails**: "Could not generate suggestions. Try describing intent differently."
- **What-if analysis fails**: "Could not evaluate change. Try again."
- **Balance hints fail**: Show previous hints; don't block editing

### Save Failures
- **Database error on save**: Show error, retry button
- **Local memory fallback**: Keep draft in local state until save succeeds
- **User continues editing**: No work lost

### Performance Safeguards
- **Rapid edits**: Debounce 500ms (wait after last edit before calling Gemini)
- **Loading state**: Show "Analyzing..." indicator
- **Queue pending edits**: Process after analysis completes

---

## Testing Strategy

### Functional Testing
- Create trial from scratch
- Create trial from existing fragrance
- Add/remove/adjust compounds
- Verify real-time re-analysis (check five analyses update)
- Test all three guidance types (intent, what-if, balance)
- Save versions; verify snapshot captures composition + analysis
- Compare two versions; verify delta display
- Restore to version; verify composition loads
- Undo/redo within draft

### Edge Cases
- Total percentage > 100%: Test normalization
- Total percentage < 50%: Test warning + allow
- Unknown compounds: Verify accepted + flagged
- Rapid edits: Verify debouncing (no excessive API calls)
- Save during analysis: Verify no race conditions
- Delete version; verify history updates

### Integration Testing
- Create trial, make edits, save v1, edit again, save v2, compare v1 & v2
- Start from existing fragrance (Phase 1), refine in Blending Studio
- Intent-based guidance: modify suggestion, re-analyze, verify impact
- What-if guidance: propose change, see delta, accept/reject

### User Acceptance Testing
- Master nose creates a trial from Phase 1 analysis
- Refines toward intent ("more sillage")
- Compares versions before/after
- Verifies guidance suggestions are chemically sound

---

## Success Criteria

- ✅ Blending Studio UI functional with composition editor
- ✅ Real-time re-analysis on every edit (reuses Phase 1 engine)
- ✅ All three guidance systems working (intent, what-if, balance)
- ✅ Version management (save, compare, restore, undo/redo)
- ✅ Persistent storage of trials and versions
- ✅ Error handling prevents silent failures
- ✅ Performance: Gemini call <10s, UI responsive
- ✅ Master nose can complete a full iterative workflow: create → edit → get guidance → save version → compare → refine

---

## Scope & Constraints

**In Scope:**
- Blending Studio UI with composition editor
- Real-time re-analysis (integration with Phase 1 engine)
- Three guidance systems (intent-based, what-if, balance)
- Full version management (save, compare, restore, branch)
- Backend endpoints for CRUD operations
- Persistent trial database
- Error handling and validation

**Out of Scope:**
- Sharing/exporting trial compositions (Phase 3 or later)
- Advanced batch testing (multi-trial comparison)
- Machine learning optimization (suggest optimal formulations)
- Educational content about guidance reasoning (Phase 3)
- Mobile app version (desktop-first)

---

## Architecture Decisions

**Why Real-Time Re-Analysis (not batch)?**
- Immediate feedback drives creative iteration
- User sees impact of each change instantly
- Worth the Gemini API cost for user experience

**Why Reuse Phase 1 Analysis Engine?**
- Consistency: same five analyses everywhere
- Efficiency: no duplicate Gemini work
- Simplicity: leverage existing `/api/analyze` endpoint

**Why Three Guidance Systems?**
- Intent-based: for users with a goal but unsure how to achieve it
- What-if: for testing hypotheses
- Balance: for detecting blind spots in the composition
- Together: comprehensive creative support

**Why Persistent Storage?**
- Trials often take multiple sessions to refine
- Version history enables learning ("why did v3 work better?")
- Enables sharing/collaboration (future phase)

---

## Dependencies & Notes

- Requires Phase 1 analytical engine (already built)
- Requires Gemini API (existing integration)
- Database needed for trial/version storage (new requirement)
- Frontend: React 19, TypeScript (existing stack)
- Backend: Node.js/Express (existing stack)

---

## Next Steps

1. ✅ Design approved (this document)
2. → Implementation plan (writing-plans skill)
3. Implement backend endpoints and database layer
4. Implement Blending Studio UI components
5. Implement guidance engine (three suggestion types)
6. Testing & validation
7. Launch Phase 2; proceed to Phase 3 (Educational Gap)
