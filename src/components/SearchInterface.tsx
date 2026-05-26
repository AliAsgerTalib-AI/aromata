import { FormEvent } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { ParsedBatchCode } from '../server/types/analysisTypes';

interface SearchInterfaceProps {
  searchBrand: string;
  setSearchBrand: (value: string) => void;
  searchName: string;
  setSearchName: (value: string) => void;
  batchCodeInput: string;
  setBatchCodeInput: (value: string) => void;
  isAnalyzing: boolean;
  errorMessage: string | null;
  setErrorMessage: (value: string | null) => void;
  onAnalyze: (brand: string, name: string) => void;
  batchResult: ParsedBatchCode | null;
  batchError: string | null;
}

export function SearchInterface({
  searchBrand,
  setSearchBrand,
  searchName,
  setSearchName,
  batchCodeInput,
  setBatchCodeInput,
  isAnalyzing,
  errorMessage,
  setErrorMessage,
  onAnalyze,
  batchResult,
  batchError,
}: SearchInterfaceProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) {
      setErrorMessage('Fragrance name is required');
      return;
    }
    onAnalyze(searchBrand, searchName);
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#6A7180] font-mono uppercase mb-2">Brand / House</label>
              <input
                type="text"
                value={searchBrand}
                onChange={(e) => setSearchBrand(e.target.value)}
                placeholder="e.g., Christian Dior"
                className="w-full px-3 py-2 bg-[#0A0B0E] border border-[#2D3139] rounded-sm text-[#E0E2E6] placeholder-[#6A7180] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6A7180] font-mono uppercase mb-2">Fragrance Name *</label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="e.g., Sauvage"
                className="w-full px-3 py-2 bg-[#0A0B0E] border border-[#2D3139] rounded-sm text-[#E0E2E6] placeholder-[#6A7180] text-sm"
                required
              />
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-sm">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-mono text-xs font-bold uppercase rounded-sm transition disabled:opacity-50"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Fragrance'}
          </button>
        </form>
      </div>

      {batchResult && (
        <div className="bg-[#0F5132]/10 border border-[#198754]/30 rounded-sm p-4">
          <h4 className="font-mono text-xs font-bold text-[#198754] uppercase mb-2">Batch Code Decoded</h4>
          <p className="text-sm text-[#E0E2E6]">{batchResult.explanation}</p>
        </div>
      )}

      {batchError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4">
          <p className="text-sm text-red-300">{batchError}</p>
        </div>
      )}
    </div>
  );
}
