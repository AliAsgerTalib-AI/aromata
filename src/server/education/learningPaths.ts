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
  },

  // INTERMEDIATE PATHS
  'molecular-synthesis-advanced': {
    id: 'molecular-synthesis-advanced',
    name: 'Molecular Synthesis & Advanced Chemistry',
    skillLevel: 'intermediate',
    topic: 'Chemical Engineering',
    description: 'Master compound families, synthesis mechanisms, and how to predict scent from chemical structure.',
    lessons: [
      {
        id: 'msa-1',
        order: 1,
        title: 'Aromachemical Families & Their Characteristics',
        objective: 'Understand aromachemical classification and behavior patterns',
        framework: 'molecular-families-framework',
        caseStudies: [],
        content: 'Aromachemicals are organized into families: musks, ambroxans, iso E supers, aldehydes, esters, etc. Each family has predictable behavior—volatility, oxidation patterns, synergy profiles. Mastering families lets you predict how new compounds will behave in composition.',
        exercise: {
          type: 'multiple_choice',
          instructions: 'Which family is known for depth and sensual character?'
        },
        checkpointQuestions: ['Can you categorize compounds by family?', 'What volatility patterns define each family?']
      },
      {
        id: 'msa-2',
        order: 2,
        title: 'Molecular Modification: Side Chains & Functional Groups',
        objective: 'Understand how chemical structure drives scent properties',
        framework: 'molecular-structure-framework',
        caseStudies: [],
        content: 'A single compound modified with different side chains or functional groups creates completely different scents. Adding an ester linkage changes volatility. Changing molecular weight changes diffusion. This lesson teaches structure-to-scent prediction.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Explain how isomers create different olfactory effects.',
          fragranceId: 'sauvage-dior'
        },
        checkpointQuestions: ['How does molecular weight affect diffusion?', 'What functional groups increase longevity?']
      },
      {
        id: 'msa-3',
        order: 3,
        title: 'Synthesis & Sustainability: Natural vs. Synthetic',
        objective: 'Understand extraction, synthesis, and environmental impact',
        framework: '',
        caseStudies: [],
        content: 'Natural extraction is expensive and variable. Synthetic compounds enable consistency and scale. Modern perfumers balance natural (for prestige) with synthetic (for cost and consistency). Understanding synthesis explains reformulations and pricing.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Identify natural vs. synthetic compounds in a luxury fragrance.',
          fragranceId: 'eau-de-gentillesse-hermes'
        },
        checkpointQuestions: ['Why are synthetics used in mass-market fragrances?', 'What\'s the cost difference?']
      },
      {
        id: 'msa-4',
        order: 4,
        title: 'Advanced Case Study: Reformulation Analysis',
        objective: 'Understand how perfumers modify formulas over time',
        framework: '',
        caseStudies: ['sauvage-reformulation-history'],
        content: 'Fragrances are reformulated for cost, IFRA compliance, or performance reasons. Sauvage has been reformulated multiple times. Understanding reformulation teaches you to spot quality differences and appreciate the engineering behind consistency.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Compare original vs. reformulated versions of Sauvage.',
          fragranceId: 'sauvage-dior'
        },
        checkpointQuestions: ['Why do fragrances get reformulated?', 'How do you spot reformulation?']
      },
      {
        id: 'msa-5',
        order: 5,
        title: 'Design Your Own Accord',
        objective: 'Create a simple accord from scratch using chemical principles',
        framework: 'molecular-families-framework',
        caseStudies: [],
        content: 'You now understand families, structure, and synergy. Try designing a simple 3-compound accord: one top-note, one middle-note driver, one base anchor. Balance volatility. Predict synergies. Create your first fragrance concept.',
        exercise: {
          type: 'design_composition',
          instructions: 'Create a simple 3-compound accord using the principles you learned.'
        },
        checkpointQuestions: ['Did your accord balance volatility?', 'What synergies emerge?']
      }
    ],
    estimatedTime: '90 minutes'
  },

  'comparative-fragrance-analysis': {
    id: 'comparative-fragrance-analysis',
    name: 'Comparative Analysis: Building Frameworks',
    skillLevel: 'intermediate',
    topic: 'Analytical Techniques',
    description: 'Learn to compare fragrances systematically and build decision frameworks for evaluation.',
    lessons: [
      {
        id: 'cfa-1',
        order: 1,
        title: 'The Comparison Matrix: Structured Evaluation',
        objective: 'Create a framework for comparing fragrances objectively',
        framework: 'comparison-matrix-framework',
        caseStudies: [],
        content: 'Compare fragrances across dimensions: projection, longevity, sillage evolution, accord clarity, efficiency, value. A comparison matrix prevents bias and enables pattern recognition across fragrance families.',
        exercise: {
          type: 'compare_fragrances',
          instructions: 'Create a comparison matrix for three fragrances.',
          frag1Id: 'sauvage-dior',
          frag2Id: 'lhomme-prada'
        },
        checkpointQuestions: ['What dimensions matter most?', 'How do you weight them?']
      },
      {
        id: 'cfa-2',
        order: 2,
        title: 'Pattern Recognition: Spotting Design Philosophy',
        objective: 'Identify recurring design patterns across brands and families',
        framework: '',
        caseStudies: ['sauvage-dior', 'lhomme-prada', 'eau-de-gentillesse-hermes'],
        content: 'Brands have philosophies. Dior emphasizes projection. Prada emphasizes balance. Hermès emphasizes restraint. Recognizing philosophy predicts new releases and explains reformulations.',
        exercise: {
          type: 'multiple_choice',
          instructions: 'Which brand philosophy emphasizes minimalism?'
        },
        checkpointQuestions: ['Can you identify brand philosophy from composition?', 'Does philosophy predict market success?']
      },
      {
        id: 'cfa-3',
        order: 3,
        title: 'Price Justification Analysis',
        objective: 'Understand whether fragrances are priced fairly based on chemistry',
        framework: '',
        caseStudies: [],
        content: 'Is a luxury fragrance worth 3x a mass-market fragrance? Sometimes yes (rare materials, heritage, consistency), sometimes no (marketing inflates price). Learning cost drivers teaches you to buy wisely and spot overpricing.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Justify or critique the price of a luxury fragrance based on composition.',
          fragranceId: 'eau-de-gentillesse-hermes'
        },
        checkpointQuestions: ['What justifies premium pricing?', 'When is a luxury fragrance overpriced?']
      },
      {
        id: 'cfa-4',
        order: 4,
        title: 'Niche vs. Mass-Market Fragrance Strategy',
        objective: 'Understand the strategic differences between market segments',
        framework: '',
        caseStudies: ['sauvage-dior', 'lhomme-prada'],
        content: 'Mass-market fragrances (like Sauvage) prioritize broad appeal and projection. Niche fragrances prioritize artistic vision and rarity. Understanding this split explains composition choices, pricing, and market positioning.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Classify a fragrance as niche or mass-market and justify your answer.',
          fragranceId: 'lhomme-prada'
        },
        checkpointQuestions: ['What makes a fragrance niche vs. mass-market?', 'Can niche compete with mass-market?']
      },
      {
        id: 'cfa-5',
        order: 5,
        title: 'Build Your Own Evaluation Framework',
        objective: 'Create a personal framework for evaluating any fragrance',
        framework: '',
        caseStudies: [],
        content: 'You\'ve learned matrix evaluation, pattern recognition, and pricing analysis. Now synthesize into a personal framework. What dimensions matter most to you? How do you weight them? Build a framework that works for your taste.',
        exercise: {
          type: 'design_framework',
          instructions: 'Create a personal evaluation framework for comparing fragrances.'
        },
        checkpointQuestions: ['Is your framework consistent?', 'Does it predict your own preferences?']
      }
    ],
    estimatedTime: '75 minutes'
  },

  // ADVANCED PATHS
  'niche-engineering-specialized': {
    id: 'niche-engineering-specialized',
    name: 'Niche Fragrance Engineering & Market Positioning',
    skillLevel: 'advanced',
    topic: 'Strategic Formulation',
    description: 'Master the engineering required to create competitive niche fragrances and understand market differentiation.',
    lessons: [
      {
        id: 'nes-1',
        order: 1,
        title: 'Market Gap Analysis: Identifying Opportunities',
        objective: 'Learn to identify underserved fragrance markets',
        framework: '',
        caseStudies: [],
        content: 'Successful niche fragrances fill gaps: "no fresh floral exists for minimalists," "no woody fragrance for gourmand lovers," "no aquatic that lasts 8+ hours." Gap analysis requires understanding current offerings, consumer feedback, and unfulfilled desires.',
        exercise: {
          type: 'multiple_choice',
          instructions: 'What market gap did L\'Homme fill?'
        },
        checkpointQuestions: ['Can you identify emerging market gaps?', 'How do you validate that a gap exists?']
      },
      {
        id: 'nes-2',
        order: 2,
        title: 'Competitive Formulation: Engineering Differentiation',
        objective: 'Design formulas that outperform competitors without copying',
        framework: 'competitive-engineering-framework',
        caseStudies: [],
        content: 'If 20 fragrances target "clean citrus for men," how do you differentiate? Superior longevity? Unique sillage profile? Lower price? Higher sophistication? This lesson teaches strategic differentiation through chemistry.',
        exercise: {
          type: 'design_composition',
          instructions: 'Engineer a formula that out-performs three competitors in one specific dimension.'
        },
        checkpointQuestions: ['What dimension differentiates your formula?', 'Can you achieve it chemically?']
      },
      {
        id: 'nes-3',
        order: 3,
        title: 'IFRA Compliance & Reformulation Strategy',
        objective: 'Navigate regulatory constraints without sacrificing performance',
        framework: '',
        caseStudies: [],
        content: 'IFRA (International Fragrance Association) restricts compound usage for safety. This creates reformulation challenges. Mastering compliance means: understanding restrictions, finding compliant alternatives, and predicting how restrictions will reshape the market.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Identify IFRA-restricted compounds and propose compliant alternatives.',
          fragranceId: 'sauvage-dior'
        },
        checkpointQuestions: ['What restrictions apply to your fragrance?', 'What alternatives exist?']
      },
      {
        id: 'nes-4',
        order: 4,
        title: 'Advanced Case Study: Niche Fragrance Deconstruction',
        objective: 'Reverse-engineer a successful niche fragrance to understand strategic choices',
        framework: '',
        caseStudies: ['lhomme-prada'],
        content: 'L\'Homme succeeded by being "the only fragrance for business that works casually." Every choice—simplic composition, balanced sillage, evolved character—supports this positioning. Deconstructing success teaches engineering wisdom.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Explain how L\'Homme\'s formula supports its market position.',
          fragranceId: 'lhomme-prada'
        },
        checkpointQuestions: ['How does the formula support the positioning?', 'What would you change?']
      },
      {
        id: 'nes-5',
        order: 5,
        title: 'Design a Niche Fragrance Brief',
        objective: 'Create a complete niche fragrance concept with engineering specifications',
        framework: '',
        caseStudies: [],
        content: 'Pull together market analysis, positioning, differentiation, and engineering. Create a fragrance brief: target consumer, market gap, competitive advantage, regulatory constraints, composition targets, and projected longevity/sillage. Design a real fragrance.',
        exercise: {
          type: 'design_niche_brief',
          instructions: 'Create a complete brief for a niche fragrance including positioning and estimated formula.'
        },
        checkpointQuestions: ['Is your positioning clear?', 'Is your formula realistic and compliant?', 'Does it differentiate?']
      }
    ],
    estimatedTime: '120 minutes'
  },

  'sensory-evaluation-expert': {
    id: 'sensory-evaluation-expert',
    name: 'Expert Sensory Evaluation & Olfactory Judgment',
    skillLevel: 'advanced',
    topic: 'Evaluation Mastery',
    description: 'Develop expert-level sensory evaluation skills and train your palate to detect subtle chemical shifts.',
    lessons: [
      {
        id: 'see-1',
        order: 1,
        title: 'Olfactory Physiology: How Your Nose Works',
        objective: 'Understand the biological basis of smell and its limitations',
        framework: '',
        caseStudies: [],
        content: 'Your olfactory epithelium has ~400 receptor types. Each receptor recognizes multiple compounds. Combinations activate patterns. Adaptation (anosmia) makes you "nose-blind" after 20 minutes. Understanding physiology explains evaluation limitations and trains better sensory practices.',
        exercise: {
          type: 'multiple_choice',
          instructions: 'Which phenomenon explains why you stop smelling your own fragrance?'
        },
        checkpointQuestions: ['How do olfactory receptors work?', 'What is olfactory adaptation?']
      },
      {
        id: 'see-2',
        order: 2,
        title: 'Evaluation Protocol: Standardized Sensory Assessment',
        objective: 'Learn professional fragrance evaluation methodology',
        framework: 'sensory-protocol-framework',
        caseStudies: [],
        content: 'Professional evaluators use standardized protocols: controlled temperature/humidity, consistent application method, timed measurements (0min, 5min, 30min, 2hr, 4hr, 8hr), blinded comparisons. This removes bias and enables reproducibility.',
        exercise: {
          type: 'analyze_fragrance',
          instructions: 'Evaluate a fragrance using a full sensory protocol.',
          fragranceId: 'sauvage-dior'
        },
        checkpointQuestions: ['Can you follow the protocol consistently?', 'Are your measurements reproducible?']
      },
      {
        id: 'see-3',
        order: 3,
        title: 'Detecting Reformulation: Micro-Changes in Familiar Fragrances',
        objective: 'Train your palate to detect subtle chemical modifications',
        framework: '',
        caseStudies: ['sauvage-reformulation-history'],
        content: 'Reformulations are often subtle. A 5% compound change might shift longevity or sillage by 10%. Expert evaluators detect these shifts through repeated comparison. This lesson trains sensory precision.',
        exercise: {
          type: 'compare_fragrances',
          instructions: 'Compare two versions of the same fragrance and identify subtle differences.',
          frag1Id: 'sauvage-dior',
          frag2Id: 'sauvage-reformulation-history'
        },
        checkpointQuestions: ['Did you detect differences?', 'Can you attribute them to specific compounds?']
      },
      {
        id: 'see-4',
        order: 4,
        title: 'Advanced Case Study: Blind Evaluation vs. Biased Evaluation',
        objective: 'Understand how bias shapes fragrance perception',
        framework: '',
        caseStudies: [],
        content: 'When you know a fragrance costs $300, you perceive it differently than a $50 alternative—even if they\'re identical. This is price bias. Expert evaluators use blind testing to eliminate bias. Learning bias teaches intellectual honesty.',
        exercise: {
          type: 'compare_fragrances',
          instructions: 'Evaluate two fragrances without knowing price, then compare your evaluation to price-aware evaluation.',
          frag1Id: 'lhomme-prada',
          frag2Id: 'eau-de-gentillesse-hermes'
        },
        checkpointQuestions: ['Did bias influence your evaluation?', 'How do you eliminate it?']
      },
      {
        id: 'see-5',
        order: 5,
        title: 'Build Your Expert Sensory Framework',
        objective: 'Create a personal expert evaluation system and train your palate',
        framework: '',
        caseStudies: [],
        content: 'Combine physiology knowledge, standardized protocols, reformulation detection, and bias awareness. Create a personal evaluation system. Then practice: evaluate 20 fragrances systematically. Train your palate to expert level.',
        exercise: {
          type: 'design_sensory_protocol',
          instructions: 'Create a personal expert sensory evaluation protocol and commit to training with it.'
        },
        checkpointQuestions: ['Is your protocol reproducible?', 'Does it account for bias?', 'Will it improve your evaluation?']
      }
    ],
    estimatedTime: '100 minutes'
  }
};
