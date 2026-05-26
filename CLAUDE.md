# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Aromata** is an AI-powered fragrance analysis platform that uses Google Gemini API to provide molecular-level analysis of fragrances. It performs scientific analysis including chemical composition, evaporation profiles, longevity predictions, and batch code decoding. The application also supports fragrance layering compatibility analysis and aesthetic moodboard generation.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4, Recharts (visualizations), Lucide React (icons), Motion (animations)
- **Backend**: Node.js, Express, TypeScript
- **Build**: Vite (frontend), esbuild (server bundling), tsx (dev execution)
- **AI**: Google Gemini API (genai SDK v2.4.0)
- **Dev Runtime**: TypeScript type checking with `tsc`, tsx for running .ts files directly

## Architecture

### Backend (server.ts)
Express server serving a Vite-built SPA in production and providing middleware for dev mode. Key endpoints:
- `GET /api/health` — Health check
- `POST /api/analyze` — Main fragrance analysis (structured JSON schema from Gemini)
- `POST /api/layering-advisor` — Quick advisory on combining two fragrances
- `POST /api/layering-compatibility` — Deep molecular compatibility analysis
- `POST /api/moodboard-generator` — Aesthetic/vibe assessment with colors and tactile metaphors

All analysis endpoints use Gemini with structured JSON schemas (`responseMimeType: "application/json"`) to guarantee valid, strongly-typed outputs.

### Frontend (src/)
React app with multiple database files as data sources:
- **App.tsx** — Main component orchestrating UI state and API calls
- **types.ts** — Shared TypeScript interfaces (FragranceData, AromaChemical, etc.)
- **Data files**:
  - `data.ts` — PREDEFINED_FRAGRANCES constant
  - `nosesDatabase.ts` — MASTER_NOSES_DATABASE
  - `housesDatabase.ts` — MASTER_HOUSES_DATABASE
  - `nicheDatabase.ts` — INDEPENDENT_NICHE_DATABASE
  - `syntheticsDatabase.ts` — PERFUME_SYNTHETICS_DATABASE
  - `technicalSyntheticsDatabase.ts` — TECHNICAL_SYNTHETICS_DATABASE
  - `originDatabase.ts` — getDynamicSourceOriginData(), KNOWN_ISOLATES_DATABASE
  - `timelineDatabase.ts` — TIMELINE_DATABASE

### Build System
- **Vite config**: React plugin, Tailwind CSS 4 integration, path alias `@/*`, HMR control via `DISABLE_HMR` env var
- **Production build** (`npm run build`): Vite builds frontend to `dist/`, esbuild bundles server as `dist/server.cjs`
- **Dev mode** (`npm run dev`): Runs `tsx server.ts`, which uses Vite in middleware mode for HMR

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with HMR (runs on port 3000) |
| `npm run build` | Vite build frontend + esbuild bundle server |
| `npm run start` | Run production bundle (`dist/server.cjs`) |
| `npm run clean` | Remove dist/ directory |
| `npm run lint` | Type-check with `tsc --noEmit` |

## Environment Variables

- **GEMINI_API_KEY** (required): Google Gemini API key. Set in `.env.local` or via secrets manager
- **GEMINI_MODEL** (optional): Override default model (defaults to `gemini-3.5-flash`)
- **APP_URL** (optional): For self-referential links and OAuth callbacks
- **NODE_ENV**: Controls production vs. dev mode (vite middleware in dev, static serve in prod)
- **DISABLE_HMR** (optional): Set to `'true'` to disable Vite HMR (used in AI Studio)

## Key Data Structures

### FragranceData (types.ts)
Central interface containing:
- **Metadata**: brand, name, concentration, nose, releaseYear, batchLineage
- **Chemical**: aromaChemicalMatrix (array of AromaChemical), naturalToSyntheticRatio
- **Performance**: evaporationCurve (EvaporationPoint[]), skinLongevityIndex, fabricPermanenceIndex, sillageProjectionRadiusCurve
- **Classification**: olfactoryFamily, accords, tempRange, humidityTolerance, settingScoring
- **Market**: avgRetailPrice, pricePerMl, valueRating, alternatives
- **Analysis**: notes (top/heart/base), historicalTimeline, laymanChemistryExplanation, story, molecularBlueprintShift, strategicTakeaway, ifraAssessment, parsedBatchCode

### AromaChemical
Individual aromachemical compound with:
- name: string
- percentage: number (0-100)
- category: one of 'Ambers/Musks', 'Woody Backbones', 'Sweet/Gourmand Anchors', 'Others'
- description: string

## Gemini API Patterns

All analysis endpoints use Gemini with structured output:
1. Set `responseMimeType: 'application/json'`
2. Define `responseSchema` with `Type.OBJECT`, `Type.STRING`, `Type.ARRAY`, etc. (from @google/genai)
3. Include `required` arrays for mandatory fields
4. Parse response with `JSON.parse(response.text.trim())`

System instructions position the model as "professional research chemist and GC-MS expert" to ensure scientific accuracy over marketing language.

## Development Notes

- **Type safety**: TypeScript strict mode across frontend and backend; tsconfig has `skipLibCheck: true` and `moduleDetection: force`
- **Styling**: Tailwind CSS 4 (via @tailwindcss/vite plugin); no CSS modules
- **Path alias**: `@/*` resolves to repo root for absolute imports
- **Frontend state**: App.tsx manages fetched fragrance data, UI state (tabs, modals, etc.), and API calls; no external state management
- **Error handling**: Server catches Gemini errors and returns structured JSON responses; missing API key throws during client() initialization
- **Static assets**: index.html in root; favicon/manifest configured in Vite

## Databases and Lookup Logic

Database files export constants with pre-populated fragrance metadata (noses, houses, synthetic chemicals, timeline events, etc.). Used to:
1. Autocomplete user input (fragrance names, designer houses, noses)
2. Enrich AI-generated data with verified facts
3. Fall back to known data when API fails or API key is missing (e.g., moodboard generator)

`originDatabase.ts` includes `getDynamicSourceOriginData()` for enriching analyses with origin/source data and `KNOWN_ISOLATES_DATABASE` for chemical compound metadata.
