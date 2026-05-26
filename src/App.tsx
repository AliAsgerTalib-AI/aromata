import { useState, useMemo } from 'react';
import { Beaker, Menu, X } from 'lucide-react';

// Hooks
import { useFragranceState } from './hooks/useFragranceState';
import { useAnalysisApi } from './hooks/useAnalysisApi';

// Components
import { SearchInterface } from './components/SearchInterface';
import { FragranceDossier } from './components/FragranceDossier';
import { LayeringAnalyzer } from './components/LayeringAnalyzer';
import { FragranceCabinet } from './components/FragranceCabinet';
import { BlendingStudio } from './components/BlendingStudio';
import { EducationHub } from './components/EducationHub';

// Data
import { PREDEFINED_FRAGRANCES } from './data';

export default function App() {
  // Use extracted hooks for state management
  const fragState = useFragranceState();
  const apiState = useAnalysisApi();

  // Tab navigation state
  const [activeTab, setActiveTab] = useState<'dossier' | 'layering' | 'cabinet' | 'compounding' | 'blending' | 'education'>('dossier');

  // Search interface state
  const [searchBrand, setSearchBrand] = useState('');
  const [searchName, setSearchName] = useState('');

  // Layering state
  const [layeringSelectA, setLayeringSelectA] = useState<string>(
    PREDEFINED_FRAGRANCES[0] ? `${PREDEFINED_FRAGRANCES[0].brand} - ${PREDEFINED_FRAGRANCES[0].name}` : ''
  );
  const [layeringSelectB, setLayeringSelectB] = useState<string>(
    PREDEFINED_FRAGRANCES[1] ? `${PREDEFINED_FRAGRANCES[1].brand} - ${PREDEFINED_FRAGRANCES[1].name}` : ''
  );
  const [layeringResult, setLayeringResult] = useState<any>(null);
  const [layeringError, setLayeringError] = useState<string | null>(null);
  const [isAnalyzingLayering, setIsAnalyzingLayering] = useState(false);

  // Guard: ensure selectedFragrance is initialized before rendering
  if (!fragState.selectedFragrance || !fragState.selectedFragrance.brand || !fragState.selectedFragrance.name) {
    return (
      <div className="min-h-screen bg-[#0A0B0E] text-[#E0E2E6] font-sans antialiased flex items-center justify-center">
        <div className="text-center">
          <Beaker className="w-12 h-12 text-[#3B82F6] animate-spin mx-auto mb-4" />
          <p className="text-[#6A7180]">Loading fragrance database...</p>
        </div>
      </div>
    );
  }

  // Available fragrances for selection
  const availableFragrances = useMemo(() => [
    ...PREDEFINED_FRAGRANCES,
    ...fragState.cabinet
  ], [fragState.cabinet]);

  // Handle fragrance analysis
  const handleAnalyze = async (brand: string, name: string) => {
    try {
      const analysis = await apiState.analyzeFragrance(brand, name);
      fragState.setSelectedFragrance(analysis as any);
      if (!fragState.cabinet.find(f => f.brand === analysis.brand && f.name === analysis.name)) {
        fragState.updateCabinet([analysis as any, ...fragState.cabinet]);
      }
      setSearchBrand('');
      setSearchName('');
    } catch (err) {
      // Error already set in hook
    }
  };

  // Handle layering analysis
  const handleLayeringAnalysis = async (fragA: any, fragB: any) => {
    setIsAnalyzingLayering(true);
    setLayeringError(null);
    try {
      const result = await apiState.layeringAnalysis(fragA, fragB);
      setLayeringResult(result);
    } catch (err: any) {
      setLayeringError(err.message);
    } finally {
      setIsAnalyzingLayering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#E0E2E6] font-sans antialiased selection:bg-[#3B82F6] selection:text-black pb-12">
      {/* Header */}
      <header className="border-b border-[#2D3139] bg-[#0A0B0E]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Beaker className="w-6 h-6 text-[#3B82F6]" />
            <h1 className="text-xl font-bold text-white">AROMATA - Fragrance Analysis Platform</h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { key: 'dossier', label: 'Dossier' },
              { key: 'layering', label: 'Layering' },
              { key: 'cabinet', label: 'Cabinet' },
              { key: 'compounding', label: 'Compounding' },
              { key: 'blending', label: 'Blending' },
              { key: 'education', label: 'Education' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-sm text-xs font-mono uppercase transition whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-[#3B82F6] text-white'
                    : 'bg-[#2D3139] text-[#6A7180] hover:bg-[#3B82F6]/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dossier' && (
          <>
            <SearchInterface
              searchBrand={searchBrand}
              setSearchBrand={setSearchBrand}
              searchName={searchName}
              setSearchName={setSearchName}
              batchCodeInput=""
              setBatchCodeInput={() => {}}
              isAnalyzing={apiState.isAnalyzing}
              errorMessage={apiState.errorMessage}
              setErrorMessage={apiState.setErrorMessage}
              onAnalyze={handleAnalyze}
              batchResult={null}
              batchError={null}
            />
            <FragranceDossier
              fragrance={fragState.selectedFragrance}
              onPrintDossier={() => window.print()}
            />
          </>
        )}

        {activeTab === 'layering' && (
          <LayeringAnalyzer
            availableFragrances={availableFragrances}
            selectedFragA={layeringSelectA}
            setSelectedFragA={setLayeringSelectA}
            selectedFragB={layeringSelectB}
            setSelectedFragB={setLayeringSelectB}
            isAnalyzing={isAnalyzingLayering}
            result={layeringResult}
            error={layeringError}
            onAnalyze={handleLayeringAnalysis}
            onPrintLayering={() => window.print()}
          />
        )}

        {activeTab === 'cabinet' && (
          <FragranceCabinet
            cabinet={fragState.cabinet}
            selectedFragrance={fragState.selectedFragrance}
            comparedSpecimens={fragState.comparedSpecimens}
            onSelectFragrance={fragState.setSelectedFragrance}
            onRemove={fragState.handleRemoveFromCabinet}
            onToggleCompare={fragState.handleToggleCompare}
          />
        )}

        {activeTab === 'compounding' && (
          <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-8 text-center">
            <p className="text-[#6A7180]">Compounding Bench - To be migrated from main App.tsx</p>
          </div>
        )}

        {activeTab === 'blending' && <BlendingStudio />}

        {activeTab === 'education' && <EducationHub />}
      </main>
    </div>
  );
}
