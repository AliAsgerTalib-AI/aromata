import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { PERFUME_SYNTHETICS_DATABASE } from '../syntheticsDatabase';
import { TECHNICAL_SYNTHETICS_DATABASE } from '../technicalSyntheticsDatabase';
import { KNOWN_ISOLATES_DATABASE } from '../originDatabase';
import { IngredientRow } from '../types';

interface IngredientDropdownProps {
  onSelect: (ingredient: IngredientRow) => void;
  disabled?: boolean;
}

export function IngredientDropdown({ onSelect, disabled = false }: IngredientDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Combine all ingredient databases
  const allIngredients = useMemo(() => {
    const combined = [
      ...PERFUME_SYNTHETICS_DATABASE.map(ing => ({
        id: `synth-${ing.name}`,
        chemicalName: ing.name,
        category: ing.category || 'Others',
        ppt: 0, // User will set this
        description: ing.smell || ''
      })),
      ...TECHNICAL_SYNTHETICS_DATABASE.map(ing => ({
        id: `tech-${ing.name}`,
        chemicalName: ing.name,
        category: ing.category || 'Others',
        ppt: 0,
        description: ing.profile || ''
      })),
      ...Object.values(KNOWN_ISOLATES_DATABASE).map(ing => ({
        id: `isolate-${ing.chemicalName}`,
        chemicalName: ing.chemicalName,
        category: ing.originClassification || 'Others',
        ppt: 0,
        description: ing.technicalProcess || ''
      }))
    ];

    // Deduplicate by chemicalName
    const seen = new Set<string>();
    return combined.filter(ing => {
      if (seen.has(ing.chemicalName)) return false;
      seen.add(ing.chemicalName);
      return true;
    });
  }, []);

  // Filter by search term
  const filteredIngredients = useMemo(() => {
    if (!searchTerm.trim()) return allIngredients;
    const lower = searchTerm.toLowerCase();
    return allIngredients.filter(
      ing =>
        ing.chemicalName.toLowerCase().includes(lower) ||
        ing.description.toLowerCase().includes(lower)
    );
  }, [searchTerm, allIngredients]);

  const handleSelect = (ingredient: IngredientRow) => {
    const newIngredient: IngredientRow = {
      ...ingredient,
      id: `${ingredient.id}-${Date.now()}`, // Unique ID
      ppt: 50 // Default PPT
    };
    onSelect(newIngredient);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 bg-[#2D3139] text-[#E0E2E6] rounded-sm hover:bg-[#3B82F6]/20 disabled:opacity-50"
      >
        + Add Ingredient
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-[#15181F] border border-[#2D3139] rounded-sm shadow-lg z-50">
          <input
            type="text"
            placeholder="Search aromachemicals..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-[#0A0B0E] text-[#E0E2E6] border-b border-[#2D3139] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
            autoFocus
          />
          <div className="max-h-96 overflow-y-auto">
            {filteredIngredients.length === 0 ? (
              <div className="px-4 py-3 text-[#6A7180] text-sm">No ingredients found</div>
            ) : (
              filteredIngredients.map(ing => (
                <button
                  key={ing.id}
                  onClick={() => handleSelect(ing)}
                  className="w-full text-left px-4 py-2 hover:bg-[#2D3139] transition"
                >
                  <div className="font-mono text-sm text-[#E0E2E6]">{ing.chemicalName}</div>
                  <div className="text-xs text-[#6A7180]">{ing.description || ing.category}</div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
