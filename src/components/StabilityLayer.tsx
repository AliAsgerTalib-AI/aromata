import React from 'react';
import { StabilityPredictionsData } from '../types';
import { QueryPanel } from './QueryPanel';

interface StabilityLayerProps {
  data: StabilityPredictionsData;
  isExpanded: boolean;
}

export const StabilityLayer: React.FC<StabilityLayerProps> = ({ data, isExpanded }) => {
  if (!isExpanded) return null;

  const riskColor = {
    low: 'text-green-700 bg-green-50',
    medium: 'text-yellow-700 bg-yellow-50',
    high: 'text-red-700 bg-red-50'
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Overview</h4>
        <p className="text-sm text-gray-700">{data.summary}</p>
      </div>

      {/* Overall Risk Assessment */}
      <div className={`p-4 rounded-lg ${riskColor[data.oxidationRisk.overallRisk]}`}>
        <h4 className="font-semibold mb-2">Oxidation Risk</h4>
        <div className="text-lg font-bold uppercase">{data.oxidationRisk.overallRisk}</div>
      </div>

      {/* Vulnerable Compounds */}
      {data.oxidationRisk.vulnerableCompounds.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Vulnerable Compounds</h4>
          <div className="space-y-2">
            {data.oxidationRisk.vulnerableCompounds.map((compound, idx) => (
              <div key={idx} className={`text-sm p-3 rounded ${riskColor[compound.riskLevel]}`}>
                <div className="font-medium">{compound.compound}</div>
                <div className="text-xs mt-1">{compound.mechanism}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shelf Life */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Expected Shelf Life</h4>
        <div className="text-lg font-bold text-blue-900">{data.expectedShelfLife}</div>
      </div>

      {/* Aging Timeline */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">How This Will Age</h4>
        <div className="space-y-3">
          <div className="bg-gray-100 p-3 rounded">
            <div className="font-semibold text-gray-900 text-sm">6 Months</div>
            <p className="text-xs text-gray-700 mt-1">{data.agingTimeline.sixMonths}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <div className="font-semibold text-gray-900 text-sm">1 Year</div>
            <p className="text-xs text-gray-700 mt-1">{data.agingTimeline.oneYear}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded">
            <div className="font-semibold text-gray-900 text-sm">5 Years</div>
            <p className="text-xs text-gray-700 mt-1">{data.agingTimeline.fiveYears}</p>
          </div>
        </div>
      </div>

      {/* Storage Recommendations */}
      {data.storageRecommendations.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Storage Recommendations</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            {data.storageRecommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Queries */}
      <QueryPanel queries={data.queries} layerName="Stability" />
    </div>
  );
};
