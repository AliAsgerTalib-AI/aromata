import { useMemo, useState } from 'react';
import {
  Beaker, Layers, Scroll, Droplet, Thermometer, Wind, Compass,
  TrendingUp, DollarSign, AlertTriangle, CheckCircle, Flame, Palette,
  Globe, MapPin, Maximize2, ExternalLink, Scale, Shirt, BookOpen, ShieldAlert,
  Zap, X, ChevronDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { FragranceData } from '../types';
import { getInterpolatedSillageRadius } from '../utils/sillagePredictions';
import { getPreCalculatedMoodboard, getSeasonalWardrobeRecommendation } from '../utils/moodboardCalculations';
import { getDominantAccord } from '../fragranceUtils';
import { DensityShiftAnalyzer } from './DensityShiftAnalyzer';

interface FragranceDossierProps {
  fragrance: FragranceData;
  onPrintDossier: () => void;
}

export function FragranceDossier({ fragrance, onPrintDossier }: FragranceDossierProps) {
  const [isFatigueBannerDismissed, setIsFatigueBannerDismissed] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState<string>('all');
  const [activeOriginIsolate, setActiveOriginIsolate] = useState<string | null>(null);
  const [sillageFloorPlan, setSillageFloorPlan] = useState<'studio' | 'office' | 'car' | 'patio'>('studio');
  const [sillageSprays, setSillageSprays] = useState<1 | 3 | 6>(1);
  const [sillageVentilation, setSillageVentilation] = useState<'none' | 'low' | 'high'>('none');
  const [sillageSimHour, setSillageSimHour] = useState(3);

  const moodboard = useMemo(() => getPreCalculatedMoodboard(fragrance), [fragrance]);
  const wardrobe = useMemo(() => getSeasonalWardrobeRecommendation(fragrance), [fragrance]);

  // Timeline fallback
  const timeline = useMemo(() => {
    if (fragrance.historicalTimeline && fragrance.historicalTimeline.length > 0) {
      return fragrance.historicalTimeline;
    }
    return [
      { year: String(fragrance.releaseYear), title: `${fragrance.brand} ${fragrance.name} Launch`, description: 'Original release', classification: 'Origin' },
      { year: String(fragrance.releaseYear + 3), title: 'Market Introduction', description: 'Commercial availability expanded', classification: 'Milestone' },
      { year: String(fragrance.releaseYear + 7), title: 'Heritage Milestone', description: 'Established market presence', classification: 'Award' }
    ];
  }, [fragrance]);

  // Filter timeline
  const filteredTimeline = useMemo(() => {
    if (timelineFilter === 'all') return timeline;
    return timeline.filter(t => String(t.classification) === timelineFilter);
  }, [timeline, timelineFilter]);

  // Get sillage radius for simulation
  const simulatedRadius = useMemo(() => {
    const baseRadius = getInterpolatedSillageRadius(fragrance, sillageSimHour);
    const sprayMultiplier = sillageSprays / 1;
    const ventilationFactor = sillageVentilation === 'high' ? 0.6 : sillageVentilation === 'low' ? 0.85 : 1.0;
    return Math.max(0.5, baseRadius * sprayMultiplier * ventilationFactor);
  }, [fragrance, sillageSimHour, sillageSprays, sillageVentilation]);

  // Get evaporation chart data
  const evaporationData = useMemo(() => {
    return fragrance.evaporationCurve.map(point => ({
      hour: point.hour,
      top: point.top,
      heart: point.heart,
      base: point.base
    }));
  }, [fragrance]);

  // Get sillage chart data
  const sillageData = useMemo(() => {
    const hours = Array.from({ length: 11 }, (_, i) => i);
    return hours.map(hour => ({
      hour,
      radius: getInterpolatedSillageRadius(fragrance, hour)
    }));
  }, [fragrance]);

  // Accord radar data
  const accordRadarData = useMemo(() => {
    return fragrance.accords.map(accord => ({
      name: accord.name,
      value: accord.intensity,
      fullMark: 100
    }));
  }, [fragrance]);

  return (
    <div className="space-y-6 py-8">
      {/* Olfactory Fatigue Alert Warning Banner */}
      {fragrance.olfactoryFatigueRisk > 80 && !isFatigueBannerDismissed && (
        <div className="mb-6 bg-gradient-to-r from-rose-950/40 to-rose-900/10 border-l-4 border-rose-500 rounded-r-sm p-5 relative overflow-hidden shadow-lg">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
            <ShieldAlert className="w-32 h-32 text-rose-500" />
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-rose-500/15 p-2 rounded-sm text-rose-400 mt-1">
              <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>CRITICAL RECEPTOR FATIGUE HAZARD</span>
                  <span className="bg-rose-500 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-normal animate-pulse">
                    {fragrance.olfactoryFatigueRisk}% ANOSMIA RISK
                  </span>
                </h4>
                <button
                  onClick={() => setIsFatigueBannerDismissed(true)}
                  className="text-slate-500 hover:text-slate-300 transition-colors font-mono text-[10px] uppercase tracking-wider cursor-pointer font-bold"
                >
                  Dismiss ×
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-4xl font-sans">
                High density of linear synthetics detected. Rapid olfactory receptor saturation and temporary anosmia (sensory blindness) likely within 2–4 hours of continuous wear.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 bg-black/40 border border-rose-950/50 p-4 rounded-sm">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-rose-400 uppercase font-bold tracking-wider block">[1] Nasal Neutralization Purge (Active Protocol)</span>
                  <p className="text-[11px] text-slate-400 leading-normal">Smell clean, unperfumed bare forearms or raw organic wool for 45 seconds. Avoid coffee beans as they compound receptor exhaust.</p>
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-rose-400 uppercase font-bold tracking-wider block">[2] Optimum Dispenser Rotation Protocol</span>
                  <p className="text-[11px] text-slate-400 leading-normal">Initiate a strict 72-hour olfactory holiday from this formula. Re-prime receptors using ultra-airy citrus eau de colognes or light high-evaporation solo molecules.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROW 1 — Primary House Identity Card */}
      <div className="bg-gradient-to-r from-[#15181F] to-[#0A0B0E] border border-[#2D3139] rounded-sm p-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">{fragrance.brand}</h2>
            <h3 className="text-2xl text-[#3B82F6] mb-4">{fragrance.name}</h3>
            <div className="space-y-1 text-sm text-[#6A7180]">
              <p><span className="font-mono uppercase text-[10px]">Concentration:</span> {fragrance.concentration}</p>
              <p><span className="font-mono uppercase text-[10px]">Nose:</span> {fragrance.nose}</p>
              <p><span className="font-mono uppercase text-[10px]">Release Year:</span> {fragrance.releaseYear}</p>
              <p><span className="font-mono uppercase text-[10px]">Olfactory Family:</span> {fragrance.olfactoryFamily}</p>
              <p><span className="font-mono uppercase text-[10px]">Batch Lineage:</span> {fragrance.batchLineage}</p>
            </div>
          </div>
          <button
            onClick={onPrintDossier}
            className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-mono font-bold uppercase rounded-sm transition"
          >
            Print Dossier
          </button>
        </div>
      </div>

      {/* ROW 1 — Historical Timeline & Lineage */}
      <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Scroll className="w-5 h-5 text-[#3B82F6]" />
          Chronological Timeline & Formulation Heritage
        </h3>

        {/* Timeline filter buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'Origin', 'Flanker Release', 'Reformulation', 'Milestone', 'Award', 'House Event', 'Gossip'].map(filter => (
            <button
              key={filter}
              onClick={() => setTimelineFilter(filter)}
              className={`px-3 py-1 text-xs font-mono rounded-sm transition ${
                timelineFilter === filter
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-[#2D3139] text-[#6A7180] hover:bg-[#3B82F6]/20'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Timeline items */}
        <div className="space-y-3">
          {filteredTimeline.map((entry, idx) => (
            <div key={idx} className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm">
              <div className="flex items-start gap-3">
                <div className="text-[#3B82F6] font-mono text-sm font-bold min-w-fit">{entry.year}</div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm">{entry.title}</h4>
                  <p className="text-[#6A7180] text-xs mt-1">{entry.description}</p>
                  <span className="text-[9px] font-mono text-[#3B82F6] uppercase mt-2 inline-block">{entry.classification}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Molecular Blueprint Shift */}
        {fragrance.molecularBlueprintShift && (
          <div className="mt-6 bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm">
            <h4 className="text-white font-bold text-sm mb-2">{fragrance.molecularBlueprintShift.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-[#3B82F6] font-mono text-[9px] uppercase block mb-1">High Volatility Engine</span>
                <p className="text-[#E0E2E6] text-xs">{fragrance.molecularBlueprintShift.highVolatilityEngine}</p>
              </div>
              <div>
                <span className="text-[#3B82F6] font-mono text-[9px] uppercase block mb-1">Effect</span>
                <p className="text-[#E0E2E6] text-xs">{fragrance.molecularBlueprintShift.highVolatilityEffect}</p>
              </div>
              <div>
                <span className="text-[#3B82F6] font-mono text-[9px] uppercase block mb-1">Low Volatility Engine</span>
                <p className="text-[#E0E2E6] text-xs">{fragrance.molecularBlueprintShift.lowVolatilityEngine}</p>
              </div>
              <div>
                <span className="text-[#3B82F6] font-mono text-[9px] uppercase block mb-1">Effect</span>
                <p className="text-[#E0E2E6] text-xs">{fragrance.molecularBlueprintShift.lowVolatilityEffect}</p>
              </div>
            </div>
          </div>
        )}

        {/* Strategic Takeaway */}
        {fragrance.strategicTakeaway && (
          <div className="mt-4 bg-amber-950/20 border border-amber-900/40 p-4 rounded-sm">
            <span className="font-mono text-[9px] text-amber-600 uppercase font-bold block mb-1">Strategic Takeaway</span>
            <p className="text-[#E0E2E6] text-xs">{fragrance.strategicTakeaway}</p>
          </div>
        )}

        {/* IFRA Assessment - Enhanced Matrix */}
        {fragrance.ifraAssessment && (
          <div className="mt-4 bg-[#15181F] border border-[#2D3139] p-6 rounded-sm">
            <div className="flex items-center justify-between mb-6">
              <h5 className="text-white font-bold text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#F59E0B]" />
                IFRA Material Compliance Matrix
              </h5>
              <span className={`font-mono text-[9px] font-bold uppercase px-3 py-1 rounded-sm ${
                fragrance.ifraAssessment.status === 'Compliant'
                  ? 'bg-[#10B981]/20 text-[#10B981]'
                  : 'bg-[#F59E0B]/20 text-[#F59E0B]'
              }`}>
                Status: {fragrance.ifraAssessment.status}
              </span>
            </div>

            {/* Compliance Matrix Table */}
            {fragrance.ifraAssessment.criticalRestrictedMaterials.length > 0 && (
              <div className="mb-6 overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#2D3139]">
                      <th className="text-left px-3 py-2 text-[#6A7180] font-mono uppercase">Restricted Chemical / Fraction</th>
                      <th className="text-center px-3 py-2 text-[#6A7180] font-mono uppercase">IFRA Threshold Limit</th>
                      <th className="text-center px-3 py-2 text-[#6A7180] font-mono uppercase">Actual Scent Mass</th>
                      <th className="text-left px-3 py-2 text-[#6A7180] font-mono uppercase">Formulation/Safety Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fragrance.ifraAssessment.criticalRestrictedMaterials.map((mat, i) => {
                      const proximityPercent = (mat.actualPercent / mat.limitPercent) * 100;
                      const riskLevel = proximityPercent >= 100 ? 'critical' : proximityPercent >= 80 ? 'high' : proximityPercent >= 60 ? 'medium' : 'low';
                      const riskColor = riskLevel === 'critical' ? 'text-[#DC2626]' : riskLevel === 'high' ? 'text-[#F59E0B]' : riskLevel === 'medium' ? 'text-[#3B82F6]' : 'text-[#10B981]';

                      return (
                        <tr key={i} className="border-b border-[#2D3139]">
                          <td className="px-3 py-3 text-white font-mono font-bold">{mat.name}</td>
                          <td className="text-center px-3 py-3 text-[#3B82F6] font-mono font-bold">{mat.limitPercent}%</td>
                          <td className={`text-center px-3 py-3 font-mono font-bold ${riskColor}`}>{mat.actualPercent}%</td>
                          <td className="px-3 py-3 text-[#6A7180]">{mat.impact}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Regulatory Ceiling Usage Proximity Visualization */}
            {fragrance.ifraAssessment.criticalRestrictedMaterials.length > 0 && (
              <div className="mb-6 bg-[#0A0B0E] border border-[#2D3139] p-6 rounded-sm">
                <h6 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#DC2626]" />
                  Regulatory Ceiling Usage Proximity
                </h6>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {fragrance.ifraAssessment.criticalRestrictedMaterials.map((mat, i) => {
                    const proximityPercent = Math.min(100, (mat.actualPercent / mat.limitPercent) * 100);
                    const riskLevel = proximityPercent >= 100 ? 'critical' : proximityPercent >= 80 ? 'high' : proximityPercent >= 60 ? 'medium' : 'low';
                    const riskLabel = riskLevel === 'critical' ? 'CRITICAL RISK' : riskLevel === 'high' ? 'HIGH RISK' : riskLevel === 'medium' ? 'MODERATE' : 'SAFE';
                    const riskColors = {
                      critical: { ring: '#DC2626', text: 'text-[#DC2626]', bg: 'bg-[#DC2626]/10' },
                      high: { ring: '#F59E0B', text: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' },
                      medium: { ring: '#3B82F6', text: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10' },
                      low: { ring: '#10B981', text: 'text-[#10B981]', bg: 'bg-[#10B981]/10' }
                    };
                    const colors = riskColors[riskLevel];

                    return (
                      <div key={i} className="flex flex-col items-center gap-3">
                        <div className="relative w-20 h-20">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                            {/* Background circle */}
                            <circle cx="40" cy="40" r="35" fill="none" stroke="#2D3139" strokeWidth="4" />
                            {/* Progress circle */}
                            <circle
                              cx="40"
                              cy="40"
                              r="35"
                              fill="none"
                              stroke={colors.ring}
                              strokeWidth="4"
                              strokeDasharray={`${2 * Math.PI * 35 * proximityPercent / 100} ${2 * Math.PI * 35}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <p className={`text-sm font-bold ${colors.text}`}>{proximityPercent.toFixed(0)}%</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-[9px] text-white font-mono font-bold">{mat.name}</p>
                          <p className={`text-[8px] font-mono font-bold uppercase ${colors.text}`}>{riskLabel}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chemist's Takeaway */}
            <div className={`bg-amber-950/20 border-l-4 p-4 rounded-r-sm ${
              fragrance.ifraAssessment.status === 'Compliant' ? 'border-[#10B981]' : 'border-[#F59E0B]'
            }`}>
              <h6 className="text-amber-600 font-mono text-[9px] uppercase font-bold mb-2">
                The Chemist's Takeaway: Cumulative Aggregate Burden
              </h6>
              <p className="text-[#E0E2E6] text-xs leading-relaxed">{fragrance.ifraAssessment.chemistsTakeaway}</p>
            </div>
          </div>
        )}
      </div>

      {/* ROW 1.5 — Scent Story & Olfactory Pyramid */}
      {fragrance.story && fragrance.notes && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#3B82F6]" />
              Fragrance Story
            </h3>
            <p className="text-[#E0E2E6] text-sm leading-relaxed">{fragrance.story}</p>
          </div>

          <div className="lg:col-span-5 bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#3B82F6]" />
              Olfactory Pyramid
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[#3B82F6] font-mono text-xs uppercase font-bold mb-2">Top Notes</p>
                <div className="flex flex-wrap gap-2">
                  {fragrance.notes.top.map((note, i) => (
                    <span key={i} className="bg-[#0A0B0E] border border-[#2D3139] text-[#E0E2E6] text-xs px-2 py-1 rounded">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[#10B981] font-mono text-xs uppercase font-bold mb-2">Heart Notes</p>
                <div className="flex flex-wrap gap-2">
                  {fragrance.notes.heart.map((note, i) => (
                    <span key={i} className="bg-[#0A0B0E] border border-[#2D3139] text-[#E0E2E6] text-xs px-2 py-1 rounded">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[#D97706] font-mono text-xs uppercase font-bold mb-2">Base Notes</p>
                <div className="flex flex-wrap gap-2">
                  {fragrance.notes.base.map((note, i) => (
                    <span key={i} className="bg-[#0A0B0E] border border-[#2D3139] text-[#E0E2E6] text-xs px-2 py-1 rounded">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROW 1.5 — Molecule Mechanics & Layman Chemistry */}
      {fragrance.laymanChemistryExplanation && (
        <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4">Molecular Mechanics & Layman Chemistry</h3>
          <div className="space-y-3">
            {fragrance.laymanChemistryExplanation.split('\n\n').map((para, idx) => (
              <p key={idx} className="text-[#E0E2E6] text-sm leading-relaxed">{para}</p>
            ))}
          </div>
        </div>
      )}

      {/* ROW 2 — Aroma-Chemical Fingerprint */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Beaker className="w-5 h-5 text-[#3B82F6]" />
            Aroma-Chemical Fingerprint
          </h3>

          <div className="mb-4 flex items-center gap-4 bg-[#0A0B0E] border border-[#2D3139] p-3 rounded-sm">
            <div className="flex-1">
              <p className="text-[#6A7180] text-xs uppercase font-mono">Natural</p>
              <p className="text-[#10B981] font-bold">{fragrance.naturalToSyntheticRatio.natural}%</p>
            </div>
            <div className="flex-1">
              <p className="text-[#6A7180] text-xs uppercase font-mono">Synthetic</p>
              <p className="text-[#A855F7] font-bold">{fragrance.naturalToSyntheticRatio.synthetic}%</p>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries({
              'Ambers/Musks': fragrance.aromaChemicalMatrix.filter(c => c.category === 'Ambers/Musks'),
              'Woody Backbones': fragrance.aromaChemicalMatrix.filter(c => c.category === 'Woody Backbones'),
              'Sweet/Gourmand Anchors': fragrance.aromaChemicalMatrix.filter(c => c.category === 'Sweet/Gourmand Anchors'),
              'Others': fragrance.aromaChemicalMatrix.filter(c => c.category === 'Others')
            }).map(([category, chemicals]) => chemicals.length > 0 && (
              <div key={category}>
                <p className="text-[#3B82F6] font-mono text-[9px] uppercase font-bold mb-2">{category}</p>
                <div className="space-y-1">
                  {chemicals.map((chem, i) => (
                    <div key={i} className="bg-[#0A0B0E] border border-[#2D3139] p-2 rounded-sm text-xs">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-white font-mono font-bold">{chem.name}</p>
                          <p className="text-[#6A7180] text-[10px]">{chem.description}</p>
                        </div>
                        <span className="text-[#3B82F6] font-bold ml-2">{chem.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2 — Evaporation Chart */}
        <div className="lg:col-span-7 bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
            Volatility & Evaporation Decay
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evaporationData}>
              <XAxis dataKey="hour" stroke="#6A7180" />
              <YAxis stroke="#6A7180" />
              <RechartsTooltip contentStyle={{ backgroundColor: '#0A0B0E', border: '1px solid #2D3139' }} />
              <Line type="monotone" dataKey="top" stroke="#F59E0B" strokeWidth={2} name="Top" />
              <Line type="monotone" dataKey="heart" stroke="#10B981" strokeWidth={2} name="Heart" />
              <Line type="monotone" dataKey="base" stroke="#D97706" strokeWidth={2} name="Base" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROW 3 — Longevity & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Droplet className="w-5 h-5 text-[#3B82F6]" />
            Longevity Metrics
          </h3>
          <div className="space-y-4">
            <div className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm text-center">
              <p className="text-[#6A7180] text-xs uppercase font-mono mb-1">Skin Longevity</p>
              <p className="text-3xl font-bold text-[#3B82F6]">{fragrance.skinLongevityIndex}</p>
              <p className="text-xs text-[#6A7180] mt-1">hours on skin</p>
            </div>
            <div className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm text-center">
              <p className="text-[#6A7180] text-xs uppercase font-mono mb-1">Fabric Permanence</p>
              <p className="text-3xl font-bold text-[#10B981]">{fragrance.fabricPermanenceIndex}</p>
              <p className="text-xs text-[#6A7180] mt-1">hours on fabric</p>
            </div>
          </div>
        </div>

        {/* ROW 3 — Sillage Curve */}
        <div className="lg:col-span-4 bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Wind className="w-5 h-5 text-[#3B82F6]" />
            Sillage Projection Radius
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={sillageData}>
              <XAxis dataKey="hour" stroke="#6A7180" />
              <YAxis stroke="#6A7180" label={{ value: 'feet', angle: -90, position: 'insideLeft' }} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#0A0B0E', border: '1px solid #2D3139' }} />
              <Area type="monotone" dataKey="radius" fill="#3B82F6" stroke="#3B82F6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ROW 3 — Anosmia Risk */}
        <div className="lg:col-span-4 bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            Anosmia Risk Assessment
          </h3>
          <div className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm mb-3">
            <p className="text-[#6A7180] text-xs uppercase font-mono mb-1">Receptor Fatigue Risk</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-[#F59E0B]">{fragrance.olfactoryFatigueRisk}%</p>
              <p className="text-xs text-[#6A7180] mb-1">temporal anosmia likelihood</p>
            </div>
          </div>
          <div className="text-xs text-[#E0E2E6] bg-[#0A0B0E] border border-[#2D3139] p-3 rounded-sm">
            {fragrance.olfactoryFatigueExplanation.substring(0, 150)}...
          </div>
        </div>
      </div>

      {/* ROW 3.5 — Density Shift Analysis */}
      {fragrance.densityShiftAnalysis && (
        <DensityShiftAnalyzer fragrance={fragrance} />
      )}

      {/* ROW 4 — Accord & Setting Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#3B82F6]" />
            Accord Assessment
          </h3>
          {accordRadarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={accordRadarData}>
                <PolarGrid stroke="#2D3139" />
                <PolarAngleAxis dataKey="name" stroke="#6A7180" tick={{ fontSize: 10 }} />
                <Radar name="Intensity" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[#6A7180] text-sm">No accord data available</p>
          )}
          <div className="mt-4 space-y-2">
            <div className="text-xs">
              <p className="text-[#3B82F6] font-mono uppercase font-bold mb-1">Temperature Range</p>
              <p className="text-[#E0E2E6]">{fragrance.tempRangeMinCelsius}°C to {fragrance.tempRangeMaxCelsius}°C</p>
            </div>
            <div className="text-xs">
              <p className="text-[#3B82F6] font-mono uppercase font-bold mb-1">Humidity Tolerance</p>
              <p className="text-[#E0E2E6]">{fragrance.humidityTolerance}</p>
            </div>
          </div>
        </div>

        {/* ROW 4 — Occasion Setting */}
        <div className="lg:col-span-7 bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#3B82F6]" />
            Occasion Setting Appropriateness
          </h3>
          <div className="space-y-3">
            {fragrance.settingScoring.map((setting, idx) => (
              <div key={idx} className="bg-[#0A0B0E] border border-[#2D3139] p-3 rounded-sm flex items-center justify-between gap-4">
                <div>
                  <p className="text-[#E0E2E6] text-sm font-mono font-bold">{setting.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-[#2D3139] h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${setting.score}%` }}
                      className="h-full bg-[#3B82F6]"
                    />
                  </div>
                  <span className="text-[#3B82F6] font-bold text-sm min-w-fit">{setting.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 5 — Market & Pricing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#10B981]" />
            Market Pricing Index
          </h3>
          <div className="space-y-3">
            <div className="bg-[#0A0B0E] border border-[#2D3139] p-3 rounded-sm text-center">
              <p className="text-[#6A7180] text-xs uppercase font-mono mb-1">Avg Retail Price</p>
              <p className="text-2xl font-bold text-white">${fragrance.avgRetailPrice}</p>
              <p className="text-[9px] text-[#6A7180] mt-1">per 100mL</p>
            </div>
            <div className="bg-[#0A0B0E] border border-[#2D3139] p-3 rounded-sm text-center">
              <p className="text-[#6A7180] text-xs uppercase font-mono mb-1">Price per mL</p>
              <p className="text-2xl font-bold text-[#3B82F6]">${fragrance.pricePerMl.toFixed(2)}</p>
            </div>
            <div className="bg-[#0A0B0E] border border-[#2D3139] p-3 rounded-sm text-center">
              <p className="text-[#6A7180] text-xs uppercase font-mono mb-1">Value Rating</p>
              <span className={`text-sm font-bold inline-block px-2 py-1 rounded border ${
                fragrance.valueRating === 'Great Value' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25' :
                fragrance.valueRating === 'Fair' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/25' :
                'bg-[#F87171]/10 text-[#F87171] border-[#F87171]/25'
              }`}>
                {fragrance.valueRating}
              </span>
            </div>
          </div>
        </div>

        {/* ROW 5 — Alternatives */}
        <div className="lg:col-span-8 bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#3B82F6]" />
            Market Alternatives & Replicators
          </h3>
          {fragrance.alternatives.length > 0 ? (
            <div className="space-y-3 mb-4">
              {fragrance.alternatives.map((alt, idx) => (
                <div key={idx} className="bg-[#0A0B0E] border border-[#2D3139] p-3 rounded-sm">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-[#6A7180] text-xs font-mono uppercase">{alt.brand}</p>
                      <p className="text-white font-bold text-sm">{alt.name}</p>
                    </div>
                    <span className="bg-[#3B82F6]/20 text-[#3B82F6] font-bold text-xs px-2 py-1 rounded">{alt.similarity}% Match</span>
                  </div>
                  <p className="text-[#6A7180] text-xs">Price: <span className="text-[#10B981] font-mono">{alt.priceComparison}</span></p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#6A7180] text-sm mb-4">No direct market alternatives identified.</p>
          )}
          {fragrance.formulationHeritage && (
            <div className="bg-amber-950/20 border border-amber-900/40 p-3 rounded-sm text-xs">
              <p className="text-amber-600 font-mono uppercase font-bold mb-1">IFRA Heritage Note:</p>
              <p className="text-[#E0E2E6]">{fragrance.formulationHeritage}</p>
            </div>
          )}
        </div>
      </div>

      {/* ROW 5.2 — Seasonal Wardrobe & Moodboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Seasonal Wardrobe */}
        <div className="lg:col-span-5 bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shirt className="w-5 h-5 text-[#3B82F6]" />
            Seasonal Wardrobe Integration
          </h3>
          <div className="space-y-3">
            <div className="bg-[#0A0B0E] border border-[#2D3139] p-3 rounded-sm">
              <p className="text-[#6A7180] text-xs uppercase font-mono mb-2">Recommended Materials</p>
              <div className="flex flex-wrap gap-2">
                {wardrobe.materials.map((mat, i) => (
                  <span key={i} className="bg-[#3B82F6]/10 text-[#3B82F6] text-xs px-2 py-1 rounded font-mono">
                    {mat}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#0A0B0E] border border-[#2D3139] p-3 rounded-sm">
                <p className="text-[#6A7180] text-[9px] uppercase font-mono mb-1">Silhouette</p>
                <p className="text-white text-sm font-bold">{wardrobe.silhouette}</p>
              </div>
              <div className="bg-[#0A0B0E] border border-[#2D3139] p-3 rounded-sm">
                <p className="text-[#6A7180] text-[9px] uppercase font-mono mb-1">Style Persona</p>
                <p className="text-white text-sm font-bold">{wardrobe.stylePersona}</p>
              </div>
            </div>
            <div className="bg-[#0A0B0E] border border-[#2D3139] p-3 rounded-sm">
              <p className="text-[#6A7180] text-xs uppercase font-mono mb-1">Outfit Pairing</p>
              <p className="text-[#E0E2E6] text-xs">{wardrobe.outfitPairing}</p>
            </div>
            <div className="bg-[#0A0B0E] border border-[#2D3139] p-3 rounded-sm">
              <p className="text-[#6A7180] text-xs uppercase font-mono mb-1">Concept</p>
              <p className="text-[#E0E2E6] text-xs">{wardrobe.concept}</p>
            </div>
          </div>
        </div>

        {/* Moodboard */}
        <div className="lg:col-span-7 bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#3B82F6]" />
            Olfactory Moodboard
          </h3>

          <div className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm mb-4">
            <p className="text-[#6A7180] text-xs uppercase font-mono mb-1">Aesthetic Identity</p>
            <h4 className="text-white font-bold text-sm mb-2">{moodboard.aestheticTitle}</h4>
            <p className="text-[#E0E2E6] text-xs italic">{moodboard.vibeAssessment}</p>
          </div>

          <div className="mb-4">
            <p className="text-[#6A7180] text-xs uppercase font-mono mb-2">Color Palette</p>
            <div className="grid grid-cols-4 gap-2">
              {moodboard.colors.map((color, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="h-10 rounded-sm border border-[#2D3139]" style={{ backgroundColor: color }} />
                  <span className="text-[8px] font-mono text-center text-[#6A7180]">{color}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[#6A7180] text-xs uppercase font-mono mb-2">Sensory Metaphors</p>
            <div className="grid grid-cols-1 gap-2">
              {moodboard.tactileMetaphors.map((metaphor, idx) => (
                <div key={idx} className="bg-[#0A0B0E] border border-[#2D3139] p-2 rounded-sm">
                  <p className="text-[#E0E2E6] text-xs italic">"{metaphor}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spatial Sillage Diffusion Simulator */}
      <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Wind className="w-5 h-5 text-[#3B82F6]" />
          Spatial Sillage Diffusion Simulator
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <p className="text-[#6A7180] text-xs uppercase font-mono mb-2">Floor Plan Preset</p>
              <div className="grid grid-cols-2 gap-2">
                {(['studio', 'office', 'car', 'patio'] as const).map(plan => (
                  <button
                    key={plan}
                    onClick={() => setSillageFloorPlan(plan)}
                    className={`px-3 py-2 text-xs font-mono rounded border transition ${
                      sillageFloorPlan === plan
                        ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white'
                        : 'bg-[#0A0B0E] border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/40'
                    }`}
                  >
                    {plan.charAt(0).toUpperCase() + plan.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[#6A7180] text-xs uppercase font-mono mb-2">Number of Sprays</p>
              <div className="flex gap-2">
                {([1, 3, 6] as const).map(num => (
                  <button
                    key={num}
                    onClick={() => setSillageSprays(num)}
                    className={`flex-1 px-3 py-2 text-xs font-mono rounded border transition ${
                      sillageSprays === num
                        ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white'
                        : 'bg-[#0A0B0E] border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/40'
                    }`}
                  >
                    {num}x
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[#6A7180] text-xs uppercase font-mono mb-2">Ventilation Level</p>
              <div className="flex gap-2">
                {(['none', 'low', 'high'] as const).map(vent => (
                  <button
                    key={vent}
                    onClick={() => setSillageVentilation(vent)}
                    className={`flex-1 px-3 py-2 text-xs font-mono rounded border transition ${
                      sillageVentilation === vent
                        ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white'
                        : 'bg-[#0A0B0E] border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/40'
                    }`}
                  >
                    {vent}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[#6A7180] text-xs uppercase font-mono mb-2">Hour of Day</p>
              <input
                type="range"
                min="0"
                max="10"
                value={sillageSimHour}
                onChange={(e) => setSillageSimHour(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-center text-[#3B82F6] font-bold text-sm mt-1">{sillageSimHour}h</p>
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-8 flex flex-col items-center justify-center min-h-64">
              <div className="relative w-40 h-40">
                {/* Room representation */}
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  {/* Room background */}
                  <rect x="20" y="20" width="160" height="160" fill="none" stroke="#2D3139" strokeWidth="2" />

                  {/* Sillage radius circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r={Math.min(70, simulatedRadius * 15)}
                    fill="#3B82F6"
                    fillOpacity={0.2}
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />

                  {/* Spray point */}
                  <circle cx="100" cy="100" r="4" fill="#3B82F6" />
                </svg>
              </div>

              <div className="mt-4 text-center space-y-1">
                <p className="text-[#3B82F6] font-bold text-lg">{simulatedRadius.toFixed(1)} feet</p>
                <p className="text-[#6A7180] text-xs">effective sillage radius</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0A0B0E] border border-[#2D3139] p-3 rounded-sm text-center">
                <p className="text-[#6A7180] text-[9px] uppercase font-mono">Concentration</p>
                <p className="text-white font-bold text-sm">{fragrance.concentration}</p>
              </div>
              <div className="bg-[#0A0B0E] border border-[#2D3139] p-3 rounded-sm text-center">
                <p className="text-[#6A7180] text-[9px] uppercase font-mono">Olfactory Family</p>
                <p className="text-white font-bold text-sm">{fragrance.olfactoryFamily}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
