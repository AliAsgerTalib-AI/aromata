import React, { useState } from 'react';
import { IntentSuggestion, BalanceHint } from '../types';

interface GuidancePanelProps {
  intent: string;
  suggestions?: IntentSuggestion[];
  hints?: BalanceHint[];
  onApplySuggestion: (suggestion: IntentSuggestion) => void;
  onGetIntentSuggestions: () => void;
  isLoading: boolean;
}

export const GuidancePanel: React.FC<GuidancePanelProps> = ({
  intent,
  suggestions,
  hints,
  onApplySuggestion,
  onGetIntentSuggestions,
  isLoading
}) => {
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);
  const [expandedHint, setExpandedHint] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Guidance Panel</h3>

      {/* Intent-Based Guidance */}
      <div className="bg-indigo-50 p-3 rounded-lg">
        <h4 className="text-sm font-semibold text-indigo-900 mb-2">Intent Guidance</h4>
        <p className="text-xs text-indigo-700 mb-2">
          {intent ? `Intent: "${intent}"` : 'Describe your goal to get suggestions'}
        </p>
        <button
          onClick={onGetIntentSuggestions}
          disabled={!intent || isLoading}
          className="w-full px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Getting Suggestions...' : 'Get Suggestions'}
        </button>

        {suggestions && suggestions.length > 0 && (
          <div className="mt-3 space-y-2">
            {suggestions.map((sug, idx) => (
              <div key={idx} className="bg-white p-2 rounded text-xs">
                <div className="font-medium text-gray-900">
                  {sug.action.charAt(0).toUpperCase() + sug.action.slice(1)} {sug.compound}
                  {sug.suggestedPercentage !== undefined && ` to ${sug.suggestedPercentage}%`}
                </div>
                <div className="text-gray-700 mt-1">{sug.reasoning}</div>
                <button
                  onClick={() => onApplySuggestion(sug)}
                  className="text-indigo-600 hover:text-indigo-900 text-xs font-medium mt-1"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Balance Hints */}
      {hints && hints.length > 0 && (
        <div className="bg-amber-50 p-3 rounded-lg">
          <h4 className="text-sm font-semibold text-amber-900 mb-2">Balance Hints</h4>
          <div className="space-y-2">
            {hints.map((hint, idx) => {
              const isExpanded = expandedHint === `${idx}`;
              return (
                <div key={idx} className="bg-white p-2 rounded text-xs">
                  <button
                    onClick={() => setExpandedHint(isExpanded ? null : `${idx}`)}
                    className="w-full text-left font-medium text-gray-900 flex justify-between items-center"
                  >
                    <span>{hint.title}</span>
                    <span>{isExpanded ? '▼' : '▶'}</span>
                  </button>
                  {isExpanded && (
                    <div className="mt-2 text-gray-700">
                      <p>{hint.description}</p>
                      {hint.suggestion && (
                        <p className="mt-1 text-indigo-600 font-medium">{hint.suggestion}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
