import React, { useState } from 'react';

interface Framework {
  id: string;
  name: string;
  methodology: string;
  keyInsight: string;
  relatedCaseStudies: string[];
}

interface FrameworkDetailProps {
  frameworkId: string;
  onBack: () => void;
}

export const FrameworkDetail: React.FC<FrameworkDetailProps> = ({ frameworkId, onBack }) => {
  const [framework, setFramework] = useState<Framework | null>(null);
  const [loading, setLoading] = useState(true);
  const [userComposition, setUserComposition] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [evaluating, setEvaluating] = useState(false);

  React.useEffect(() => {
    fetchFramework();
  }, [frameworkId]);

  const fetchFramework = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/education/frameworks/${frameworkId}`);
      const data = await res.json();
      setFramework(data);
    } catch (error) {
      console.error('Failed to fetch framework:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!userComposition.trim() || !framework) return;

    try {
      setEvaluating(true);
      // Parse composition (simplified parsing for demo)
      const compounds = userComposition.split(',').map(line => {
        const parts = line.split(':');
        return {
          name: parts[0].trim(),
          percentage: parseInt(parts[1] || '0')
        };
      });

      const res = await fetch('/api/education/evaluate-composition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compounds, frameworkId })
      });
      const data = await res.json();
      setEvaluation(data.evaluation);
    } catch (error) {
      console.error('Failed to evaluate composition:', error);
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading framework...</p>;
  }

  if (!framework) {
    return <p className="text-red-600">Framework not found.</p>;
  }

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
        ← Back to Frameworks
      </button>

      {/* Header */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">{framework.name}</h1>
      </div>

      {/* Methodology */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-3">Methodology</h2>
        <p className="text-gray-700 leading-relaxed">{framework.methodology}</p>
      </div>

      {/* Key Insight */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Key Insight</h3>
        <p className="text-blue-800">{framework.keyInsight}</p>
      </div>

      {/* Interactive Exercise */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-3">Try It Yourself</h2>
        <p className="text-gray-600 mb-4">Enter a fragrance composition to evaluate using this framework.</p>
        <textarea
          value={userComposition}
          onChange={(e) => setUserComposition(e.target.value)}
          placeholder="Enter compounds (e.g., Sandalwood: 10, Vanilla: 8, Amber: 5)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3 h-24"
        />
        <button
          onClick={handleEvaluate}
          disabled={!userComposition.trim() || evaluating}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
        >
          {evaluating ? 'Evaluating...' : 'Evaluate Composition'}
        </button>

        {evaluation && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Evaluation</h3>
            <p className="text-gray-700 whitespace-pre-wrap text-sm">{evaluation}</p>
          </div>
        )}
      </div>

      {/* Related Case Studies */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-3">Related Case Studies</h2>
        <p className="text-gray-600 mb-4">See this framework in action:</p>
        <ul className="space-y-2">
          {framework.relatedCaseStudies.map(caseId => (
            <li key={caseId} className="text-blue-600 hover:text-blue-800 cursor-pointer">{caseId}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
