import { GoogleGenAI } from '@google/genai';
import { EnhancedFragranceAnalysis } from '../types/analysisTypes';

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

interface Compound {
  name: string;
  percentage: number;
}

interface IntentSuggestion {
  compound: string;
  action: 'add' | 'increase' | 'decrease' | 'remove';
  currentPercentage?: number;
  suggestedPercentage?: number;
  reasoning: string;
}

interface BalanceHint {
  type: 'redundancy' | 'imbalance' | 'missing';
  title: string;
  description: string;
  compounds?: string[];
  suggestion?: string;
}

export class GuidanceEngine {
  constructor(private ai: GoogleGenAI) {}

  async getIntentGuidance(
    compounds: Compound[],
    analysis: EnhancedFragranceAnalysis,
    intent: string
  ): Promise<IntentSuggestion[]> {
    const compoundList = compounds
      .map(c => `${c.name}: ${c.percentage}%`)
      .join('\n');

    const prompt = `You are a master perfumer. Current composition:
${compoundList}

Current analysis summary:
- Primary Accord: ${analysis.dominantAccordMechanics.primaryAccord}
- Efficiency: ${analysis.formulationEfficiency.efficiencyScore}/10
- Key Synergies: ${analysis.synergisticInteractions.dominantSynergies.slice(0, 2).map(s => `${s.compound_a}-${s.compound_b}`).join(', ')}

User's Intent: "${intent}"

Suggest 3-5 specific compound changes (add/remove/increase/decrease %) to move toward this intent.
For each suggestion, provide reasoning.

Return JSON array: [{"compound": "name", "action": "add|increase|decrease|remove", "currentPercentage": X, "suggestedPercentage": Y, "reasoning": "..."}]
Only include fields relevant to the action (e.g., no suggestedPercentage for remove).`;

    const response = await this.ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{role: "user", parts: [{text: prompt}]}],
      config: {
        responseMimeType: 'application/json'
      }
    });

    try {
      const result = JSON.parse(response.text.trim());
      return Array.isArray(result) ? result : result.suggestions || [];
    } catch (e) {
      console.error('Failed to parse intent guidance:', e);
      return [];
    }
  }

  getBalanceHints(
    compounds: Compound[],
    analysis: EnhancedFragranceAnalysis
  ): BalanceHint[] {
    const hints: BalanceHint[] = [];

    // Check for redundancy (efficiency analysis)
    const redundancy = analysis.formulationEfficiency.redundancyMap;
    for (const item of redundancy) {
      if (item.redundancyScore >= 7) {
        hints.push({
          type: 'redundancy',
          title: `Redundancy detected: ${item.role}`,
          description: `${item.compounds.join(', ')} all serve similar roles (score: ${item.redundancyScore}/10).`,
          compounds: item.compounds,
          suggestion: item.suggestion
        });
      }
    }

    // Check for imbalance (volatility tiers)
    const tiers = analysis.molecularDiffusionDynamics.volatilityTiers;
    const totalCompounds = compounds.length;
    const heartCompounds = tiers.heart.length;
    const heartPercentage = compounds
      .filter(c => tiers.heart.includes(c.name))
      .reduce((sum, c) => sum + c.percentage, 0);

    if (heartPercentage < 20 && heartCompounds < totalCompounds * 0.3) {
      hints.push({
        type: 'imbalance',
        title: 'Heart layer underdeveloped',
        description: `Only ${heartPercentage.toFixed(1)}% of composition. Heart typically 30-50%.`,
        suggestion: 'Add a floral, fruity, or spicy accent to strengthen the heart'
      });
    }

    // Check for missing aldehydes or top notes
    const topTier = tiers.top;
    if (topTier.length === 0 || topTier.length < 3) {
      hints.push({
        type: 'missing',
        title: 'Limited top-note diversity',
        description: 'Few or no high-volatility compounds. Consider adding aldehydes or fresh citrus.',
        suggestion: 'Aldehydes add brightness; citrus adds freshness'
      });
    }

    return hints;
  }
}
