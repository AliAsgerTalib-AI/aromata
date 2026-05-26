import { useState, useCallback } from 'react';
import { CompoundingFormula } from '../types';

export interface FormulaVersion {
  id: string;
  timestamp: number;
  formula: CompoundingFormula;
  label?: string;
}

const MAX_HISTORY = 10;

export function useFormulaHistory(initialFormula: CompoundingFormula) {
  // Initialize with one version
  const [history, setHistory] = useState<FormulaVersion[]>(() => [
    {
      id: Date.now().toString(),
      timestamp: Date.now(),
      formula: initialFormula,
      label: 'Initial'
    }
  ]);

  // Add a new version to history (prepend to keep newest first)
  const addVersion = useCallback((formula: CompoundingFormula, label?: string) => {
    const newVersion: FormulaVersion = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      formula,
      label
    };

    setHistory(prev => {
      const updated = [newVersion, ...prev];
      // Keep only the most recent MAX_HISTORY versions
      return updated.slice(0, MAX_HISTORY);
    });
  }, []);

  // Rollback to a specific version by ID
  const rollback = useCallback((versionId: string): CompoundingFormula | null => {
    const version = history.find(v => v.id === versionId);
    return version ? version.formula : null;
  }, [history]);

  // Clear all history
  const clear = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addVersion,
    rollback,
    clear
  };
}
