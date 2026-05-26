import React, { useState, useEffect } from 'react';
import { AnalysisView } from './AnalysisView';

interface CaseStudy {
  fragrance: {
    name: string;
    brand: string;
    concentration: string;
    releaseYear: number;
    nose: string;
  };
  strategicContext: string;
  chemistryStory: string;
  expertCommentary: string;
  analysis: any;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
}

interface CaseStudyDetailProps {
  caseStudyId: string;
  onBack: () => void;
}

export const CaseStudyDetail: React.FC<CaseStudyDetailProps> = ({ caseStudyId, onBack }) => {
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'context' | 'story' | 'analysis' | 'commentary'>('profile');

  useEffect(() => {
    fetchCaseStudy();
  }, [caseStudyId]);

  const fetchCaseStudy = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/education/case-studies/${caseStudyId}`);
      const data = await res.json();
      setCaseStudy(data);
    } catch (error) {
      console.error('Failed to fetch case study:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading case study...</p>;
  }

  if (!caseStudy) {
    return <p className="text-red-600">Case study not found.</p>;
  }

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
        ← Back to Case Studies
      </button>

      {/* Header */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">{caseStudy.fragrance.name}</h1>
        <p className="text-xl text-gray-600 mt-1">{caseStudy.fragrance.brand}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
          <div>
            <p className="text-gray-600">Perfumer</p>
            <p className="font-semibold text-gray-900">{caseStudy.fragrance.nose}</p>
          </div>
          <div>
            <p className="text-gray-600">Concentration</p>
            <p className="font-semibold text-gray-900">{caseStudy.fragrance.concentration}</p>
          </div>
          <div>
            <p className="text-gray-600">Released</p>
            <p className="font-semibold text-gray-900">{caseStudy.fragrance.releaseYear}</p>
          </div>
          <div>
            <p className="text-gray-600">Difficulty</p>
            <p className="font-semibold text-gray-900 capitalize">{caseStudy.difficultyLevel}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        {['profile', 'context', 'story', 'analysis', 'commentary'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 font-semibold text-sm transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Fragrance Profile</h2>
            <p className="text-gray-700">{caseStudy.fragrance.brand} {caseStudy.fragrance.name} is a {caseStudy.fragrance.concentration} released in {caseStudy.fragrance.releaseYear}, created by {caseStudy.fragrance.nose}.</p>
          </div>
        )}

        {activeTab === 'context' && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Strategic Context</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{caseStudy.strategicContext}</p>
          </div>
        )}

        {activeTab === 'story' && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Chemistry Story</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{caseStudy.chemistryStory}</p>
          </div>
        )}

        {activeTab === 'analysis' && caseStudy.analysis && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Full Analysis</h2>
            <AnalysisView analysis={caseStudy.analysis} fragranceName={caseStudy.fragrance.name} brand={caseStudy.fragrance.brand} />
          </div>
        )}

        {activeTab === 'commentary' && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Expert Commentary</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{caseStudy.expertCommentary}</p>
          </div>
        )}
      </div>
    </div>
  );
};
