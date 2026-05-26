// Synergistic Interactions
export interface CompoundInteraction {
  compound_a: string;
  compound_b: string;
  interaction_type: 'amplifies' | 'diminishes' | 'transforms' | 'neutral';
  strength: number; // 1-10
  mechanism: string;
}

export interface ThreeWayEffect {
  compounds: [string, string, string];
  effect_type: string;
  strength: number;
  explanation: string;
}

export interface SynergisticInteractions {
  pairs: CompoundInteraction[];
  threeWayEffects: ThreeWayEffect[];
  dominantSynergies: CompoundInteraction[];
  summary: string;
  queries: {
    which_molecules_are_synergistic: string;
    where_are_dominant_synergies: string;
    how_do_synergies_shape_effect: string;
  };
}

// Dominant Accord Mechanics
export interface AccordDriver {
  accord: string;
  compounds: string[];
  roleDescription: string;
  confidence: number; // 1-10
}

export interface DominantAccordMechanics {
  primaryAccord: string;
  primaryAccordConfidence: number;
  secondaryAccords: string[];
  accordDrivers: AccordDriver[];
  psychologicalFactors: string;
  unexpectedElements: string;
  summary: string;
  queries: {
    why_does_this_feel_like_accord: string;
    what_creates_impression: string;
    unexpected_elements_explanation: string;
  };
}

// Molecular Diffusion Dynamics
export interface VolatilityTiers {
  top: string[];
  heart: string[];
  base: string[];
}

export interface CarrierRelationship {
  carrier: string;
  cargo: string[];
  explanation: string;
}

export interface EvaporationPhase {
  phase: 'top' | 'heart' | 'base';
  compounds: string[];
  timingMinutes: string;
}

export interface ProjectionPrediction {
  topNoteProjection: 'low' | 'medium' | 'high';
  topNoteExplanation: string;
  heartNoteProjection: 'low' | 'medium' | 'high';
  heartNoteExplanation: string;
  baseNoteProjection: 'low' | 'medium' | 'high';
  baseNoteExplanation: string;
}

export interface MolecularDiffusionDynamics {
  volatilityTiers: VolatilityTiers;
  carrierRelationships: CarrierRelationship[];
  evaporationSequence: EvaporationPhase[];
  molecularWeightHierarchy: Array<{ compound: string; weight: number }>;
  projectionPrediction: ProjectionPrediction;
  summary: string;
  queries: {
    which_molecules_carry_top_notes: string;
    how_does_this_project: string;
    evaporation_sequence: string;
  };
}

// Stability Predictions
export interface VulnerableCompound {
  compound: string;
  riskLevel: 'low' | 'medium' | 'high';
  mechanism: string;
}

export interface OxidationRisk {
  overallRisk: 'low' | 'medium' | 'high';
  vulnerableCompounds: VulnerableCompound[];
}

export interface AgingTimeline {
  sixMonths: string;
  oneYear: string;
  fiveYears: string;
}

export interface StabilityPredictions {
  oxidationRisk: OxidationRisk;
  chemicalReactions: string[];
  separationRisk: 'low' | 'medium' | 'high';
  separationExplanation: string;
  expectedShelfLife: '6 months' | '1 year' | '3+ years';
  agingTimeline: AgingTimeline;
  storageRecommendations: string[];
  summary: string;
  queries: {
    how_will_this_age: string;
    shelf_life: string;
    which_compounds_at_oxidation_risk: string;
  };
}

// Formulation Efficiency
export interface RedundancyItem {
  role: string;
  compounds: string[];
  redundancyScore: number; // 1-10
  suggestion: string;
}

export interface DensityAssessment {
  score: number; // 1-10
  classification: 'lean' | 'balanced' | 'dense' | 'bloated';
  explanation: string;
}

export interface ImprovementSuggestion {
  suggestion: string;
  rationale: string;
  impact: 'low' | 'medium' | 'high';
}

export interface FormulationEfficiency {
  redundancyMap: RedundancyItem[];
  densityAssessment: DensityAssessment;
  missingElements: string[];
  efficiencyScore: number; // 1-10
  improvementSuggestions: ImprovementSuggestion[];
  summary: string;
  queries: {
    is_this_over_formulated: string;
    where_can_we_tighten: string;
    whats_missing_for_balance: string;
  };
}

// Complete Analysis Response
export interface EnhancedFragranceAnalysis {
  synergisticInteractions: SynergisticInteractions;
  dominantAccordMechanics: DominantAccordMechanics;
  molecularDiffusionDynamics: MolecularDiffusionDynamics;
  stabilityPredictions: StabilityPredictions;
  formulationEfficiency: FormulationEfficiency;
  metadata: {
    confidence_scores?: Record<string, number>;
    limitations?: string[];
    caveats?: string;
  };
}

// Density Shift Analysis
export interface DensityShiftAnalysis {
  familyFocus: string;                    // "Gourmand", "Woody", "Floral", "Oriental", "Fresh", etc.
  highVolatilityEngine: string;           // Key top-note compound names (extracted)
  diffusionEffect: string;                // Gemini-generated narrative about immediate impact
  lowVolatilityEngine: string;            // Key base compound names (extracted)
  tenacityEffect: string;                 // Gemini-generated narrative about long-lasting wear
  strategicPortfolioTakeaway: string;     // Gemini-generated strategic insight
}

// API Response wrapper
import { FragranceData } from '../../types';

export interface AnalyzeResponse {
  analysis: FragranceData;
  error?: string;
}
