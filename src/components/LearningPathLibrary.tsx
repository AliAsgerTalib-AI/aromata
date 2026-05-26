import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';

interface LearningPath {
  id: string;
  name: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  lessons: Array<{ id: string }>;
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
    return <p className="text-gray-600">Loading learning paths...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold mb-3 text-gray-900">Filter by Skill Level</h3>
        <div className="flex gap-3">
          {['', 'beginner', 'intermediate', 'advanced'].map(level => (
            <Button
              key={level || 'all'}
              onClick={() => setSelectedLevel(level)}
              variant={selectedLevel === level ? 'primary' : 'secondary'}
              size="sm"
            >
              {level ? level.charAt(0).toUpperCase() + level.slice(1) : 'All'}
            </Button>
          ))}
        </div>
      </div>

      {/* Paths Grid */}
      <div className="grid grid-cols-1 gap-4">
        {paths.map(path => (
          <div key={path.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{path.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{path.description}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full capitalize">
                {path.skillLevel}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">{path.lessons.length} lessons • {path.estimatedTime}</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onSelectPath?.(path.id)}
              >
                Start Path
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
