import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';

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
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  lessons: Lesson[];
  estimatedTime: string;
}

interface LearningPathLibraryProps {
  onSelectPath?: (pathId: string) => void;
}

export const LearningPathLibrary: React.FC<LearningPathLibraryProps> = ({ onSelectPath }) => {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  useEffect(() => {
    fetchPaths();
  }, [selectedLevel]);

  const fetchPaths = async () => {
    try {
      setLoading(true);
      const query = selectedLevel ? `?skillLevel=${selectedLevel}` : '';
      const res = await fetch(`/api/education/paths${query}`);
      const data = await res.json();
      setPaths(data.paths || []);
    } catch (error) {
      console.error('Failed to fetch paths:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-[#6A7180]">Loading learning paths...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
        <h3 className="font-semibold mb-4 text-white text-sm font-mono uppercase">Filter by Skill Level</h3>
        <div className="flex gap-3 flex-wrap">
          {['', 'beginner', 'intermediate', 'advanced'].map(level => (
            <button
              key={level || 'all'}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 text-xs font-mono uppercase rounded-sm transition-colors ${
                selectedLevel === level
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-[#0A0B0E] border border-[#2D3139] text-[#9CA3AF] hover:text-white hover:border-[#3B82F6]'
              }`}
            >
              {level ? level.charAt(0).toUpperCase() + level.slice(1) : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Paths Grid */}
      <div className="grid grid-cols-1 gap-4">
        {paths.map(path => (
          <div
            key={path.id}
            onClick={() => onSelectPath?.(path.id)}
            className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6 hover:border-[#3B82F6] hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white group-hover:text-[#3B82F6] transition-colors flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5" />
                  {path.name}
                </h3>
                <p className="text-[#9CA3AF] text-sm">{path.description}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-mono uppercase rounded-sm whitespace-nowrap ml-2 ${
                path.skillLevel === 'beginner'
                  ? 'bg-[#10B981]/20 text-[#10B981]'
                  : path.skillLevel === 'intermediate'
                  ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
                  : 'bg-[#F59E0B]/20 text-[#F59E0B]'
              }`}>
                {path.skillLevel}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[#9CA3AF] text-sm font-mono">{path.lessons.length} lessons • {path.estimatedTime}</p>
              <button className="px-4 py-2 bg-[#3B82F6] text-white font-mono text-xs uppercase rounded-sm hover:bg-[#60A5FA] transition-colors">
                Start Path
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
