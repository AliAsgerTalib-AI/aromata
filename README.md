# Aromata — AI-Powered Fragrance Analysis Platform

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-Latest-green) ![License](https://img.shields.io/badge/License-MIT-green)

**Aromata** is a cutting-edge fragrance analysis platform that combines molecular chemistry expertise with AI-powered intelligence. It provides detailed scientific analysis of fragrances at the aromachemical level, including composition breakdown, evaporation profiles, longevity predictions, batch code decoding, fragrance layering compatibility, and aesthetic moodboard generation.

## 🎯 Features

### Core Analysis
- **Molecular Composition Analysis** — Break down fragrances into their aromachemical components with percentages and descriptions
- **Evaporation Profiling** — Detailed hour-by-hour evaporation curves for top, heart, and base layers
- **Longevity Prediction** — Skin and fabric permanence indices with sillage projection curves
- **Olfactory Classification** — Family, accords, thermal tolerance, humidity resilience, and occasion scoring
- **Batch Code Decoding** — Intelligent parsing of commercial batch codes for manufacture date, factory origin, and shelf-life assessment

### Advanced Features
- **Fragrance Layering Compatibility** — Deep molecular compatibility analysis between two fragrances with clash detection
- **Quick Layering Advisor** — Fast compatibility assessment with molecular summaries
- **Aesthetic Moodboard Generation** — Vibe and mood assessment with color palettes and tactile metaphors
- **Personal Cabinet Management** — Save and organize favorite fragrances for comparison
- **Specimen Comparison Matrix** — Side-by-side molecular analysis of multiple fragrances

### Enhanced Fragrance Analysis (Five Dimensions)
The enhanced `/api/analyze` endpoint now returns comprehensive analyses across **five key analytical dimensions**:

1. **Synergistic Interactions** — Compound pairs that amplify, diminish, or transform effects
2. **Dominant Accord Mechanics** — Why a fragrance "feels" like what it is
3. **Molecular Diffusion Dynamics** — Volatility hierarchies, evaporation sequences, projection
4. **Stability Predictions** — Oxidation risk, aging trajectory, shelf life
5. **Formulation Efficiency** — Redundancy, density, balance, improvement suggestions

Each analysis includes **pre-answered expert queries** for deep insight without additional API calls:
- Synergies: "Which molecules are synergistic?"
- Accords: "Why does this feel like [accord]?"
- Diffusion: "How does this project on skin?"
- Stability: "How will this age?"
- Efficiency: "Is this over-formulated?"

Results are cached for 10 minutes, and the UI presents a **layered deep-dive** interface where users can expand each analysis dimension and interact with structured queries.

### Educational Content
- **Layman's Chemistry Explanation** — Accessible descriptions of how fragrances work physically and chemically
- **Historical Timeline** — Chronological fragrance heritage, flanker releases, and corporate milestones
- **Molecular Blueprint Shifts** — How formulations change across concentration levels
- **Strategic Takeaways** — Honest analysis of brand margins, demographic targeting, and regulatory strategies
- **IFRA Compliance Assessment** — Restricted materials analysis and allergen aggregation warnings

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/aromata.git
cd aromata

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" >> .env.local
```

### Development

```bash
# Start dev server with hot reload (port 3000)
npm run dev

# Type-check code
npm run lint

# Build for production
npm run build

# Start production server
npm run start

# Clean build artifacts
npm run clean
```

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
- Tailwind CSS 4 (styling)
- Recharts (data visualizations)
- Lucide React (icons)
- Motion (animations)

**Backend:**
- Node.js + Express
- TypeScript
- Google Gemini API (genai SDK v2.4.0)

**Build & Dev:**
- Vite (frontend bundling)
- esbuild (server bundling)
- tsx (TypeScript execution)
- tsc (type checking)

### Project Structure

```
aromata/
├── src/
│   ├── App.tsx                      # Main React component
│   ├── main.tsx                     # React entry point
│   ├── types.ts                     # TypeScript interfaces
│   ├── apiUtils.ts                  # API client utilities
│   ├── fragranceUtils.ts            # Fragrance logic helpers
│   ├── concentrationUtils.ts        # Concentration calculations
│   ├── hooks/
│   │   └── useTemporaryState.ts    # Custom state hook
│   └── databases/
│       ├── data.ts                  # Predefined fragrances
│       ├── nosesDatabase.ts         # Perfumer names/brands
│       ├── housesDatabase.ts        # Fashion houses
│       ├── nicheDatabase.ts         # Niche brands
│       ├── syntheticsDatabase.ts    # Aromachemical library
│       ├── technicalSyntheticsDatabase.ts  # Technical isolates
│       ├── originDatabase.ts        # Chemical origins/sources
│       └── timelineDatabase.ts      # Historical events
├── server.ts                        # Express backend
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── index.html                       # HTML entry point
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

Returns complete `FragranceData` object with:
- Chemical composition matrix
- Evaporation curves
- Performance metrics
- Classification and accords
- Historical timeline
- Batch code parsing (if provided)
- Market intelligence
- Layman's explanations
- IFRA compliance assessment

### Layering Compatibility (Deep Analysis)
```
POST /api/layering-compatibility
Content-Type: application/json

{
  "fragA": { /* FragranceData */ },
  "fragB": { /* FragranceData */ }
}
```

Returns compatibility analysis including:
- Overall compatibility score (0-100)
- Compatibility level (Excellent/Good/Fair/Poor/Clash)
- Base fixative amplification effects
- Top note conflicts
- Optimal application sequence
- Molecular summary

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
  "name": "Sauvage",
  "olfactoryFamily": "Aromatic",
  "accords": [ /* AccordIntensity[] */ ]
}
```

Returns aesthetic assessment with:
- Mood/vibe description
- Color palette
- Tactile metaphors
- Seasonal associations
- Occasion recommendations

## 📊 Data Structures

### FragranceData
The central data structure representing a fragrance's complete profile.

**Key Properties:**
- **Metadata:** brand, name, concentration, nose (perfumer), releaseYear, batchLineage
- **Chemistry:** aromaChemicalMatrix (compound list), naturalToSyntheticRatio
- **Performance:** evaporationCurve, skinLongevityIndex, fabricPermanenceIndex, sillageProjectionRadiusCurve, olfactoryFatigueRisk
- **Classification:** olfactoryFamily, accords, tempRange, humidityTolerance, settingScoring
- **Market:** avgRetailPrice, pricePerMl, valueRating, alternatives
- **Analysis:** notes (top/heart/base), historicalTimeline, laymanChemistryExplanation, story, molecularBlueprintShift, strategicTakeaway, ifraAssessment, parsedBatchCode

### AromaChemical
Represents a single aromachemical compound within a fragrance.

```typescript
{
  name: string           // e.g., "Iso E Super", "Sandalwood Extract"
  percentage: number     // 0-100
  category: string       // 'Ambers/Musks' | 'Woody Backbones' | 'Sweet/Gourmand Anchors' | 'Others'
  description: string    // Sensory and technical properties
}
```

## 🧪 Gemini API Integration

All analysis endpoints use Google Gemini with structured JSON output to guarantee valid, type-safe responses.

### Pattern
1. Define response schema with explicit field types (Object, String, Array, Number, Boolean, Enum)
2. Set `responseMimeType: 'application/json'` to guarantee JSON output
3. Mark required fields in schema
4. Parse response with `JSON.parse(response.text.trim())`

### System Prompt
The model is positioned as a "professional research chemist and GC-MS expert" to ensure scientific accuracy over marketing language, providing unbiased molecular analysis rather than brand narratives.

## 🧑‍💻 Development

### Code Organization
- **React Components:** App.tsx contains main component with state management (no Redux)
- **Type Safety:** Full TypeScript strict mode; tsconfig includes `skipLibCheck`, `moduleDetection: force`
- **Styling:** Tailwind CSS 4 with no CSS modules
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
- **Tailwind CSS** — For utility-first styling
- **Recharts** — For beautiful data visualizations
- **The fragrance community** — For inspiring this project

## 📮 Support

For issues, questions, or feature requests, please open an issue on GitHub or contact the maintainers.

## 🔗 Links

- [Google Gemini API Documentation](https://ai.google.dev/)
- [React 19 Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS 4 Documentation](https://tailwindcss.com/)

---

**Built with 🧪 and ✨ for fragrance enthusiasts and chemists alike.**
