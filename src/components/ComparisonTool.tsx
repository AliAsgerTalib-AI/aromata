import React, { useState } from 'react';
import { Button } from './ui/Button';

interface KeyDifference {
  dimension: string;
  difference: string;
  explanation: string;
}

interface ComparisonResult {
  frag1Id: string;
  frag2Id: string;
  keyDifferences: KeyDifference[];
}

export const ComparisonTool: React.FC = () => {
  const [frag1Id, setFrag1Id] = useState('');
  const [frag2Id, setFrag2Id] = useState('');
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!frag1Id || !frag2Id) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/education/compare?frag1=${frag1Id}&frag2=${frag2Id}`);
      const data = await res.json();
      setComparison(data);
    } catch (error) {
      console.error('Failed to compare:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Fragrance Comparison</h2>

      {/* Input */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Fragrance 1</label>
          <input
            type="text"
            value={frag1Id}
            onChange={(e) => setFrag1Id(e.target.value)}
            placeholder="Case study ID (e.g., sauvage-dior)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Fragrance 2</label>
          <input
            type="text"
            value={frag2Id}
            onChange={(e) => setFrag2Id(e.target.value)}
            placeholder="Case study ID (e.g., lhomme-prada)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        <Button
          onClick={handleCompare}
          disabled={!frag1Id || !frag2Id || loading}
          isLoading={loading}
          variant="primary"
          className="w-full"
        >
          {loading ? 'Comparing...' : 'Compare Fragrances'}
        </Button>
      </div>

      {/* Results */}
      {comparison && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Comparison Results</h3>

          {comparison.keyDifferences.map((diff, idx) => (
            <div key={idx} className="border-b border-gray-200 pb-4 last:border-b-0">
              <h4 className="font-semibold text-gray-900 mb-1">{diff.dimension}</h4>
              <p className="text-sm text-gray-700 mb-1">{diff.difference}</p>
              <p className="text-xs text-gray-600">{diff.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
