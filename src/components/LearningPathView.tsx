import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';

interface Lesson {
  id: string;
  title: string;
  objective: string;
  content: string;
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
      <Button onClick={onBack} variant="ghost" size="sm">
        ← Back to Learning Paths
      </Button>

      {/* Progress */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-900">{path.name}</h3>
          <span className="text-sm text-gray-600">Lesson {currentLessonIndex + 1} of {path.lessons.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentLessonIndex + 1) / path.lessons.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Lesson Content */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentLesson.title}</h2>
        <p className="text-sm text-gray-600 mb-4">Objective: {currentLesson.objective}</p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-gray-700 leading-relaxed">{currentLesson.content}</p>
        </div>

        {/* Checkpoints */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-900">Checkpoint Questions</h3>
          {currentLesson.checkpointQuestions.map((question, idx) => (
            <div key={idx} className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-2">{question}</p>
              <input
                type="text"
                placeholder="Your answer..."
                value={checkpointAnswers[question] || ''}
                onChange={(e) => handleCheckpoint(question, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <Button
            onClick={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
            disabled={currentLessonIndex === 0}
            variant="secondary"
          >
            ← Previous
          </Button>

          {isLastLesson ? (
            <Button
              disabled={!allCheckpointsAnswered}
              variant="primary"
            >
              Complete Path
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!allCheckpointsAnswered}
              variant="primary"
            >
              Next →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
