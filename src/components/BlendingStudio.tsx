import React, { useState, useCallback, useEffect } from 'react';
import { TrialComposition, BlendingTrial, BlendingVersion, EnhancedAnalysisData, IntentSuggestion, BalanceHint } from '../types';
import { CompositionEditor } from './CompositionEditor';
import { GuidancePanel } from './GuidancePanel';
import { VersionManager } from './VersionManager';
import { AnalysisView } from './AnalysisView';

interface BlendingStudioProps {
  trial?: BlendingTrial;
  versions?: BlendingVersion[];
}

export const BlendingStudio: React.FC<BlendingStudioProps> = ({ trial, versions = [] }) => {
  const [composition, setComposition] = useState<TrialComposition>({ compounds: [] });
  const [intent, setIntent] = useState('');
  const [analysis, setAnalysis] = useState<EnhancedAnalysisData | null>(null);
  const [suggestions, setSuggestions] = useState<IntentSuggestion[]>([]);
  const [hints, setHints] = useState<BalanceHint[]>([]);
  const [isAnalyzing, setIsLoading] = useState(false);
  const [unsaved, setUnsaved] = useState(false);

  // Debounced re-analysis
  useEffect(() => {
    const timer = setTimeout(() => {
      if (composition.compounds.length > 0) {
        analyzeComposition();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [composition]);

  const analyzeComposition = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/blending/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trialId: trial?.id, composition })
      });
      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
        setUnsaved(true);

        // Get balance hints
        if (data.analysis) {
          setHints(getBalanceHints(data.analysis));
        }
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBalanceHints = (analysis: EnhancedAnalysisData): BalanceHint[] => {
    const hints: BalanceHint[] = [];
    // Same logic as server-side
    const redundancy = analysis.formulationEfficiency.redundancyMap;
    for (const item of redundancy) {
      if (item.redundancyScore >= 7) {
        hints.push({
          type: 'redundancy',
          title: `Redundancy: ${item.role}`,
          description: `${item.compounds.join(', ')} serve similar roles.`,
          compounds: item.compounds,
          suggestion: item.suggestion
        });
      }
    }
    return hints;
  };

  const handleGetIntentSuggestions = async () => {
    if (!intent.trim() || !analysis) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/blending/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          composition,
          analysis,
          type: 'intent',
          intent
        })
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Guidance failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = (suggestion: IntentSuggestion) => {
    const updated = { ...composition };

    switch (suggestion.action) {
      case 'add':
        updated.compounds.push({
          name: suggestion.compound,
          percentage: suggestion.suggestedPercentage || 5
        });
        break;
      case 'increase':
      case 'decrease':
        const idx = updated.compounds.findIndex(c => c.name === suggestion.compound);
        if (idx >= 0) {
          updated.compounds[idx].percentage = suggestion.suggestedPercentage || updated.compounds[idx].percentage;
        }
        break;
      case 'remove':
        updated.compounds = updated.compounds.filter(c => c.name !== suggestion.compound);
        break;
    }

    setComposition(updated);
    setSuggestions([]);
  };

  const handleSaveVersion = async (snapshotName: string) => {
    if (!trial || !analysis) return;
    try {
      await fetch(`/api/blending/versions/${trial.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          composition,
          analysis,
          snapshotName
        })
      });
      setUnsaved(false);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Blending Studio</h1>
      {trial && <p className="text-gray-600 mb-6">{trial.name}</p>}

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Composition Editor */}
        <div className="col-span-1 bg-white p-4 rounded-lg border border-gray-200">
          <CompositionEditor
            composition={composition}
            intent={intent}
            onCompositionChange={setComposition}
            onIntentChange={setIntent}
            onAddCompound={() => {}}
          />
        </div>

        {/* Center: Analysis Panel */}
        <div className="col-span-1 bg-white p-4 rounded-lg border border-gray-200">
          {analysis ? (
            <AnalysisView
              analysis={analysis}
              fragranceName="Trial"
              brand="Blending"
            />
          ) : (
            <p className="text-gray-500 text-sm">Add compounds to see analysis...</p>
          )}
        </div>

        {/* Right: Guidance & Versions */}
        <div className="col-span-1 bg-white p-4 rounded-lg border border-gray-200 space-y-6">
          <GuidancePanel
            intent={intent}
            suggestions={suggestions}
            hints={hints}
            onApplySuggestion={handleApplySuggestion}
            onGetIntentSuggestions={handleGetIntentSuggestions}
            isLoading={isAnalyzing}
          />

          {trial && (
            <VersionManager
              versions={versions}
              currentDraftUnsaved={unsaved}
              onSaveVersion={handleSaveVersion}
              onRestoreVersion={() => {}}
              onCompareVersions={() => {}}
              onDeleteVersion={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
};
