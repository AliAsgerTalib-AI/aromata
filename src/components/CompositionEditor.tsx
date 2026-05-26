import React, { useState } from 'react';
import { TrialComposition } from '../types';

interface CompositionEditorProps {
  composition: TrialComposition;
  intent: string;
  onCompositionChange: (composition: TrialComposition) => void;
  onIntentChange: (intent: string) => void;
  onAddCompound: () => void;
}

export const CompositionEditor: React.FC<CompositionEditorProps> = ({
  composition,
  intent,
  onCompositionChange,
  onIntentChange,
  onAddCompound
}) => {
  const [newCompound, setNewCompound] = useState('');
  const [newPercentage, setNewPercentage] = useState(5);

  const handleRemoveCompound = (index: number) => {
    const updated = {
      compounds: composition.compounds.filter((_, i) => i !== index)
    };
    onCompositionChange(updated);
  };

  const handleUpdatePercentage = (index: number, percentage: number) => {
    const updated = {
      compounds: composition.compounds.map((c, i) =>
        i === index ? { ...c, percentage: Math.max(0, Math.min(100, percentage)) } : c
      )
    };
    onCompositionChange(updated);
  };

  const handleAddCompound = () => {
    if (!newCompound.trim()) return;
    const updated = {
      compounds: [
        ...composition.compounds,
        { name: newCompound.trim(), percentage: newPercentage }
      ]
    };
    onCompositionChange(updated);
    setNewCompound('');
    setNewPercentage(5);
  };

  const totalPercentage = composition.compounds.reduce((sum, c) => sum + c.percentage, 0);
  const tooMuchWarning = totalPercentage > 100;
  const tooDilute = totalPercentage < 50;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Composition Editor</h3>

        {/* Intent */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Intent (optional)</label>
          <input
            type="text"
            placeholder="e.g., Make more floral, Increase projection..."
            value={intent}
            onChange={(e) => onIntentChange(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        {/* Compound List */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Compounds</label>
            <span className={`text-xs ${tooMuchWarning ? 'text-red-600' : tooDilute ? 'text-yellow-600' : 'text-gray-600'}`}>
              Total: {totalPercentage.toFixed(1)}%
            </span>
          </div>

          {composition.compounds.length === 0 && (
            <p className="text-sm text-gray-500 italic">No compounds yet. Add one below.</p>
          )}

          {composition.compounds.map((compound, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
              <span className="text-sm font-medium text-gray-900 flex-1 min-w-[120px]">
                {compound.name}
              </span>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={compound.percentage}
                  onChange={(e) => handleUpdatePercentage(idx, parseFloat(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={compound.percentage}
                  onChange={(e) => handleUpdatePercentage(idx, parseFloat(e.target.value))}
                  className="w-12 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <span className="text-sm text-gray-600">%</span>
              </div>
              <button
                onClick={() => handleRemoveCompound(idx)}
                className="text-red-600 hover:text-red-900 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {tooMuchWarning && (
          <p className="text-sm text-red-600 mb-3">⚠ Total exceeds 100%. Consider normalizing percentages.</p>
        )}
        {tooDilute && (
          <p className="text-sm text-yellow-600 mb-3">⚠ Total is very dilute (&lt;50%). May lack intensity.</p>
        )}

        {/* Add Compound */}
        <div className="space-y-2 bg-blue-50 p-3 rounded-lg">
          <label className="text-sm font-medium text-gray-700">Add Compound</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Compound name..."
              value={newCompound}
              onChange={(e) => setNewCompound(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={newPercentage}
              onChange={(e) => setNewPercentage(parseFloat(e.target.value))}
              className="w-16 px-2 py-2 border border-gray-300 rounded text-sm"
              placeholder="%"
            />
            <button
              onClick={handleAddCompound}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
