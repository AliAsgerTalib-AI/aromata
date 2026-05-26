import { Framework } from './types';

export const FRAMEWORKS: Record<string, Framework> = {
  'synergy-framework': {
    id: 'synergy-framework',
    name: 'Synergy Framework',
    phase1Dimension: 'synergistic_interactions',
    methodology: 'Synergies are molecular interactions where two compounds together create a result greater, less, or different than their individual effects. There are three types: amplification (1+1=3), diminishment (1+1=0.5), and transformation (A+B=C). Understanding synergies helps explain why a fragrance smells complex and multifaceted.',
    keyInsight: 'Iso E Super alone is transparent. Iso E Super + Sandalwood creates warmth. Iso E Super + Citral creates tension. The same molecule produces different effects depending on its partners.',
    interactiveExample: {
      caseStudyId: 'sauvage-dior',
      explanation: 'In Sauvage, Ambroxan synergizes with Vanilla to create longevity boost. Ambroxan alone provides warmth and longevity; Vanilla adds sweetness. Together, they create a creamy warmth that lasts 8+ hours—greater than either ingredient alone.'
    },
    relatedCaseStudies: ['sauvage-dior', 'aventus-creed', 'black-orchid-tom-ford']
  },

  'volatility-tiers-framework': {
    id: 'volatility-tiers-framework',
    name: 'Volatility Tiers & Projection Logic',
    phase1Dimension: 'molecular_diffusion_dynamics',
    methodology: 'Volatility determines evaporation speed. Compounds organize into three tiers: high-volatility (top notes, evaporate in minutes), medium-volatility (heart notes, evaporate in 1-4 hours), and low-volatility (base notes, last 4+ hours). The percentage of compounds in each tier determines overall projection and longevity trajectory.',
    keyInsight: 'High volatility projects immediately but vanishes fast. Low volatility projects subtly but lasts. Balanced tier composition creates a fragrance that opens strong, develops, and closes with longevity. Overweighting top notes creates loud-then-silent. Overweighting base creates invisible opening.',
    interactiveExample: {
      caseStudyId: 'lhomme-prada',
      explanation: 'L\'Homme has 20% top-tier volatility, 40% heart, 40% base. It opens with moderate brightness (citrus), softens into a floral mid-development, and settles on a woody base. The balanced tiers create sustained presence without excessive projection. Compare to Sauvage, which has higher top-tier volatility for more explosive opening.'
    },
    relatedCaseStudies: ['sauvage-dior', 'lhomme-prada', 'eros-versace', 'blu-mediterraneo-acqua-di-parma']
  },

  'accord-drivers-framework': {
    id: 'accord-drivers-framework',
    name: 'Accord Drivers Framework',
    phase1Dimension: 'dominant_accord_mechanics',
    methodology: 'Accord drivers are the key compounds that establish the primary olfactory character. A few compounds define the vibe (why it feels floral, woody, aromatic, etc.); other compounds support, complicate, or extend. Identifying drivers helps explain why a fragrance is perceived as "X" despite many ingredients.',
    keyInsight: 'Calone + Galbanum = aquatic freshness. Remove Galbanum, and the aquatic character weakens. The driver compounds are small in number (2-3 often) but outsized in olfactory importance.',
    interactiveExample: {
      caseStudyId: 'black-orchid-tom-ford',
      explanation: 'Black Orchid\'s primary drivers are dark orchid accord (synthetic molecules creating the dark floral) and oud (woody-leathery base character). Darkcurrant supports. The drivers establish "dark floral"—other compounds extend and refine the character.'
    },
    relatedCaseStudies: ['black-orchid-tom-ford', 'eros-versace', 'gentleman-reserve-privee-givenchy', 'lhomme-prada']
  },

  'redundancy-efficiency-framework': {
    id: 'redundancy-efficiency-framework',
    name: 'Redundancy & Efficiency Analysis',
    phase1Dimension: 'formulation_efficiency',
    methodology: 'Redundancy occurs when multiple compounds serve the same role without added benefit. Efficiency is the opposite: each compound contributes distinctly. Some redundancy is intentional (layering for persistence); some is waste (poor design). Assessing efficiency reveals whether a fragrance is artfully dense or carelessly over-formulated.',
    keyInsight: 'If three compounds are all woody backbones, you\'re wasting cost and muddying the smell. If three are slightly different woody backbones creating subtle layering, that\'s art.',
    interactiveExample: {
      caseStudyId: 'eros-versace',
      explanation: 'Eros contains multiple vanillas (Bourbon vanilla, vanillin, other vanillins) and ambers (ambroxan, other ambers) serving similar roles. This is intentional redundancy: the layering of similar-note compounds creates density and persistence that a single vanilla or amber cannot achieve. The redundancy is the formulation strategy.'
    },
    relatedCaseStudies: ['eros-versace', 'sauvage-dior', 'lhomme-prada']
  },

  'stability-framework': {
    id: 'stability-framework',
    name: 'Stability & Aging Prediction',
    phase1Dimension: 'stability_predictions',
    methodology: 'Stability is resistance to oxidation, separation, and chemical breakdown. Compounds oxidize at different rates (aldehydes fast, woody notes slow). Understanding stability helps predict how a fragrance will evolve over months and years. Some age beautifully (oakmoss, oud); others degrade (citrus).',
    keyInsight: 'Aldehydes oxidize in 6 months; Chanel No. 5 reformulations address this by reducing aldehyde intensity. Oud ages well, becoming more complex. Citrus diminishes, requiring fresh bottles.',
    interactiveExample: {
      caseStudyId: 'chanel-no5',
      explanation: 'No. 5\'s high aldehyde concentration was innovative in 1921 but problematic over time (aldehydes oxidize). Modern reformulations reduce aldehydes while preserving the character. A case study in how stability drives reformulation.'
    },
    relatedCaseStudies: ['chanel-no5', 'aventus-creed', 'black-orchid-tom-ford']
  }
};
