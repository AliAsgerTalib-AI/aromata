export interface AromaChemical {
  name: string;
  percentage: number;
  category: 'Ambers/Musks' | 'Woody Backbones' | 'Sweet/Gourmand Anchors' | 'Others';
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

export interface FragranceData {
  brand: string;
  name: string;
  concentration: 'Cologne (EDC)' | 'Toilette (EDT)' | 'Parfum (EDP)' | 'Extrait'| 'Pure Parfum';
  nose: string;
  releaseYear: number;
  batchLineage: string;
  
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
  notes?: {
    top: string[];
    heart: string[];
    base: string[];
  };
}
