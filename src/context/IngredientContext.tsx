import React, { createContext, useContext, useMemo } from 'react';
import { PERFUME_SYNTHETICS_DATABASE } from '../syntheticsDatabase';
import { TECHNICAL_SYNTHETICS_DATABASE } from '../technicalSyntheticsDatabase';
import { KNOWN_ISOLATES_DATABASE } from '../originDatabase';
import { IngredientRow } from '../types';

interface IngredientContextType {
  allIngredients: IngredientRow[];
  searchIngredients: (query: string) => IngredientRow[];
}

const IngredientContext = createContext<IngredientContextType | undefined>(undefined);

export function IngredientProvider({ children }: { children: React.ReactNode }) {
  const allIngredients = useMemo(() => {
    const combined = [
      ...PERFUME_SYNTHETICS_DATABASE.map(ing => ({
        id: `synth-${ing.name}`,
        chemicalName: ing.name,
        category: ing.category || 'Others',
        ppt: 0,
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

  const searchIngredients = (query: string): IngredientRow[] => {
    if (!query.trim()) return allIngredients;
    const lower = query.toLowerCase();
    return allIngredients.filter(
      ing =>
        ing.chemicalName.toLowerCase().includes(lower) ||
        ing.description.toLowerCase().includes(lower)
    );
  };

  return (
    <IngredientContext.Provider value={{ allIngredients, searchIngredients }}>
      {children}
    </IngredientContext.Provider>
  );
}

export function useIngredients() {
  const context = useContext(IngredientContext);
  if (!context) {
    throw new Error('useIngredients must be used within IngredientProvider');
  }
  return context;
}
