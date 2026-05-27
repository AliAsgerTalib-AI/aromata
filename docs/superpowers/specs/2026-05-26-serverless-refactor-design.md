# Design: Serverless Refactoring + Feature Removal

**Date:** 2026-05-26  
**Status:** Design Approved  
**Scope:** Remove Compounding/Blending/Education tabs + convert to Vercel serverless

---

## Executive Summary

Aromata is being refactored to:
1. **Remove 3 features:** Compounding, Blending, Education tabs (and all related code)
2. **Convert to serverless:** Replace Express server with Vercel serverless functions
3. **Result:** Lean 3-tab app (Dossier, Layering, Cabinet) that runs natively on Vercel

---

## Current State → Target State

### Current Architecture
- **Backend:** Single `server.ts` Express server handling all routes
- **Frontend:** Vite-built React SPA served from `dist/`
- **Deployment:** Fails on Vercel (custom server not supported)
- **Features:** 6 tabs (Dossier, Layering, Cabinet, Compounding, Blending, Education)

### Target Architecture
- **Backend:** 4 serverless functions in `api/` directory
- **Frontend:** Same Vite-built React SPA, static files only
- **Deployment:** Native Vercel support (no config hacks needed)
- **Features:** 3 tabs (Dossier, Layering, Cabinet)
- **Dependencies:** Remove Express, SQLite, unused packages

---

## Detailed Changes

### 1. Frontend: App.tsx Refactoring

**Current state:**
```typescript
const [activeTab, setActiveTab] = useState<
  'dossier' | 'layering' | 'cabinet' | 'compounding' | 'blending' | 'education'
>('dossier');
```

**Target state:**
```typescript
const [activeTab, setActiveTab] = useState<'dossier' | 'layering' | 'cabinet'>('dossier');
```

**Changes:**
- Remove imports: `CompoundingBench`, `BlendingStudio`, `EducationHub`
- Remove `IngredientProvider` wrapper (only used by Compounding)
- Simplify tab navigation to 3 buttons
- Remove conditional renders for 3 removed tabs
- Keep all code for Dossier, Layering, Cabinet (zero changes)

**Files to delete:**
```
src/components/CompoundingBench.tsx
src/components/BlendingStudio.tsx
src/components/EducationHub.tsx
src/components/IngredientDropdown.tsx
src/components/TemplateSelector.tsx
src/components/ExportImportPanel.tsx
src/components/CompoundLibrary.tsx
src/components/HistoryPanel.tsx
src/components/ChartContainer.tsx (if Compounding-only)
src/context/IngredientContext.tsx
src/hooks/usePhysicsSimulation.ts
src/hooks/useFormulaHistory.ts
src/utils/formulaCache.ts
src/utils/formulaSerializer.ts
src/formulaTemplates.ts
```

### 2. Backend: Server.ts → Serverless Functions

**New directory structure:**
```
api/
├── analyze.js
├── layering-advisor.js
├── layering-compatibility.js
└── moodboard-generator.js
```

**Each function pattern:**
```javascript
export default async (req, res) => {
  // 1. Validate input
  // 2. Check cache
  // 3. Call Gemini
  // 4. Return JSON
}
```

**Shared code in `src/server/`:**
- `src/server/gemini/` - Prompt builders, schemas
- `src/server/cache/` - Cache implementations
- `src/server/types/` - TypeScript types
- `src/server/utils.ts` - Sanitization, error handling

**Removed from server.ts:**
- Express app initialization
- All route definitions
- Vite middleware setup
- Database initialization
- Better-sqlite3 imports
- Blending/Education routers

**New server.ts** (if keeping for local dev):
- Can optionally keep a local dev server using the API functions
- Or remove entirely (use `vercel dev` for local testing)

### 3. Vercel Configuration

**Add `vercel.json`:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

**API function requirements:**
- Each function in `api/` is automatically a route: `api/analyze.js` → `/api/analyze`
- Vercel auto-detects `.js` and `.ts` files in `api/`
- Functions receive `(req, res)` parameters
- Max execution time: 60 seconds (sufficient for Gemini calls)

### 4. Dependencies

**Remove from package.json:**
```json
"express": "^4.21.2",
"helmet": "^8.2.0",
"cors": "^2.8.6",
"express-rate-limit": "^8.5.2",
"better-sqlite3": "^12.10.0"
```

**Keep:**
```json
"@google/genai": "^2.4.0",
"dotenv": "^17.2.3",
"react": "^19.0.1",
"react-dom": "^19.0.1",
"vite": "^6.2.3",
... (other frontend deps)
```

**Remove scripts:**
- `"dev"` (no local server)
- Keep `"build"`, `"lint"`, `"start"` (for Vercel)

### 5. Environment Variables

**No changes needed** - Vercel will use `GEMINI_API_KEY` as-is

---

## Implementation Sequence

### Phase 1: Feature Removal (Safe to do first)
1. Delete Compounding/Blending/Education components
2. Update App.tsx (remove 3 tabs and imports)
3. Delete utilities (formulas, templates, ingredient context)
4. Verify type checking passes

### Phase 2: Serverless Migration
1. Create `api/` directory structure
2. Extract routes into individual functions
3. Create shared utility module in `src/server/`
4. Update vite.config.ts (remove server config)
5. Update package.json (remove dependencies, scripts)

### Phase 3: Verification
1. Run `npm run lint` (TypeScript check)
2. Run `npm run build` (Vite + API functions)
3. Test locally with Vercel CLI: `vercel dev`
4. Test each endpoint: Dossier analyze, Layering, Moodboard

### Phase 4: Deployment
1. Push to GitHub
2. Vercel auto-deploys (no additional config needed)
3. Verify /api/analyze returns 200 (not 404)

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Removing shared code used elsewhere | Verified via grep - no cross-contamination |
| Breaking Dossier/Layering/Cabinet | No changes to those components; type check ensures safety |
| API responses change | Serverless functions return identical JSON structure |
| Cold start latency | Vercel functions typically <500ms; acceptable for UI |
| Environment variables missing | Vercel UI to set GEMINI_API_KEY before deploy |

---

## Testing Strategy

**Pre-deployment:**
1. ✅ Type check: `npm run lint` (catches import errors)
2. ✅ Build: `npm run build` (Vite + esbuild for functions)
3. ✅ Local test: `vercel dev` → curl endpoints
4. ✅ Manual test: Open app in browser, test 3 tabs

**Post-deployment:**
1. ✅ Dossier: Enter fragrance name → Analyze → Should return data
2. ✅ Layering: Select two fragrances → Analyze → Should return compatibility
3. ✅ Cabinet: Should display any saved fragrances

---

## Success Criteria

- ✅ App runs on Vercel without 404 errors
- ✅ /api/analyze returns 200 (not 404)
- ✅ Dossier, Layering, Cabinet fully functional
- ✅ No TypeScript errors
- ✅ Reduced bundle size (removed Express, SQLite)
- ✅ Cleaner codebase (removed 3 unused features)

---

## Notes

- **Database:** Blending used in-memory SQLite; safe to remove (not used elsewhere)
- **Rate limiting:** Vercel has built-in rate limiting; no need for express-rate-limit
- **CORS:** Handled automatically by Vercel (same origin only)
- **Caching:** Keep analysisCache (used by Dossier)
- **Local dev:** After refactoring, use `vercel dev` instead of `npm run dev`
