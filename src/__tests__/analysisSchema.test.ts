import { buildAnalysisSchema } from '../server/gemini/analysisPrompt';
import { Type } from '@google/genai';

describe('Analysis Schema Validation', () => {
  it('should define schema with all five required analyses', () => {
    const schema = buildAnalysisSchema();
    const required = schema.required as string[];

    expect(required).toContain('synergisticInteractions');
    expect(required).toContain('dominantAccordMechanics');
    expect(required).toContain('molecularDiffusionDynamics');
    expect(required).toContain('stabilityPredictions');
    expect(required).toContain('formulationEfficiency');
    expect(required).toContain('metadata');
  });

  it('should have proper structure for synergisticInteractions', () => {
    const schema = buildAnalysisSchema();
    const synergies = schema.properties.synergisticInteractions;

    expect(synergies).toBeDefined();
    expect(synergies.required).toContain('pairs');
    expect(synergies.required).toContain('queries');
  });

  it('should have proper structure for dominantAccordMechanics', () => {
    const schema = buildAnalysisSchema();
    const accords = schema.properties.dominantAccordMechanics;

    expect(accords).toBeDefined();
    expect(accords.required).toContain('primaryAccord');
    expect(accords.required).toContain('accordDrivers');
  });

  it('should have proper structure for molecularDiffusionDynamics', () => {
    const schema = buildAnalysisSchema();
    const diffusion = schema.properties.molecularDiffusionDynamics;

    expect(diffusion).toBeDefined();
    expect(diffusion.required).toContain('volatilityTiers');
    expect(diffusion.required).toContain('projectionPrediction');
  });

  it('should have proper structure for stabilityPredictions', () => {
    const schema = buildAnalysisSchema();
    const stability = schema.properties.stabilityPredictions;

    expect(stability).toBeDefined();
    expect(stability.required).toContain('oxidationRisk');
    expect(stability.required).toContain('agingTimeline');
  });

  it('should have proper structure for formulationEfficiency', () => {
    const schema = buildAnalysisSchema();
    const efficiency = schema.properties.formulationEfficiency;

    expect(efficiency).toBeDefined();
    expect(efficiency.required).toContain('densityAssessment');
    expect(efficiency.required).toContain('improvementSuggestions');
  });

  it('should have queries object for each analysis layer', () => {
    const schema = buildAnalysisSchema();

    const synergiesQueries = schema.properties.synergisticInteractions.properties.queries;
    expect(synergiesQueries.required).toContain('which_molecules_are_synergistic');

    const accordsQueries = schema.properties.dominantAccordMechanics.properties.queries;
    expect(accordsQueries.required).toContain('why_does_this_feel_like_accord');

    const diffusionQueries = schema.properties.molecularDiffusionDynamics.properties.queries;
    expect(diffusionQueries.required).toContain('which_molecules_carry_top_notes');
  });
});
