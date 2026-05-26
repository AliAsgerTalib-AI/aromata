import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';

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

export const CaseStudyLibrary: React.FC = () => {
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
    return <p className="text-gray-600">Loading case studies...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold mb-3 text-gray-900">Filter by Difficulty</h3>
        <div className="flex gap-3">
          {['', 'beginner', 'intermediate', 'advanced'].map(level => (
            <Button
              key={level || 'all'}
              onClick={() => setSelectedDifficulty(level)}
              variant={selectedDifficulty === level ? 'primary' : 'secondary'}
              size="sm"
            >
              {level || 'All'}
            </Button>
          ))}
        </div>
      </div>

      {/* Case Studies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cases.map(caseStudy => (
          <div key={caseStudy.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{caseStudy.fragrance.name}</h3>
              <p className="text-sm text-gray-600">{caseStudy.fragrance.brand}</p>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Nose:</strong> {caseStudy.fragrance.nose}</p>
              <p><strong>Released:</strong> {caseStudy.fragrance.releaseYear}</p>
              <p><strong>Difficulty:</strong> <span className="capitalize text-blue-600">{caseStudy.difficultyLevel}</span></p>
            </div>
            <Button variant="primary" size="sm" className="mt-4 w-full">
              Read Case Study
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
