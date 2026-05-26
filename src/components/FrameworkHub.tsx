import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';

interface Framework {
  id: string;
  name: string;
  methodology: string;
  keyInsight: string;
}

interface FrameworkHubProps {
  onSelectFramework?: (frameworkId: string) => void;
}

export const FrameworkHub: React.FC<FrameworkHubProps> = ({ onSelectFramework }) => {
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
    return <p className="text-[#6A7180]">Loading frameworks...</p>;
  }

  return (
    <div className="space-y-6">
      <p className="text-[#9CA3AF] text-lg">Master the five expert frameworks that teach you to analyze fragrances like a professional.</p>

      {/* Frameworks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {frameworks.map(framework => (
          <div
            key={framework.id}
            onClick={() => onSelectFramework?.(framework.id)}
            className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6 hover:border-[#3B82F6] hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-[#3B82F6] flex-shrink-0 mt-1" />
              <h3 className="text-lg font-bold text-white group-hover:text-[#3B82F6] transition-colors">{framework.name}</h3>
            </div>
            <p className="text-[#9CA3AF] text-sm mb-4 line-clamp-3">{framework.methodology}</p>
            <div className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm mb-4">
              <p className="text-[#6A7180] text-xs uppercase font-mono font-bold mb-2">Key Insight</p>
              <p className="text-[#E0E2E6] text-sm line-clamp-2">{framework.keyInsight}</p>
            </div>
            <button className="w-full px-4 py-2 bg-[#3B82F6] text-white font-mono text-xs uppercase rounded-sm hover:bg-[#60A5FA] transition-colors">
              Learn Framework
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
