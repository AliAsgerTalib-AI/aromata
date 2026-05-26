import React, { useState } from 'react';
import { BookOpen, Lightbulb, Compass } from 'lucide-react';
import { CaseStudyLibrary } from './CaseStudyLibrary';
import { FrameworkHub } from './FrameworkHub';
import { LearningPathLibrary } from './LearningPathLibrary';

type EducationTab = 'cases' | 'frameworks' | 'paths';

export const EducationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EducationTab>('cases');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Education Hub</h1>
      <p className="text-gray-600 mb-6">Learn fragrance analysis through case studies, expert frameworks, and guided learning paths.</p>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('cases')}
          className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors ${
            activeTab === 'cases'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Compass className="w-5 h-5" />
          Case Studies
        </button>
        <button
          onClick={() => setActiveTab('frameworks')}
          className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors ${
            activeTab === 'frameworks'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lightbulb className="w-5 h-5" />
          Frameworks
        </button>
        <button
          onClick={() => setActiveTab('paths')}
          className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors ${
            activeTab === 'paths'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          Learning Paths
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'cases' && <CaseStudyLibrary />}
      {activeTab === 'frameworks' && <FrameworkHub />}
      {activeTab === 'paths' && <LearningPathLibrary />}
    </div>
  );
};
