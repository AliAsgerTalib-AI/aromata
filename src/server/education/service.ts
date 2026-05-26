import { GoogleGenAI } from '@google/genai';
import { CaseStudy, ComparisonResult, Framework } from './types';
import { CASE_STUDIES } from './caseStudies';
import { FRAMEWORKS } from './frameworks';

export class EducationService {
  constructor(private ai: GoogleGenAI) {}

  getCaseStudy(id: string): CaseStudy | null {
    return CASE_STUDIES[id] || null;
  }

  getAllCaseStudies(): CaseStudy[] {
    return Object.values(CASE_STUDIES);
  }

  getCaseStudiesByFramework(frameworkId: string): CaseStudy[] {
    return Object.values(CASE_STUDIES).filter(cs => cs.frameworksFeatured.includes(frameworkId));
  }

  getCaseStudiesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): CaseStudy[] {
    return Object.values(CASE_STUDIES).filter(cs => cs.difficultyLevel === difficulty);
  }

  getFramework(id: string): Framework | null {
    return FRAMEWORKS[id] || null;
  }

  getAllFrameworks(): Framework[] {
    return Object.values(FRAMEWORKS);
  }

  async compareFragrances(frag1Id: string, frag2Id: string): Promise<ComparisonResult> {
    const frag1 = this.getCaseStudy(frag1Id);
    const frag2 = this.getCaseStudy(frag2Id);

    if (!frag1 || !frag2) {
      throw new Error('One or both fragrances not found');
    }

    // Generate comparison using Gemini
    const prompt = `Compare these two fragrances:
Fragrance 1: ${frag1.fragrance.brand} ${frag1.fragrance.name}
Fragrance 2: ${frag2.fragrance.brand} ${frag2.fragrance.name}

Analyze their key differences across:
1. Projection (how far they project)
2. Longevity (how long they last)
3. Accord character (how they feel)
4. Complexity (simple vs. complex)
5. Target audience

Format as a structured JSON with key differences.`;

    const response = await this.ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json'
      }
    });

    let differences: any = [];
    try {
      const parsed = JSON.parse(response.text.trim());
      differences = parsed.differences || [];
    } catch (e) {
      console.error('Failed to parse comparison response', e);
      differences = [];
    }

    return {
      frag1Id,
      frag2Id,
      frag1Analysis: frag1.analysis,
      frag2Analysis: frag2.analysis,
      keyDifferences: differences
    };
  }

  async evaluateCompositionForFramework(
    compounds: Array<{ name: string; percentage: number }>,
    frameworkId: string
  ): Promise<string> {
    const framework = this.getFramework(frameworkId);
    if (!framework) {
      throw new Error('Framework not found');
    }

    const compoundList = compounds.map(c => `${c.name} (${c.percentage}%)`).join(', ');

    const prompt = `Using the ${framework.name}, evaluate this fragrance composition:
${compoundList}

Apply the ${framework.name} methodology:
${framework.methodology}

Key insight: ${framework.keyInsight}

Provide a structured analysis of how this composition demonstrates (or fails to demonstrate) the principles of this framework.`;

    const response = await this.ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    return response.text;
  }
}
