import { Type } from '@google/genai';

export function buildFragranceDataPrompt(brand: string, name: string): string {
  return `You are a world-class fragrance expert with deep knowledge of perfume composition, performance, and market data. Your task is to provide comprehensive, accurate data for the fragrance "${brand} - ${name}".

Return detailed information about this fragrance covering:
1. Identity & Classification: brand, exact name, fragrance family, nose (perfumer if known)
2. Chemical Composition: Estimate the aromaChemical matrix with realistic percentage distributions
3. Performance Profile: Skin longevity, fabric permanence, sillage projection, olfactory fatigue risk
4. Sensory Profile: Top/heart/base notes, accords (textures and intensities), temperature tolerance, humidity response, setting recommendations
5. Market Intelligence: Approximate retail price, price per ml, value assessment, alternatives, formulation history
6. Narrative: Layman explanation of how it works chemically, evocative story, molecular blueprint shifts, strategic takeaways, IFRA compliance assessment
7. Density Shift Analysis: Analyze how the fragrance distributes molecular weight between high-volatility (top) and low-volatility (base) compounds. Identify key compounds at each end and describe the sensory impact. Provide a strategic insight about why this distribution pattern exists.

Be specific with percentages, hours, and scores. For chemical composition, estimate realistic aromachemicals that would create this fragrance's profile. For performance, base estimates on the fragrance's actual reputation and longevity characteristics. Include all requested fields even if you must estimate conservatively.`;
}

export function buildFragranceDataSchema() {
  return {
    type: Type.OBJECT,
    required: [
      'brand',
      'name',
      'concentration',
      'nose',
      'releaseYear',
      'batchLineage',
      'aromaChemicalMatrix',
      'naturalToSyntheticRatio',
      'evaporationCurve',
      'skinLongevityIndex',
      'fabricPermanenceIndex',
      'sillageProjectionRadiusCurve',
      'olfactoryFatigueRisk',
      'olfactoryFatigueExplanation',
      'olfactoryFamily',
      'accords',
      'tempRangeMinCelsius',
      'tempRangeMaxCelsius',
      'humidityTolerance',
      'settingScoring',
      'avgRetailPrice',
      'pricePerMl',
      'valueRating',
      'alternatives',
      'formulationHeritage',
      'densityShiftAnalysis',
    ],
    properties: {
      brand: { type: Type.STRING, description: 'Fragrance brand/house name' },
      name: { type: Type.STRING, description: 'Fragrance product name' },
      concentration: {
        type: Type.STRING,
        description: 'Fragrance concentration: Cologne (EDC), Toilette (EDT), Parfum (EDP), Extrait, or Pure Parfum',
      },
      nose: { type: Type.STRING, description: 'Perfumer/nose name or "Unknown" if not attributed' },
      releaseYear: { type: Type.INTEGER, description: 'Year of original release' },
      batchLineage: { type: Type.STRING, description: 'Brief formulation history/reformulation notes' },
      aromaChemicalMatrix: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          required: ['name', 'percentage', 'category', 'description'],
          properties: {
            name: { type: Type.STRING, description: 'Chemical compound name' },
            percentage: { type: Type.NUMBER, description: 'Percentage of compound (0-100)' },
            category: {
              type: Type.STRING,
              description: 'One of: Ambers/Musks, Woody Backbones, Sweet/Gourmand Anchors, Others',
            },
            description: { type: Type.STRING, description: 'Role and effect of this compound in the fragrance' },
          },
        },
        description: 'Array of aroma chemicals with percentages',
      },
      naturalToSyntheticRatio: {
        type: Type.OBJECT,
        required: ['natural', 'synthetic'],
        properties: {
          natural: { type: Type.INTEGER, description: 'Percentage of natural ingredients (0-100)' },
          synthetic: { type: Type.INTEGER, description: 'Percentage of synthetic ingredients (0-100)' },
        },
      },
      evaporationCurve: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          required: ['hour', 'top', 'heart', 'base'],
          properties: {
            hour: { type: Type.INTEGER, description: 'Time in hours' },
            top: { type: Type.INTEGER, description: 'Top note intensity 0-100' },
            heart: { type: Type.INTEGER, description: 'Heart note intensity 0-100' },
            base: { type: Type.INTEGER, description: 'Base note intensity 0-100' },
          },
        },
        description: 'Evaporation timeline showing how notes evolve over time',
      },
      skinLongevityIndex: { type: Type.NUMBER, description: 'Expected longevity on skin in hours' },
      fabricPermanenceIndex: { type: Type.NUMBER, description: 'Expected longevity on fabric in hours' },
      sillageProjectionRadiusCurve: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          required: ['hour', 'radiusFeet'],
          properties: {
            hour: { type: Type.INTEGER, description: 'Time in hours' },
            radiusFeet: { type: Type.NUMBER, description: 'Sillage projection radius in feet' },
          },
        },
        description: 'How far the fragrance projects over time',
      },
      olfactoryFatigueRisk: { type: Type.NUMBER, description: 'Risk of olfactory fatigue as percentage (0-100)' },
      olfactoryFatigueExplanation: { type: Type.STRING, description: 'Why this fragrance carries that fatigue risk' },
      olfactoryFamily: { type: Type.STRING, description: 'Primary olfactory family (Woody, Floral, Oriental, Fresh, etc.)' },
      accords: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          required: ['name', 'intensity'],
          properties: {
            name: { type: Type.STRING, description: 'Accord name (e.g., Soapy, Powdery, Metallic, Earthy)' },
            intensity: { type: Type.INTEGER, description: 'Intensity 0-100' },
          },
        },
        description: 'Sensory textures and their intensities',
      },
      tempRangeMinCelsius: { type: Type.INTEGER, description: 'Minimum recommended temperature in Celsius' },
      tempRangeMaxCelsius: { type: Type.INTEGER, description: 'Maximum recommended temperature in Celsius' },
      humidityTolerance: { type: Type.STRING, description: 'How humidity affects the fragrance (e.g., "Low humidity optimal")' },
      settingScoring: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          required: ['name', 'score'],
          properties: {
            name: { type: Type.STRING, description: 'Setting name (e.g., "Office", "Casual", "Nightlife")' },
            score: { type: Type.INTEGER, description: 'Suitability score 0-100' },
          },
        },
        description: 'How well this fragrance suits different settings',
      },
      avgRetailPrice: { type: Type.NUMBER, description: 'Average retail price in USD' },
      pricePerMl: { type: Type.NUMBER, description: 'Price per milliliter in USD' },
      valueRating: { type: Type.STRING, description: 'Value assessment: Great Value, Fair, Overpriced, or similar' },
      alternatives: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          required: ['brand', 'name', 'similarity', 'priceComparison'],
          properties: {
            brand: { type: Type.STRING },
            name: { type: Type.STRING },
            similarity: { type: Type.INTEGER, description: 'Similarity percentage 0-100' },
            priceComparison: { type: Type.STRING, description: 'cheaper, similar, or more expensive with price delta' },
          },
        },
        description: 'Similar fragrances with comparable profiles',
      },
      formulationHeritage: { type: Type.STRING, description: 'Notes on batch-to-batch changes or IFRA reformulations' },
      laymanChemistryExplanation: {
        type: Type.STRING,
        description: 'Explanation of how this fragrance works chemically in simple terms',
      },
      story: { type: Type.STRING, description: 'Evocative narrative or artistic story about the fragrance' },
      molecularBlueprintShift: {
        type: Type.OBJECT,
        required: ['title', 'highVolatilityEngine', 'highVolatilityEffect', 'lowVolatilityEngine', 'lowVolatilityEffect'],
        properties: {
          title: { type: Type.STRING },
          highVolatilityEngine: { type: Type.STRING, description: 'Top-note volatile compounds' },
          highVolatilityEffect: { type: Type.STRING, description: 'Effect of high-volatility compounds' },
          lowVolatilityEngine: { type: Type.STRING, description: 'Base-note fixative compounds' },
          lowVolatilityEffect: { type: Type.STRING, description: 'Effect of low-volatility compounds' },
        },
      },
      strategicTakeaway: { type: Type.STRING, description: 'Key insight about this fragrance design or appeal' },
      ifraAssessment: {
        type: Type.OBJECT,
        required: ['status', 'criticalRestrictedMaterials', 'chemistsTakeaway'],
        properties: {
          status: { type: Type.STRING, description: 'Compliant, Reformulated, Restricted, or similar' },
          criticalRestrictedMaterials: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['name', 'limitPercent', 'actualPercent', 'impact'],
              properties: {
                name: { type: Type.STRING },
                limitPercent: { type: Type.NUMBER, description: 'IFRA limit as percentage' },
                actualPercent: { type: Type.NUMBER, description: 'Actual percentage in formula' },
                impact: { type: Type.STRING, description: 'How this restriction affects the fragrance' },
              },
            },
          },
          chemistsTakeaway: { type: Type.STRING, description: 'Chemist perspective on IFRA compliance' },
        },
      },
      notes: {
        type: Type.OBJECT,
        required: ['top', 'heart', 'base'],
        properties: {
          top: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Top notes' },
          heart: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Heart/middle notes' },
          base: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Base notes' },
        },
      },
      historicalTimeline: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          required: ['year', 'title', 'description', 'classification'],
          properties: {
            year: { type: Type.STRING, description: 'Year or year range' },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            classification: { type: Type.STRING, description: 'Origin, Flanker Release, Reformulation, Milestone, Award, House Event, or Gossip' },
          },
        },
        description: 'Key milestones in the fragrance history',
      },
      parsedBatchCode: {
        type: Type.OBJECT,
        required: ['code', 'brand', 'isValid'],
        properties: {
          code: { type: Type.STRING, description: 'Example batch code (may be estimated)' },
          brand: { type: Type.STRING },
          isValid: { type: Type.BOOLEAN },
          manufacturingDate: { type: Type.STRING },
          factoryOrigin: { type: Type.STRING },
          shelfLifeStatus: { type: Type.STRING },
          activeIngredientsStability: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
      },
      densityShiftAnalysis: {
        type: Type.OBJECT,
        required: [
          'familyFocus',
          'highVolatilityEngine',
          'diffusionEffect',
          'lowVolatilityEngine',
          'tenacityEffect',
          'strategicPortfolioTakeaway'
        ],
        properties: {
          familyFocus: {
            type: Type.STRING,
            description: 'Primary fragrance family (Gourmand, Woody, Floral, Oriental, Fresh, etc.)'
          },
          highVolatilityEngine: {
            type: Type.STRING,
            description: 'Key top-note compounds driving initial diffusion (comma-separated list of compound names)'
          },
          diffusionEffect: {
            type: Type.STRING,
            description: 'Narrative describing the immediate sensory impact and diffusion behavior (2-3 sentences)'
          },
          lowVolatilityEngine: {
            type: Type.STRING,
            description: 'Key base compounds creating longevity and signature wear (comma-separated list of compound names)'
          },
          tenacityEffect: {
            type: Type.STRING,
            description: 'Narrative describing the long-lasting sensory experience (2-3 sentences)'
          },
          strategicPortfolioTakeaway: {
            type: Type.STRING,
            description: 'Strategic insight into formulation choices, market positioning, or house philosophy (2-3 sentences)'
          }
        }
      },
    },
  };
}
