import React from 'react';
import { FormulationEfficiencyData } from '../types';
import { QueryPanel } from './QueryPanel';

interface EfficiencyLayerProps {
  data: FormulationEfficiencyData;
  isExpanded: boolean;
}

export const EfficiencyLayer: React.FC<EfficiencyLayerProps> = ({ data, isExpanded }) => {
  if (!isExpanded) return null;

  const densityColor = {
    lean: 'text-blue-700 bg-blue-50',
    balanced: 'text-green-700 bg-green-50',
    dense: 'text-amber-700 bg-amber-50',
    bloated: 'text-red-700 bg-red-50'
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Overview</h4>
        <p className="text-sm text-gray-700">{data.summary}</p>
      </div>

      {/* Efficiency Score */}
      <div className="bg-indigo-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Overall Efficiency Score</h4>
        <div className="text-3xl font-bold text-indigo-900">{data.efficiencyScore}/10</div>
        <p className="text-xs text-gray-600 mt-1">How well optimized this composition is</p>
      </div>

      {/* Density Assessment */}
      <div className={`p-4 rounded-lg ${densityColor[data.densityAssessment.classification]}`}>
        <h4 className="font-semibold mb-2">Formulation Density</h4>
        <div className="text-lg font-bold uppercase">{data.densityAssessment.classification}</div>
        <div className="text-sm mt-2">{data.densityAssessment.explanation}</div>
      </div>

      {/* Redundancy Map */}
      {data.redundancyMap.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Redundant Roles</h4>
          <div className="space-y-2">
            {data.redundancyMap.map((item, idx) => (
              <div key={idx} className="bg-gray-100 p-3 rounded">
                <div className="font-medium text-gray-900 text-sm">{item.role}</div>
                <div className="text-xs text-gray-700 mt-1">
                  Compounds: {item.compounds.join(', ')}
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  Redundancy: {item.redundancyScore}/10 — {item.suggestion}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Elements */}
      {data.missingElements.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded">
          <h4 className="font-semibold text-gray-900 mb-2">Missing Elements</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            {data.missingElements.map((element, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2">▸</span>
                <span>{element}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvement Suggestions */}
      {data.improvementSuggestions.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Improvement Suggestions</h4>
          <div className="space-y-2">
            {data.improvementSuggestions.slice(0, 4).map((suggestion, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded border-l-4 border-indigo-500">
                <div className="font-medium text-gray-900 text-sm">{suggestion.suggestion}</div>
                <div className="text-xs text-gray-700 mt-1">{suggestion.rationale}</div>
                <div className="text-xs text-gray-600 mt-2">
                  Impact: <span className="font-semibold capitalize">{suggestion.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queries */}
      <QueryPanel queries={data.queries} layerName="Efficiency" />
    </div>
  );
};
