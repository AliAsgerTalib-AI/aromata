import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';

interface CaseStudy {
  id: string;
  fragrance: {
    name: string;
    brand: string;
    nose: string;
    releaseYear: number;
  };
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
}

interface CaseStudyLibraryProps {
  onSelectCaseStudy?: (caseStudyId: string) => void;
}

export const CaseStudyLibrary: React.FC<CaseStudyLibraryProps> = ({ onSelectCaseStudy }) => {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  useEffect(() => {
    fetchCaseStudies();
  }, [selectedDifficulty]);

  const fetchCaseStudies = async () => {
    try {
      setLoading(true);
      const query = selectedDifficulty ? `?difficulty=${selectedDifficulty}` : '';
      const res = await fetch(`/api/education/case-studies${query}`);
      const data = await res.json();
      setCases(data.cases || []);
    } catch (error) {
      console.error('Failed to fetch case studies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-[#6A7180]">Loading case studies...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
        <h3 className="font-semibold mb-4 text-white text-sm font-mono uppercase">Filter by Difficulty</h3>
        <div className="flex gap-3 flex-wrap">
          {['', 'beginner', 'intermediate', 'advanced'].map(level => (
            <button
              key={level || 'all'}
              onClick={() => setSelectedDifficulty(level)}
              className={`px-4 py-2 text-xs font-mono uppercase rounded-sm transition-colors ${
                selectedDifficulty === level
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-[#0A0B0E] border border-[#2D3139] text-[#9CA3AF] hover:text-white hover:border-[#3B82F6]'
              }`}
            >
              {level ? level.charAt(0).toUpperCase() + level.slice(1) : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Case Studies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cases.map(caseStudy => (
          <div
            key={caseStudy.id}
            onClick={() => onSelectCaseStudy?.(caseStudy.id)}
            className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6 hover:border-[#3B82F6] hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white group-hover:text-[#3B82F6] transition-colors">{caseStudy.fragrance.name}</h3>
                <p className="text-[#9CA3AF] text-sm">{caseStudy.fragrance.brand}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-mono uppercase rounded-sm whitespace-nowrap ml-2 ${
                caseStudy.difficultyLevel === 'beginner'
                  ? 'bg-[#10B981]/20 text-[#10B981]'
                  : caseStudy.difficultyLevel === 'intermediate'
                  ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
                  : 'bg-[#F59E0B]/20 text-[#F59E0B]'
              }`}>
                {caseStudy.difficultyLevel}
              </span>
            </div>

            <div className="space-y-2 text-sm text-[#9CA3AF] font-mono mb-4">
              <p><span className="text-[#6A7180]">Nose:</span> {caseStudy.fragrance.nose}</p>
              <p><span className="text-[#6A7180]">Released:</span> {caseStudy.fragrance.releaseYear}</p>
            </div>

            <button className="w-full px-4 py-2 bg-[#3B82F6] text-white font-mono text-xs uppercase rounded-sm hover:bg-[#60A5FA] transition-colors">
              Read Case Study
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
