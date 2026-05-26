import React, { useState } from 'react';
import { BookOpen, Lightbulb, Compass } from 'lucide-react';
import { CaseStudyLibrary } from './CaseStudyLibrary';
import { FrameworkHub } from './FrameworkHub';
import { LearningPathLibrary } from './LearningPathLibrary';
import { LearningPathView } from './LearningPathView';

type EducationTab = 'cases' | 'frameworks' | 'paths';

export const EducationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EducationTab>('cases');
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Education Hub</h1>
      <p className="text-gray-600 mb-6">Learn fragrance analysis through case studies, expert frameworks, and guided learning paths.</p>

      {/* Tab Navigation */}
      <div role="tablist" aria-label="Education content sections" className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          role="tab"
          id="tab-cases"
          aria-selected={activeTab === 'cases'}
          aria-controls="panel-cases"
          onClick={() => setActiveTab('cases')}
          className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 ${
            activeTab === 'cases'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Compass className="w-5 h-5" aria-hidden="true" />
          Case Studies
        </button>
        <button
          role="tab"
          id="tab-frameworks"
          aria-selected={activeTab === 'frameworks'}
          aria-controls="panel-frameworks"
          onClick={() => setActiveTab('frameworks')}
          className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 ${
            activeTab === 'frameworks'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lightbulb className="w-5 h-5" aria-hidden="true" />
          Frameworks
        </button>
        <button
          role="tab"
          id="tab-paths"
          aria-selected={activeTab === 'paths'}
          aria-controls="panel-paths"
          onClick={() => setActiveTab('paths')}
          className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 ${
            activeTab === 'paths'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BookOpen className="w-5 h-5" aria-hidden="true" />
          Learning Paths
        </button>
      </div>

      {/* Tab Content */}
      <div id="panel-cases" role="tabpanel" aria-labelledby="tab-cases">
        {activeTab === 'cases' && <CaseStudyLibrary />}
      </div>
      <div id="panel-frameworks" role="tabpanel" aria-labelledby="tab-frameworks">
        {activeTab === 'frameworks' && <FrameworkHub />}
      </div>
      <div id="panel-paths" role="tabpanel" aria-labelledby="tab-paths">
        {activeTab === 'paths' && (
          selectedPathId ? (
            <LearningPathView
              pathId={selectedPathId}
              onBack={() => setSelectedPathId(null)}
            />
          ) : (
            <LearningPathLibrary
              onSelectPath={setSelectedPathId}
            />
          )
        )}
      </div>
    </div>
  );
};
