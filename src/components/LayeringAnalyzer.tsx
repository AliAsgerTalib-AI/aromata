import { useState, FormEvent } from 'react';
import { Layers, AlertTriangle } from 'lucide-react';
import { FragranceData } from '../types';

interface LayeringResult {
  compatibilityScore: number;
  compatibilityLevel: string;
  baseFixativeAmplification: string;
  topNoteConflict: string;
  applicationSequence: string;
  molecularSummary: string;
}

interface LayeringAnalyzerProps {
  availableFragrances: FragranceData[];
  selectedFragA: string;
  setSelectedFragA: (value: string) => void;
  selectedFragB: string;
  setSelectedFragB: (value: string) => void;
  isAnalyzing: boolean;
  result: LayeringResult | null;
  error: string | null;
  onAnalyze: (fragA: FragranceData, fragB: FragranceData) => Promise<void>;
  onPrintLayering: () => void;
}

export function LayeringAnalyzer({
  availableFragrances,
  selectedFragA,
  setSelectedFragA,
  selectedFragB,
  setSelectedFragB,
  isAnalyzing,
  result,
  error,
  onAnalyze,
  onPrintLayering,
}: LayeringAnalyzerProps) {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fragA = availableFragrances.find(f => `${f.brand} - ${f.name}` === selectedFragA);
    const fragB = availableFragrances.find(f => `${f.brand} - ${f.name}` === selectedFragB);

    if (fragA && fragB) {
      await onAnalyze(fragA, fragB);
    }
  };

  return (
    <div className="space-y-6 py-8">
      <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#3B82F6]" />
          Molecular Layering Compatibility Analyzer
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#6A7180] font-mono uppercase mb-2">Specimen A (Base)</label>
              <select
                value={selectedFragA}
                onChange={(e) => setSelectedFragA(e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0B0E] border border-[#2D3139] rounded-sm text-[#E0E2E6] text-sm"
              >
                {availableFragrances.map(f => (
                  <option key={`${f.brand}-${f.name}`} value={`${f.brand} - ${f.name}`}>
                    {f.brand} - {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#6A7180] font-mono uppercase mb-2">Specimen B (Layer)</label>
              <select
                value={selectedFragB}
                onChange={(e) => setSelectedFragB(e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0B0E] border border-[#2D3139] rounded-sm text-[#E0E2E6] text-sm"
              >
                {availableFragrances.map(f => (
                  <option key={`${f.brand}-${f.name}`} value={`${f.brand} - ${f.name}`}>
                    {f.brand} - {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-sm">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-mono text-xs font-bold uppercase rounded-sm transition disabled:opacity-50"
          >
            {isAnalyzing ? 'Analyzing...' : 'Run Compatibility Analysis'}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-sm font-bold text-white mb-2">{result.compatibilityLevel}</h4>
              <div className="text-3xl font-bold text-[#3B82F6]">{result.compatibilityScore}%</div>
            </div>
            <button
              onClick={onPrintLayering}
              className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-mono font-bold uppercase rounded-sm transition"
            >
              Print Report
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="text-xs font-bold text-[#10B981] uppercase mb-2">Base Fixative Amplification</h5>
              <p className="text-sm text-[#E0E2E6]">{result.baseFixativeAmplification}</p>
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#F59E0B] uppercase mb-2">Top Note Interaction</h5>
              <p className="text-sm text-[#E0E2E6]">{result.topNoteConflict}</p>
            </div>
            <div>
              <h5 className="text-xs font-bold text-[#3B82F6] uppercase mb-2">Application Sequence</h5>
              <p className="text-sm text-[#E0E2E6]">{result.applicationSequence}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
