import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';

interface Exercise {
  type: string;
  instructions: string;
  targetAccord?: string;
  fragranceId?: string;
  frag1Id?: string;
  frag2Id?: string;
}

interface Lesson {
  id: string;
  order?: number;
  title: string;
  objective: string;
  content: string;
  framework?: string;
  caseStudies?: string[];
  exercise?: Exercise;
  checkpointQuestions: string[];
}

interface LearningPath {
  id: string;
  name: string;
  lessons: Lesson[];
}

interface LearningPathViewProps {
  pathId: string;
  onBack: () => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({ pathId, onBack }) => {
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [checkpointAnswers, setCheckpointAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPath();
  }, [pathId]);

  const fetchPath = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/education/paths/${pathId}`);
      const data = await res.json();
      setPath(data);
    } catch (error) {
      console.error('Failed to fetch path:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading learning path...</p>;
  }

  if (!path || path.lessons.length === 0) {
    return <p className="text-red-600">Path or lessons not found.</p>;
  }

  const currentLesson = path.lessons[currentLessonIndex];
  const isLastLesson = currentLessonIndex === path.lessons.length - 1;

  const handleNext = () => {
    if (!isLastLesson) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setCheckpointAnswers({});
    }
  };

  const handleCheckpoint = (question: string, answer: string) => {
    setCheckpointAnswers({ ...checkpointAnswers, [question]: answer });
  };

  const allCheckpointsAnswered = currentLesson.checkpointQuestions.every(q => checkpointAnswers[q]);

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-[#3B82F6] hover:text-[#60A5FA] font-mono text-sm mb-4">
        ← Back to Paths
      </button>

      {/* Progress */}
      <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-white font-mono text-sm uppercase">{path.name}</h3>
          <span className="text-sm text-[#9CA3AF] font-mono">Lesson {currentLessonIndex + 1} of {path.lessons.length}</span>
        </div>
        <div className="w-full bg-[#0A0B0E] rounded-full h-3 overflow-hidden border border-[#2D3139]">
          <div
            className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] h-3 rounded-full transition-all"
            style={{ width: `${((currentLessonIndex + 1) / path.lessons.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Lesson Content */}
      <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-8 space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-3">{currentLesson.title}</h2>
          <p className="text-[#9CA3AF]">Objective: {currentLesson.objective}</p>
        </div>

        {/* Main Content */}
        <div className="bg-[#0A0B0E] border border-[#2D3139] p-6 rounded-sm">
          <p className="text-[#E0E2E6] leading-relaxed">{currentLesson.content}</p>
        </div>

        {/* Framework Reference */}
        {currentLesson.framework && (
          <div className="border-l-4 border-[#A855F7] bg-[#0A0B0E] border border-[#2D3139] p-6 rounded-sm">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">📚 Framework</h4>
            <p className="text-[#E0E2E6] capitalize">{currentLesson.framework.replace(/-/g, ' ')}</p>
          </div>
        )}

        {/* Case Studies Reference */}
        {currentLesson.caseStudies && currentLesson.caseStudies.length > 0 && (
          <div className="border-l-4 border-[#10B981] bg-[#0A0B0E] border border-[#2D3139] p-6 rounded-sm">
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">🔍 Case Studies</h4>
            <ul className="text-[#E0E2E6] space-y-2">
              {currentLesson.caseStudies.map((cs, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#10B981]">•</span>
                  {cs.replace(/-/g, ' ').toUpperCase()}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Exercise */}
        {currentLesson.exercise && (
          <div className="border-l-4 border-[#F59E0B] bg-[#0A0B0E] border border-[#2D3139] p-6 rounded-sm">
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">✏️ Exercise</h4>
            <p className="text-[#E0E2E6] mb-3 capitalize"><strong>Type:</strong> {currentLesson.exercise.type.replace(/_/g, ' ')}</p>
            <p className="text-[#E0E2E6]"><strong>Instructions:</strong> {currentLesson.exercise.instructions}</p>
            {currentLesson.exercise.targetAccord && (
              <p className="text-[#E0E2E6] mt-3"><strong>Target:</strong> {currentLesson.exercise.targetAccord}</p>
            )}
          </div>
        )}

        {/* Checkpoint Questions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white text-lg flex items-center gap-2">✅ Checkpoint Questions</h3>
          {currentLesson.checkpointQuestions.map((question, idx) => (
            <div key={idx} className="bg-[#0A0B0E] border-l-4 border-[#3B82F6] p-4 rounded-sm border border-[#2D3139]">
              <p className="text-sm font-semibold text-white mb-3">{idx + 1}. {question}</p>
              <input
                type="text"
                placeholder="Your answer..."
                value={checkpointAnswers[question] || ''}
                onChange={(e) => handleCheckpoint(question, e.target.value)}
                className="w-full px-3 py-2 bg-[#15181F] border border-[#2D3139] rounded-sm text-sm text-white placeholder-[#6A7180] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-[#2D3139]">
          <button
            onClick={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
            disabled={currentLessonIndex === 0}
            className={`px-6 py-2 rounded-sm font-mono text-sm uppercase transition-colors ${
              currentLessonIndex === 0
                ? 'bg-[#2D3139] text-[#6A7180] cursor-not-allowed'
                : 'bg-[#3B82F6]/10 border border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6]/20'
            }`}
          >
            ← Previous
          </button>

          {isLastLesson ? (
            <button
              disabled={!allCheckpointsAnswered}
              className={`px-6 py-2 rounded-sm font-mono text-sm uppercase transition-colors ${
                !allCheckpointsAnswered
                  ? 'bg-[#2D3139] text-[#6A7180] cursor-not-allowed'
                  : 'bg-[#10B981] text-white hover:bg-[#059669]'
              }`}
            >
              Complete Path
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!allCheckpointsAnswered}
              className={`px-6 py-2 rounded-sm font-mono text-sm uppercase transition-colors ${
                !allCheckpointsAnswered
                  ? 'bg-[#2D3139] text-[#6A7180] cursor-not-allowed'
                  : 'bg-[#3B82F6] text-white hover:bg-[#60A5FA]'
              }`}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
