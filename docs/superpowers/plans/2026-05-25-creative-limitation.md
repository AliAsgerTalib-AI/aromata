# Creative Limitation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Blending Studio — a complete creative composition workspace with real-time re-analysis, three guidance systems, and version management.

**Architecture:** Backend provides REST API for trial CRUD, real-time composition re-analysis (via Phase 1 engine), and three guidance systems. Frontend Blending Studio UI with composition editor, live analysis panel, guidance suggestions, and version manager. Persistent database stores trials and versions.

**Tech Stack:**
- Backend: Node.js/Express, TypeScript, Gemini API (Phase 1 reuse)
- Frontend: React 19, TypeScript, Tailwind CSS 4
- Database: SQLite (simple) or PostgreSQL (scalable)

---

## File Structure

**Backend Files to Create/Modify:**
- `src/server/db/schema.ts` — NEW: Database schema (trials, versions)
- `src/server/db/queries.ts` — NEW: Database queries (CRUD operations)
- `src/server/blending/router.ts` — NEW: Blending API routes
- `src/server/blending/service.ts` — NEW: Business logic (analyze, guidance)
- `src/server/blending/guidance.ts` — NEW: Three guidance systems (intent, what-if, balance)
- `server.ts` — MODIFY: Register blending router

**Frontend Files to Create/Modify:**
- `src/types.ts` — MODIFY: Add Blending Studio types (Trial, TrialVersion, Guidance)
- `src/components/BlendingStudio.tsx` — NEW: Main Blending Studio container
- `src/components/CompositionEditor.tsx` — NEW: Compound list editor (add/remove/adjust)
- `src/components/GuidancePanel.tsx` — NEW: Guidance suggestions (intent, what-if, balance)
- `src/components/VersionManager.tsx` — NEW: Version history, save, restore, compare
- `src/components/VersionComparison.tsx` — NEW: Side-by-side version comparison
- `src/App.tsx` — MODIFY: Add BlendingStudio route/section

**Test Files:**
- `src/__tests__/blendingService.test.ts` — NEW: Guidance and analysis tests
- `src/__tests__/database.test.ts` — NEW: Database CRUD tests

---

## Task Breakdown

### Task 1: Create Database Schema & Initialize

**Files:**
- Create: `src/server/db/schema.ts`
- Modify: `server.ts` (database initialization)

**Steps:**

- [ ] **Step 1: Create schema file with Trial and TrialVersion types**

Create `src/server/db/schema.ts`:

```typescript
import { Database } from 'better-sqlite3';

export interface Trial {
  id: string;
  userId: string;
  name: string;
  intent: string;
  baseFragrance?: { brand: string; name: string };
  createdAt: number;
  updatedAt: number;
}

export interface TrialVersion {
  id: string;
  trialId: string;
  composition: {
    compounds: Array<{
      name: string;
      percentage: number;
    }>;
  };
  analysis: any; // EnhancedFragranceAnalysis
  snapshotName: string;
  isDraft: boolean;
  createdAt: number;
}

export function initializeDatabase(db: Database): void {
  // Create trials table
  db.exec(`
    CREATE TABLE IF NOT EXISTS trials (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      name TEXT NOT NULL,
      intent TEXT,
      baseFragrance TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    )
  `);

  // Create versions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS trial_versions (
      id TEXT PRIMARY KEY,
      trialId TEXT NOT NULL REFERENCES trials(id),
      composition TEXT NOT NULL,
      analysis TEXT NOT NULL,
      snapshotName TEXT NOT NULL,
      isDraft INTEGER NOT NULL DEFAULT 0,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (trialId) REFERENCES trials(id)
    )
  `);

  // Create index for faster queries
  db.exec(`CREATE INDEX IF NOT EXISTS idx_trial_user ON trials(userId)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_version_trial ON trial_versions(trialId)`);
}
```

- [ ] **Step 2: Verify schema file compiles**

Run: `npm run lint`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/server/db/schema.ts
git commit -m "feat: add blending studio database schema"
```

---

### Task 2: Create Database Query Functions

**Files:**
- Create: `src/server/db/queries.ts`

**Steps:**

- [ ] **Step 1: Create CRUD query functions**

Create `src/server/db/queries.ts`:

```typescript
import Database from 'better-sqlite3';
import { Trial, TrialVersion } from './schema';

export class TrialQueries {
  constructor(private db: Database.Database) {}

  createTrial(trial: Trial): void {
    const stmt = this.db.prepare(`
      INSERT INTO trials (id, userId, name, intent, baseFragrance, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      trial.id,
      trial.userId,
      trial.name,
      trial.intent || null,
      trial.baseFragrance ? JSON.stringify(trial.baseFragrance) : null,
      trial.createdAt,
      trial.updatedAt
    );
  }

  getTrial(trialId: string): Trial | null {
    const stmt = this.db.prepare('SELECT * FROM trials WHERE id = ?');
    const row = stmt.get(trialId) as any;
    if (!row) return null;
    return {
      ...row,
      baseFragrance: row.baseFragrance ? JSON.parse(row.baseFragrance) : undefined
    };
  }

  getUserTrials(userId: string): Trial[] {
    const stmt = this.db.prepare('SELECT * FROM trials WHERE userId = ? ORDER BY updatedAt DESC');
    const rows = stmt.all(userId) as any[];
    return rows.map(row => ({
      ...row,
      baseFragrance: row.baseFragrance ? JSON.parse(row.baseFragrance) : undefined
    }));
  }

  updateTrial(trialId: string, updates: Partial<Trial>): void {
    const current = this.getTrial(trialId);
    if (!current) throw new Error('Trial not found');
    
    const updated = { ...current, ...updates, updatedAt: Date.now() };
    const stmt = this.db.prepare(`
      UPDATE trials SET name = ?, intent = ?, baseFragrance = ?, updatedAt = ? WHERE id = ?
    `);
    stmt.run(
      updated.name,
      updated.intent || null,
      updated.baseFragrance ? JSON.stringify(updated.baseFragrance) : null,
      updated.updatedAt,
      trialId
    );
  }

  deleteTrial(trialId: string): void {
    this.db.prepare('DELETE FROM trial_versions WHERE trialId = ?').run(trialId);
    this.db.prepare('DELETE FROM trials WHERE id = ?').run(trialId);
  }

  createVersion(version: TrialVersion): void {
    const stmt = this.db.prepare(`
      INSERT INTO trial_versions (id, trialId, composition, analysis, snapshotName, isDraft, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      version.id,
      version.trialId,
      JSON.stringify(version.composition),
      JSON.stringify(version.analysis),
      version.snapshotName,
      version.isDraft ? 1 : 0,
      version.createdAt
    );
  }

  getVersions(trialId: string): TrialVersion[] {
    const stmt = this.db.prepare(
      'SELECT * FROM trial_versions WHERE trialId = ? ORDER BY createdAt DESC'
    );
    const rows = stmt.all(trialId) as any[];
    return rows.map(row => ({
      id: row.id,
      trialId: row.trialId,
      composition: JSON.parse(row.composition),
      analysis: JSON.parse(row.analysis),
      snapshotName: row.snapshotName,
      isDraft: row.isDraft === 1,
      createdAt: row.createdAt
    }));
  }

  updateVersion(versionId: string, updates: Partial<TrialVersion>): void {
    const stmt = this.db.prepare(`
      UPDATE trial_versions SET snapshotName = ?, isDraft = ? WHERE id = ?
    `);
    stmt.run(
      updates.snapshotName,
      updates.isDraft ? 1 : 0,
      versionId
    );
  }

  deleteVersion(versionId: string): void {
    this.db.prepare('DELETE FROM trial_versions WHERE id = ?').run(versionId);
  }
}
```

- [ ] **Step 2: Verify compiles**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/server/db/queries.ts
git commit -m "feat: add trial and version database queries"
```

---

### Task 3: Create Guidance Engine

**Files:**
- Create: `src/server/blending/guidance.ts`

**Steps:**

- [ ] **Step 1: Implement three guidance systems**

Create `src/server/blending/guidance.ts`:

```typescript
import { GoogleGenAI } from '@google/genai';
import { EnhancedFragranceAnalysis } from '../types/analysisTypes';

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

interface Compound {
  name: string;
  percentage: number;
}

interface IntentSuggestion {
  compound: string;
  action: 'add' | 'increase' | 'decrease' | 'remove';
  currentPercentage?: number;
  suggestedPercentage?: number;
  reasoning: string;
}

interface BalanceHint {
  type: 'redundancy' | 'imbalance' | 'missing';
  title: string;
  description: string;
  compounds?: string[];
  suggestion?: string;
}

export class GuidanceEngine {
  constructor(private ai: GoogleGenAI) {}

  async getIntentGuidance(
    compounds: Compound[],
    analysis: EnhancedFragranceAnalysis,
    intent: string
  ): Promise<IntentSuggestion[]> {
    const compoundList = compounds
      .map(c => `${c.name}: ${c.percentage}%`)
      .join('\n');

    const prompt = `You are a master perfumer. Current composition:
${compoundList}

Current analysis summary:
- Primary Accord: ${analysis.dominantAccordMechanics.primaryAccord}
- Efficiency: ${analysis.formulationEfficiency.efficiencyScore}/10
- Key Synergies: ${analysis.synergisticInteractions.dominantSynergies.slice(0, 2).map(s => `${s.compound_a}-${s.compound_b}`).join(', ')}

User's Intent: "${intent}"

Suggest 3-5 specific compound changes (add/remove/increase/decrease %) to move toward this intent.
For each suggestion, provide reasoning.

Return JSON array: [{"compound": "name", "action": "add|increase|decrease|remove", "currentPercentage": X, "suggestedPercentage": Y, "reasoning": "..."}]
Only include fields relevant to the action (e.g., no suggestedPercentage for remove).`;

    const response = await this.ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{role: "user", parts: [{text: prompt}]}],
      config: {
        responseMimeType: 'application/json'
      }
    });

    try {
      const result = JSON.parse(response.text.trim());
      return Array.isArray(result) ? result : result.suggestions || [];
    } catch (e) {
      console.error('Failed to parse intent guidance:', e);
      return [];
    }
  }

  getBalanceHints(
    compounds: Compound[],
    analysis: EnhancedFragranceAnalysis
  ): BalanceHint[] {
    const hints: BalanceHint[] = [];

    // Check for redundancy (efficiency analysis)
    const redundancy = analysis.formulationEfficiency.redundancyMap;
    for (const item of redundancy) {
      if (item.redundancyScore >= 7) {
        hints.push({
          type: 'redundancy',
          title: `Redundancy detected: ${item.role}`,
          description: `${item.compounds.join(', ')} all serve similar roles (score: ${item.redundancyScore}/10).`,
          compounds: item.compounds,
          suggestion: item.suggestion
        });
      }
    }

    // Check for imbalance (volatility tiers)
    const tiers = analysis.molecularDiffusionDynamics.volatilityTiers;
    const totalCompounds = compounds.length;
    const heartCompounds = tiers.heart.length;
    const heartPercentage = compounds
      .filter(c => tiers.heart.includes(c.name))
      .reduce((sum, c) => sum + c.percentage, 0);

    if (heartPercentage < 20 && heartCompounds < totalCompounds * 0.3) {
      hints.push({
        type: 'imbalance',
        title: 'Heart layer underdeveloped',
        description: `Only ${heartPercentage.toFixed(1)}% of composition. Heart typically 30-50%.`,
        suggestion: 'Add a floral, fruity, or spicy accent to strengthen the heart'
      });
    }

    // Check for missing aldehydes or top notes
    const topTier = tiers.top;
    if (topTier.length === 0 || topTier.length < 3) {
      hints.push({
        type: 'missing',
        title: 'Limited top-note diversity',
        description: 'Few or no high-volatility compounds. Consider adding aldehydes or fresh citrus.',
        suggestion: 'Aldehydes add brightness; citrus adds freshness'
      });
    }

    return hints;
  }
}
```

- [ ] **Step 2: Verify compiles**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/server/blending/guidance.ts
git commit -m "feat: add guidance engine with intent and balance hint systems"
```

---

### Task 4: Create Blending Service (Business Logic)

**Files:**
- Create: `src/server/blending/service.ts`

**Steps:**

- [ ] **Step 1: Implement blending service**

Create `src/server/blending/service.ts`:

```typescript
import { GoogleGenAI } from '@google/genai';
import { buildAnalysisPrompt, buildAnalysisSchema } from '../gemini/analysisPrompt';
import { EnhancedFragranceAnalysis } from '../types/analysisTypes';
import { GuidanceEngine } from './guidance';
import { TrialQueries } from '../db/queries';

interface Compound {
  name: string;
  percentage: number;
}

export class BlendingService {
  private guidance: GuidanceEngine;
  private ai: GoogleGenAI;

  constructor(private db: TrialQueries, aiClient: GoogleGenAI) {
    this.ai = aiClient;
    this.guidance = new GuidanceEngine(aiClient);
  }

  async analyzeComposition(compounds: Compound[]): Promise<EnhancedFragranceAnalysis> {
    // Reuse Phase 1 analysis engine
    const prompt = buildAnalysisPrompt('Trial', 'Trial Composition', compounds);
    const schema = buildAnalysisSchema();

    const response = await this.ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
      contents: [{role: "user", parts: [{text: prompt}]}],
      config: {
        systemInstruction: 'You are a professional research chemist. Return only valid JSON.',
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    });

    return JSON.parse(response.text.trim());
  }

  async getGuidance(
    compounds: Compound[],
    analysis: EnhancedFragranceAnalysis,
    type: 'intent' | 'balance',
    intent?: string
  ): Promise<any> {
    if (type === 'intent' && intent) {
      return {
        suggestions: await this.guidance.getIntentGuidance(compounds, analysis, intent)
      };
    } else if (type === 'balance') {
      return {
        hints: this.guidance.getBalanceHints(compounds, analysis)
      };
    }
    return null;
  }
}
```

- [ ] **Step 2: Verify compiles**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/server/blending/service.ts
git commit -m "feat: add blending service with composition analysis and guidance"
```

---

### Task 5: Create Blending API Routes

**Files:**
- Create: `src/server/blending/router.ts`

**Steps:**

- [ ] **Step 1: Implement REST API endpoints**

Create `src/server/blending/router.ts`:

```typescript
import express from 'express';
import { v4 as uuid } from 'uuid';
import { BlendingService } from './service';
import { TrialQueries } from '../db/queries';
import { GoogleGenAI } from '@google/genai';

export function createBlendinRouter(
  db: TrialQueries,
  ai: GoogleGenAI
): express.Router {
  const router = express.Router();
  const service = new BlendingService(db, ai);
  const analysisLimit = require('express-rate-limit')({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many blending requests. Please try again later.'
  });

  // POST /api/blending/trials
  router.post('/trials', analysisLimit, (req: express.Request, res: express.Response) => {
    try {
      const { name, intent, baseFragrance } = req.body;
      if (!name) return res.status(400).json({ error: 'Trial name required' });

      const trial = {
        id: uuid(),
        userId: 'user-123', // TODO: Extract from session
        name,
        intent: intent || '',
        baseFragrance: baseFragrance || undefined,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      db.createTrial(trial);

      // Create initial draft version
      const version = {
        id: uuid(),
        trialId: trial.id,
        composition: { compounds: [] },
        analysis: {},
        snapshotName: 'Draft',
        isDraft: true,
        createdAt: Date.now()
      };
      db.createVersion(version);

      res.json(trial);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/blending/analyze
  router.post('/analyze', analysisLimit, async (req: express.Request, res: express.Response) => {
    try {
      const { trialId, composition } = req.body;
      if (!composition?.compounds) {
        return res.status(400).json({ error: 'Composition required' });
      }

      const analysis = await service.analyzeComposition(composition.compounds);
      res.json({ analysis });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/blending/guidance
  router.post('/guidance', analysisLimit, async (req: express.Request, res: express.Response) => {
    try {
      const { composition, analysis, type, intent } = req.body;
      if (!composition?.compounds || !analysis) {
        return res.status(400).json({ error: 'Composition and analysis required' });
      }

      const guidance = await service.getGuidance(
        composition.compounds,
        analysis,
        type,
        intent
      );
      res.json(guidance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/blending/versions/{trialId}/save
  router.post('/versions/:trialId/save', analysisLimit, (req: express.Request, res: express.Response) => {
    try {
      const { trialId } = req.params;
      const { composition, analysis, snapshotName } = req.body;

      const version = {
        id: uuid(),
        trialId,
        composition,
        analysis,
        snapshotName: snapshotName || `v${Date.now()}`,
        isDraft: false,
        createdAt: Date.now()
      };

      db.createVersion(version);
      res.json(version);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/blending/trials/{trialId}
  router.get('/trials/:trialId', (req: express.Request, res: express.Response) => {
    try {
      const trial = db.getTrial(req.params.trialId);
      if (!trial) return res.status(404).json({ error: 'Trial not found' });

      const versions = db.getVersions(req.params.trialId);
      res.json({ trial, versions });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/blending/trials
  router.get('/trials', (req: express.Request, res: express.Response) => {
    try {
      const trials = db.getUserTrials('user-123'); // TODO: Extract from session
      res.json({ trials });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE /api/blending/versions/{versionId}
  router.delete('/versions/:versionId', (req: express.Request, res: express.Response) => {
    try {
      db.deleteVersion(req.params.versionId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
```

- [ ] **Step 2: Fix import and add to server.ts**

In `server.ts`, add after imports:

```typescript
import { createBlendinRouter } from './src/server/blending/router';
import { initializeDatabase } from './src/server/db/schema';
import { TrialQueries } from './src/server/db/queries';
import Database from 'better-sqlite3';
```

And in server setup (after creating Express app), add:

```typescript
// Initialize database
const db = new Database(':memory:'); // or use a file: 'aromata.db'
initializeDatabase(db);
const trialQueries = new TrialQueries(db);

// Register blending router
app.use('/api/blending', createBlendinRouter(trialQueries, ai));
```

- [ ] **Step 3: Install better-sqlite3**

Run: `npm install better-sqlite3 && npm install --save-dev @types/better-sqlite3`

- [ ] **Step 4: Verify compiles**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/server/blending/router.ts server.ts
git commit -m "feat: add blending API routes and database integration"
```

---

### Task 6: Add Blending Types to src/types.ts

**Files:**
- Modify: `src/types.ts`

**Steps:**

- [ ] **Step 1: Add blending types**

Append to end of `src/types.ts`:

```typescript
// Blending Studio Types

export interface TrialComposition {
  compounds: Array<{
    name: string;
    percentage: number;
  }>;
}

export interface BlendingTrial {
  id: string;
  userId: string;
  name: string;
  intent: string;
  baseFragrance?: { brand: string; name: string };
  createdAt: number;
  updatedAt: number;
}

export interface BlendingVersion {
  id: string;
  trialId: string;
  composition: TrialComposition;
  analysis: EnhancedAnalysisData;
  snapshotName: string;
  isDraft: boolean;
  createdAt: number;
}

export interface IntentSuggestion {
  compound: string;
  action: 'add' | 'increase' | 'decrease' | 'remove';
  currentPercentage?: number;
  suggestedPercentage?: number;
  reasoning: string;
}

export interface BalanceHint {
  type: 'redundancy' | 'imbalance' | 'missing';
  title: string;
  description: string;
  compounds?: string[];
  suggestion?: string;
}
```

- [ ] **Step 2: Verify compiles**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: add blending studio types"
```

---

### Task 7: Create Composition Editor Component

**Files:**
- Create: `src/components/CompositionEditor.tsx`

**Steps:**

- [ ] **Step 1: Create composition editor**

Create `src/components/CompositionEditor.tsx`:

```typescript
import React, { useState } from 'react';
import { TrialComposition } from '../types';

interface CompositionEditorProps {
  composition: TrialComposition;
  intent: string;
  onCompositionChange: (composition: TrialComposition) => void;
  onIntentChange: (intent: string) => void;
  onAddCompound: () => void;
}

export const CompositionEditor: React.FC<CompositionEditorProps> = ({
  composition,
  intent,
  onCompositionChange,
  onIntentChange,
  onAddCompound
}) => {
  const [newCompound, setNewCompound] = useState('');
  const [newPercentage, setNewPercentage] = useState(5);

  const handleRemoveCompound = (index: number) => {
    const updated = {
      compounds: composition.compounds.filter((_, i) => i !== index)
    };
    onCompositionChange(updated);
  };

  const handleUpdatePercentage = (index: number, percentage: number) => {
    const updated = {
      compounds: composition.compounds.map((c, i) =>
        i === index ? { ...c, percentage: Math.max(0, Math.min(100, percentage)) } : c
      )
    };
    onCompositionChange(updated);
  };

  const handleAddCompound = () => {
    if (!newCompound.trim()) return;
    const updated = {
      compounds: [
        ...composition.compounds,
        { name: newCompound.trim(), percentage: newPercentage }
      ]
    };
    onCompositionChange(updated);
    setNewCompound('');
    setNewPercentage(5);
  };

  const totalPercentage = composition.compounds.reduce((sum, c) => sum + c.percentage, 0);
  const tooMuchWarning = totalPercentage > 100;
  const tooDilute = totalPercentage < 50;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Composition Editor</h3>

        {/* Intent */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Intent (optional)</label>
          <input
            type="text"
            placeholder="e.g., Make more floral, Increase projection..."
            value={intent}
            onChange={(e) => onIntentChange(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        {/* Compound List */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Compounds</label>
            <span className={`text-xs ${tooMuchWarning ? 'text-red-600' : tooDilute ? 'text-yellow-600' : 'text-gray-600'}`}>
              Total: {totalPercentage.toFixed(1)}%
            </span>
          </div>

          {composition.compounds.length === 0 && (
            <p className="text-sm text-gray-500 italic">No compounds yet. Add one below.</p>
          )}

          {composition.compounds.map((compound, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
              <span className="text-sm font-medium text-gray-900 flex-1 min-w-[120px]">
                {compound.name}
              </span>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={compound.percentage}
                  onChange={(e) => handleUpdatePercentage(idx, parseFloat(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={compound.percentage}
                  onChange={(e) => handleUpdatePercentage(idx, parseFloat(e.target.value))}
                  className="w-12 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <span className="text-sm text-gray-600">%</span>
              </div>
              <button
                onClick={() => handleRemoveCompound(idx)}
                className="text-red-600 hover:text-red-900 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {tooMuchWarning && (
          <p className="text-sm text-red-600 mb-3">⚠ Total exceeds 100%. Consider normalizing percentages.</p>
        )}
        {tooDilute && (
          <p className="text-sm text-yellow-600 mb-3">⚠ Total is very dilute (&lt;50%). May lack intensity.</p>
        )}

        {/* Add Compound */}
        <div className="space-y-2 bg-blue-50 p-3 rounded-lg">
          <label className="text-sm font-medium text-gray-700">Add Compound</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Compound name..."
              value={newCompound}
              onChange={(e) => setNewCompound(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={newPercentage}
              onChange={(e) => setNewPercentage(parseFloat(e.target.value))}
              className="w-16 px-2 py-2 border border-gray-300 rounded text-sm"
              placeholder="%"
            />
            <button
              onClick={handleAddCompound}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Verify compiles**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/CompositionEditor.tsx
git commit -m "feat: add CompositionEditor component"
```

---

### Task 8: Create Guidance Panel Component

**Files:**
- Create: `src/components/GuidancePanel.tsx`

**Steps:**

- [ ] **Step 1: Create guidance panel**

Create `src/components/GuidancePanel.tsx`:

```typescript
import React, { useState } from 'react';
import { IntentSuggestion, BalanceHint } from '../types';

interface GuidancePanelProps {
  intent: string;
  suggestions?: IntentSuggestion[];
  hints?: BalanceHint[];
  onApplySuggestion: (suggestion: IntentSuggestion) => void;
  onGetIntentSuggestions: () => void;
  isLoading: boolean;
}

export const GuidancePanel: React.FC<GuidancePanelProps> = ({
  intent,
  suggestions,
  hints,
  onApplySuggestion,
  onGetIntentSuggestions,
  isLoading
}) => {
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);
  const [expandedHint, setExpandedHint] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Guidance Panel</h3>

      {/* Intent-Based Guidance */}
      <div className="bg-indigo-50 p-3 rounded-lg">
        <h4 className="text-sm font-semibold text-indigo-900 mb-2">Intent Guidance</h4>
        <p className="text-xs text-indigo-700 mb-2">
          {intent ? `Intent: "${intent}"` : 'Describe your goal to get suggestions'}
        </p>
        <button
          onClick={onGetIntentSuggestions}
          disabled={!intent || isLoading}
          className="w-full px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Getting Suggestions...' : 'Get Suggestions'}
        </button>

        {suggestions && suggestions.length > 0 && (
          <div className="mt-3 space-y-2">
            {suggestions.map((sug, idx) => (
              <div key={idx} className="bg-white p-2 rounded text-xs">
                <div className="font-medium text-gray-900">
                  {sug.action.charAt(0).toUpperCase() + sug.action.slice(1)} {sug.compound}
                  {sug.suggestedPercentage !== undefined && ` to ${sug.suggestedPercentage}%`}
                </div>
                <div className="text-gray-700 mt-1">{sug.reasoning}</div>
                <button
                  onClick={() => onApplySuggestion(sug)}
                  className="text-indigo-600 hover:text-indigo-900 text-xs font-medium mt-1"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Balance Hints */}
      {hints && hints.length > 0 && (
        <div className="bg-amber-50 p-3 rounded-lg">
          <h4 className="text-sm font-semibold text-amber-900 mb-2">Balance Hints</h4>
          <div className="space-y-2">
            {hints.map((hint, idx) => {
              const isExpanded = expandedHint === `${idx}`;
              return (
                <div key={idx} className="bg-white p-2 rounded text-xs">
                  <button
                    onClick={() => setExpandedHint(isExpanded ? null : `${idx}`)}
                    className="w-full text-left font-medium text-gray-900 flex justify-between items-center"
                  >
                    <span>{hint.title}</span>
                    <span>{isExpanded ? '▼' : '▶'}</span>
                  </button>
                  {isExpanded && (
                    <div className="mt-2 text-gray-700">
                      <p>{hint.description}</p>
                      {hint.suggestion && (
                        <p className="mt-1 text-indigo-600 font-medium">{hint.suggestion}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Verify compiles**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/GuidancePanel.tsx
git commit -m "feat: add GuidancePanel component"
```

---

### Task 9: Create Version Manager Component

**Files:**
- Create: `src/components/VersionManager.tsx`

**Steps:**

- [ ] **Step 1: Create version manager**

Create `src/components/VersionManager.tsx`:

```typescript
import React, { useState } from 'react';
import { BlendingVersion } from '../types';

interface VersionManagerProps {
  versions: BlendingVersion[];
  currentDraftUnsaved: boolean;
  onSaveVersion: (snapshotName: string) => void;
  onRestoreVersion: (versionId: string) => void;
  onCompareVersions: (v1Id: string, v2Id: string) => void;
  onDeleteVersion: (versionId: string) => void;
}

export const VersionManager: React.FC<VersionManagerProps> = ({
  versions,
  currentDraftUnsaved,
  onSaveVersion,
  onRestoreVersion,
  onCompareVersions,
  onDeleteVersion
}) => {
  const [snapshotName, setSnapshotName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string | null>(null);

  const handleSave = () => {
    if (!snapshotName.trim()) return;
    onSaveVersion(snapshotName);
    setSnapshotName('');
    setShowSaveForm(false);
  };

  const handleCompare = (versionId: string) => {
    if (selectedForComparison && selectedForComparison !== versionId) {
      onCompareVersions(selectedForComparison, versionId);
      setSelectedForComparison(null);
    } else {
      setSelectedForComparison(selectedForComparison === versionId ? null : versionId);
    }
  };

  return (
    <div className="border-t pt-4 space-y-3">
      <h4 className="font-semibold text-gray-900">Version Manager</h4>

      {/* Save Button */}
      <div className="flex gap-2">
        {showSaveForm ? (
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Snapshot name (e.g., v6: More Floral)..."
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <button
              onClick={handleSave}
              disabled={!snapshotName.trim()}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 disabled:bg-gray-400"
            >
              Save
            </button>
            <button
              onClick={() => setShowSaveForm(false)}
              className="px-3 py-1 bg-gray-300 text-gray-900 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSaveForm(true)}
            className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
          >
            Save Snapshot
          </button>
        )}
      </div>

      {currentDraftUnsaved && (
        <p className="text-xs text-amber-600">✨ Current draft has unsaved changes</p>
      )}

      {/* Version History */}
      <div className="space-y-2">
        {versions.length === 0 ? (
          <p className="text-xs text-gray-500">No versions yet. Save your first snapshot above.</p>
        ) : (
          versions.map(version => (
            <div
              key={version.id}
              className={`p-2 rounded text-xs border ${
                selectedForComparison === version.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{version.snapshotName}</div>
                  <div className="text-gray-600 text-xs">
                    {new Date(version.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onRestoreVersion(version.id)}
                    className="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handleCompare(version.id)}
                    className={`font-medium ${
                      selectedForComparison === version.id
                        ? 'text-blue-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Compare
                  </button>
                  <button
                    onClick={() => onDeleteVersion(version.id)}
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Verify compiles**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/VersionManager.tsx
git commit -m "feat: add VersionManager component"
```

---

### Task 10: Create Main Blending Studio Component

**Files:**
- Create: `src/components/BlendingStudio.tsx`

**Steps:**

- [ ] **Step 1: Create main Blending Studio container**

Create `src/components/BlendingStudio.tsx`:

```typescript
import React, { useState, useCallback, useEffect } from 'react';
import { TrialComposition, BlendingTrial, BlendingVersion, EnhancedAnalysisData, IntentSuggestion, BalanceHint } from '../types';
import { CompositionEditor } from './CompositionEditor';
import { GuidancePanel } from './GuidancePanel';
import { VersionManager } from './VersionManager';
import { AnalysisView } from './AnalysisView';

interface BlendingStudioProps {
  trial?: BlendingTrial;
  versions?: BlendingVersion[];
}

export const BlendingStudio: React.FC<BlendingStudioProps> = ({ trial, versions = [] }) => {
  const [composition, setComposition] = useState<TrialComposition>({ compounds: [] });
  const [intent, setIntent] = useState('');
  const [analysis, setAnalysis] = useState<EnhancedAnalysisData | null>(null);
  const [suggestions, setSuggestions] = useState<IntentSuggestion[]>([]);
  const [hints, setHints] = useState<BalanceHint[]>([]);
  const [isAnalyzing, isLoading] = useState(false);
  const [unsaved, setUnsaved] = useState(false);

  // Debounced re-analysis
  useEffect(() => {
    const timer = setTimeout(() => {
      if (composition.compounds.length > 0) {
        analyzeComposition();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [composition]);

  const analyzeComposition = async () => {
    isLoading(true);
    try {
      const res = await fetch('/api/blending/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trialId: trial?.id, composition })
      });
      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
        setUnsaved(true);

        // Get balance hints
        if (data.analysis) {
          setHints(getBalanceHints(data.analysis));
        }
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      isLoading(false);
    }
  };

  const getBalanceHints = (analysis: EnhancedAnalysisData): BalanceHint[] => {
    const hints: BalanceHint[] = [];
    // Same logic as server-side
    const redundancy = analysis.formulationEfficiency.redundancyMap;
    for (const item of redundancy) {
      if (item.redundancyScore >= 7) {
        hints.push({
          type: 'redundancy',
          title: `Redundancy: ${item.role}`,
          description: `${item.compounds.join(', ')} serve similar roles.`,
          compounds: item.compounds,
          suggestion: item.suggestion
        });
      }
    }
    return hints;
  };

  const handleGetIntentSuggestions = async () => {
    if (!intent.trim() || !analysis) return;
    isLoading(true);
    try {
      const res = await fetch('/api/blending/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          composition,
          analysis,
          type: 'intent',
          intent
        })
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Guidance failed:', error);
    } finally {
      isLoading(false);
    }
  };

  const handleApplySuggestion = (suggestion: IntentSuggestion) => {
    const updated = { ...composition };

    switch (suggestion.action) {
      case 'add':
        updated.compounds.push({
          name: suggestion.compound,
          percentage: suggestion.suggestedPercentage || 5
        });
        break;
      case 'increase':
      case 'decrease':
        const idx = updated.compounds.findIndex(c => c.name === suggestion.compound);
        if (idx >= 0) {
          updated.compounds[idx].percentage = suggestion.suggestedPercentage || updated.compounds[idx].percentage;
        }
        break;
      case 'remove':
        updated.compounds = updated.compounds.filter(c => c.name !== suggestion.compound);
        break;
    }

    setComposition(updated);
    setSuggestions([]);
  };

  const handleSaveVersion = async (snapshotName: string) => {
    if (!trial || !analysis) return;
    try {
      await fetch(`/api/blending/versions/${trial.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          composition,
          analysis,
          snapshotName
        })
      });
      setUnsaved(false);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Blending Studio</h1>
      {trial && <p className="text-gray-600 mb-6">{trial.name}</p>}

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Composition Editor */}
        <div className="col-span-1 bg-white p-4 rounded-lg border border-gray-200">
          <CompositionEditor
            composition={composition}
            intent={intent}
            onCompositionChange={setComposition}
            onIntentChange={setIntent}
            onAddCompound={() => {}}
          />
        </div>

        {/* Center: Analysis Panel */}
        <div className="col-span-1 bg-white p-4 rounded-lg border border-gray-200">
          {analysis ? (
            <AnalysisView
              analysis={analysis}
              fragranceName="Trial"
              brand="Blending"
            />
          ) : (
            <p className="text-gray-500 text-sm">Add compounds to see analysis...</p>
          )}
        </div>

        {/* Right: Guidance & Versions */}
        <div className="col-span-1 bg-white p-4 rounded-lg border border-gray-200 space-y-6">
          <GuidancePanel
            intent={intent}
            suggestions={suggestions}
            hints={hints}
            onApplySuggestion={handleApplySuggestion}
            onGetIntentSuggestions={handleGetIntentSuggestions}
            isLoading={isAnalyzing}
          />

          {trial && (
            <VersionManager
              versions={versions}
              currentDraftUnsaved={unsaved}
              onSaveVersion={handleSaveVersion}
              onRestoreVersion={() => {}}
              onCompareVersions={() => {}}
              onDeleteVersion={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Verify compiles**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/BlendingStudio.tsx
git commit -m "feat: add BlendingStudio main component"
```

---

### Task 11: Add BlendingStudio to App.tsx

**Files:**
- Modify: `src/App.tsx`

**Steps:**

- [ ] **Step 1: Add BlendingStudio route/section to App.tsx**

In `src/App.tsx`, add import:

```typescript
import { BlendingStudio } from './components/BlendingStudio';
```

And add a route or section for Blending Studio (adjust based on current App structure). For example, if using tabs:

```typescript
// In the App component, add a BlendingStudio tab option
<button
  onClick={() => setActiveTab('blending')}
  className={`px-4 py-2 font-medium ${activeTab === 'blending' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'}`}
>
  Blending Studio
</button>

// And in the render:
{activeTab === 'blending' && <BlendingStudio />}
```

- [ ] **Step 2: Verify compiles**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: integrate BlendingStudio into main app"
```

---

### Task 12: Manual Testing & Build Verification

**Files:**
- Test: All blending components and backend

**Steps:**

- [ ] **Step 1: Build the project**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 2: Start dev server**

Run: `npm run dev`
Expected: Server starts on port 3000

- [ ] **Step 3: Navigate to Blending Studio**

Open browser to `http://localhost:3000` and navigate to Blending Studio tab

- [ ] **Step 4: Test composition editor**

- Add a compound (e.g., "Hedione" at 15%)
- Add another compound (e.g., "Iso E Super" at 12%)
- Adjust percentages using sliders
- Remove a compound
- Set an intent ("Make more floral")

Expected: UI responsive, no console errors

- [ ] **Step 5: Test real-time analysis**

After adding compounds, wait for analysis to load

Expected: Analysis panel shows five layers (if analysis completes)

- [ ] **Step 6: Test guidance**

Click "Get Suggestions" with an intent set

Expected: Suggestions load (or graceful error if Gemini fails)

- [ ] **Step 7: Test version manager**

Save a snapshot with name "v1: Initial"

Expected: Version appears in history, can restore it

- [ ] **Step 8: Commit test results**

```bash
git add .
git commit -m "test: manual testing of blending studio complete"
```

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-05-25-creative-limitation.md`.**

The implementation has 12 main tasks covering:
- **Tasks 1-6**: Backend (database, CRUD, guidance, API routes)
- **Tasks 7-11**: Frontend (composition editor, guidance panel, version manager, main studio, app integration)
- **Task 12**: Manual testing & verification

**Two execution options:**

**1. Subagent-Driven (recommended)** — Dispatch fresh subagent per task, review between tasks, fast iteration
   - Use `superpowers:subagent-driven-development`

**2. Inline Execution** — Execute tasks in this session, batch with checkpoints
   - Use `superpowers:executing-plans`

**Which approach would you prefer?**
