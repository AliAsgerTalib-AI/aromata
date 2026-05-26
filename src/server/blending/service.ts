import { GoogleGenAI } from '@google/genai';
import { buildAnalysisPrompt, buildAnalysisSchema } from '../gemini/analysisPrompt';
import { EnhancedFragranceAnalysis } from '../types/analysisTypes';
import { GuidanceEngine } from './guidance';
import { TrialQueries } from '../db/queries';

interface Compound {
  name: string;
  percentage: number;
}

export class BlendingService {
  private guidance: GuidanceEngine;
  private ai: GoogleGenAI;

  constructor(private db: TrialQueries, aiClient: GoogleGenAI) {
    this.ai = aiClient;
    this.guidance = new GuidanceEngine(aiClient);
  }

  async analyzeComposition(compounds: Compound[]): Promise<EnhancedFragranceAnalysis> {
    // Reuse Phase 1 analysis engine
    const prompt = buildAnalysisPrompt('Trial', 'Trial Composition', compounds);
    const schema = buildAnalysisSchema();

    const response = await this.ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
      contents: [{role: "user", parts: [{text: prompt}]}],
      config: {
        systemInstruction: 'You are a professional research chemist. Return only valid JSON.',
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    });

    return JSON.parse(response.text.trim());
  }

  async getGuidance(
    compounds: Compound[],
    analysis: EnhancedFragranceAnalysis,
    type: 'intent' | 'balance',
    intent?: string
  ): Promise<any> {
    if (type === 'intent' && intent) {
      return {
        suggestions: await this.guidance.getIntentGuidance(compounds, analysis, intent)
      };
    } else if (type === 'balance') {
      return {
        hints: this.guidance.getBalanceHints(compounds, analysis)
      };
    }
    return null;
  }
}
