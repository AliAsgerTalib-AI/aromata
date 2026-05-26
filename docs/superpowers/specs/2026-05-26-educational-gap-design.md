# Educational Gap (Phase 3) Design Specification

## Overview

**Goal:** Build a comprehensive educational system that teaches users to analyze fragrances like master perfumers, using three parallel, independent systems: case study masterclasses, expert frameworks, and guided learning paths.

**Architecture:** Three interconnected learning systems that reuse Phase 1's five-dimensional analysis engine, enabling users to understand both the *why* (through case studies and expert commentary) and the *how* (through frameworks and learning paths).

**Scope:** 
- 10 masterclass fragrances with strategic context and expert narratives
- 5 expert frameworks (one per Phase 1 analysis dimension)
- 9 guided learning paths (3 beginner, 3 intermediate, 3 advanced)
- Comparison tools and interactive exercises
- All systems operate independently but interconnect

---

## Problem Statement

Aromata currently provides powerful analysis (Phase 1: Analytical Blindness) and creative tools (Phase 2: Creative Limitation), but users lack:
1. **Guided learning paths** to progressively build analysis skills
2. **Expert methodologies** explaining *how* to analyze fragrances systematically
3. **Worked examples** (case studies) showing why famous fragrances succeed strategically and chemically
4. **Comparison learning** — understanding fragrances by contrast, not in isolation

Phase 3 closes this gap by creating three independent educational systems that teach analysis skills through real fragrances.

---

## Architecture

### Core Principle: Reuse Phase 1 Analysis

All educational content leverages `/api/analyze` from Phase 1:
- Case studies display full five-dimensional analysis
- Frameworks teach how to *interpret* each analysis dimension
- Learning paths apply frameworks to real cases
- Comparison tools show analysis side-by-side

### Three Independent Systems

**System 1: Case Study Library**
- 10 iconic fragrances with narrative, strategy, chemistry story, expert commentary
- Each case includes full Phase 1 analysis
- Serves as anchor for frameworks and learning paths
- Enables discovery by fragrance, era, or framework focus

**System 2: Expert Frameworks**
- 5 methodologies (one per Phase 1 dimension): Synergy, Volatility Tiers, Accord Drivers, Redundancy, Stability
- Each framework: methodology explanation + interactive example + "try it yourself" tool
- Teaches vocabulary and decision-making of master perfumers
- Referenced throughout learning paths and case studies

**System 3: Learning Paths**
- 9 guided progressions (beginner → intermediate → advanced)
- Each lesson: objective + content + exercise + checkpoint
- Combine case studies + frameworks in structured sequences
- Users can follow paths or skip around (independent navigation)

### Integration Points

- **Case Study View:** Link to relevant frameworks, comparison tool, related learning paths
- **Framework View:** Examples from case studies, "try it" exercises, links to learning paths
- **Learning Path:** Current lesson references frameworks and case studies
- **Comparison Tool:** Works across all systems (case studies, cabinet fragrances, any fragrance)

---

## System 1: Case Study Library

### Masterclass Fragrances (10 total)

1. **Chanel No. 5** — Iconic structure, aldehydes, formulation longevity, reformulation history
2. **Sauvage (Dior)** — Ambroxan dominance, mass-market success, projection mastery, EDT/EDP comparison
3. **L'Homme (Prada)** — Minimalism, versatility, calone + woody balance, modern restraint
4. **Aventus (Creed)** — Synthetic achievement, pineapple note, performance hype vs. reality
5. **Eros (Versace)** — Gourmand density, mint + vanilla + amber layering, longevity strategy
6. **Sel Marin (Heeley)** — Niche naturals, ambrette seed complexity, modern artisanal approach
7. **Gentleman Reserve Privée (Givenchy)** — Reformulation case study, iris + tobacco evolution
8. **Blu Mediterraneo (Acqua di Parma)** — Citrus mastery, top-note projection, simplicity elegance
9. **Black Orchid (Tom Ford)** — Dark floral complexity, accords, base-note drama
10. **Eau de Gentillesse (Hermès)** — Clean simplicity, beginner-friendly, understated excellence

### Case Study Data Structure

```typescript
interface CaseStudy {
  id: string;
  fragrance: {
    brand: string;
    name: string;
    concentration: FragranceConcentration;
    releaseYear: number;
    nose: string;
  };
  
  // Narrative content
  strategicContext: string;  // Why created, market positioning, brand intent
  chemistryStory: string;    // Narrative of composition choices
  expertCommentary: string;  // Master perfumer insights
  
  // Reference analysis
  analysis: EnhancedFragranceAnalysis;  // From Phase 1
  analysisTimestamp: number;
  
  // Learning metadata
  frameworksFeatured: string[];  // Which frameworks this case demonstrates
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  keyLessons: string[];  // What users should learn from this case
  
  // Variants
  variants?: Array<{
    name: string;
    concentration: string;
    analysis: EnhancedFragranceAnalysis;
    differencesFromBase: string;
  }>;
}
```

### Case Study View Components

**Profile Section:**
- Fragrance metadata (brand, nose, release year)
- Concise classification (family, main accords)

**Strategic Context Tab:**
- Why this fragrance was created
- Market positioning at release and today
- Brand strategy (mass-market, niche, flanker, etc.)
- Commercial success or notoriety

**Chemistry Story Tab:**
- Narrative explanation of composition choices
- Key compound roles (why ambroxan matters in Sauvage, why aldehydes matter in No. 5)
- How the nose engineered the desired effect
- Concentration strategy (why EDT vs EDP differ)

**Analysis Tab:**
- Full Phase 1 five-dimensional analysis (reuse AnalysisView component)
- Expandable sections: Synergies, Accords, Diffusion, Stability, Efficiency

**Expert Commentary Tab:**
- Master perfumer perspective on what makes it exceptional
- Market critique (what's brilliant, what's compromised)
- Longevity assessment (has it aged well, been reformulated?)

**Variants Tab (if applicable):**
- Compare EDT vs EDP, or historical reformulations
- Side-by-side analysis of variants

---

## System 2: Expert Frameworks

### Framework 1: Synergy Framework

**Goal:** Teach users to identify which compound pairs amplify, diminish, or transform effects.

**Methodology:**
- Definition: Synergies are molecular interactions where two compounds together create a result greater/less/different than their individual effects
- Key insight: "Iso E Super alone is transparent. Iso E Super + Sandalwood creates warmth. Iso E Super + Citral creates tension."
- Three interaction types: amplification (1+1=3), diminishment (1+1=0.5), transformation (A+B=C)
- How to spot synergies in analysis: Look at "dominant synergies" in Phase 1 data

**Interactive Example:**
- Use Sauvage as example: Ambroxan + Vanilla = longevity boost vs. Ambroxan alone
- Show Sauvage's synergistic interactions data from Phase 1
- Highlight the top 3 synergies and explain why they matter

**Try It Yourself:**
- User selects two compounds from any fragrance in their cabinet or case studies
- Tool returns: interaction type, strength prediction, mechanism explanation
- Powered by Gemini API analyzing the compound pair

---

### Framework 2: Volatility Tiers & Projection Logic

**Goal:** Teach why top/heart/base separation creates longevity and sillage.

**Methodology:**
- Definition: Volatility determines evaporation speed; tiers control projection timing
- Key insight: "High volatility (top) projects immediately, vanishes in 15min. Low volatility (base) projects subtly, lasts 8+ hours."
- Composition strategy: Balance tier percentages (too much top = loud then dies; too little top = no opening)
- How to predict projection: Count compounds in each tier, sum percentages, estimate sillage curve

**Interactive Example:**
- Use L'Homme vs. Sauvage: L'Homme has more heart, projects subtly. Sauvage has high top/base, explosive opening + strong finish.
- Show volatility tiers from Phase 1 analysis
- Show projection prediction curves side-by-side

**Try It Yourself:**
- User adjusts compound percentages in a composition
- Volatility tiers update automatically
- Projected sillage curve updates in real-time (integrated with Phase 2 Blending Studio)

---

### Framework 3: Accord Drivers Framework

**Goal:** Teach how specific compounds *create the vibe* (why it feels floral vs. woody).

**Methodology:**
- Definition: Accord drivers are key compounds that establish the primary olfactory character
- Key insight: "Calone + Galbanum = aquatic freshness. Remove Galbanum = loses green, becomes soapy."
- How accords form: A few compounds define the character; others support or complicate it
- How to identify drivers: Look at "accord drivers" in Phase 1 data; they show which compounds create the primary accord

**Interactive Example:**
- Use Black Orchid: Dark floral = orchid + dark woods + amber. Each driver creates a layer of the vibe.
- Show accord drivers and their roles from Phase 1 analysis
- Explain how removing/changing each driver would alter the character

**Try It Yourself:**
- User selects a target accord (floral, woody, aromatic, etc.)
- Tool suggests which compounds typically drive that accord
- User builds a composition guided by accord drivers
- Integrated with Phase 2 Blending Studio

---

### Framework 4: Redundancy & Efficiency Analysis

**Goal:** Teach how to spot over-formulation and design efficient compositions.

**Methodology:**
- Definition: Redundancy occurs when multiple compounds serve the same role without added benefit
- Key insight: "If three compounds are all woody backbones, you're wasting cost and muddying the smell."
- Efficiency vs. complexity: Some redundancy is intentional (layering), some is waste (poor design)
- How to assess: Look at "redundancy map" and "efficiency score" in Phase 1 data

**Interactive Example:**
- Use Eros: High density, many compounds serving similar roles (multiple vanillas, multiple ambers)
- Is this redundancy artistic or wasteful? Expert commentary explains the intent
- Show redundancy map and efficiency score from Phase 1

**Try It Yourself:**
- User analyzes any fragrance for redundancy
- Tool flags overlapping compounds and suggests tightening
- Shows potential cost savings and olfactory clarity improvement

---

### Framework 5: Stability & Aging Prediction

**Goal:** Teach how fragrances chemically degrade and evolve over time.

**Methodology:**
- Definition: Stability = resistance to oxidation, separation, and chemical breakdown
- Key insight: "Aldehydes oxidize in 6 months; here's what the fragrance will smell like then."
- Aging trajectories: Some fragrances improve (Creed Aventus, oak wood aging), others degrade (citrus top notes oxidize)
- How to predict: Look at "stability predictions" in Phase 1 data; they detail oxidation risk and aging timeline

**Interactive Example:**
- Use Chanel No. 5: Aldehyde-heavy, oxidizes over time (known), but the base intensifies (desired)
- Show oxidation risk, aging timeline, storage recommendations from Phase 1
- Explain why No. 5's reformulations address this

**Try It Yourself:**
- User analyzes any fragrance's stability
- Tool shows oxidation risk, aging projection, storage recommendations
- Integrated with Phase 2 cabinet tools

---

## System 3: Learning Paths

### Path Structure

Each path is a sequence of 4-7 lessons combining frameworks and case studies.

```typescript
interface LearningPath {
  id: string;
  name: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  description: string;
  
  lessons: Array<{
    id: string;
    order: number;
    title: string;
    objective: string;
    framework_covered: string;
    case_studies_used: string[];
    content: string;
    exercise_type: 'multiple_choice' | 'analyze_fragrance' | 'compare_fragrances' | 'predict_composition';
    exercise_details: any;
    checkpoint_questions: string[];
  }>;
  
  estimatedTime: string;  // "45 minutes"
  prerequisites?: string[];
}
```

### Beginner Paths (3 total)

**Path 1: Fragrance Fundamentals**
- Lesson 1: What is fragrance? Concentration, volatility, basic terms
- Lesson 2: The pyramid (top/heart/base) — Structure basics
- Lesson 3: Analyze Eau de Gentillesse — Simple case, identify top/heart/base
- Lesson 4: Intro to Volatility Tiers Framework — Why the pyramid matters
- Lesson 5: Your first analysis — Analyze a simple fragrance using Volatility framework
- Time: 30 min

**Path 2: Why Famous Fragrances Work**
- Lesson 1: Strategic thinking — Why brands create what they do
- Lesson 2: Case study: Sauvage — Mass-market dominance, projection mastery
- Lesson 3: Case study: L'Homme — Minimalism and versatility
- Lesson 4: Case study: Eau de Gentillesse — Simplicity excellence
- Lesson 5: Compare these three — What makes each special?
- Time: 45 min

**Path 3: My First Analysis**
- Lesson 1: The five dimensions — Overview of Phase 1 analysis
- Lesson 2: Analyzing synergies — Which compounds work together?
- Lesson 3: Analyzing accords — Why it feels like X
- Lesson 4: Analyzing diffusion — How long does it last?
- Lesson 5: Analyze a fragrance you own — Apply all dimensions
- Time: 60 min

### Intermediate Paths (3 total)

**Path 4: Mastering Accords**
- Lesson 1: Accord Drivers Framework — How compounds create character
- Lesson 2: Case study: Black Orchid — Dark floral complexity
- Lesson 3: Case study: Eros — Gourmand layering
- Lesson 4: Compare accords — What makes dark floral different from sweet gourmand?
- Lesson 5: Identify drivers — Practice spotting accord drivers in new fragrances
- Time: 50 min

**Path 5: Longevity & Projection**
- Lesson 1: Volatility Tiers Framework deep dive — Advanced tier composition
- Lesson 2: Case study: Sauvage EDT vs EDP — Concentration strategy
- Lesson 3: Case study: Aventus — Projection hype vs. reality
- Lesson 4: Predict projection — Analyze a fragrance's sillage curve
- Lesson 5: Design projection — Use Phase 2 Blending Studio to create a long-lasting fragrance
- Time: 60 min

**Path 6: Spotting Efficiency**
- Lesson 1: Redundancy & Efficiency Framework — Over-formulation detection
- Lesson 2: Case study: Eros — Intentional density vs. waste
- Lesson 3: Case study: Sauvage — Efficient minimalism
- Lesson 4: Analyze three fragrances — Spot redundancy, assess efficiency
- Lesson 5: Improve a fragrance — Redesign using efficiency insights
- Time: 45 min

### Advanced Paths (3 total)

**Path 7: The Master's Toolkit**
- Lesson 1: All five frameworks integrated — Synergy, Accords, Volatility, Redundancy, Stability
- Lesson 2: Case study: Aventus — Complex synthetic achievement
- Lesson 3: Case study: Blu Mediterraneo — Citrus mastery
- Lesson 4: Deep analysis — Apply all frameworks to a complex fragrance
- Lesson 5: Master assessment — Comprehensive analysis of your choice
- Time: 90 min

**Path 8: Reformulation & Evolution**
- Lesson 1: Understanding reformulations — Why and how fragrances change
- Lesson 2: Case study: Gentleman Reserve Privée — Iris + tobacco evolution
- Lesson 3: Case study: Chanel No. 5 — Aldehyde adaptations over decades
- Lesson 4: Predict reformulation — What would you change in a fragrance?
- Lesson 5: Design a reformulation — Improve a classic using your frameworks
- Time: 75 min

**Path 9: Designing Your Own Blend**
- Lesson 1: From analysis to creation — Reverse-engineering fragrances
- Lesson 2: Intent-to-composition — How to translate a creative vision to compounds
- Lesson 3: Case studies as templates — Learn from Sauvage, Eros, Black Orchid
- Lesson 4: Blending Studio integration — Create a composition
- Lesson 5: Analyze your creation — Self-critique using all frameworks
- Time: 120 min

---

## System 3: Comparison & Discovery Tools

### Comparison Tool

**Functionality:**
- Select any two fragrances (case studies or user's cabinet)
- View side-by-side analysis across all Phase 1 dimensions
- Highlight key differences (e.g., "Sauvage projects 3x more in first hour")
- Explain differences using frameworks (e.g., "Sauvage has more top-note volatility")

**Usage:**
- Learning path: "Compare L'Homme vs. Sauvage — What's the difference?"
- Case study: "Compare Sauvage EDT vs. EDP variants"
- Independent: User selects any two fragrances

**Data:**
- Queries Phase 1 analysis for both fragrances
- Computes key differences automatically
- Returns structured comparison highlighting major distinctions

### Framework Reference Tool

**Functionality:**
- Quick-access guide to all 5 frameworks from anywhere in app
- Each framework: methodology + key insight + interactive example + "try it yourself" link

**Usage:**
- While analyzing a fragrance, click framework chip to learn methodology
- Links back to case studies demonstrating that framework
- Links to learning paths using that framework

### Case Study Discovery

**Browsing Options:**
- By category: Iconic, Niche, Modern, Reformulated, Minimalist, Dense
- By framework focus: "Fragrances that teach volatility tiers"
- By difficulty: Beginner-friendly cases, advanced cases
- By era: Classic, modern, contemporary releases

**Related Cases:**
- "Similar to this fragrance" — Show cases with comparable analysis profiles
- "Learn this framework via" — Cases that exemplify a framework

---

## Data Structures

### Core Interfaces

```typescript
// Case Study (see System 1 above)
interface CaseStudy { ... }

// Framework
interface Framework {
  id: string;
  name: string;  // "Synergy Framework", etc.
  phase1Dimension: 'synergistic_interactions' | 'dominant_accord_mechanics' | 'molecular_diffusion_dynamics' | 'stability_predictions' | 'formulation_efficiency';
  methodology: string;  // Description of the framework
  keyInsight: string;
  interactiveExample: {
    caseStudyId: string;
    explanation: string;
  };
  relatedCaseStudies: string[];  // IDs of cases demonstrating this framework
}

// Learning Path (see System 3 above)
interface LearningPath { ... }

// Lesson (within LearningPath)
interface Lesson {
  id: string;
  order: number;
  title: string;
  objective: string;
  framework: string;  // Framework ID covered in this lesson
  caseStudies: string[];  // Case study IDs referenced
  content: string;  // Lesson text/explanation
  exercise: Exercise;
  checkpoints: string[];  // Checkpoint questions
}

// Exercise
type Exercise = 
  | { type: 'multiple_choice'; options: string[]; correct: number; explanation: string }
  | { type: 'analyze_fragrance'; fragranceId?: string; instructions: string }
  | { type: 'compare_fragrances'; frag1Id?: string; frag2Id?: string; instructions: string }
  | { type: 'predict_composition'; targetAccord: string; instructions: string };
```

---

## API Endpoints

### Case Studies
- `GET /api/education/case-studies` — List all case studies with summary
- `GET /api/education/case-studies/{id}` — Full case study with analysis and commentary
- `GET /api/education/case-studies?framework={frameworkId}` — Filter by framework
- `GET /api/education/case-studies?difficulty={level}` — Filter by difficulty

### Frameworks
- `GET /api/education/frameworks` — List all 5 frameworks
- `GET /api/education/frameworks/{id}` — Full framework with examples and related cases

### Learning Paths
- `GET /api/education/paths` — List all paths with progress (requires session)
- `GET /api/education/paths/{id}` — Full path with all lessons
- `GET /api/education/paths?skillLevel={level}` — Filter by difficulty
- `POST /api/education/paths/{pathId}/lessons/{lessonId}/checkpoint` — Submit checkpoint answers
- `GET /api/education/paths/{pathId}/progress` — User's progress in path

### Comparison & Discovery
- `GET /api/education/compare?frag1={id}&frag2={id}` — Side-by-side analysis comparison
- `GET /api/education/discovery/similar?caseStudyId={id}` — Related case studies
- `GET /api/education/discovery/by-framework?frameworkId={id}` — Cases teaching a framework

---

## Frontend Components

### New Components

**CaseStudyLibrary.tsx**
- Case study grid/list with discovery filters
- Rendering of case study profile, strategic context, chemistry story, analysis, commentary

**CaseStudyDetail.tsx**
- Full case study view with tabs (profile, context, story, analysis, commentary, variants)
- Reuses Phase 1's AnalysisView for analysis tab
- Comparison button linking to comparison tool

**FrameworkHub.tsx**
- Framework grid with quick access to each framework
- Each framework card links to full framework view

**FrameworkDetail.tsx**
- Methodology explanation, key insight, interactive example
- "Try it yourself" tool for applying framework
- Related case studies and learning paths

**LearningPathLibrary.tsx**
- Path grid filtered by skill level
- Progress bars for in-progress paths
- Difficulty indicators

**LearningPathView.tsx**
- Current lesson display with objective, content, exercise
- Checkpoint questions before advancing
- Links to referenced frameworks and case studies
- Progress sidebar

**ComparisonTool.tsx**
- Side-by-side fragrance analysis
- Highlights key differences using frameworks
- Selectable fragrances (cases or cabinet)

**EducationHub.tsx** (Main container)
- Tab-based navigation: Case Studies | Frameworks | Learning Paths
- Unified discovery and search across all systems

### Reused Components
- `AnalysisView.tsx` (from Phase 1) — Display full analysis in case studies and comparisons
- `FragranceSearchInput` — Search fragrances
- `TabNav` — Top-level navigation

---

## Implementation Approach

### Phase 3 Scope

**Backend:**
- Create 10 case studies with manually-written strategic context, chemistry story, expert commentary
- Run `/api/analyze` for each case study fragrance, cache results
- Implement 5 framework definitions with examples and interactive tools
- Define 9 learning paths with lesson sequences and exercises
- Build API endpoints (case studies, frameworks, paths, comparison, discovery)

**Frontend:**
- CaseStudyLibrary, CaseStudyDetail components
- FrameworkHub, FrameworkDetail components
- LearningPathLibrary, LearningPathView components
- ComparisonTool component
- EducationHub main container (tabs + search + discovery)
- Integrate with Phase 2 Blending Studio for design exercises

### Success Criteria

1. Users can browse and read all 10 case studies with full context and analysis
2. Users can access all 5 frameworks and understand the methodology
3. Users can follow any learning path from start to finish, completing checkpoints
4. Users can compare any two fragrances side-by-side using comparison tool
5. Case studies, frameworks, and learning paths are discoverable and interconnected
6. Framework exercises integrate with Phase 2 Blending Studio (e.g., "design using accord drivers")
7. Users report improved ability to analyze fragrances independently (via post-path reflection)

---

## Success Metrics

- **Engagement:** Users complete at least one learning path within first session
- **Comprehension:** Checkpoint quiz success rate > 70%
- **Application:** Users use comparison tool and framework tools multiple times per session
- **Retention:** Case studies and frameworks are bookmarked/referenced by returning users
- **Independence:** Users analyze their own fragrances using taught frameworks

---

## Technical Notes

- **Reuse Phase 1 Analysis:** All case study analyses are cached results from `/api/analyze`; no new analysis required
- **Framework Interactivity:** Gemini API powers "try it yourself" exercises (user selects compounds → API analyzes interaction)
- **Learning Path Persistence:** Track user progress in paths (lessons completed, checkpoints passed) using session/user ID
- **Comparison Efficiency:** Leverage existing Phase 1 analysis cache; comparison tool queries and formats cached data
- **Integration with Phase 2:** Blending Studio exercises reference learning paths; path exercises can save compositions to trials

---

## Future Extensions (Out of Scope)

- Video/audio narration of case studies
- Peer analysis sharing (users analyze fragrances, share with community)
- Expert Q&A tied to case studies
- Certification upon completing advanced paths
- Personalized path recommendations based on learning style
