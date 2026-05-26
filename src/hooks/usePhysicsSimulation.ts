import { useState, useCallback, useEffect, useRef } from 'react';
import { CompoundingFormula, SimulationResult, IFRACompliance } from '../types';
import { formulaCache } from '../utils/formulaCache';

interface UsePhysicsSimulationResult {
  result: SimulationResult | null;
  compliance: IFRACompliance | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function usePhysicsSimulation(formula: CompoundingFormula): UsePhysicsSimulationResult {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [compliance, setCompliance] = useState<IFRACompliance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController | null>(null);

  const performSimulation = useCallback(async (formulaToSimulate: CompoundingFormula) => {
    // Validate formula
    if (formulaToSimulate.ingredients.length === 0) {
      setError('Add at least one ingredient before simulating');
      setResult(null);
      setCompliance(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      const formulaHash = await formulaCache.getFormulaHash(
        formulaToSimulate.ingredients,
        formulaToSimulate.carrierType,
        formulaToSimulate.dilutionRatio
      );

      const cached = formulaCache.get(formulaHash);
      if (cached) {
        setResult(cached.result);
        setCompliance(cached.compliance);
        setIsLoading(false);
        return; // Early return, skip API call
      }

      // Cancel previous request if still in flight
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/physics-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: formulaToSimulate.ingredients.map(ing => ({
            name: ing.chemicalName,
            ppt: ing.ppt,
            category: ing.category,
            description: ing.description
          })),
          carrierType: formulaToSimulate.carrierType,
          dilutionRatio: formulaToSimulate.dilutionRatio,
          blendName: formulaToSimulate.blendName,
          leadPerfumer: formulaToSimulate.leadPerfumer
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Simulation failed');
      }

      const data = await response.json();
      formulaCache.set(formulaHash, data, data.ifraCompliance);
      setResult(data);
      setCompliance(data.ifraCompliance);
      setError(null);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce the simulation trigger
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer (300ms debounce)
    debounceTimerRef.current = setTimeout(() => {
      performSimulation(formula);
    }, 300);

    // Cleanup on unmount or before next effect
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [formula, performSimulation]);

  const retry = useCallback(() => {
    performSimulation(formula);
  }, [formula, performSimulation]);

  return {
    result,
    compliance,
    isLoading,
    error,
    retry
  };
}
