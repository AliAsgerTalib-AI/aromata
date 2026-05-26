import React, { useState, useEffect } from 'react';

interface Framework {
  id: string;
  name: string;
  methodology: string;
  keyInsight: string;
}

export const FrameworkHub: React.FC = () => {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFrameworks();
  }, []);

  const fetchFrameworks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/education/frameworks');
      const data = await res.json();
      setFrameworks(data.frameworks || []);
    } catch (error) {
      console.error('Failed to fetch frameworks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading frameworks...</p>;
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-600">Master the five expert frameworks that teach you to analyze fragrances like a professional.</p>

      {/* Frameworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {frameworks.map(framework => (
          <div key={framework.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{framework.name}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">{framework.methodology}</p>
            <div className="bg-blue-50 p-3 rounded mb-4">
              <p className="text-xs font-semibold text-blue-900">Key Insight</p>
              <p className="text-xs text-blue-800 mt-1">{framework.keyInsight}</p>
            </div>
            <button className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">
              Learn Framework
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
