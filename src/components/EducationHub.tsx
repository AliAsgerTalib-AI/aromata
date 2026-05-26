import React, { useState } from 'react';
import { BookOpen, Lightbulb, Compass, ArrowLeft } from 'lucide-react';
import { CaseStudyLibrary } from './CaseStudyLibrary';
import { FrameworkHub } from './FrameworkHub';
import { LearningPathLibrary } from './LearningPathLibrary';
import { LearningPathView } from './LearningPathView';

type EducationTab = 'cases' | 'frameworks' | 'paths';

export const EducationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EducationTab>('paths');
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string | null>(null);
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<string | null>(null);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-8">
        <h1 className="text-4xl font-bold text-white mb-3">Education Hub</h1>
        <p className="text-[#9CA3AF] text-lg">Master fragrance analysis through structured frameworks, real case studies, and guided learning paths.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-[#2D3139]">
        {[
          { key: 'paths', label: 'Learning Paths', icon: BookOpen },
          { key: 'frameworks', label: 'Expert Frameworks', icon: Lightbulb },
          { key: 'cases', label: 'Case Studies', icon: Compass }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as EducationTab);
                setSelectedPathId(null);
                setSelectedFrameworkId(null);
                setSelectedCaseStudyId(null);
              }}
              className={`flex items-center gap-2 px-6 py-4 font-mono uppercase text-sm transition-colors border-b-2 ${
                activeTab === tab.key
                  ? 'border-[#3B82F6] text-[#3B82F6]'
                  : 'border-transparent text-[#6A7180] hover:text-[#9CA3AF]'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'paths' && (
          selectedPathId ? (
            <div>
              <button
                onClick={() => setSelectedPathId(null)}
                className="flex items-center gap-2 text-[#3B82F6] hover:text-[#60A5FA] mb-6 font-mono text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Paths
              </button>
              <LearningPathView
                pathId={selectedPathId}
                onBack={() => setSelectedPathId(null)}
              />
            </div>
          ) : (
            <LearningPathLibrary onSelectPath={setSelectedPathId} />
          )
        )}

        {activeTab === 'frameworks' && (
          selectedFrameworkId ? (
            <div>
              <button
                onClick={() => setSelectedFrameworkId(null)}
                className="flex items-center gap-2 text-[#3B82F6] hover:text-[#60A5FA] mb-6 font-mono text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Frameworks
              </button>
              <FrameworkDetail frameworkId={selectedFrameworkId} />
            </div>
          ) : (
            <FrameworkHub onSelectFramework={setSelectedFrameworkId} />
          )
        )}

        {activeTab === 'cases' && (
          selectedCaseStudyId ? (
            <div>
              <button
                onClick={() => setSelectedCaseStudyId(null)}
                className="flex items-center gap-2 text-[#3B82F6] hover:text-[#60A5FA] mb-6 font-mono text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Case Studies
              </button>
              <CaseStudyDetail caseStudyId={selectedCaseStudyId} />
            </div>
          ) : (
            <CaseStudyLibrary onSelectCaseStudy={setSelectedCaseStudyId} />
          )
        )}
      </div>
    </div>
  );
};

// Framework Detail Component
const FrameworkDetail: React.FC<{ frameworkId: string }> = ({ frameworkId }) => {
  const [framework, setFramework] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/education/frameworks/${frameworkId}`)
      .then(res => res.json())
      .then(data => {
        setFramework(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [frameworkId]);

  if (loading) return <p className="text-[#6A7180]">Loading framework...</p>;
  if (!framework) return <p className="text-[#EF4444]">Framework not found</p>;

  return (
    <div className="space-y-6">
      <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-8">
        <h2 className="text-3xl font-bold text-white mb-3">{framework.name}</h2>
        <p className="text-[#9CA3AF] text-base">{framework.methodology}</p>
      </div>

      <div className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-6">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#3B82F6]" />
          Key Insight
        </h3>
        <p className="text-[#E0E2E6]">{framework.keyInsight}</p>
      </div>

      {framework.interactiveExample && (
        <div className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-6">
          <h3 className="text-lg font-bold text-white mb-3">Interactive Example</h3>
          <p className="text-[#E0E2E6]">{framework.interactiveExample.explanation}</p>
        </div>
      )}

      {framework.relatedCaseStudies && framework.relatedCaseStudies.length > 0 && (
        <div className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-6">
          <h3 className="text-lg font-bold text-white mb-3">Related Case Studies</h3>
          <p className="text-[#9CA3AF] text-sm">{framework.relatedCaseStudies.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

// Case Study Detail Component
const CaseStudyDetail: React.FC<{ caseStudyId: string }> = ({ caseStudyId }) => {
  const [caseStudy, setCaseStudy] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/education/case-studies/${caseStudyId}`)
      .then(res => res.json())
      .then(data => {
        setCaseStudy(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [caseStudyId]);

  if (loading) return <p className="text-[#6A7180]">Loading case study...</p>;
  if (!caseStudy) return <p className="text-[#EF4444]">Case study not found</p>;

  return (
    <div className="space-y-6">
      <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-8">
        <h2 className="text-3xl font-bold text-white mb-2">{caseStudy.fragrance.brand} {caseStudy.fragrance.name}</h2>
        <div className="flex gap-4 text-[#9CA3AF] text-sm font-mono">
          <span>Nose: {caseStudy.fragrance.nose}</span>
          <span>Released: {caseStudy.fragrance.releaseYear}</span>
          <span className="text-[#3B82F6]">{caseStudy.difficultyLevel.toUpperCase()}</span>
        </div>
      </div>

      <div className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-6">
        <h3 className="text-lg font-bold text-white mb-3">Strategic Context</h3>
        <p className="text-[#E0E2E6] leading-relaxed">{caseStudy.strategicContext}</p>
      </div>

      <div className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-6">
        <h3 className="text-lg font-bold text-white mb-3">Chemistry Story</h3>
        <p className="text-[#E0E2E6] leading-relaxed">{caseStudy.chemistryStory}</p>
      </div>

      <div className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-6">
        <h3 className="text-lg font-bold text-white mb-3">Expert Commentary</h3>
        <p className="text-[#E0E2E6] leading-relaxed">{caseStudy.expertCommentary}</p>
      </div>

      {caseStudy.keyLessons && caseStudy.keyLessons.length > 0 && (
        <div className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4">Key Lessons</h3>
          <ul className="space-y-2">
            {caseStudy.keyLessons.map((lesson: string, idx: number) => (
              <li key={idx} className="flex gap-3 text-[#E0E2E6]">
                <span className="text-[#3B82F6] font-bold flex-shrink-0">{idx + 1}.</span>
                <span>{lesson}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {caseStudy.variants && caseStudy.variants.length > 0 && (
        <div className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4">Variants</h3>
          <div className="space-y-3">
            {caseStudy.variants.map((variant: any, idx: number) => (
              <div key={idx} className="border-l-4 border-[#3B82F6] pl-4">
                <p className="font-semibold text-white">{variant.name}</p>
                <p className="text-[#9CA3AF] text-sm">{variant.concentration}</p>
                <p className="text-[#E0E2E6] text-sm mt-2">{variant.differencesFromBase}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
