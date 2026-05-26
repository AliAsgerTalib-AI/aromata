import React from 'react';
import { DominantAccordMechanicsData } from '../types';
import { QueryPanel } from './QueryPanel';

interface AccordsLayerProps {
  data: DominantAccordMechanicsData;
  isExpanded: boolean;
}

export const AccordsLayer: React.FC<AccordsLayerProps> = ({ data, isExpanded }) => {
  if (!isExpanded) return null;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Overview</h4>
        <p className="text-sm text-gray-700">{data.summary}</p>
      </div>

      {/* Primary Accord */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Primary Accord</h4>
        <div className="text-lg font-bold text-blue-900">{data.primaryAccord}</div>
        <div className="text-sm text-gray-700 mt-1">
          Confidence: {data.primaryAccordConfidence}/10
        </div>
      </div>

      {/* Accord Drivers */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">What Creates This Accord</h4>
        <div className="space-y-2">
          {data.accordDrivers.map((driver, idx) => (
            <div key={idx} className="text-sm bg-gray-100 p-3 rounded">
              <div className="font-medium text-gray-900">{driver.accord}</div>
              <div className="text-gray-700 mt-1">{driver.roleDescription}</div>
              <div className="text-gray-600 text-xs mt-2">
                Compounds: {driver.compounds.join(', ')} | Confidence: {driver.confidence}/10
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Accords */}
      {data.secondaryAccords.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Secondary Accords</h4>
          <div className="flex flex-wrap gap-2">
            {data.secondaryAccords.map((accord, idx) => (
              <span key={idx} className="text-sm bg-gray-200 px-3 py-1 rounded">
                {accord}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Psychological Factors */}
      {data.psychologicalFactors && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Psychological Factors</h4>
          <p className="text-sm text-gray-700">{data.psychologicalFactors}</p>
        </div>
      )}

      {/* Unexpected Elements */}
      {data.unexpectedElements && (
        <div className="bg-yellow-50 p-3 rounded">
          <h4 className="font-semibold text-gray-900 mb-2">Unexpected Elements</h4>
          <p className="text-sm text-gray-700">{data.unexpectedElements}</p>
        </div>
      )}

      {/* Queries */}
      <QueryPanel queries={data.queries} layerName="Accords" />
    </div>
  );
};
