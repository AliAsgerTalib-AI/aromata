import { CaseStudy } from './types';

export const CASE_STUDIES: Record<string, CaseStudy> = {
  'chanel-no5': {
    id: 'chanel-no5',
    fragrance: {
      brand: 'Chanel',
      name: 'No. 5',
      concentration: 'EDP',
      releaseYear: 1921,
      nose: 'Ernest Beaux'
    },
    strategicContext: 'Revolutionized perfumery with synthetic aldehydes, positioning fragrance as a luxury status symbol. Created the modern prestige fragrance template. Market dominance for over a century.',
    chemistryStory: 'Ernest Beaux used a high concentration of C10 and C12 aldehydes (unusual for 1921) to create a powdery, soapy opening that masks the florals beneath. The base is a woody-amber structure with natural rose and jasmine creating a complex heart. Reformulations over decades have reduced aldehyde intensity.',
    expertCommentary: 'No. 5 remains a masterclass in restraint and structure. The aldehydes do not shout; they open the composition like a door. The floral heart is complex yet harmonious. The base—oakmoss, sandalwood, amber—provides anchor without heaviness. Modern reformulations lose some of this sophistication, trading complexity for mass comfort.',
    analysis: {} as any,
    analysisTimestamp: 0,
    frameworksFeatured: ['synergy-framework', 'accord-drivers-framework', 'stability-framework'],
    difficultyLevel: 'beginner',
    keyLessons: [
      'How aldehydes open a composition',
      'Structure of a classic floral fragrance',
      'Reformulation and ingredient substitution over time'
    ],
    variants: [
      {
        name: 'No. 5 Eau Première',
        concentration: 'EDT',
        analysis: {} as any,
        differencesFromBase: 'Lighter, less aldehyde intensity, fresher presentation, shorter longevity'
      }
    ]
  },

  'sauvage-dior': {
    id: 'sauvage-dior',
    fragrance: {
      brand: 'Dior',
      name: 'Sauvage',
      concentration: 'EDP',
      releaseYear: 2015,
      nose: 'François Demachy'
    },
    strategicContext: 'Blockbuster mass-market success, dominating niche and mainstream sales simultaneously. Positioned as universal masculine appeal. Became reference standard for ambroxan-dominant fragrances.',
    chemistryStory: 'Sauvage centers on ambroxan (a synthetic polycyclic musk)—approximately 20% of composition. Ambroxan creates warmth, longevity, and a subtle creaminess. The opening is spicey-fresh (pepper, ginger). The heart softens with vanilla and amber. The base deepens with cedarwood and ambroxan dominance. Extremely efficient formulation.',
    expertCommentary: 'Sauvage succeeds through elegant simplicity and powerful projection. The ambroxan is the star; other notes support it. Some perfumers critique it as one-dimensional and dated (released 2015, feels less novel today). However, the molecular engineering is excellent: few compounds doing much work. A masterclass in efficient formulation, if not complex composition.',
    analysis: {} as any,
    analysisTimestamp: 0,
    frameworksFeatured: ['volatility-tiers-framework', 'redundancy-efficiency-framework'],
    difficultyLevel: 'beginner',
    keyLessons: [
      'Ambroxan as anchor and longevity driver',
      'Efficient formulation: few compounds, high impact',
      'Projection mastery through volatility tiers'
    ],
    variants: [
      {
        name: 'Sauvage Eau Fraîche',
        concentration: 'EDT',
        analysis: {} as any,
        differencesFromBase: 'Higher citrus, less ambroxan, lighter projection, shorter duration'
      }
    ]
  },

  'lhomme-prada': {
    id: 'lhomme-prada',
    fragrance: {
      brand: 'Prada',
      name: "L'Homme",
      concentration: 'EDT',
      releaseYear: 2016,
      nose: 'Olivier Polge, Antoine Maisondieu'
    },
    strategicContext: 'Modern minimalism positioned against heavy masculines. Success through restraint and versatility. Worn in business and casual contexts equally.',
    chemistryStory: 'L\'Homme centers on calone (aquatic), linalool (floral lightness), and cedarwood (base structure). The composition is deliberately spare: few compounds, high quality, clear separation of top/heart/base. Opens bright (bergamot, grapefruit), softens to floral (iris, muguet from linalool), settles on woody-amber base (cedarwood, amber accords).',
    expertCommentary: 'A masterclass in simplicity. L\'Homme proves that complexity is not required for beauty. The restraint is intentional—each note has space to breathe. Some find it too simple, lacking development. Others recognize it as wisdom: knowing when to stop adding.',
    analysis: {} as any,
    analysisTimestamp: 0,
    frameworksFeatured: ['accord-drivers-framework', 'redundancy-efficiency-framework'],
    difficultyLevel: 'beginner',
    keyLessons: [
      'Minimalist structure and its advantages',
      'The power of white space (unused composition potential)',
      'Versatility through restraint'
    ]
  },

  'aventus-creed': {
    id: 'aventus-creed',
    fragrance: {
      brand: 'Creed',
      name: 'Aventus',
      concentration: 'EDP',
      releaseYear: 2010,
      nose: 'Olivier Creed'
    },
    strategicContext: 'Positioned as luxury niche achievement. Created demand for synthetic fruitiness (pinapple note through HDPS). Premium pricing justified by longevity and projection. Cult following in fragrance community.',
    chemistryStory: 'Aventus opens with a burst of synthetic pineapple (hexyl cinnamal, other compounds creating tropical fruit). The heart is dry (blackcurrant, apple). The base is amber-wood (patchouli, oak moss, ambroxan). The pineapple note is the hero; other elements support and extend. Batch variation is notorious (formulation inconsistency).',
    expertCommentary: 'Aventus divides opinion. The pineapple opening is striking and memorable. Some perfumers praise the creativity; others find it artificial and dated. The longevity is exceptional—8+ hours on skin. The batch variation is a flaw: quality control should be tighter. Nevertheless, it remains an iconic niche fragrance.',
    analysis: {} as any,
    analysisTimestamp: 0,
    frameworksFeatured: ['synergy-framework', 'stability-framework'],
    difficultyLevel: 'intermediate',
    keyLessons: [
      'Synthetic fruitiness and its perception',
      'Longevity through base-note anchoring',
      'Batch consistency and quality control'
    ]
  },

  'eros-versace': {
    id: 'eros-versace',
    fragrance: {
      brand: 'Versace',
      name: 'Eros',
      concentration: 'EDT',
      releaseYear: 2012,
      nose: 'Givaudan perfumers'
    },
    strategicContext: 'Mass-market gourmand positioned as youthful and hedonistic. Heavy longevity and projection designed for nightlife and young male demographics. High sales volume.',
    chemistryStory: 'Eros opens with a sharp mint (spearmint, peppermint oils). The heart is dense with vanilla (Bourbon vanilla, other vanillins). The base layers amber (ambroxan, other ambers) and spice (ambroxane with spicy warmth). High concentration of sweet compounds creates cloying richness. Multiple vanillas and ambers layer redundantly (see efficiency analysis).',
    expertCommentary: 'Eros succeeds through raw appeal, not subtlety. The mint opening attracts, the vanilla and amber seduce. Some perfumers critique it as over-formulated and linear. However, it demonstrates how redundancy can be intentional—layering similar-role compounds creates density and persistence. A case study in mass-market strategy versus technical perfection.',
    analysis: {} as any,
    analysisTimestamp: 0,
    frameworksFeatured: ['redundancy-efficiency-framework', 'volatility-tiers-framework'],
    difficultyLevel: 'intermediate',
    keyLessons: [
      'Gourmand layering and density',
      'Intentional redundancy for persistence',
      'Mint as opening attraction device'
    ]
  },

  'sel-marin-heeley': {
    id: 'sel-marin-heeley',
    fragrance: {
      brand: 'Heeley',
      name: 'Sel Marin',
      concentration: 'EDP',
      releaseYear: 2012,
      nose: 'James Heeley'
    },
    strategicContext: 'Niche artisanal positioning. Uses natural materials (ambrette seed, seaweed extracts) and minimal synthetics. Targets fragrance enthusiasts and naturals advocates. Premium pricing justified by material quality.',
    chemistryStory: 'Sel Marin centers on ambrette seed absolute (traditionally associated with musk, here creating musky-sweet warmth). The composition includes seaweed / ozonic notes (through synthetic molecules creating marine accord), salt facet (not literal salt, but dry-mineral perception), and driftwood base (from cedarwood and other woods). Minimal added synthetics; most effect from natural absolutes.',
    expertCommentary: 'Sel Marin appeals to naturals-focused perfumers and those seeking olfactory distinction. The ambrette seed is unusual and pleasurable. Some find the composition rambling and unfocused. Others recognize it as a portrait of literal seaside experience—salt, seaweed, driftwood—faithfully rendered.',
    analysis: {} as any,
    analysisTimestamp: 0,
    frameworksFeatured: ['accord-drivers-framework', 'synergy-framework'],
    difficultyLevel: 'intermediate',
    keyLessons: [
      'Natural materials and their complexity',
      'Creating ozonic/aquatic effects naturally',
      'Ambrette seed as alternative to synthetic musks'
    ]
  },

  'gentleman-reserve-privee-givenchy': {
    id: 'gentleman-reserve-privee-givenchy',
    fragrance: {
      brand: 'Givenchy',
      name: 'Gentleman Reserve Privée',
      concentration: 'EDP',
      releaseYear: 2015,
      nose: 'Olivier Gillotin'
    },
    strategicContext: 'Premium flanker of Gentleman (2017). Introduced to capture niche interest while maintaining mainstream accessibility. Reformulation as study in brand evolution.',
    chemistryStory: 'Gentleman Reserve Privée shifts the original\'s iris emphasis toward tobacco. Opens with iris (iris root providing powdery-dry opening) and spice. The heart deepens into tobacco absolute (creating leather, smoke, and sweet earthiness). The base is warm amber and woody notes. Significantly different from original through tobacco dominance.',
    expertCommentary: 'The tobacco note is the key innovation. Reserve Privée shows how reformulation can honor a brand while creating distinction. The iris-to-tobacco progression is logical and executed cleanly. A case study in flanker strategy: different enough to justify premium pricing, familiar enough to maintain brand loyalty.',
    analysis: {} as any,
    analysisTimestamp: 0,
    frameworksFeatured: ['accord-drivers-framework', 'stability-framework'],
    difficultyLevel: 'intermediate',
    keyLessons: [
      'Tobacco as accord driver and character builder',
      'Reformulation and brand evolution',
      'Flanker strategy and market positioning'
    ]
  },

  'blu-mediterraneo-acqua-di-parma': {
    id: 'blu-mediterraneo-acqua-di-parma',
    fragrance: {
      brand: 'Acqua di Parma',
      name: 'Blu Mediterraneo',
      concentration: 'EDT',
      releaseYear: 2012,
      nose: 'Olivier Polge'
    },
    strategicContext: 'Niche classic focused on luxury and heritage. Positioned as Mediterranean luxury, evoking coastal vacations. High price justified by brand prestige and material quality.',
    chemistryStory: 'Blu Mediterraneo opens with a bright citrus burst (bergamot, lemon, grapefruit). The heart transitions to herbal-aquatic notes (mint, sea salt accord, aquatic molecules). The base is a clean woody structure (cedar, vetiver) with subtle amber warmth. The composition is elegant: each section distinct, clear progression.',
    expertCommentary: 'Blu Mediterraneo exemplifies how citrus can be executed with sophistication. The opening is immediate and joyful, but the base prevents it from vanishing into frothiness. Olivier Polge demonstrates technical mastery: clear structure, high-quality materials, intentional design. A fragrance that works equally at the beach and in business contexts.',
    analysis: {} as any,
    analysisTimestamp: 0,
    frameworksFeatured: ['volatility-tiers-framework', 'accord-drivers-framework'],
    difficultyLevel: 'intermediate',
    keyLessons: [
      'Citrus mastery and longevity',
      'Aquatic notes and their construction',
      'Projection through tier management'
    ]
  },

  'black-orchid-tom-ford': {
    id: 'black-orchid-tom-ford',
    fragrance: {
      brand: 'Tom Ford',
      name: 'Black Orchid',
      concentration: 'EDP',
      releaseYear: 2006,
      nose: 'Tom Ford with IFF'
    },
    strategicContext: 'Luxury brand entry into high-end fragrance (2006). Positioned as dark, mysterious, sensual. Created demand for dark-floral positioning. Premium pricing ($200+).',
    chemistryStory: 'Black Orchid opens with dark florals (orchid note—synthetic creation, not literal orchid) and spice. The heart layers dark fruits (blackcurrant, plum) with florals and amber (dark, warm, slightly sweet). The base is a complex blend of oud (woody-leathery), dark woods (ebony), patchouli, and vanilla. Extremely dense and long-lasting.',
    expertCommentary: 'Black Orchid succeeds through daring: dark florals and oud before niche fragrance recognized oud\'s mainstream appeal. The composition is complex—many competing notes—yet cohesive. Some find it heavy and oppressive; others recognize it as art. A turning point in Tom Ford\'s fragrance business.',
    analysis: {} as any,
    analysisTimestamp: 0,
    frameworksFeatured: ['synergy-framework', 'accord-drivers-framework', 'stability-framework'],
    difficultyLevel: 'advanced',
    keyLessons: [
      'Dark floral complexity and layering',
      'Oud as base anchor and character builder',
      'Creating perceived sophistication through density'
    ]
  },

  'eau-de-gentillesse-hermes': {
    id: 'eau-de-gentillesse-hermes',
    fragrance: {
      brand: 'Hermès',
      name: 'Eau de Gentillesse',
      concentration: 'EDT',
      releaseYear: 2015,
      nose: 'Christine Nagel, Daphné Bugey'
    },
    strategicContext: 'Hermès entry into clean, minimal fragrances. Positioned as understated luxury and refinement. Targets those seeking subtlety over projection.',
    chemistryStory: 'Eau de Gentillesse is deliberately subtle. Opens with soft florals (peony, lily of the valley). The heart is clean and transparent (hyaluronic-like transparency, heliotrope for gentle sweetness). The base is minimal: a touch of musk and woody notes. The composition avoids heavy or dark notes; everything is light and refined.',
    expertCommentary: 'A fragrance for those who dislike fragrance. The restraint is the point. Eau de Gentillesse fades into the background intentionally—a skin scent, a whisper. For beginners, it teaches that fragrance is not about projection or longevity, but presence and refinement.',
    analysis: {} as any,
    analysisTimestamp: 0,
    frameworksFeatured: ['redundancy-efficiency-framework', 'volatility-tiers-framework'],
    difficultyLevel: 'beginner',
    keyLessons: [
      'Minimalism and intentional restraint',
      'Skin scents and subtle fragrances',
      'Refinement through simplicity'
    ]
  }
};
