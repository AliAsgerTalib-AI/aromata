import React from 'react';
import { SynergisticInteractionsData } from '../types';
import { QueryPanel } from './QueryPanel';

interface SynergiesLayerProps {
  data: SynergisticInteractionsData;
  isExpanded: boolean;
}

export const SynergiesLayer: React.FC<SynergiesLayerProps> = ({ data, isExpanded }) => {
  if (!isExpanded) return null;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Overview</h4>
        <p className="text-sm text-gray-700">{data.summary}</p>
      </div>

      {/* Dominant Synergies */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Dominant Synergies</h4>
        <div className="space-y-2">
          {data.dominantSynergies.slice(0, 5).map((synergy, idx) => (
            <div key={idx} className="text-sm bg-indigo-50 p-3 rounded">
              <div className="font-medium text-gray-900">
                {synergy.compound_a} ↔ {synergy.compound_b}
              </div>
              <div className="text-gray-700 mt-1">{synergy.interaction_type}</div>
              <div className="text-gray-600 text-xs mt-1">
                Strength: {synergy.strength}/10 — {synergy.mechanism}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Three-Way Effects */}
      {data.threeWayEffects.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Three-Way Effects</h4>
          <div className="space-y-2">
            {data.threeWayEffects.slice(0, 3).map((effect, idx) => (
              <div key={idx} className="text-sm bg-purple-50 p-3 rounded">
                <div className="font-medium text-gray-900">
                  {effect.compounds.join(' + ')}
                </div>
                <div className="text-gray-700 mt-1">{effect.explanation}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queries */}
      <QueryPanel queries={data.queries} layerName="Synergies" />
    </div>
  );
};
