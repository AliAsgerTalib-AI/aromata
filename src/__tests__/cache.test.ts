import { AnalysisCache } from '../server/cache/analysisCache';
import { EnhancedFragranceAnalysis } from '../server/types/analysisTypes';

describe('AnalysisCache', () => {
  let cache: AnalysisCache;

  const mockAnalysis: EnhancedFragranceAnalysis = {
    synergisticInteractions: {
      pairs: [],
      threeWayEffects: [],
      dominantSynergies: [],
      summary: 'Test',
      queries: {
        which_molecules_are_synergistic: 'Answer 1',
        where_are_dominant_synergies: 'Answer 2',
        how_do_synergies_shape_effect: 'Answer 3'
      }
    },
    dominantAccordMechanics: {
      primaryAccord: 'Floral',
      primaryAccordConfidence: 8,
      secondaryAccords: [],
      accordDrivers: [],
      psychologicalFactors: 'Test',
      unexpectedElements: 'Test',
      summary: 'Test',
      queries: {
        why_does_this_feel_like_accord: 'Answer',
        what_creates_impression: 'Answer',
        unexpected_elements_explanation: 'Answer'
      }
    },
    molecularDiffusionDynamics: {
      volatilityTiers: { top: [], heart: [], base: [] },
      carrierRelationships: [],
      evaporationSequence: [],
      molecularWeightHierarchy: [],
      projectionPrediction: {
        topNoteProjection: 'low',
        topNoteExplanation: 'Test',
        heartNoteProjection: 'medium',
        heartNoteExplanation: 'Test',
        baseNoteProjection: 'high',
        baseNoteExplanation: 'Test'
      },
      summary: 'Test',
      queries: {
        which_molecules_carry_top_notes: 'Answer',
        how_does_this_project: 'Answer',
        evaporation_sequence: 'Answer'
      }
    },
    stabilityPredictions: {
      oxidationRisk: { overallRisk: 'low', vulnerableCompounds: [] },
      chemicalReactions: [],
      separationRisk: 'low',
      separationExplanation: 'Test',
      expectedShelfLife: '3+ years',
      agingTimeline: { sixMonths: 'Test', oneYear: 'Test', fiveYears: 'Test' },
      storageRecommendations: [],
      summary: 'Test',
      queries: {
        how_will_this_age: 'Answer',
        shelf_life: 'Answer',
        which_compounds_at_oxidation_risk: 'Answer'
      }
    },
    formulationEfficiency: {
      redundancyMap: [],
      densityAssessment: { score: 5, classification: 'balanced', explanation: 'Test' },
      missingElements: [],
      efficiencyScore: 7,
      improvementSuggestions: [],
      summary: 'Test',
      queries: {
        is_this_over_formulated: 'Answer',
        where_can_we_tighten: 'Answer',
        whats_missing_for_balance: 'Answer'
      }
    },
    metadata: {}
  };

  beforeEach(() => {
    cache = new AnalysisCache();
  });

  it('should store and retrieve analysis', () => {
    cache.set('Chanel', 'No. 5', mockAnalysis);
    const retrieved = cache.get('Chanel', 'No. 5');

    expect(retrieved).toBeDefined();
    expect(retrieved?.formulationEfficiency.efficiencyScore).toBe(7);
  });

  it('should return null for missing key', () => {
    const retrieved = cache.get('Unknown', 'Fragrance');
    expect(retrieved).toBeNull();
  });

  it('should generate consistent cache keys', () => {
    const key1 = cache.getCacheKey('Chanel', 'No. 5');
    const key2 = cache.getCacheKey('CHANEL', 'NO. 5');

    expect(key1).toBe(key2);
  });

  it('should clear specific entry', () => {
    cache.set('Chanel', 'No. 5', mockAnalysis);
    expect(cache.get('Chanel', 'No. 5')).toBeDefined();

    cache.clear('Chanel', 'No. 5');
    expect(cache.get('Chanel', 'No. 5')).toBeNull();
  });

  it('should clear all entries', () => {
    cache.set('Chanel', 'No. 5', mockAnalysis);
    cache.set('Dior', 'Sauvage', mockAnalysis);

    cache.clear();
    expect(cache.getSize()).toBe(0);
  });
});
