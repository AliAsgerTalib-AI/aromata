import { Plus } from 'lucide-react';
import { IngredientRow } from '../types';
import { COMPOUND_LIBRARY } from '../data/compoundLibrary';

interface CompoundLibraryProps {
  onAddCompound: (ingredients: IngredientRow[]) => void;
}

export function CompoundLibrary({ onAddCompound }: CompoundLibraryProps) {
  // Organize compounds by category in the correct order
  const categories = ['Base', 'Heart', 'Top', 'Accord'] as const;

  return (
    <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6 mb-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🧬</span>
          <h3 className="text-[#0F9] text-xs font-mono uppercase">Compound Library</h3>
        </div>
        <p className="text-[#6A7180] text-sm">
          Combine pre-made blends into custom formulas
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {categories.map(category => {
          const compoundsInCategory = COMPOUND_LIBRARY.filter(c => c.category === category);

          return (
            <div key={category}>
              {/* Category Title */}
              <div className="mb-4">
                <h4 className="text-[#0F9] text-xs font-mono uppercase tracking-wider">
                  ▸ {category} Compounds
                </h4>
              </div>

              {/* Compounds Grid */}
              <div className="grid grid-cols-2 gap-4">
                {compoundsInCategory.map(compound => (
                  <button
                    key={compound.id}
                    onClick={() => onAddCompound(compound.ingredients)}
                    className="text-left p-4 rounded-sm bg-[#0A0B0E] border border-[#2D3139] hover:border-[#3B82F6] hover:bg-[#1A1D24] transition-all"
                  >
                    {/* Compound Name */}
                    <h5 className="text-[#E0E2E6] font-bold text-sm mb-2">
                      {compound.name}
                    </h5>

                    {/* Description */}
                    <p className="text-[#6A7180] text-xs mb-3 line-clamp-2">
                      {compound.description}
                    </p>

                    {/* Ingredients Preview */}
                    <div className="text-[#6A7180] text-xs space-y-1 mb-4">
                      {compound.ingredients.map(ing => (
                        <div key={ing.id} className="flex items-center gap-2">
                          <span className="text-[#0F9]">•</span>
                          <span>{ing.chemicalName}</span>
                          <span className="text-[#6A7180]">({ing.ppt} ppt)</span>
                        </div>
                      ))}
                    </div>

                    {/* Add Button */}
                    <div className="flex items-center gap-2 text-[#0F9] text-xs font-mono uppercase hover:text-[#0F9]/80">
                      <Plus className="w-4 h-4" />
                      <span>Add to Formula</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
