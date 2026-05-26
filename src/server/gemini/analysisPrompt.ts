import { Type } from '@google/genai';

export function buildAnalysisPrompt(brand: string, name: string, compounds: Array<{name: string, percentage: number}>): string {
  const compoundsList = compounds
    .map(c => `- ${c.name}: ${c.percentage}%`)
    .join('\n');

  return `You are a professional research chemist and GC-MS expert. Perform a deep analytical assessment of the following fragrance composition, focusing on the five key analytical dimensions.

Brand: ${brand}
Fragrance Name: ${name}

Compound Composition:
${compoundsList}

Provide a comprehensive analysis covering:

1. **Synergistic Interactions**: Identify compound pairs that amplify, diminish, or transform each other's effects. Rate interaction strength 1-10. List dominant synergies.

2. **Dominant Accord Mechanics**: Explain why this fragrance "feels" like what it is. What primary accord does the composition create? Which compounds drive that perception? Address any surprising elements.

3. **Molecular Diffusion Dynamics**: Map volatility tiers (top/heart/base). Which molecules carry which? Provide evaporation sequence timing. Predict projection/sillage for each note phase.

4. **Stability Predictions**: Assess oxidation risk per compound. Predict shelf life, aging trajectory over 6 months/1 year/5 years. Note separation risks and storage recommendations.

5. **Formulation Efficiency**: Identify redundant compound roles. Rate formulation density (1=lean, 10=bloated). Note missing elements for better balance. Suggest improvements.

For each analysis, provide structured query answers that directly answer common expert questions about that dimension.

Return ONLY valid JSON matching the response schema. No markdown, no explanations outside the JSON.`;
}

export function buildAnalysisSchema() {
  return {
    type: Type.OBJECT,
    required: [
      'synergisticInteractions',
      'dominantAccordMechanics',
      'molecularDiffusionDynamics',
      'stabilityPredictions',
      'formulationEfficiency',
      'metadata'
    ],
    properties: {
      synergisticInteractions: {
        type: Type.OBJECT,
        required: ['pairs', 'threeWayEffects', 'dominantSynergies', 'summary', 'queries'],
        properties: {
          pairs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['compound_a', 'compound_b', 'interaction_type', 'strength', 'mechanism'],
              properties: {
                compound_a: { type: Type.STRING },
                compound_b: { type: Type.STRING },
                interaction_type: {
                  type: Type.STRING,
                  description: "Must be one of: 'amplifies', 'diminishes', 'transforms', 'neutral'"
                },
                strength: { type: Type.NUMBER, description: '1-10 scale' },
                mechanism: { type: Type.STRING }
              }
            }
          },
          threeWayEffects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['compounds', 'effect_type', 'strength', 'explanation'],
              properties: {
                compounds: { type: Type.ARRAY, items: { type: Type.STRING } },
                effect_type: { type: Type.STRING },
                strength: { type: Type.NUMBER },
                explanation: { type: Type.STRING }
              }
            }
          },
          dominantSynergies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['compound_a', 'compound_b', 'interaction_type', 'strength', 'mechanism'],
              properties: {
                compound_a: { type: Type.STRING },
                compound_b: { type: Type.STRING },
                interaction_type: { type: Type.STRING },
                strength: { type: Type.NUMBER },
                mechanism: { type: Type.STRING }
              }
            }
          },
          summary: { type: Type.STRING },
          queries: {
            type: Type.OBJECT,
            required: ['which_molecules_are_synergistic', 'where_are_dominant_synergies', 'how_do_synergies_shape_effect'],
            properties: {
              which_molecules_are_synergistic: { type: Type.STRING },
              where_are_dominant_synergies: { type: Type.STRING },
              how_do_synergies_shape_effect: { type: Type.STRING }
            }
          }
        }
      },
      dominantAccordMechanics: {
        type: Type.OBJECT,
        required: ['primaryAccord', 'primaryAccordConfidence', 'secondaryAccords', 'accordDrivers', 'psychologicalFactors', 'unexpectedElements', 'summary', 'queries'],
        properties: {
          primaryAccord: { type: Type.STRING },
          primaryAccordConfidence: { type: Type.NUMBER, description: '1-10' },
          secondaryAccords: { type: Type.ARRAY, items: { type: Type.STRING } },
          accordDrivers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['accord', 'compounds', 'roleDescription', 'confidence'],
              properties: {
                accord: { type: Type.STRING },
                compounds: { type: Type.ARRAY, items: { type: Type.STRING } },
                roleDescription: { type: Type.STRING },
                confidence: { type: Type.NUMBER }
              }
            }
          },
          psychologicalFactors: { type: Type.STRING },
          unexpectedElements: { type: Type.STRING },
          summary: { type: Type.STRING },
          queries: {
            type: Type.OBJECT,
            required: ['why_does_this_feel_like_accord', 'what_creates_impression', 'unexpected_elements_explanation'],
            properties: {
              why_does_this_feel_like_accord: { type: Type.STRING },
              what_creates_impression: { type: Type.STRING },
              unexpected_elements_explanation: { type: Type.STRING }
            }
          }
        }
      },
      molecularDiffusionDynamics: {
        type: Type.OBJECT,
        required: ['volatilityTiers', 'carrierRelationships', 'evaporationSequence', 'molecularWeightHierarchy', 'projectionPrediction', 'summary', 'queries'],
        properties: {
          volatilityTiers: {
            type: Type.OBJECT,
            required: ['top', 'heart', 'base'],
            properties: {
              top: { type: Type.ARRAY, items: { type: Type.STRING } },
              heart: { type: Type.ARRAY, items: { type: Type.STRING } },
              base: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          carrierRelationships: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['carrier', 'cargo', 'explanation'],
              properties: {
                carrier: { type: Type.STRING },
                cargo: { type: Type.ARRAY, items: { type: Type.STRING } },
                explanation: { type: Type.STRING }
              }
            }
          },
          evaporationSequence: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['phase', 'compounds', 'timingMinutes'],
              properties: {
                phase: { type: Type.STRING, description: "One of: 'top', 'heart', 'base'" },
                compounds: { type: Type.ARRAY, items: { type: Type.STRING } },
                timingMinutes: { type: Type.STRING }
              }
            }
          },
          molecularWeightHierarchy: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['compound', 'weight'],
              properties: {
                compound: { type: Type.STRING },
                weight: { type: Type.NUMBER }
              }
            }
          },
          projectionPrediction: {
            type: Type.OBJECT,
            required: ['topNoteProjection', 'topNoteExplanation', 'heartNoteProjection', 'heartNoteExplanation', 'baseNoteProjection', 'baseNoteExplanation'],
            properties: {
              topNoteProjection: { type: Type.STRING, description: "One of: 'low', 'medium', 'high'" },
              topNoteExplanation: { type: Type.STRING },
              heartNoteProjection: { type: Type.STRING },
              heartNoteExplanation: { type: Type.STRING },
              baseNoteProjection: { type: Type.STRING },
              baseNoteExplanation: { type: Type.STRING }
            }
          },
          summary: { type: Type.STRING },
          queries: {
            type: Type.OBJECT,
            required: ['which_molecules_carry_top_notes', 'how_does_this_project', 'evaporation_sequence'],
            properties: {
              which_molecules_carry_top_notes: { type: Type.STRING },
              how_does_this_project: { type: Type.STRING },
              evaporation_sequence: { type: Type.STRING }
            }
          }
        }
      },
      stabilityPredictions: {
        type: Type.OBJECT,
        required: ['oxidationRisk', 'chemicalReactions', 'separationRisk', 'separationExplanation', 'expectedShelfLife', 'agingTimeline', 'storageRecommendations', 'summary', 'queries'],
        properties: {
          oxidationRisk: {
            type: Type.OBJECT,
            required: ['overallRisk', 'vulnerableCompounds'],
            properties: {
              overallRisk: { type: Type.STRING, description: "One of: 'low', 'medium', 'high'" },
              vulnerableCompounds: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ['compound', 'riskLevel', 'mechanism'],
                  properties: {
                    compound: { type: Type.STRING },
                    riskLevel: { type: Type.STRING },
                    mechanism: { type: Type.STRING }
                  }
                }
              }
            }
          },
          chemicalReactions: { type: Type.ARRAY, items: { type: Type.STRING } },
          separationRisk: { type: Type.STRING },
          separationExplanation: { type: Type.STRING },
          expectedShelfLife: { type: Type.STRING, description: "One of: '6 months', '1 year', '3+ years'" },
          agingTimeline: {
            type: Type.OBJECT,
            required: ['sixMonths', 'oneYear', 'fiveYears'],
            properties: {
              sixMonths: { type: Type.STRING },
              oneYear: { type: Type.STRING },
              fiveYears: { type: Type.STRING }
            }
          },
          storageRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
          queries: {
            type: Type.OBJECT,
            required: ['how_will_this_age', 'shelf_life', 'which_compounds_at_oxidation_risk'],
            properties: {
              how_will_this_age: { type: Type.STRING },
              shelf_life: { type: Type.STRING },
              which_compounds_at_oxidation_risk: { type: Type.STRING }
            }
          }
        }
      },
      formulationEfficiency: {
        type: Type.OBJECT,
        required: ['redundancyMap', 'densityAssessment', 'missingElements', 'efficiencyScore', 'improvementSuggestions', 'summary', 'queries'],
        properties: {
          redundancyMap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['role', 'compounds', 'redundancyScore', 'suggestion'],
              properties: {
                role: { type: Type.STRING },
                compounds: { type: Type.ARRAY, items: { type: Type.STRING } },
                redundancyScore: { type: Type.NUMBER },
                suggestion: { type: Type.STRING }
              }
            }
          },
          densityAssessment: {
            type: Type.OBJECT,
            required: ['score', 'classification', 'explanation'],
            properties: {
              score: { type: Type.NUMBER },
              classification: { type: Type.STRING, description: "One of: 'lean', 'balanced', 'dense', 'bloated'" },
              explanation: { type: Type.STRING }
            }
          },
          missingElements: { type: Type.ARRAY, items: { type: Type.STRING } },
          efficiencyScore: { type: Type.NUMBER },
          improvementSuggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ['suggestion', 'rationale', 'impact'],
              properties: {
                suggestion: { type: Type.STRING },
                rationale: { type: Type.STRING },
                impact: { type: Type.STRING, description: "One of: 'low', 'medium', 'high'" }
              }
            }
          },
          summary: { type: Type.STRING },
          queries: {
            type: Type.OBJECT,
            required: ['is_this_over_formulated', 'where_can_we_tighten', 'whats_missing_for_balance'],
            properties: {
              is_this_over_formulated: { type: Type.STRING },
              where_can_we_tighten: { type: Type.STRING },
              whats_missing_for_balance: { type: Type.STRING }
            }
          }
        }
      },
      metadata: {
        type: Type.OBJECT,
        properties: {
          confidence_scores: { type: Type.OBJECT },
          limitations: { type: Type.ARRAY, items: { type: Type.STRING } },
          caveats: { type: Type.STRING }
        }
      }
    }
  };
}
