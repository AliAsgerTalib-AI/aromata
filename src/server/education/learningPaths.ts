import { LearningPath } from './types';

export const LEARNING_PATHS: Record<string, LearningPath> = {
  'fragrance-fundamentals': {
    id: 'fragrance-fundamentals',
    name: 'Fragrance Fundamentals',
    skillLevel: 'beginner',
    topic: 'Core Concepts',
    description: 'Learn the basics: concentration levels, the fragrance pyramid (top/heart/base), and how volatility creates longevity.',
    lessons: [
      {
        id: 'fund-1',
        order: 1,
        title: 'What is Fragrance? Concentration & Volatility',
        objective: 'Understand concentration types and why volatility matters',
        framework: 'volatility-tiers-framework',
        caseStudies: [],
        content: 'Fragrance concentration determines strength and longevity. Eau de Toilette (EDT) is 5-10% fragrance oils; Eau de Parfum (EDP) is 15-20%. Higher concentration means longer lasting. Volatility is the speed of evaporation. High-volatility compounds evaporate fast (top notes). Low-volatility compounds evaporate slowly (base notes).',
        exercise: {
          type: 'multiple_choice',
          instructions: 'Which statement is true?',
          targetAccord: 'Which fragrance concentration lasts longest?'
        },
        checkpointQuestions: ['What is the typical concentration range for EDP?', 'Why do base notes last longer than top notes?']
      },
      {
        id: 'fund-2',
        order: 2,
        title: 'The Fragrance Pyramid: Structure Basics',
        objective: 'Understand the top/heart/base structure and its purpose',
        framework: 'volatility-tiers-framework',
        caseStudies: [],
        content: 'The fragrance pyramid organizes compounds by volatility. Top notes (first 5-15 minutes): bright, volatile, set expectations. Heart notes (15 minutes to 4 hours): develop character, less volatile. Base notes (4+ hours): anchor, persist, often woody/amber/musky. This structure creates development and evolution—the fragrance changes as you wear it.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Identify top, heart, and base notes in a simple fragrance.',
          fragranceId: 'eau-de-gentillesse-hermes'
        },
        checkpointQuestions: ['Name three typical top-note compounds.', 'Why is base-note persistence important?']
      },
      {
        id: 'fund-3',
        order: 3,
        title: 'Case Study: Eau de Gentillesse—Simple Elegance',
        objective: 'Apply structure concepts to a real fragrance',
        framework: 'volatility-tiers-framework',
        caseStudies: ['eau-de-gentillesse-hermes'],
        content: 'Eau de Gentillesse is deliberately simple. Opens with soft florals (top), transitions to clean notes (heart), closes on minimal musk and wood (base). The simplicity teaches: you don\'t need many compounds to be beautiful. Gentillesse shows that fragrance is about presence, not loudness.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Identify the pyramid structure in Eau de Gentillesse.',
          fragranceId: 'eau-de-gentillesse-hermes'
        },
        checkpointQuestions: ['What is the primary character of Gentillesse?', 'Why is its simplicity considered refined?']
      },
      {
        id: 'fund-4',
        order: 4,
        title: 'Framework: Volatility Tiers',
        objective: 'Learn how to predict projection and longevity',
        framework: 'volatility-tiers-framework',
        caseStudies: [],
        content: 'The Volatility Tiers Framework teaches you to predict a fragrance\'s projection and longevity by looking at compound distribution across tiers. High-volatility tier = loud opening, fast fade. Low-volatility tier = subtle opening, lasting finish. Balanced tiers = evolutionary development.',
        exercise: {
          type: 'multiple_choice',
          instructions: 'Which tier composition creates the strongest lasting power?'
        },
        checkpointQuestions: ['What tier determines initial projection?', 'How do you assess longevity?']
      },
      {
        id: 'fund-5',
        order: 5,
        title: 'Your First Analysis',
        objective: 'Apply pyramid and volatility concepts to analyze a fragrance',
        framework: 'volatility-tiers-framework',
        caseStudies: ['eau-de-gentillesse-hermes'],
        content: 'Now apply what you\'ve learned. Choose a fragrance you own or know. Identify its top, heart, and base notes. Estimate the volatility tiers. Predict projection and longevity based on tier distribution.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Analyze a fragrance of your choice using the pyramid and tiers framework.'
        },
        checkpointQuestions: ['Did you correctly identify the notes?', 'Was your longevity prediction accurate?']
      }
    ],
    estimatedTime: '30 minutes'
  },

  'famous-fragrances-work': {
    id: 'famous-fragrances-work',
    name: 'Why Famous Fragrances Work',
    skillLevel: 'beginner',
    topic: 'Case Studies',
    description: 'Explore three iconic fragrances and understand why they succeed strategically and chemically.',
    lessons: [
      {
        id: 'ffw-1',
        order: 1,
        title: 'Strategic Thinking: Why Brands Create What They Do',
        objective: 'Understand market positioning and brand strategy',
        framework: '',
        caseStudies: [],
        content: 'Fragrances are not created in isolation. Brands create fragrances to fill market gaps, target demographics, or create status symbols. Chanel No. 5 created the "prestige luxury fragrance" category. Sauvage dominates mass market. L\'Homme targets minimalists. Understanding strategy helps explain composition choices.',
        exercise: {
          type: 'multiple_choice',
          instructions: 'What market gap did Sauvage fill?'
        },
        checkpointQuestions: ['How does market positioning affect composition?']
      },
      {
        id: 'ffw-2',
        order: 2,
        title: 'Case Study: Sauvage—Mass-Market Dominance',
        objective: 'Understand Sauvage\'s strategic and chemical success',
        framework: 'volatility-tiers-framework',
        caseStudies: ['sauvage-dior'],
        content: 'Sauvage (2015) dominates mass-market fragrance sales globally. Strategy: create a powerful, versatile fragrance for broad appeal. Chemistry: ambroxan-dominant (20% of composition) creates warmth, longevity, and a subtle sweetness. Few compounds doing much work. Efficient, effective.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Analyze Sauvage\'s composition and explain its market success.',
          fragranceId: 'sauvage-dior'
        },
        checkpointQuestions: ['What is Sauvage\'s primary compound?', 'Why is efficiency important for mass market?']
      },
      {
        id: 'ffw-3',
        order: 3,
        title: 'Case Study: L\'Homme—Minimalism & Versatility',
        objective: 'Understand minimalism as a market strategy',
        framework: 'redundancy-efficiency-framework',
        caseStudies: ['lhomme-prada'],
        content: 'L\'Homme (2016) succeeds through intentional minimalism. Strategy: create a fragrance that works in business and casual contexts equally. Chemistry: few compounds, clear structure, generous white space. L\'Homme proves that simplicity is not laziness; it\'s wisdom.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Compare Sauvage and L\'Homme. What\'s different?',
          frag1Id: 'sauvage-dior',
          frag2Id: 'lhomme-prada'
        },
        checkpointQuestions: ['Which is simpler? Why?', 'How does minimalism enable versatility?']
      },
      {
        id: 'ffw-4',
        order: 4,
        title: 'Case Study: Eau de Gentillesse—Understated Excellence',
        objective: 'Understand refinement through restraint',
        framework: '',
        caseStudies: ['eau-de-gentillesse-hermes'],
        content: 'Eau de Gentillesse embodies Hermès values: understated luxury, refinement, restraint. The fragrance is deliberately subtle—a skin scent, almost invisible. Yet it succeeds because subtlety is intentional and executed perfectly.',
        exercise: {
          type: 'compare_fragrances',
          instructions: 'Compare all three fragrances: Sauvage, L\'Homme, Gentillesse. What\'s different?',
          frag1Id: 'sauvage-dior',
          frag2Id: 'lhomme-prada'
        },
        checkpointQuestions: ['Which projects most?', 'Which is most refined?', 'When would you wear each?']
      },
      {
        id: 'ffw-5',
        order: 5,
        title: 'Reflect & Compare',
        objective: 'Synthesize learning from three case studies',
        framework: '',
        caseStudies: ['sauvage-dior', 'lhomme-prada', 'eau-de-gentillesse-hermes'],
        content: 'Sauvage, L\'Homme, and Gentillesse represent three successful strategies: mass-market dominance, balanced versatility, and understated luxury. Each succeeded because its chemistry aligned with its market positioning.',
        exercise: {
          type: 'multiple_choice',
          instructions: 'Which fragrance is most appropriate for business contexts?'
        },
        checkpointQuestions: ['Can you articulate each fragrance\'s market position?', 'Can you explain the chemistry that supports each position?']
      }
    ],
    estimatedTime: '45 minutes'
  },

  'my-first-analysis': {
    id: 'my-first-analysis',
    name: 'My First Analysis',
    skillLevel: 'beginner',
    topic: 'Applied Analysis',
    description: 'Learn all five dimensions of fragrance analysis using a real fragrance.',
    lessons: [
      {
        id: 'mfa-1',
        order: 1,
        title: 'The Five Dimensions Overview',
        objective: 'Understand the five analysis dimensions',
        framework: '',
        caseStudies: [],
        content: 'Fragrance analysis breaks into five dimensions: Synergistic Interactions (how compounds work together), Dominant Accords (why it feels like X), Molecular Diffusion Dynamics (projection and longevity), Stability Predictions (aging and shelf life), Formulation Efficiency (redundancy and balance). Master perfumers consider all five when evaluating fragrances.',
        exercise: {
          type: 'multiple_choice',
          instructions: 'Which dimension addresses longevity?'
        },
        checkpointQuestions: ['Can you name all five dimensions?']
      },
      {
        id: 'mfa-2',
        order: 2,
        title: 'Dimension 1: Synergistic Interactions',
        objective: 'Understand how compounds work together',
        framework: 'synergy-framework',
        caseStudies: [],
        content: 'Synergies are compound pairs that create effects greater than the sum of their parts. Ambroxan + Vanilla = warmth boost. Iso E Super + Sandalwood = depth. Learning to spot synergies explains why a fragrance feels complex and sophisticated.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Identify synergistic pairs in a fragrance.',
          fragranceId: 'sauvage-dior'
        },
        checkpointQuestions: ['What are synergies?', 'Can you spot them in real fragrances?']
      },
      {
        id: 'mfa-3',
        order: 3,
        title: 'Dimension 2: Dominant Accords',
        objective: 'Understand why fragrances feel like what they are',
        framework: 'accord-drivers-framework',
        caseStudies: [],
        content: 'Accords are combinations of notes that create a unified impression. Floral accords feel flowery. Woody accords feel woody. Accord drivers are the key compounds that establish the primary character. Understanding drivers explains why a fragrance smells like what it does.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Identify the primary accord and its drivers.',
          fragranceId: 'lhomme-prada'
        },
        checkpointQuestions: ['What\'s the primary accord?', 'Which compounds drive it?']
      },
      {
        id: 'mfa-4',
        order: 4,
        title: 'Dimension 3: Molecular Diffusion Dynamics',
        objective: 'Predict projection and longevity',
        framework: 'volatility-tiers-framework',
        caseStudies: [],
        content: 'Diffusion is how fragrance spreads in the air and how long it lasts. High-volatility compounds project immediately but fade fast. Low-volatility compounds project subtly but last. Balanced distribution creates evolution—opening, development, closure.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Assess projection and longevity based on tiers.',
          fragranceId: 'eau-de-gentillesse-hermes'
        },
        checkpointQuestions: ['How would you predict longevity?', 'Why does this fragrance project subtly?']
      },
      {
        id: 'mfa-5',
        order: 5,
        title: 'Dimension 4: Stability Predictions',
        objective: 'Understand aging and shelf life',
        framework: 'stability-framework',
        caseStudies: [],
        content: 'Fragrances age. Some compounds oxidize (become less pleasant). Others deepen and improve. Understanding stability helps you buy wisely, store properly, and predict how a fragrance will smell in 6 months, 1 year, 5 years.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Assess oxidation risk and aging trajectory.',
          fragranceId: 'sauvage-dior'
        },
        checkpointQuestions: ['How do aldehydes age?', 'What storage preserves fragrance?']
      },
      {
        id: 'mfa-6',
        order: 6,
        title: 'Dimension 5: Formulation Efficiency',
        objective: 'Spot over-formulation and design inefficiency',
        framework: 'redundancy-efficiency-framework',
        caseStudies: [],
        content: 'Efficiency is the ratio of compounds to olfactory impact. Over-formulated fragrances use redundant compounds (three vanillas instead of one exceptional vanilla). Efficient fragrances leverage each compound distinctly. Both approaches can succeed; understanding which reveals design philosophy.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Assess whether this fragrance is efficiently formulated.',
          fragranceId: 'eros-versace'
        },
        checkpointQuestions: ['Is this fragrance over-formulated?', 'Is redundancy intentional or wasteful?']
      },
      {
        id: 'mfa-7',
        order: 7,
        title: 'Analyze Your Own Fragrance',
        objective: 'Apply all five dimensions to a fragrance you know',
        framework: '',
        caseStudies: [],
        content: 'Choose a fragrance you own or know well. Analyze it across all five dimensions. Your goal: understand not just what it smells like, but why—the chemistry, the strategy, the engineering behind the beauty.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Full analysis of a fragrance using all five dimensions.'
        },
        checkpointQuestions: ['Did you understand all five dimensions?', 'Can you explain the chemistry behind what you smell?']
      }
    ],
    estimatedTime: '60 minutes'
  }
};
