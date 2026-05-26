import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { IngredientRow } from '../types';
import { useIngredients } from '../context/IngredientContext';

interface IngredientDropdownProps {
  onSelect: (ingredient: IngredientRow) => void;
  disabled?: boolean;
}

const PAGE_SIZE = 50;

export function IngredientDropdown({ onSelect, disabled = false }: IngredientDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { searchIngredients, paginate } = useIngredients();

  // Filter by search term using context
  const filteredIngredients = useMemo(() => {
    return searchIngredients(searchTerm);
  }, [searchTerm, searchIngredients]);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  // Get paginated items
  const paginatedIngredients = useMemo(() => {
    return paginate(filteredIngredients, currentPage, PAGE_SIZE);
  }, [filteredIngredients, currentPage, paginate]);

  // Check if there are more pages available
  const hasMorePages = (currentPage + 1) * PAGE_SIZE < filteredIngredients.length;

  // Handle scroll to load more
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollHeight, scrollTop, clientHeight } = scrollContainerRef.current;

    if (scrollHeight - scrollTop < 100 && hasMorePages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMorePages]);

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
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="max-h-96 overflow-y-auto"
          >
            {filteredIngredients.length === 0 ? (
              <div className="px-4 py-3 text-[#6A7180] text-sm">No ingredients found</div>
            ) : (
              <>
                {paginatedIngredients.map(ing => (
                  <button
                    key={ing.id}
                    onClick={() => handleSelect(ing)}
                    className="w-full text-left px-4 py-2 hover:bg-[#2D3139] transition"
                  >
                    <div className="font-mono text-sm text-[#E0E2E6]">{ing.chemicalName}</div>
                    <div className="text-xs text-[#6A7180]">{ing.description || ing.category}</div>
                  </button>
                ))}
                {hasMorePages && (
                  <div className="px-4 py-2 text-center text-xs text-[#6A7180] bg-[#1E2026]">
                    Scroll for more ({paginatedIngredients.length} of {filteredIngredients.length})
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
