import { useState, useCallback, useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IngredientRow, CompoundingFormula, SimulationResult, IFRACompliance, FragranceData, FormulaTemplate } from '../types';
import { IngredientDropdown } from './IngredientDropdown';
import { ChartContainer } from './ChartContainer';
import { TemplateSelector } from './TemplateSelector';
import { ExportImportPanel } from './ExportImportPanel';
import { usePhysicsSimulation } from '../hooks/usePhysicsSimulation';

interface CompoundingBenchProps {
  availableFragrances?: FragranceData[];
  onRegisterFormula?: (formula: FragranceData) => void;
}

export function CompoundingBench({ onRegisterFormula }: CompoundingBenchProps) {
  // Formula state
  const [formula, setFormula] = useState<CompoundingFormula>({
    blendName: '',
    leadPerfumer: '',
    ingredients: [],
    carrierType: 'ethanol',
    dilutionRatio: 20
  });

  // Use Physics Simulation Hook
  const { result: simulationResult, compliance: ifraCompliance, isLoading: isSimulating, error, retry: retrySimulation } = usePhysicsSimulation(formula);

  // Calculate total PPT
  const totalPpt = useMemo(() => {
    return formula.ingredients.reduce((sum, ing) => sum + ing.ppt, 0);
  }, [formula.ingredients]);

  // Calculate weight share percentages
  const ingredientsWithShares = useMemo(() => {
    return formula.ingredients.map(ing => ({
      ...ing,
      shareWts: totalPpt > 0 ? (ing.ppt / totalPpt) * 100 : 0
    }));
  }, [formula.ingredients, totalPpt]);


  // Update formula field
  const updateFormula = useCallback((updates: Partial<CompoundingFormula>) => {
    setFormula(prev => ({ ...prev, ...updates }));
  }, []);

  // Add ingredient
  const addIngredient = useCallback((ingredient: IngredientRow) => {
    setFormula(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredient]
    }));
    // Hook automatically debounces and simulates
  }, []);

  // Update ingredient PPT
  const updateIngredientPpt = useCallback((id: string, ppt: number) => {
    const updated = formula.ingredients.map(ing =>
      ing.id === id ? { ...ing, ppt: Math.max(1, Math.min(1000, ppt)) } : ing
    );
    updateFormula({ ingredients: updated });
    // Hook automatically debounces and simulates
  }, [formula.ingredients, updateFormula]);

  // Remove ingredient
  const removeIngredient = useCallback((id: string) => {
    const updated = formula.ingredients.filter(ing => ing.id !== id);
    updateFormula({ ingredients: updated });
    // Hook automatically debounces and simulates
  }, [formula.ingredients, updateFormula]);

  // Update carrier
  const updateCarrier = useCallback((carrierType: 'ethanol' | 'dpg' | 'ipm') => {
    updateFormula({ carrierType });
    // Hook automatically debounces and simulates
  }, [updateFormula]);

  // Update dilution
  const updateDilution = useCallback((dilutionRatio: number) => {
    updateFormula({ dilutionRatio: Math.max(0, Math.min(100, dilutionRatio)) });
    // Hook automatically debounces and simulates
  }, [updateFormula]);

  // Handle template selection
  const handleSelectTemplate = useCallback((template: FormulaTemplate) => {
    // Create unique instance IDs for each ingredient
    const ingredientsWithIds = template.ingredients.map(ing => ({
      ...ing,
      id: `${ing.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));

    // Update formula with template values
    setFormula({
      blendName: template.name,
      leadPerfumer: '',
      ingredients: ingredientsWithIds,
      carrierType: template.carrierType,
      dilutionRatio: template.dilutionRatio
    });
  }, []);

  return (
    <div className="grid grid-cols-2 gap-8">
      {/* LEFT PANEL: Formula Editor */}
      <div>
        {/* Template Selector */}
        <TemplateSelector onSelectTemplate={handleSelectTemplate} />

        {/* Export / Import Panel */}
        <ExportImportPanel
          formula={formula}
          onImportFormula={(imported) => setFormula(imported)}
        />

        {/* Formula Metadata */}
        <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6 mb-6">
          <h3 className="text-[#0F9] text-xs font-mono uppercase mb-4">Formula Metadata Registry</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[#6A7180] text-xs uppercase font-mono mb-2">Blend Name</label>
              <input
                type="text"
                value={formula.blendName}
                onChange={e => updateFormula({ blendName: e.target.value })}
                placeholder="My Custom Blend"
                className="w-full bg-[#0A0B0E] border border-[#2D3139] rounded-sm px-3 py-2 text-[#E0E2E6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-[#6A7180] text-xs uppercase font-mono mb-2">Lead Perfumer / Nose</label>
              <input
                type="text"
                value={formula.leadPerfumer}
                onChange={e => updateFormula({ leadPerfumer: e.target.value })}
                placeholder="Artisan Perfumer"
                className="w-full bg-[#0A0B0E] border border-[#2D3139] rounded-sm px-3 py-2 text-[#E0E2E6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
              />
            </div>
          </div>
        </div>

        {/* Compounding Sheet */}
        <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#0F9] text-xs font-mono uppercase">Compounding Sheet</h3>
            <div className="text-[#0F9] text-xs font-mono">Total Ratios Loaded: <span className="font-bold">{totalPpt} pts</span></div>
          </div>

          {/* Ingredients Table */}
          {formula.ingredients.length === 0 ? (
            <div className="text-[#6A7180] text-sm text-center py-8">No ingredients added yet</div>
          ) : (
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#2D3139]">
                    <th className="text-left px-2 py-2 text-[#6A7180] font-mono uppercase">Scent Isolate</th>
                    <th className="text-left px-2 py-2 text-[#6A7180] font-mono uppercase">Category</th>
                    <th className="text-left px-2 py-2 text-[#6A7180] font-mono uppercase">PPT</th>
                    <th className="text-left px-2 py-2 text-[#6A7180] font-mono uppercase">Share (wts)</th>
                    <th className="text-left px-2 py-2 text-[#6A7180] font-mono uppercase">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredientsWithShares.map(ing => (
                    <tr key={ing.id} className="border-b border-[#2D3139] hover:bg-[#0A0B0E]">
                      <td className="px-2 py-3 text-[#E0E2E6]">{ing.chemicalName}</td>
                      <td className="px-2 py-3">
                        <span className="bg-[#2D3139] text-[#0F9] px-2 py-1 rounded text-xs uppercase">
                          {ing.category}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={ing.ppt}
                          onChange={e => updateIngredientPpt(ing.id, parseInt(e.target.value) || 1)}
                          className="w-16 bg-[#0A0B0E] border border-[#2D3139] rounded-sm px-2 py-1 text-[#E0E2E6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                        />
                      </td>
                      <td className="px-2 py-3 text-[#0F9]">{ing.shareWts.toFixed(2)}%</td>
                      <td className="px-2 py-3">
                        <button
                          onClick={() => removeIngredient(ing.id)}
                          className="text-[#6A7180] hover:text-red-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add Ingredient */}
          <div className="mt-6">
            <IngredientDropdown onSelect={addIngredient} disabled={isSimulating} />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Carrier Dilution, Compliance & Simulation */}
      <div className="space-y-6">
        {/* Carrier Dilution Desk */}
        <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
          <h3 className="text-[#0F9] text-xs font-mono uppercase mb-4">Carrier Dilution Desk</h3>

          {/* Carrier Type Selection */}
          <div className="mb-6">
            <label className="block text-[#6A7180] text-xs uppercase font-mono mb-3">Carrier Solvent Media Type</label>
            <div className="flex gap-3">
              {(['ethanol', 'dpg', 'ipm'] as const).map(carrier => {
                const labels: Record<typeof carrier, string> = {
                  ethanol: 'ETHANOL (98%)',
                  dpg: 'DPG GLYCOL',
                  ipm: 'IPM ESTER'
                };
                return (
                  <button
                    key={carrier}
                    onClick={() => updateCarrier(carrier)}
                    className={`px-4 py-2 rounded-sm text-xs font-mono uppercase transition ${
                      formula.carrierType === carrier
                        ? 'bg-[#3B82F6] text-white'
                        : 'bg-[#2D3139] text-[#6A7180] hover:bg-[#3B82F6]/20'
                    }`}
                  >
                    {labels[carrier]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dilution Slider */}
          <div>
            <label className="block text-[#6A7180] text-xs uppercase font-mono mb-3">Fragrance Oil Dilution Load</label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={formula.dilutionRatio}
                onChange={e => updateDilution(parseInt(e.target.value))}
                className="w-full h-2 bg-[#2D3139] rounded-lg appearance-none cursor-pointer accent-[#0F9]"
              />
              <div className="flex justify-between text-xs text-[#6A7180] font-mono">
                <span>{formula.dilutionRatio}% Oil / {100 - formula.dilutionRatio}% Solvent</span>
              </div>
              <p className="text-xs text-[#6A7180] mt-2">
                Higher oil concentration increases longevity and sillage; carrier solvent extends diffusion.
              </p>
            </div>
          </div>
        </div>

        {/* IFRA Compliance Desk */}
        {ifraCompliance && (
          <div className={`bg-[#15181F] border rounded-sm p-6 ${ifraCompliance.isCompliant ? 'border-[#2D3139]' : 'border-red-500'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#0F9] text-xs font-mono uppercase">IFRA Safety Compliance Desk</h3>
              <span className={`px-3 py-1 rounded text-xs font-mono uppercase ${
                ifraCompliance.isCompliant
                  ? 'bg-[#0F9] text-black'
                  : 'bg-red-500 text-white'
              }`}>
                {ifraCompliance.isCompliant ? '✓ Compliant' : '⚠ Non-Compliant'}
              </span>
            </div>

            {ifraCompliance.overallWarning && (
              <div className="bg-red-500/10 border border-red-500 rounded-sm px-3 py-2 mb-4 text-xs text-red-200">
                {ifraCompliance.overallWarning}
              </div>
            )}

            <div className="space-y-3">
              {ifraCompliance.ingredientAssessments.map((assess, idx) => (
                <div key={idx} className="border-b border-[#2D3139] pb-3 last:border-b-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-mono text-[#E0E2E6] text-xs">
                      {assess.status === 'compliant' ? '✓' : '⚠'} {assess.chemicalName}
                    </div>
                    <div className="text-[#0F9] font-mono text-xs">{assess.percentageInFormula.toFixed(3)}% IN FORMULA</div>
                  </div>
                  <div className={`text-xs ${assess.status === 'compliant' ? 'text-[#6A7180]' : 'text-red-400'}`}>
                    {assess.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Physics Simulation */}
        {isSimulating && (
          <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6 flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="animate-spin mb-3">
                <div className="w-8 h-8 border-2 border-[#3B82F6] border-t-[#0F9] rounded-full mx-auto" />
              </div>
              <p className="text-[#6A7180] text-sm">Calculating simulation...</p>
            </div>
          </div>
        )}

        {error && !isSimulating && (
          <div className="bg-red-500/10 border border-red-500 rounded-sm p-4">
            <p className="text-red-300 text-sm mb-3">{error}</p>
            <button
              onClick={() => retrySimulation()}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-mono rounded-sm transition"
            >
              Retry
            </button>
          </div>
        )}

        {simulationResult && !isSimulating && (
          <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
            <h3 className="text-[#0F9] text-xs font-mono uppercase mb-4">Live Predictive Physics Simulation</h3>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-4">
                <div className="text-[#6A7180] text-xs uppercase font-mono mb-2">Active Skin Longevity</div>
                <div className="text-[#0F9] font-bold text-xl">{simulationResult.longevityHours.toFixed(1)} hrs</div>
              </div>
              <div className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-4">
                <div className="text-[#6A7180] text-xs uppercase font-mono mb-2">Initial Sillage Bubble</div>
                <div className="text-[#0F9] font-bold text-xl">{simulationResult.sillageFeetProjection.toFixed(1)} ft</div>
              </div>
            </div>

            {/* Chart 1: Volatility Decay */}
            {simulationResult && (
              <ChartContainer
                title="Molecular Gas Volatility Decay Line"
                data={simulationResult.evaporationCurve}
                dataKey="volatilityPercent"
                xAxisKey="timeHours"
                yAxisLabel="Volatility (%)"
                height={250}
              />
            )}

            {/* Chart 2: Sillage Projection */}
            {simulationResult && (
              <ChartContainer
                title="Simulated Dispersion Radius (Projection Feet)"
                data={simulationResult.evaporationCurve.map(point => ({
                  timeHours: point.timeHours,
                  sillageFeet: simulationResult.sillageFeetProjection * (1 - point.volatilityPercent / 100)
                }))}
                dataKey="sillageFeet"
                xAxisKey="timeHours"
                yAxisLabel="Radius (feet)"
                height={250}
              />
            )}
          </div>
        )}

        {/* Register Formula Button */}
        {simulationResult && !isSimulating && ifraCompliance && (
          <button
            onClick={async () => {
              try {
                const newFragrance: FragranceData = {
                  brand: 'Custom Blend',
                  name: formula.blendName || 'Unnamed Formula',
                  concentration: 'Parfum (EDP)' as any,
                  nose: formula.leadPerfumer || 'Unknown',
                  releaseYear: new Date().getFullYear(),
                  batchLineage: '',

                  // Chemical composition
                  aromaChemicalMatrix: formula.ingredients.map(ing => ({
                    name: ing.chemicalName,
                    percentage: totalPpt > 0 ? (ing.ppt / totalPpt) * 100 : 0,
                    category: ing.category as any,
                    description: ing.description || ''
                  })),
                  naturalToSyntheticRatio: {
                    natural: 0,
                    synthetic: 100
                  },

                  // Performance
                  evaporationCurve: simulationResult?.evaporationCurve.map(point => ({
                    hour: Math.round(point.timeHours),
                    top: point.volatilityPercent,
                    heart: point.volatilityPercent * 0.8,
                    base: point.volatilityPercent * 0.5
                  })) || [],
                  skinLongevityIndex: simulationResult?.longevityHours || 0,
                  fabricPermanenceIndex: 0,
                  sillageProjectionRadiusCurve: simulationResult?.sillageFeetProjection ? [
                    { hour: 0, radiusFeet: simulationResult.sillageFeetProjection }
                  ] : [],
                  olfactoryFatigueRisk: 0,
                  olfactoryFatigueExplanation: 'Custom blend - fatigue profile pending analysis',

                  // Classification
                  olfactoryFamily: 'Custom Blend',
                  accords: [],
                  tempRangeMinCelsius: 15,
                  tempRangeMaxCelsius: 29,
                  humidityTolerance: 'moderate',
                  settingScoring: [],

                  // Market
                  avgRetailPrice: 0,
                  pricePerMl: 0,
                  valueRating: 'Fair',
                  alternatives: [],
                  formulationHeritage: 'Custom formula created in Compounding Bench',

                  // Analysis
                  notes: { top: [], heart: [], base: [] },
                  historicalTimeline: [],
                  laymanChemistryExplanation: '',
                  story: `Custom formula created in the Compounding Bench. Carrier: ${formula.carrierType}, Dilution: ${formula.dilutionRatio}% oil.`,
                  strategicTakeaway: 'Custom blend formulated for specific olfactory goals',
                  ifraAssessment: {
                    status: ifraCompliance?.isCompliant ? 'Compliant' : 'Restricted',
                    criticalRestrictedMaterials: [],
                    chemistsTakeaway: ifraCompliance?.overallWarning || 'Formula compliant with IFRA standards'
                  }
                };

                if (onRegisterFormula) {
                  onRegisterFormula(newFragrance);
                }

                // Reset form (hook will automatically clear simulation results)
                setFormula({
                  blendName: '',
                  leadPerfumer: '',
                  ingredients: [],
                  carrierType: 'ethanol',
                  dilutionRatio: 20
                });
              } catch (err: any) {
                console.error('Failed to register formula:', err.message);
              }
            }}
            className="w-full py-3 bg-[#0F9] text-black font-bold rounded-sm hover:bg-[#0F9]/80 transition"
          >
            + Register Formula Specimen On Cabinet Shelf
          </button>
        )}
      </div>
    </div>
  );
}
