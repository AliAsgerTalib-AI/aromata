# Serverless Refactoring + Feature Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Compounding/Blending/Education features and convert Express server to Vercel serverless functions, resulting in a 3-tab Dossier/Layering/Cabinet app that runs natively on Vercel without 404 errors.

**Architecture:** Migrate from single Express server (`server.ts`) to Vercel serverless functions (`api/` directory). Each API endpoint becomes an independent function. Shared code (Gemini setup, caching, validation) lives in `src/server/utils.ts`. Frontend (React SPA) built to `dist/` unchanged.

**Tech Stack:** React 19, TypeScript, Vite (frontend), Vercel serverless (backend), Google Gemini API

---

## Phase 1: Feature Removal (Safe Deletion)

### Task 1: Delete Compounding/Blending/Education Components

**Files:**
- Delete: `src/components/CompoundingBench.tsx`
- Delete: `src/components/BlendingStudio.tsx`
- Delete: `src/components/EducationHub.tsx`
- Delete: `src/components/IngredientDropdown.tsx`
- Delete: `src/components/TemplateSelector.tsx`
- Delete: `src/components/ExportImportPanel.tsx`
- Delete: `src/components/CompoundLibrary.tsx`
- Delete: `src/components/HistoryPanel.tsx`

- [ ] **Step 1: Delete component files**

```bash
rm src/components/CompoundingBench.tsx
rm src/components/BlendingStudio.tsx
rm src/components/EducationHub.tsx
rm src/components/IngredientDropdown.tsx
rm src/components/TemplateSelector.tsx
rm src/components/ExportImportPanel.tsx
rm src/components/CompoundLibrary.tsx
rm src/components/HistoryPanel.tsx
```

- [ ] **Step 2: Verify files deleted**

```bash
git status
```

Expected: Shows 8 deleted files

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "refactor: remove Compounding, Blending, Education components"
```

---

### Task 2: Delete Related Hooks, Context, and Utilities

**Files:**
- Delete: `src/context/IngredientContext.tsx`
- Delete: `src/hooks/usePhysicsSimulation.ts`
- Delete: `src/hooks/useFormulaHistory.ts`
- Delete: `src/utils/formulaCache.ts`
- Delete: `src/utils/formulaSerializer.ts`
- Delete: `src/formulaTemplates.ts`

- [ ] **Step 1: Delete utility files**

```bash
rm src/context/IngredientContext.tsx
rm src/hooks/usePhysicsSimulation.ts
rm src/hooks/useFormulaHistory.ts
rm src/utils/formulaCache.ts
rm src/utils/formulaSerializer.ts
rm src/formulaTemplates.ts
```

- [ ] **Step 2: Verify deletion**

```bash
git status
```

Expected: Shows 6 deleted files

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "refactor: remove Compounding-related hooks, context, and utilities"
```

---

### Task 3: Update App.tsx - Remove Tabs and Imports

**Files:**
- Modify: `src/App.tsx:1-30` (imports and state)
- Modify: `src/App.tsx:105-127` (tab navigation)
- Modify: `src/App.tsx:133-194` (conditional renders)

- [ ] **Step 1: Update imports in App.tsx**

Read current file and locate imports (lines 1-20):

```bash
head -20 src/App.tsx
```

Find and replace imports section. Change from:
```typescript
import { CompoundingBench } from './components/CompoundingBench';
import { BlendingStudio } from './components/BlendingStudio';
import { EducationHub } from './components/EducationHub';
import { IngredientProvider } from './context/IngredientContext';
```

To: (remove those 4 lines entirely)

Result: Only imports should be `SearchInterface`, `FragranceDossier`, `LayeringAnalyzer`, `FragranceCabinet`

- [ ] **Step 2: Update activeTab state**

Find line ~30 in App.tsx:
```typescript
const [activeTab, setActiveTab] = useState<'dossier' | 'layering' | 'cabinet' | 'compounding' | 'blending' | 'education'>('dossier');
```

Replace with:
```typescript
const [activeTab, setActiveTab] = useState<'dossier' | 'layering' | 'cabinet'>('dossier');
```

- [ ] **Step 3: Update tab navigation array**

Find the tab array around line 107-114:
```typescript
{[
  { key: 'dossier', label: 'Dossier' },
  { key: 'layering', label: 'Layering' },
  { key: 'cabinet', label: 'Cabinet' },
  { key: 'compounding', label: 'Compounding' },
  { key: 'blending', label: 'Blending' },
  { key: 'education', label: 'Education' }
]}
```

Replace with:
```typescript
{[
  { key: 'dossier', label: 'Dossier' },
  { key: 'layering', label: 'Layering' },
  { key: 'cabinet', label: 'Cabinet' }
]}
```

- [ ] **Step 4: Remove IngredientProvider wrapper**

Find the return statement around line 95:
```typescript
return (
  <IngredientProvider>
    <div className="min-h-screen bg-[#0A0B0E]">
```

Replace with:
```typescript
return (
  <div className="min-h-screen bg-[#0A0B0E]">
```

And find closing tag around line 196:
```typescript
    </div>
  </IngredientProvider>
);
```

Replace with:
```typescript
    </div>
);
```

- [ ] **Step 5: Remove conditional renders for 3 tabs**

Find the main content section around line 182-194:
```typescript
{activeTab === 'compounding' && (
  <CompoundingBench
    availableFragrances={availableFragrances}
    onRegisterFormula={(formula) => {
      fragState.updateCabinet([formula, ...fragState.cabinet]);
      setActiveTab('cabinet');
    }}
  />
)}

{activeTab === 'blending' && <BlendingStudio />}

{activeTab === 'education' && <EducationHub />}
```

Delete these 3 conditional blocks entirely.

- [ ] **Step 6: Verify syntax with type check**

```bash
npm run lint
```

Expected: No errors

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx && git commit -m "refactor: update App.tsx to remove 3 tabs and imports"
```

---

### Task 4: Verify Type Checking Passes

**Files:**
- Check: `tsconfig.json` (no changes needed)

- [ ] **Step 1: Run type check**

```bash
npm run lint
```

Expected output: "No errors"

- [ ] **Step 2: If errors occur, fix them**

If there are errors related to removed imports, they should be caught in Task 3. If not, trace and fix.

- [ ] **Step 3: Commit if fixes needed**

```bash
git add . && git commit -m "fix: resolve TypeScript errors after feature removal"
```

---

## Phase 2: Serverless Migration

### Task 5: Create Shared Server Utilities Module

**Files:**
- Create: `src/server/utils.ts`

This module will contain shared functions used by all API serverless functions.

- [ ] **Step 1: Create src/server/utils.ts**

```typescript
import express from "express";

/**
 * Initialize Gemini client (can be called per request or cached)
 * Since serverless functions are stateless, initialize fresh per request
 */
export function getGeminiClient() {
  const { GoogleGenAI } = require("@google/genai");
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is required. Please set it in Vercel secrets."
    );
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Input sanitization helper
 */
export function sanitizeInput(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\x00-\x1F\x7F]/g, "")
    .trim()
    .substring(0, maxLength);
}

/**
 * Standard API error handler for serverless functions
 */
export function handleApiError(
  res: any,
  error: any,
  context: string
): void {
  const message = error?.message || "Unknown error";
  const statusCode = error?.statusCode || 500;

  console.error(`Error in ${context}:`, message);

  res.status(statusCode).json({
    error: message,
    context,
  });
}

/**
 * CORS headers for serverless functions
 */
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * Apply CORS headers to response
 */
export function applyCorsHeaders(res: any): void {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}
```

- [ ] **Step 2: Verify file created**

```bash
test -f src/server/utils.ts && echo "File created successfully"
```

- [ ] **Step 3: Commit**

```bash
git add src/server/utils.ts && git commit -m "feat: create shared server utilities for serverless functions"
```

---

### Task 6: Create /api/analyze Serverless Function

**Files:**
- Create: `api/analyze.js`

This function handles POST /api/analyze requests (Dossier feature).

- [ ] **Step 1: Create api/analyze.js**

```javascript
import { analysisCache } from "../src/server/cache/analysisCache.js";
import {
  buildFragranceDataPrompt,
  buildFragranceDataSchema,
} from "../src/server/gemini/fragranceDataPrompt.js";
import { PREDEFINED_FRAGRANCES } from "../src/data.js";
import { getGeminiClient, sanitizeInput, handleApiError, applyCorsHeaders } from "../src/server/utils.js";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

export default async (req, res) => {
  // Handle OPTIONS for CORS
  if (req.method === "OPTIONS") {
    applyCorsHeaders(res);
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  applyCorsHeaders(res);

  try {
    const brand = sanitizeInput(req.body?.brand, 200);
    const name = sanitizeInput(req.body?.name, 200);

    if (!name) {
      return res.status(400).json({ error: "Fragrance name is required." });
    }

    // Check cache first
    const cached = analysisCache.get(brand, name);
    if (cached) {
      return res.json({ analysis: cached });
    }

    // Check PREDEFINED_FRAGRANCES (case-insensitive)
    const predefinedFragrance = PREDEFINED_FRAGRANCES.find(
      (f) =>
        f.brand.toLowerCase() === brand.toLowerCase() &&
        f.name.toLowerCase() === name.toLowerCase()
    );

    if (predefinedFragrance) {
      analysisCache.set(brand, name, predefinedFragrance);
      return res.json({ analysis: predefinedFragrance });
    }

    // For unknown fragrances, infer via Gemini
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

    res.json({ analysis: fragranceData });
  } catch (error) {
    if (error.message?.includes("JSON.parse")) {
      return handleApiError(
        res,
        new Error("Analysis returned invalid JSON. Please try again."),
        "fragrance analysis parsing"
      );
    }
    return handleApiError(res, error, "fragrance analysis");
  }
};
```

- [ ] **Step 2: Create api directory if needed**

```bash
mkdir -p api
```

- [ ] **Step 3: Verify file created**

```bash
test -f api/analyze.js && echo "API function created successfully"
```

- [ ] **Step 4: Commit**

```bash
git add api/analyze.js && git commit -m "feat: create /api/analyze serverless function for Dossier"
```

---

### Task 7: Create /api/layering-advisor Serverless Function

**Files:**
- Create: `api/layering-advisor.js`

- [ ] **Step 1: Create api/layering-advisor.js**

```javascript
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
```

- [ ] **Step 2: Verify file created**

```bash
test -f api/layering-advisor.js && echo "API function created successfully"
```

- [ ] **Step 3: Commit**

```bash
git add api/layering-advisor.js && git commit -m "feat: create /api/layering-advisor serverless function"
```

---

### Task 8: Create /api/layering-compatibility Serverless Function

**Files:**
- Create: `api/layering-compatibility.js`

- [ ] **Step 1: Create api/layering-compatibility.js**

```javascript
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
```

- [ ] **Step 2: Verify file created**

```bash
test -f api/layering-compatibility.js && echo "API function created successfully"
```

- [ ] **Step 3: Commit**

```bash
git add api/layering-compatibility.js && git commit -m "feat: create /api/layering-compatibility serverless function"
```

---

### Task 9: Create /api/moodboard-generator Serverless Function

**Files:**
- Create: `api/moodboard-generator.js`

- [ ] **Step 1: Create api/moodboard-generator.js**

```javascript
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
```

- [ ] **Step 2: Verify file created**

```bash
test -f api/moodboard-generator.js && echo "API function created successfully"
```

- [ ] **Step 3: Commit**

```bash
git add api/moodboard-generator.js && git commit -m "feat: create /api/moodboard-generator serverless function"
```

---

### Task 10: Delete or Archive server.ts

**Files:**
- Modify or Delete: `server.ts`

Since we're now using serverless functions, the Express server is no longer needed. You can either delete it or keep it for reference.

- [ ] **Step 1: Delete server.ts**

```bash
rm server.ts
```

OR if you want to keep it for reference, rename it:

```bash
mv server.ts server.ts.bak
```

- [ ] **Step 2: Verify deletion**

```bash
git status
```

Expected: Shows `server.ts` as deleted (or renamed)

- [ ] **Step 3: Commit**

```bash
git add server.ts && git commit -m "refactor: remove Express server.ts (replaced by serverless functions)"
```

---

### Task 11: Update vite.config.ts

**Files:**
- Modify: `vite.config.ts`

Remove the server configuration section since we no longer have a dev server.

- [ ] **Step 1: Read current vite.config.ts**

```bash
cat vite.config.ts
```

- [ ] **Step 2: Remove server configuration**

Find the `server: { ... }` object and remove it. The file should look like:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindPlugin from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindPlugin()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname
    }
  }
})
```

Remove any sections that reference:
- `middleware` mode
- Vite HMR
- `DISABLE_HMR` environment variable
- `createServer` or server config

- [ ] **Step 3: Verify syntax**

```bash
npm run lint
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add vite.config.ts && git commit -m "refactor: remove server configuration from vite.config.ts"
```

---

### Task 12: Update package.json - Remove Dependencies

**Files:**
- Modify: `package.json`

Remove Express, SQLite, and related dependencies.

- [ ] **Step 1: Remove dependencies**

Open `package.json` and remove these from `"dependencies"`:
- `express`
- `helmet`
- `cors`
- `express-rate-limit`
- `better-sqlite3`
- `vite` (dev dependency, keep it)

Also remove from `"devDependencies"`:
- `@types/express`
- `@types/cors`
- `@types/express-rate-limit`
- `@types/better-sqlite3`

Result should look like:

```json
{
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "dotenv": "^17.2.3",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "recharts": "^3.8.1",
    "uuid": "^14.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/uuid": "^10.0.0",
    "autoprefixer": "^10.4.21",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.3"
  }
}
```

- [ ] **Step 2: Update scripts section**

Change scripts to:

```json
"scripts": {
  "build": "vite build",
  "lint": "tsc --noEmit"
}
```

Remove: `dev`, `start`, `clean`

- [ ] **Step 3: Install dependencies**

```bash
npm install
```

This will update `package-lock.json`

- [ ] **Step 4: Verify**

```bash
npm list
```

Expected: Should only show frontend and Gemini dependencies

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json && git commit -m "refactor: remove Express, SQLite, and server dependencies from package.json"
```

---

### Task 13: Add vercel.json Configuration

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create vercel.json**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "NODE_ENV": "production"
  }
}
```

- [ ] **Step 2: Verify file created**

```bash
test -f vercel.json && echo "vercel.json created successfully"
```

- [ ] **Step 3: Commit**

```bash
git add vercel.json && git commit -m "config: add vercel.json for serverless deployment"
```

---

## Phase 3: Verification & Testing

### Task 14: Verify Type Checking

**Files:**
- Check: All TypeScript files

- [ ] **Step 1: Run type check**

```bash
npm run lint
```

Expected: "No errors"

If there are errors:
- Check for any remaining imports of deleted components
- Check for import path issues in api/ functions

- [ ] **Step 2: Fix any errors found**

If errors exist, trace them:
```bash
npm run lint 2>&1 | grep error
```

And fix the files referenced.

- [ ] **Step 3: Commit if fixes needed**

```bash
git add . && git commit -m "fix: resolve TypeScript errors"
```

---

### Task 15: Verify Build Succeeds

**Files:**
- Check: `dist/` output

- [ ] **Step 1: Clean and build**

```bash
rm -rf dist && npm run build
```

Expected: Build completes without errors, creates `dist/` directory

- [ ] **Step 2: Verify output**

```bash
ls -la dist/
```

Expected: Should show `index.html` and `assets/` directory

- [ ] **Step 3: Verify API functions are detected**

```bash
ls -la api/
```

Expected: Should show 4 `.js` files: analyze.js, layering-advisor.js, layering-compatibility.js, moodboard-generator.js

- [ ] **Step 4: If build failed, check errors**

```bash
npm run build 2>&1 | tail -30
```

Debug and fix issues before proceeding.

---

### Task 16: Install Vercel CLI and Test Locally (Optional)

**Files:**
- No files modified

- [ ] **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

- [ ] **Step 2: Run local Vercel dev server**

```bash
vercel dev
```

Expected: Server starts on `http://localhost:3000`

- [ ] **Step 3: Test endpoints locally**

Open new terminal and test:

```bash
# Test Dossier /api/analyze
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"brand": "Dior", "name": "Sauvage"}' 2>/dev/null | jq . | head -20
```

Expected: Returns fragrance analysis JSON (not 404)

```bash
# Test Layering /api/layering-advisor
curl -X POST http://localhost:3000/api/layering-advisor \
  -H "Content-Type: application/json" \
  -d '{"fragA": {"name": "Sauvage"}, "fragB": {"name": "Bleu"}}' 2>/dev/null | jq . | head -20
```

Expected: Returns compatibility analysis JSON

- [ ] **Step 4: Stop local server**

```bash
Ctrl+C
```

---

### Task 17: Final Verification Checklist

**Files:**
- Check: Git log, directory structure

- [ ] **Step 1: Verify all files are clean**

```bash
git status
```

Expected: "nothing to commit, working tree clean"

- [ ] **Step 2: View commit log**

```bash
git log --oneline -10
```

Expected: Shows ~15 commits related to refactoring

- [ ] **Step 3: Verify directory structure**

```bash
find api src -name "*.js" -o -name "*.ts" | grep -E "(api/|server/)" | sort
```

Expected: Shows api/ functions and src/server/ utilities

- [ ] **Step 4: Final type check**

```bash
npm run lint
```

Expected: "No errors"

- [ ] **Step 5: Final build**

```bash
npm run build
```

Expected: "✓ built successfully"

---

### Task 18: Push to GitHub

**Files:**
- No local changes

- [ ] **Step 1: Verify all changes committed**

```bash
git status
```

Expected: "working tree clean"

- [ ] **Step 2: Check remote**

```bash
git remote -v
```

Expected: Shows origin pointing to your GitHub repo

- [ ] **Step 3: Push to main**

```bash
git push origin main
```

Expected: All commits pushed successfully

- [ ] **Step 4: Verify on GitHub**

Open https://github.com/YOUR-USERNAME/aromata and verify:
- Latest commit shows serverless refactoring
- `api/` directory visible
- `server.ts` removed or archived
- `vercel.json` present

- [ ] **Step 5: Deploy to Vercel**

Go to Vercel dashboard:
1. Select your Aromata project
2. It should auto-detect the push and start building
3. Wait for deployment to complete
4. Open the deployed URL (https://aromata-kappa.vercel.app)
5. Test in browser:
   - Go to Dossier tab
   - Enter "Dior" and "Sauvage"
   - Click "Analyze Fragrance"
   - Should see results (not 404)

- [ ] **Step 6: Celebrate! 🎉**

---

## Post-Implementation Verification

**Verify in Vercel deployment:**
- ✅ No 404 errors
- ✅ /api/analyze works
- ✅ Dossier tab fully functional
- ✅ Layering tab fully functional
- ✅ Cabinet tab fully functional
- ✅ All 3 tabs display correctly
- ✅ No console errors
