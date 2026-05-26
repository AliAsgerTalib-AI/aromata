export enum AromaCategory {
  AMBERS_MUSKS = 'Ambers/Musks',
  WOODY_BACKBONES = 'Woody Backbones',
  SWEET_GOURMAND = 'Sweet/Gourmand Anchors',
  OTHERS = 'Others'
}

export enum TimelineClassification {
  ORIGIN = 'Origin',
  FLANKER_RELEASE = 'Flanker Release',
  REFORMULATION = 'Reformulation',
  MILESTONE = 'Milestone',
  AWARD = 'Award',
  HOUSE_EVENT = 'House Event',
  GOSSIP = 'Gossip'
}

export enum FragranceConcentration {
  COLOGNE = 'Cologne (EDC)',
  TOILETTE = 'Toilette (EDT)',
  PARFUM = 'Parfum (EDP)',
  EXTRAIT = 'Extrait',
  PURE_PARFUM = 'Pure Parfum'
}

export interface AromaChemical {
  name: string;
  percentage: number;
  category: AromaCategory;
  description: string;
}

export interface EvaporationPoint {
  hour: number;
  top: number;
  heart: number;
  base: number;
}

export interface SillagePoint {
  hour: number;
  radiusFeet: number;
}

export interface AccordIntensity {
  name: string; // Soapy, Powdery, Metallic, Earthy, Bone-Dry, Resinous, Animalic, Synthetic-Sharp, etc.
  intensity: number; // 0-100
}

export interface SettingScore {
  name: string; // e.g. Strict Office, Open-Air Only, High-Heat Casual, High-Performance Nightlife
  score: number; // 0-100
}

export interface AlternativeFragrance {
  brand: string;
  name: string;
  similarity: number; // 0-100
  priceComparison: 'cheaper' | 'similar' | 'more expensive' | string;
}

export interface ParsedBatchCode {
  code: string;
  brand: string;
  isValid: boolean;
  manufacturingDate?: string;
  factoryOrigin?: string;
  shelfLifeStatus?: 'Fresh' | 'Mature' | 'Degraded' | 'Expired';
  activeIngredientsStability?: string;
  explanation?: string;
}

export interface HistoricalMilestone {
  year: string;
  title: string;
  description: string;
  classification: TimelineClassification | string;
}

export interface FragranceData {
  brand: string;
  name: string;
  concentration: FragranceConcentration;
  nose: string;
  releaseYear: number;
  batchLineage: string;
  parsedBatchCode?: ParsedBatchCode;
  historicalTimeline?: HistoricalMilestone[];
  
  // chemical/molecular
  aromaChemicalMatrix: AromaChemical[];
  naturalToSyntheticRatio: {
    natural: number;
    synthetic: number;
  };
  evaporationCurve: EvaporationPoint[];
  
  // performance
  skinLongevityIndex: number; // hours
  fabricPermanenceIndex: number; // hours
  sillageProjectionRadiusCurve: SillagePoint[];
  olfactoryFatigueRisk: number; // percentage
  olfactoryFatigueExplanation: string;
  
  // mapping & context
  olfactoryFamily: string;
  accords: AccordIntensity[];
  tempRangeMinCelsius: number;
  tempRangeMaxCelsius: number;
  humidityTolerance: string; // e.g. "Low humidity optimal", "High moisture resistant" vs "Collapses in heavy humidity"
  settingScoring: SettingScore[];
  
  // market intelligence
  avgRetailPrice: number;
  pricePerMl: number;
  valueRating: 'Great Value' | 'Fair' | 'Overpriced' | string;
  alternatives: AlternativeFragrance[];
  formulationHeritage: string; // e.g. batch-to-batch changes / IFRA regulation impact
  laymanChemistryExplanation?: string; // layman explanation of how the perfume actually works chemically
  story?: string; // Evocative artistic narrative story
  molecularBlueprintShift?: {
    title: string;
    highVolatilityEngine: string;
    highVolatilityEffect: string;
    lowVolatilityEngine: string;
    lowVolatilityEffect: string;
  };
  strategicTakeaway?: string;
  ifraAssessment?: {
    status: 'Compliant' | 'Reformulated' | 'Restricted' | string;
    criticalRestrictedMaterials: {
      name: string;
      limitPercent: number;
      actualPercent: number;
      impact: string;
    }[];
    chemistsTakeaway: string;
  };
  notes?: {
    top: string[];
    heart: string[];
    base: string[];
  };
}

// Enhanced Analysis Types (Five Dimensions)

export interface SynergisticInteractionsData {
  pairs: Array<{
    compound_a: string;
    compound_b: string;
    interaction_type: 'amplifies' | 'diminishes' | 'transforms' | 'neutral';
    strength: number;
    mechanism: string;
  }>;
  threeWayEffects: Array<{
    compounds: [string, string, string];
    effect_type: string;
    strength: number;
    explanation: string;
  }>;
  dominantSynergies: Array<{
    compound_a: string;
    compound_b: string;
    interaction_type: string;
    strength: number;
    mechanism: string;
  }>;
  summary: string;
  queries: {
    which_molecules_are_synergistic: string;
    where_are_dominant_synergies: string;
    how_do_synergies_shape_effect: string;
  };
}

export interface DominantAccordMechanicsData {
  primaryAccord: string;
  primaryAccordConfidence: number;
  secondaryAccords: string[];
  accordDrivers: Array<{
    accord: string;
    compounds: string[];
    roleDescription: string;
    confidence: number;
  }>;
  psychologicalFactors: string;
  unexpectedElements: string;
  summary: string;
  queries: {
    why_does_this_feel_like_accord: string;
    what_creates_impression: string;
    unexpected_elements_explanation: string;
  };
}

export interface MolecularDiffusionDynamicsData {
  volatilityTiers: {
    top: string[];
    heart: string[];
    base: string[];
  };
  carrierRelationships: Array<{
    carrier: string;
    cargo: string[];
    explanation: string;
  }>;
  evaporationSequence: Array<{
    phase: 'top' | 'heart' | 'base';
    compounds: string[];
    timingMinutes: string;
  }>;
  molecularWeightHierarchy: Array<{
    compound: string;
    weight: number;
  }>;
  projectionPrediction: {
    topNoteProjection: 'low' | 'medium' | 'high';
    topNoteExplanation: string;
    heartNoteProjection: 'low' | 'medium' | 'high';
    heartNoteExplanation: string;
    baseNoteProjection: 'low' | 'medium' | 'high';
    baseNoteExplanation: string;
  };
  summary: string;
  queries: {
    which_molecules_carry_top_notes: string;
    how_does_this_project: string;
    evaporation_sequence: string;
  };
}

export interface StabilityPredictionsData {
  oxidationRisk: {
    overallRisk: 'low' | 'medium' | 'high';
    vulnerableCompounds: Array<{
      compound: string;
      riskLevel: 'low' | 'medium' | 'high';
      mechanism: string;
    }>;
  };
  chemicalReactions: string[];
  separationRisk: 'low' | 'medium' | 'high';
  separationExplanation: string;
  expectedShelfLife: '6 months' | '1 year' | '3+ years';
  agingTimeline: {
    sixMonths: string;
    oneYear: string;
    fiveYears: string;
  };
  storageRecommendations: string[];
  summary: string;
  queries: {
    how_will_this_age: string;
    shelf_life: string;
    which_compounds_at_oxidation_risk: string;
  };
}

export interface FormulationEfficiencyData {
  redundancyMap: Array<{
    role: string;
    compounds: string[];
    redundancyScore: number;
    suggestion: string;
  }>;
  densityAssessment: {
    score: number;
    classification: 'lean' | 'balanced' | 'dense' | 'bloated';
    explanation: string;
  };
  missingElements: string[];
  efficiencyScore: number;
  improvementSuggestions: Array<{
    suggestion: string;
    rationale: string;
    impact: 'low' | 'medium' | 'high';
  }>;
  summary: string;
  queries: {
    is_this_over_formulated: string;
    where_can_we_tighten: string;
    whats_missing_for_balance: string;
  };
}

export interface EnhancedAnalysisData {
  synergisticInteractions: SynergisticInteractionsData;
  dominantAccordMechanics: DominantAccordMechanicsData;
  molecularDiffusionDynamics: MolecularDiffusionDynamicsData;
  stabilityPredictions: StabilityPredictionsData;
  formulationEfficiency: FormulationEfficiencyData;
  metadata?: {
    confidence_scores?: Record<string, number>;
    limitations?: string[];
    caveats?: string;
  };
}
