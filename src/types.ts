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
