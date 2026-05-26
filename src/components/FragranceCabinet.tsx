import { FragranceData } from '../types';
import { Trash2, Scale } from 'lucide-react';

interface FragranceCabinetProps {
  cabinet: FragranceData[];
  selectedFragrance: FragranceData;
  comparedSpecimens: string[];
  onSelectFragrance: (frag: FragranceData) => void;
  onRemove: (brand: string, name: string) => void;
  onToggleCompare: (brand: string, name: string) => boolean;
}

export function FragranceCabinet({
  cabinet,
  selectedFragrance,
  comparedSpecimens,
  onSelectFragrance,
  onRemove,
  onToggleCompare,
}: FragranceCabinetProps) {
  if (cabinet.length === 0) {
    return (
      <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-8 text-center">
        <p className="text-[#6A7180]">Your fragrance cabinet is empty. Analyze fragrances to build your collection.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cabinet.map((frag) => {
          const compID = `${frag.brand} - ${frag.name}`;
          const isSelected = selectedFragrance.brand === frag.brand && selectedFragrance.name === frag.name;
          const isCompared = comparedSpecimens.includes(compID);

          return (
            <div
              key={compID}
              className={`bg-[#15181F] border rounded-sm p-4 cursor-pointer transition ${
                isSelected
                  ? 'border-[#3B82F6] bg-[#0F172A]'
                  : 'border-[#2D3139] hover:border-[#3B82F6]'
              }`}
              onClick={() => onSelectFragrance(frag)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-white text-sm">{frag.brand}</h4>
                  <p className="text-[#6A7180] text-xs">{frag.name}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCompare(frag.brand, frag.name);
                    }}
                    className={`p-1 rounded transition ${
                      isCompared
                        ? 'bg-[#3B82F6] text-white'
                        : 'bg-[#2D3139] text-[#6A7180] hover:bg-[#3B82F6] hover:text-white'
                    }`}
                    title="Compare"
                  >
                    <Scale className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(frag.brand, frag.name);
                    }}
                    className="p-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-[#3B82F6] font-mono">{frag.olfactoryFamily}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
