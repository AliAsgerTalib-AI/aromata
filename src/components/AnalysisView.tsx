import React, { useState } from 'react';
import { EnhancedAnalysisData } from '../types';
import { SynergiesLayer } from './SynergiesLayer';
import { AccordsLayer } from './AccordsLayer';
import { DiffusionLayer } from './DiffusionLayer';
import { StabilityLayer } from './StabilityLayer';
import { EfficiencyLayer } from './EfficiencyLayer';

interface AnalysisViewProps {
  analysis: EnhancedAnalysisData;
  fragranceName?: string;
  brand?: string;
}

interface LayerState {
  synergies: boolean;
  accords: boolean;
  diffusion: boolean;
  stability: boolean;
  efficiency: boolean;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  analysis,
  fragranceName = 'Fragrance',
  brand = 'Unknown'
}) => {
  const [expanded, setExpanded] = useState<LayerState>({
    synergies: false,
    accords: false,
    diffusion: false,
    stability: false,
    efficiency: false
  });

  const toggleLayer = (layer: keyof LayerState) => {
    setExpanded(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Header Summary */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{brand} • {fragranceName}</h2>
        <p className="text-gray-600 mt-2">Deep analytical assessment across five dimensions</p>
      </div>

      {/* Key Findings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="font-semibold text-indigo-900 mb-2">Primary Accord</h3>
          <p className="text-lg font-bold text-indigo-900">
            {analysis.dominantAccordMechanics.primaryAccord}
          </p>
          <p className="text-xs text-indigo-700 mt-1">
            Confidence: {analysis.dominantAccordMechanics.primaryAccordConfidence}/10
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">Efficiency Score</h3>
          <p className="text-lg font-bold text-green-900">
            {analysis.formulationEfficiency.efficiencyScore}/10
          </p>
          <p className="text-xs text-green-700 mt-1">
            Classification: {analysis.formulationEfficiency.densityAssessment.classification}
          </p>
        </div>
      </div>

      {/* Analysis Layers */}
      <div className="space-y-4">
        {/* Synergies */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleLayer('synergies')}
            className={`w-full px-4 py-3 text-left font-semibold flex items-center justify-between transition-colors ${
              expanded.synergies
                ? 'bg-indigo-100 text-indigo-900'
                : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'
            }`}
          >
            <span>Synergistic Interactions</span>
            <span>{expanded.synergies ? '▼' : '▶'}</span>
          </button>
          {expanded.synergies && (
            <div className="px-4 py-4">
              <SynergiesLayer
                data={analysis.synergisticInteractions}
                isExpanded={expanded.synergies}
              />
            </div>
          )}
        </div>

        {/* Accords */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleLayer('accords')}
            className={`w-full px-4 py-3 text-left font-semibold flex items-center justify-between transition-colors ${
              expanded.accords
                ? 'bg-blue-100 text-blue-900'
                : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
            }`}
          >
            <span>Dominant Accord Mechanics</span>
            <span>{expanded.accords ? '▼' : '▶'}</span>
          </button>
          {expanded.accords && (
            <div className="px-4 py-4">
              <AccordsLayer
                data={analysis.dominantAccordMechanics}
                isExpanded={expanded.accords}
              />
            </div>
          )}
        </div>

        {/* Diffusion */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleLayer('diffusion')}
            className={`w-full px-4 py-3 text-left font-semibold flex items-center justify-between transition-colors ${
              expanded.diffusion
                ? 'bg-amber-100 text-amber-900'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            <span>Molecular Diffusion Dynamics</span>
            <span>{expanded.diffusion ? '▼' : '▶'}</span>
          </button>
          {expanded.diffusion && (
            <div className="px-4 py-4">
              <DiffusionLayer
                data={analysis.molecularDiffusionDynamics}
                isExpanded={expanded.diffusion}
              />
            </div>
          )}
        </div>

        {/* Stability */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleLayer('stability')}
            className={`w-full px-4 py-3 text-left font-semibold flex items-center justify-between transition-colors ${
              expanded.stability
                ? 'bg-red-100 text-red-900'
                : 'bg-red-50 text-red-900 hover:bg-red-100'
            }`}
          >
            <span>Stability Predictions</span>
            <span>{expanded.stability ? '▼' : '▶'}</span>
          </button>
          {expanded.stability && (
            <div className="px-4 py-4">
              <StabilityLayer
                data={analysis.stabilityPredictions}
                isExpanded={expanded.stability}
              />
            </div>
          )}
        </div>

        {/* Efficiency */}
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleLayer('efficiency')}
            className={`w-full px-4 py-3 text-left font-semibold flex items-center justify-between transition-colors ${
              expanded.efficiency
                ? 'bg-green-100 text-green-900'
                : 'bg-green-50 text-green-900 hover:bg-green-100'
            }`}
          >
            <span>Formulation Efficiency</span>
            <span>{expanded.efficiency ? '▼' : '▶'}</span>
          </button>
          {expanded.efficiency && (
            <div className="px-4 py-4">
              <EfficiencyLayer
                data={analysis.formulationEfficiency}
                isExpanded={expanded.efficiency}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
