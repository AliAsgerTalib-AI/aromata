import { useMemo } from 'react';
import {
  Beaker, Layers, Scroll, Droplet, Thermometer, Wind, Compass,
  TrendingUp, DollarSign, AlertTriangle, CheckCircle, Flame, Palette,
  Globe, MapPin, Maximize2, ExternalLink, Scale
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { FragranceData } from '../types';
import { getInterpolatedSillageRadius } from '../utils/sillagePredictions';
import { getPreCalculatedMoodboard, getSeasonalWardrobeRecommendation } from '../utils/moodboardCalculations';

interface FragranceDossierProps {
  fragrance: FragranceData;
  onPrintDossier: () => void;
}

export function FragranceDossier({ fragrance, onPrintDossier }: FragranceDossierProps) {
  const moodboard = useMemo(() => getPreCalculatedMoodboard(fragrance), [fragrance]);
  const wardrobe = useMemo(() => getSeasonalWardrobeRecommendation(fragrance), [fragrance]);

  return (
    <div className="space-y-6 py-8">
      {/* Header with fragrance identity */}
      <div className="bg-gradient-to-r from-[#15181F] to-[#0A0B0E] border border-[#2D3139] rounded-sm p-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">{fragrance.brand}</h2>
            <h3 className="text-2xl text-[#3B82F6] mb-4">{fragrance.name}</h3>
            <p className="text-[#6A7180] text-sm">{fragrance.concentration}</p>
          </div>
          <button
            onClick={onPrintDossier}
            className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-mono font-bold uppercase rounded-sm transition"
          >
            Print Dossier
          </button>
        </div>
      </div>

      {/* Moodboard Section */}
      <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
        <h3 className="text-lg font-bold text-white mb-4">{moodboard.aestheticTitle}</h3>
        <p className="text-[#E0E2E6] mb-4">{moodboard.vibeAssessment}</p>
        <div className="grid grid-cols-4 gap-2">
          {moodboard.colors.map((color, i) => (
            <div key={i} className="h-16 rounded-sm border border-[#2D3139]" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>

      {/* Wardrobe Recommendation */}
      <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
        <h3 className="text-lg font-bold text-white mb-4">Seasonal Wardrobe</h3>
        <p className="text-[#3B82F6] font-mono text-sm mb-3">{wardrobe.season}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-[#6A7180] uppercase font-mono mb-2">Occasions</p>
            <ul className="space-y-1">
              {wardrobe.occasions.map((occ, i) => (
                <li key={i} className="text-sm text-[#E0E2E6]">• {occ}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-[#6A7180] uppercase font-mono mb-2">Color Palette</p>
            <ul className="space-y-1">
              {wardrobe.colorPalette.map((color, i) => (
                <li key={i} className="text-sm text-[#E0E2E6]">• {color}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Placeholder for additional sections */}
      <div className="text-center p-8 bg-[#15181F] border border-[#2D3139] rounded-sm">
        <p className="text-[#6A7180]">Additional dossier sections from main App.tsx will be integrated here</p>
      </div>
    </div>
  );
}
