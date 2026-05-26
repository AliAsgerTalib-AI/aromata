import { RotateCcw, Trash2 } from 'lucide-react';
import { FormulaVersion } from '../hooks/useFormulaHistory';

interface HistoryPanelProps {
  history: FormulaVersion[];
  onRollback: (versionId: string) => void;
  onClear: () => void;
}

export function HistoryPanel({ history, onRollback, onClear }: HistoryPanelProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getVersionLabel = (version: FormulaVersion, index: number) => {
    if (version.label) {
      return version.label;
    }
    return `v${index + 1}`;
  };

  return (
    <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[#0F9] text-xs font-mono uppercase">
          📜 History ({history.length})
        </h3>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-[#6A7180] hover:text-red-500 transition"
            title="Clear all history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-[#6A7180] text-sm text-center py-8">No history yet</div>
      ) : (
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {history.map((version, index) => (
            <div
              key={version.id}
              className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-3 flex justify-between items-center hover:border-[#3B82F6] transition"
            >
              <div className="flex-1">
                <div className="text-[#E0E2E6] text-xs font-mono">
                  {getVersionLabel(version, index)}
                </div>
                <div className="text-[#6A7180] text-xs mt-1">
                  {formatTime(version.timestamp)}
                </div>
              </div>
              <button
                onClick={() => onRollback(version.id)}
                className="text-[#6A7180] hover:text-[#0F9] transition ml-4"
                title={`Rollback to ${getVersionLabel(version, index)}`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
