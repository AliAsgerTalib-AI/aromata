import { EnhancedFragranceAnalysis } from '../types/analysisTypes';

export interface CaseStudy {
  id: string;
  fragrance: {
    brand: string;
    name: string;
    concentration: string;
    releaseYear: number;
    nose: string;
  };
  strategicContext: string;
  chemistryStory: string;
  expertCommentary: string;
  analysis: EnhancedFragranceAnalysis;
  analysisTimestamp: number;
  frameworksFeatured: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  keyLessons: string[];
  variants?: Array<{
    name: string;
    concentration: string;
    analysis: EnhancedFragranceAnalysis;
    differencesFromBase: string;
  }>;
}

export interface Framework {
  id: string;
  name: string;
  phase1Dimension: 'synergistic_interactions' | 'dominant_accord_mechanics' | 'molecular_diffusion_dynamics' | 'stability_predictions' | 'formulation_efficiency';
  methodology: string;
  keyInsight: string;
  interactiveExample: {
    caseStudyId: string;
    explanation: string;
  };
  relatedCaseStudies: string[];
}

export interface Exercise {
  type: 'multiple_choice' | 'analyze_fragrance' | 'compare_fragrances' | 'predict_composition';
  instructions: string;
  fragranceId?: string;
  frag1Id?: string;
  frag2Id?: string;
  targetAccord?: string;
}

export interface Lesson {
  id: string;
  order: number;
  title: string;
  objective: string;
  framework: string;
  caseStudies: string[];
  content: string;
  exercise: Exercise;
  checkpointQuestions: string[];
}

export interface LearningPath {
  id: string;
  name: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  description: string;
  lessons: Lesson[];
  estimatedTime: string;
  prerequisites?: string[];
}

export interface ComparisonResult {
  frag1Id: string;
  frag2Id: string;
  frag1Analysis: EnhancedFragranceAnalysis;
  frag2Analysis: EnhancedFragranceAnalysis;
  keyDifferences: Array<{
    dimension: string;
    difference: string;
    explanation: string;
  }>;
}
