# Aromata — AI-Powered Fragrance Analysis Platform

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-Latest-green) ![License](https://img.shields.io/badge/License-MIT-green)

**Aromata** is a cutting-edge fragrance analysis platform that combines molecular chemistry expertise with AI-powered intelligence. It provides detailed scientific analysis of fragrances at the aromachemical level, including composition breakdown, evaporation profiles, longevity predictions, batch code decoding, fragrance layering compatibility, and aesthetic moodboard generation.

## 🎯 Features

### Core Analysis Engine
- **Molecular Composition Analysis** — Break down fragrances into their aromachemical components with percentages and descriptions
- **Evaporation Profiling** — Detailed hour-by-hour evaporation curves for top, heart, and base layers
- **Longevity Prediction** — Skin and fabric permanence indices with sillage projection curves
- **Olfactory Classification** — Family, accords, thermal tolerance, humidity resilience, and occasion scoring
- **Batch Code Decoding** — Intelligent parsing of commercial batch codes for manufacture date, factory origin, and shelf-life assessment
- **Density Shift Analysis** — Real-time molecular diffusion modeling with dynamic vapor concentration visualization

### Fragrance Dossier (Seven Comprehensive Sections)
The enhanced FragranceDossier displays richly detailed analysis across seven key dimensions:

1. **Artistic Dossier: Scent Story & Concept** — Brand positioning and creative intent
2. **Scent Physics: Molecule Mechanics & Layman's Chemistry** — Accessible explanations of how fragrances work
3. **GC-MS Quantified: Chemical Analysis Breakdown** — Compound count, natural/synthetic ratios, category distribution
4. **Aroma-Chemical Fingerprint (Molecular Matrix)** — Complete compound listing with percentages and descriptions
5. **Volatility & Evaporation Decay Vector Map** — Visual heatmap of evaporation over time
6. **IFRA Material Compliance Matrix** — Restricted chemical analysis with regulatory ceiling gauges
7. **Spatial Sillage Diffusion Simulator** — 2D floor plan heatmap with real-time vapor modeling and active projection

### Advanced Features
- **Fragrance Layering Compatibility** — Deep molecular compatibility analysis between two fragrances with clash detection
- **Quick Layering Advisor** — Fast compatibility assessment with molecular summaries
- **Aesthetic Moodboard Generation** — Vibe and mood assessment with color palettes and tactile metaphors
- **Personal Cabinet Management** — Save and organize favorite fragrances for comparison
- **Specimen Comparison Matrix** — Side-by-side molecular analysis of multiple fragrances

### Compounding Bench (Laboratory-Grade Formula Creation)
The **Compounding Bench** is a professional-grade tool for creating and analyzing custom fragrance formulas with real-time physics simulation and IFRA safety compliance checking:

**Key Capabilities:**
- **Formula Creation** — Combine aromachemicals with precise PPT (parts per thousand) ratios
- **Ingredient Library** — Access 100+ pre-cataloged synthetics, technical isolates, and natural extracts
- **Carrier Selection** — Choose between Ethanol (98%), Dipropylene Glycol (DPG), or Isopropyl Myristate (IPM)
- **Dilution Control** — Adjust fragrance oil to carrier solvent ratio (0-100%) with live recalculation
- **Live Physics Simulation** — Gemini-powered predictions for evaporation curves, skin longevity, and sillage projection
- **Volatility Decay Curves** — Visual hour-by-hour breakdown of top, heart, and base note evaporation
- **IFRA Safety Compliance** — Real-time per-ingredient validation against international safety thresholds
- **Formula Registration** — Save completed formulas to cabinet as full FragranceData objects for layering analysis and comparison

### Education Hub (Professional Learning Platform)
The **Education Hub** provides structured learning and expert resources with a professional dark-theme interface:

#### Learning Paths
- **Three Skill Levels:** Beginner, Intermediate, Advanced
- **Structured Lessons:** 25 total lessons across 8 learning paths
- **Progressive Curriculum:** From fundamentals to expert-level fragrance engineering
- **Interactive Exercises:** Multiple choice, fragrance analysis, composition design, and expert evaluation
- **Checkpoint Questions:** Verify understanding with interactive assessments
- **Real-World Case Studies:** Learn from pre-analyzed fragrances and expert annotations

**Available Paths:**
- **Beginner:** Fragrance Fundamentals, Why Famous Fragrances Work, My First Analysis
- **Intermediate:** Molecular Synthesis & Advanced Chemistry, Comparative Analysis: Building Frameworks
- **Advanced:** Niche Fragrance Engineering & Market Positioning, Expert Sensory Evaluation & Olfactory Judgment

#### Expert Frameworks
- **5 Professional Analytical Frameworks** with methodology guides:
  - Synergy Framework — Understanding molecular interactions
  - Volatility Tiers & Projection Logic — Predicting projection and longevity
  - Accord Drivers Framework — Identifying key compounds
  - Redundancy & Efficiency Analysis — Assessing formulation design
  - Stability & Aging Prediction — Understanding aging trajectories

- **Interactive Examples** with real fragrance case studies
- **Key Insights** highlighting professional evaluation criteria
- **Framework Evaluation Tool** — Apply frameworks to custom compositions

#### Case Studies
- **Real-World Fragrance Analysis** with detailed molecular breakdowns
- **Strategic Context** — Understand brand positioning and market strategy
- **Chemistry Stories** — Learn compound selection and formulation rationale
- **Expert Commentary** — Professional perfumer insights on design decisions
- **Key Lessons** — Takeaways you can apply to your own analysis
- **Variants** — Compare different concentrations and reformulations

**Featured Case Studies:**
- Chanel No. 5 — Iconic aldehydes and prestige positioning
- Dior Sauvage — Mass-market efficiency and ambroxan dominance
- Prada L'Homme — Minimalism and versatility
- Hermès Eau de Gentillesse — Understated luxury and restraint
- Tom Ford Black Orchid — Dark florals and complexity
- Versace Eros — Gourmand formulation and longevity

### Enhanced Fragrance Analysis (Five Dimensions)
The enhanced `/api/analyze` endpoint returns comprehensive analyses across **five key analytical dimensions**:

1. **Synergistic Interactions** — Compound pairs that amplify, diminish, or transform effects
2. **Dominant Accord Mechanics** — Why a fragrance "feels" like what it is
3. **Molecular Diffusion Dynamics** — Volatility hierarchies, evaporation sequences, projection
4. **Stability Predictions** — Oxidation risk, aging trajectory, shelf life
5. **Formulation Efficiency** — Redundancy, density, balance, improvement suggestions

Each analysis includes **pre-answered expert queries** for deep insight without additional API calls.

### Educational Content
- **Layman's Chemistry Explanation** — Accessible descriptions of how fragrances work physically and chemically
- **Historical Timeline** — Chronological fragrance heritage, flanker releases, and corporate milestones
- **Molecular Blueprint Shifts** — How formulations change across concentration levels
- **Strategic Takeaways** — Honest analysis of brand margins, demographic targeting, and regulatory strategies
- **IFRA Compliance Assessment** — Restricted materials analysis and allergen aggregation warnings

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18 or higher ([download](https://nodejs.org/))
- **npm** (included with Node.js) or **yarn**
- **Google Gemini API key** ([get one free](https://ai.google.dev/))

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/aromata.git
cd aromata
```

#### 2. Install Dependencies
```bash
npm install
```

This installs all required packages including:
- React 19, TypeScript, Vite
- Express, Node.js backend dependencies
- Google Gemini SDK (@google/genai)
- Styling (Tailwind CSS 4), icons (Lucide React), animations (Motion)
- Data visualization (Recharts)

#### 3. Set Up Environment Variables
```bash
# Create environment file
cp .env.example .env.local
```

Or manually create `.env.local` in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash
NODE_ENV=development
```

**How to get your Gemini API key:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key
4. Paste it in `.env.local` as shown above

#### 4. Verify Installation
```bash
# Type-check to verify everything is set up correctly
npm run lint
```

If there are no errors, you're ready to develop!

### Development

```bash
# Start dev server with hot reload (port 3000)
npm run dev

# The app will open at: http://localhost:3000
# Changes to files automatically refresh the browser (HMR)

# In another terminal, type-check code (optional, but recommended)
npm run lint

# Build for production
npm run build

# Run production build locally (for testing)
npm run start

# Clean build artifacts
npm run clean
```

### Troubleshooting

**Issue: "GEMINI_API_KEY is required"**
- Check that `.env.local` exists in the project root
- Verify the key is set: `cat .env.local | grep GEMINI_API_KEY`
- Make sure there are no extra spaces or quotes around the key

**Issue: Port 3000 already in use**
- Change the port in `server.ts` or kill the process using port 3000:
  - macOS/Linux: `lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9`
  - Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`

**Issue: Node modules not installing**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules/` and `package-lock.json`: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`

**Issue: TypeScript errors in IDE**
- Make sure TypeScript version matches: `npm list typescript`
- Reload your IDE/editor
- Run `npm run lint` to see detailed errors

## 📋 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | — | Google Gemini API key for AI analysis |
| `GEMINI_MODEL` | No | `gemini-3.5-flash` | Override default Gemini model version |
| `APP_URL` | No | `http://localhost:3000` | Base URL for self-referential links |
| `NODE_ENV` | No | `development` | Environment mode (development/production) |
| `DISABLE_HMR` | No | `false` | Disable Vite hot module reload |

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite (bundler with HMR)
- Tailwind CSS 4 (styling with dark theme)
- Recharts (data visualizations)
- Lucide React (icons)
- Motion (animations)

**Backend:**
- Node.js + Express
- TypeScript
- Google Gemini API (genai SDK v2.4.0)
- Express caching middleware

**Build & Dev:**
- Vite (frontend bundling)
- esbuild (server bundling)
- tsx (TypeScript execution)
- tsc (type checking)

### Project Structure

```
aromata/
├── src/
│   ├── App.tsx                              # Main React component
│   ├── main.tsx                             # React entry point
│   ├── types.ts                             # TypeScript interfaces
│   ├── fragranceUtils.ts                    # Fragrance logic helpers
│   ├── hooks/
│   │   ├── useFragranceState.ts            # Fragrance state management
│   │   └── useAnalysisApi.ts               # API call hook
│   ├── components/
│   │   ├── FragranceDossier.tsx            # Comprehensive fragrance analysis display
│   │   ├── EducationHub.tsx                # Professional education portal
│   │   ├── LearningPathView.tsx            # Interactive lesson viewer
│   │   ├── LearningPathLibrary.tsx         # Learning path collection
│   │   ├── FrameworkHub.tsx                # Expert frameworks collection
│   │   ├── FrameworkDetail.tsx             # Framework details and examples
│   │   ├── CaseStudyLibrary.tsx            # Case study collection
│   │   ├── CaseStudyDetail.tsx             # Individual case study view
│   │   ├── LayeringAnalyzer.tsx            # Fragrance layering compatibility
│   │   ├── FragranceCabinet.tsx            # Personal fragrance library
│   │   ├── BlendingStudio.tsx              # Fragrance blending tool
│   │   ├── CompoundingBench.tsx            # Laboratory formula creation tool
│   │   ├── IngredientDropdown.tsx          # Aromachemical ingredient selector
│   │   ├── SearchInterface.tsx             # Fragrance search and input
│   │   ├── ui/
│   │   │   ├── Button.tsx                  # Reusable button component
│   │   │   └── (other UI components)
│   │   └── (other components)
│   ├── server/
│   │   ├── education/
│   │   │   ├── router.ts                   # Education API routes
│   │   │   ├── service.ts                  # Education business logic
│   │   │   ├── learningPaths.ts            # Learning path content
│   │   │   ├── frameworks.ts               # Framework definitions
│   │   │   ├── caseStudies.ts              # Case study data
│   │   │   ├── types.ts                    # Education types
│   │   │   └── (other education modules)
│   │   ├── blending/
│   │   │   ├── router.ts                   # Blending API routes
│   │   │   ├── service.ts                  # Blending logic
│   │   │   └── (other blending modules)
│   │   ├── cache/
│   │   │   └── analysisCache.ts            # API response caching
│   │   └── (other server modules)
│   └── data/
│       ├── data.ts                         # Predefined fragrances
│       ├── nosesDatabase.ts                # Perfumer names/brands
│       ├── housesDatabase.ts               # Fashion houses
│       ├── nicheDatabase.ts                # Niche brands
│       ├── syntheticsDatabase.ts           # Aromachemical library
│       ├── technicalSyntheticsDatabase.ts  # Technical isolates
│       ├── originDatabase.ts               # Chemical origins/sources
│       └── timelineDatabase.ts             # Historical events
├── server.ts                               # Express backend entry point
├── vite.config.ts                          # Vite configuration
├── tsconfig.json                           # TypeScript configuration
├── tailwind.config.js                      # Tailwind CSS configuration
├── index.html                              # HTML entry point
├── README.md                               # This file
└── package.json
```

## 🔌 API Endpoints

All endpoints return structured JSON responses from Gemini with strong type guarantees.

### Health Check
```
GET /api/health
```
Simple endpoint to verify server is running.

### Fragrance Analysis
```
POST /api/analyze
Content-Type: application/json

{
  "brand": "Chanel",
  "name": "No. 5",
  "batchCode": "3145891222019"  // optional
}
```

Returns complete `FragranceData` object with comprehensive analysis across all dimensions.

### Layering Compatibility (Deep Analysis)
```
POST /api/layering-compatibility
Content-Type: application/json

{
  "fragA": { /* FragranceData */ },
  "fragB": { /* FragranceData */ }
}
```

Returns compatibility analysis including scores, clash detection, and recommendations.

### Layering Advisor (Quick Assessment)
```
POST /api/layering-advisor
Content-Type: application/json

{
  "fragA": { /* FragranceData */ },
  "fragB": { /* FragranceData */ }
}
```

Quick advisory version of compatibility analysis.

### Moodboard Generator
```
POST /api/moodboard-generator
Content-Type: application/json

{
  "brand": "Dior",
  "name": "Sauvage"
}
```

Returns aesthetic assessment with mood, colors, and seasonal associations.

### Compounding Bench Physics Simulation
```
POST /api/physics-simulation
Content-Type: application/json

{
  "ingredients": [
    {"name": "Iso E Super", "ppt": 220, "category": "Woody Backbones", "description": "..."},
    {"name": "Ambroxan", "ppt": 145, "category": "Ambers/Musks", "description": "..."}
  ],
  "carrierType": "ethanol",
  "dilutionRatio": 20,
  "blendName": "My Custom Blend",
  "leadPerfumer": "Artisan Perfumer"
}
```

Returns physics simulation results including:
- **evaporationCurve** — Hour-by-hour volatility decay for top, heart, and base layers
- **longevityHours** — Predicted skin longevity in hours
- **sillageFeetProjection** — Initial sillage projection radius in feet
- **ifraCompliance** — Per-ingredient and overall IFRA safety assessment

## 📚 Education Hub API Endpoints

### Learning Paths
```
GET /api/education/paths
GET /api/education/paths?skillLevel=intermediate
GET /api/education/paths/:pathId
```

Returns learning paths with full lesson content, exercises, and checkpoint questions.

### Expert Frameworks
```
GET /api/education/frameworks
GET /api/education/frameworks/:frameworkId
POST /api/education/evaluate-composition
```

Returns framework definitions, methodologies, and composition evaluation results.

### Case Studies
```
GET /api/education/case-studies
GET /api/education/case-studies?difficulty=beginner
GET /api/education/case-studies/:caseStudyId
```

Returns case study collections and detailed fragrance analysis examples.

### Comparison Tool
```
GET /api/education/compare?frag1={id}&frag2={id}
```

Compares two fragrances across multiple dimensions.

## 📊 Data Structures

### FragranceData
The central data structure representing a fragrance's complete profile.

**Key Properties:**
- **Metadata:** brand, name, concentration, nose (perfumer), releaseYear
- **Chemistry:** aromaChemicalMatrix (compound list), naturalToSyntheticRatio
- **Performance:** evaporationCurve, skinLongevityIndex, sillageProjectionRadiusCurve
- **Classification:** olfactoryFamily, accords, tempRange, humidityTolerance
- **Market:** avgRetailPrice, valueRating, alternatives
- **Analysis:** notes, historicalTimeline, ifraAssessment, densityShiftAnalysis

### AromaChemical
```typescript
{
  name: string           // e.g., "Iso E Super", "Sandalwood Extract"
  percentage: number     // 0-100
  category: string       // 'Ambers/Musks' | 'Woody Backbones' | 'Sweet/Gourmand Anchors' | 'Others'
  description: string    // Sensory and technical properties
}
```

### CompoundingFormula
```typescript
{
  blendName: string                           // User-provided formula name
  leadPerfumer: string                        // Perfumer or creator attribution
  ingredients: IngredientRow[]                // Array of aromachemicals with PPT ratios
  carrierType: 'ethanol' | 'dpg' | 'ipm'    // Solvent selection
  dilutionRatio: number                       // 0-100% fragrance oil concentration
}
```

### IngredientRow
```typescript
{
  id: string             // Unique identifier
  chemicalName: string   // e.g., "Iso E Super"
  category: string       // Chemical category
  ppt: number            // Parts per thousand (0-1000)
  description?: string   // Optional chemical description
}
```

### SimulationResult
```typescript
{
  evaporationCurve: EvaporationPoint[]  // Hour-by-hour volatility breakdown
  longevityHours: number                // Predicted skin longevity
  sillageFeetProjection: number         // Initial sillage radius
}
```

## 🧪 Gemini API Integration

All analysis endpoints use Google Gemini with structured JSON output to guarantee valid, type-safe responses.

### System Prompts
- **Analysis Endpoints** — Model positioned as a "professional research chemist and GC-MS expert" to ensure scientific accuracy over marketing language
- **Compounding Bench** — Model provides "professional fragrance chemist and GC-MS expert" reasoning for physics simulations, evaporation profiles, and IFRA compliance assessments

### Structured JSON Responses
All endpoints enforce structured JSON output via `responseMimeType: 'application/json'` and schema definitions to ensure:
- Type-safe responses matching TypeScript interfaces
- Predictable field availability
- Eliminates response parsing errors

### Caching
Analysis results are cached for 10 minutes to reduce API calls and improve response times. Compounding Bench simulations are computed on-demand (no caching) for formula accuracy.

## 🧑‍💻 Development

### Code Organization
- **React Components:** App.tsx contains main component with state management via custom hooks
- **Type Safety:** Full TypeScript strict mode; tsconfig includes `skipLibCheck`, `moduleDetection: force`
- **Styling:** Tailwind CSS 4 with dark theme design system
- **Imports:** Path alias `@/*` resolves to repository root

### Database Files
Pre-populated constants for:
- Fragrance names and predefined profiles
- Perfumer names and brands (noses)
- Fashion houses
- Niche brands
- Aromachemical libraries and technical isolates
- Chemical origin/sourcing data
- Historical timelines

Used for:
1. Input autocomplete
2. Data enrichment
3. Fallback when API unavailable

### Error Handling
- Server catches Gemini errors and returns structured responses
- Missing API key throws during client initialization
- Network errors are caught and reported to user
- Invalid responses trigger fallback mechanisms

## 📦 Building for Production

```bash
# Build frontend (Vite) and server (esbuild)
npm run build

# Output:
# - dist/             — Frontend static assets
# - dist/server.cjs   — Bundled Node.js server

# Start production server
npm run start
```

The server serves the built frontend as a single-page application and provides API endpoints for analysis requests.

## 🧪 Type Checking

```bash
# Run TypeScript type checker (no emit)
npm run lint

# Errors will be reported for type mismatches, missing properties, etc.
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Maintain TypeScript strict mode compliance
- Follow existing code patterns and conventions
- Add type annotations for all functions
- Run `npm run lint` before submitting PRs

## 📝 License

This project is licensed under the MIT License — see LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini API** — For AI-powered fragrance analysis
- **React 19** — For reactive UI framework
- **Tailwind CSS 4** — For utility-first dark theme styling
- **Recharts** — For beautiful data visualizations
- **Lucide React** — For professional icons
- **The fragrance community** — For inspiring this project

## 📮 Support

For issues, questions, or feature requests, please open an issue on GitHub or contact the maintainers.

## 🔗 Links

- [Google Gemini API Documentation](https://ai.google.dev/)
- [React 19 Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS 4 Documentation](https://tailwindcss.com/)

---

**Built with 🧪 and ✨ for fragrance enthusiasts, chemists, and perfumers.**
