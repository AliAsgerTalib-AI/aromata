import React from 'react';
import { MolecularDiffusionDynamicsData } from '../types';
import { QueryPanel } from './QueryPanel';

interface DiffusionLayerProps {
  data: MolecularDiffusionDynamicsData;
  isExpanded: boolean;
}

export const DiffusionLayer: React.FC<DiffusionLayerProps> = ({ data, isExpanded }) => {
  if (!isExpanded) return null;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Overview</h4>
        <p className="text-sm text-gray-700">{data.summary}</p>
      </div>

      {/* Volatility Tiers */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-pink-50 p-3 rounded">
          <h5 className="font-semibold text-pink-900 mb-2">Top (High Volatility)</h5>
          <div className="text-xs text-gray-700 space-y-1">
            {data.volatilityTiers.top.map((c, i) => (
              <div key={i} className="bg-white px-2 py-1 rounded">{c}</div>
            ))}
          </div>
        </div>
        <div className="bg-amber-50 p-3 rounded">
          <h5 className="font-semibold text-amber-900 mb-2">Heart (Moderate)</h5>
          <div className="text-xs text-gray-700 space-y-1">
            {data.volatilityTiers.heart.map((c, i) => (
              <div key={i} className="bg-white px-2 py-1 rounded">{c}</div>
            ))}
          </div>
        </div>
        <div className="bg-indigo-50 p-3 rounded">
          <h5 className="font-semibold text-indigo-900 mb-2">Base (Low Volatility)</h5>
          <div className="text-xs text-gray-700 space-y-1">
            {data.volatilityTiers.base.map((c, i) => (
              <div key={i} className="bg-white px-2 py-1 rounded">{c}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Projection Prediction */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Projection & Sillage</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">Top Notes:</span>
            <span className="font-semibold text-gray-900">{data.projectionPrediction.topNoteProjection.toUpperCase()}</span>
          </div>
          <p className="text-xs text-gray-600 ml-4">{data.projectionPrediction.topNoteExplanation}</p>

          <div className="flex justify-between mt-3">
            <span className="text-gray-700">Heart Notes:</span>
            <span className="font-semibold text-gray-900">{data.projectionPrediction.heartNoteProjection.toUpperCase()}</span>
          </div>
          <p className="text-xs text-gray-600 ml-4">{data.projectionPrediction.heartNoteExplanation}</p>

          <div className="flex justify-between mt-3">
            <span className="text-gray-700">Base Notes:</span>
            <span className="font-semibold text-gray-900">{data.projectionPrediction.baseNoteProjection.toUpperCase()}</span>
          </div>
          <p className="text-xs text-gray-600 ml-4">{data.projectionPrediction.baseNoteExplanation}</p>
        </div>
      </div>

      {/* Carrier Relationships */}
      {data.carrierRelationships.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Carrier Relationships</h4>
          <div className="space-y-2">
            {data.carrierRelationships.slice(0, 5).map((rel, idx) => (
              <div key={idx} className="text-sm bg-gray-100 p-3 rounded">
                <div className="font-medium text-gray-900">{rel.carrier} carries:</div>
                <div className="text-gray-700 mt-1">{rel.cargo.join(', ')}</div>
                <div className="text-gray-600 text-xs mt-1">{rel.explanation}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queries */}
      <QueryPanel queries={data.queries} layerName="Diffusion" />
    </div>
  );
};
