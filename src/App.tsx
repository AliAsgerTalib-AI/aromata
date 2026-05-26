import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Beaker, 
  Search, 
  ShieldAlert, 
  Thermometer, 
  Wind, 
  Clock, 
  Layers, 
  Compass, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Calendar, 
  Award, 
  Droplet,
  Shuffle,
  Activity,
  Maximize2,
  ExternalLink,
  RefreshCw,
  Zap,
  MapPin,
  Flame,
  FileSpreadsheet,
  Trash2,
  Plus,
  Scale,
  Play,
  Pause,
  Shirt,
  Palette,
  Globe,
  Bookmark,
  BookOpen,
  Scroll,
  Sparkles,
  Users,
  Atom,
  Printer,
  Copy,
  Check
} from 'lucide-react';
import { getDynamicSourceOriginData, KNOWN_ISOLATES_DATABASE } from './originDatabase';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  AreaChart, 
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ReferenceLine,
  ReferenceDot,
  Legend
} from 'recharts';
import { PREDEFINED_FRAGRANCES } from './data';
import { FragranceData, ParsedBatchCode, AromaChemical, FragranceConcentration } from './types';
import { fragranceExistsInCabinet, getDominantAccord } from './fragranceUtils';
import { MASTER_NOSES_DATABASE } from './nosesDatabase';
import { MASTER_HOUSES_DATABASE } from './housesDatabase';
import { INDEPENDENT_NICHE_DATABASE } from './nicheDatabase';
import { PERFUME_SYNTHETICS_DATABASE } from './syntheticsDatabase';
import { TECHNICAL_SYNTHETICS_DATABASE } from './technicalSyntheticsDatabase';
import { TIMELINE_DATABASE } from './timelineDatabase';

const getInterpolatedSillageRadius = (fragrance: FragranceData, hour: number): number => {
  const curve = fragrance.sillageProjectionRadiusCurve;
  if (!curve || curve.length === 0) return 3.0;
  
  // exact matching
  const exact = curve.find(c => c.hour === hour);
  if (exact !== undefined) return exact.radiusFeet;
  
  if (hour <= curve[0].hour) return curve[0].radiusFeet;
  if (hour >= curve[curve.length - 1].hour) return curve[curve.length - 1].radiusFeet;
  
  let lowIdx = 0;
  for (let i = 0; i < curve.length; i++) {
    if (curve[i].hour <= hour) {
      lowIdx = i;
    } else {
      break;
    }
  }
  const highIdx = lowIdx + 1;
  const pLow = curve[lowIdx];
  const pHigh = curve[highIdx];
  
  const fraction = (hour - pLow.hour) / (pHigh.hour - pLow.hour);
  return pLow.radiusFeet + fraction * (pHigh.radiusFeet - pLow.radiusFeet);
};

export interface WardrobeRecommendation {
  materials: string[];
  silhouette: string;
  stylePersona: string;
  outfitPairing: string;
  concept: string;
}

const getSeasonalWardrobeRecommendation = (frag: FragranceData): WardrobeRecommendation => {
  const maxTemp = frag.tempRangeMaxCelsius;
  const minTemp = frag.tempRangeMinCelsius;
  const dominantAccord = getDominantAccord(frag.accords);

  let materials: string[] = ['Organic Linen Plain-weave', 'Breathable Long-staple Tencel', 'Unstructured Rayon'];
  let silhouette = 'Slouchy Soft-shouldered Tailoring';
  let stylePersona = 'Minimalist Aerated Casual core';
  let outfitPairing = 'Dry-spun white linen shirt layered loosely over draped tencel flat-front trousers, styled with raw leather slides.';
  let concept = 'Airborne Thermal Dispersion Ventilation';

  if (maxTemp < 15) {
    // Cold weather
    materials = ['Dense Boiled Wool', 'Lambskin Suede', 'Double-faced Cashmere Thread', 'Merino Ribbing'];
    silhouette = 'Structured Multi-layered Overcoat Silhouette';
    stylePersona = 'Brutalist Architectural tailoring';
    outfitPairing = 'A massive double-breasted graphite cashmere overcoat, thick mockneck rib-knit merino sweater, and structured dry Japanese denim.';
    concept = 'Fibrous Air-layer Heat Trapping';
  } else if (minTemp >= 15 && maxTemp <= 25) {
    // Moderate weather
    materials = ['Washed Chamois Suede', 'Dense Cotton Gabardine', 'Fine Gauge Merino', 'Heavy Cotton Drill'];
    silhouette = 'Transitional Cropped Jackets & Layers';
    stylePersona = 'Refined Technical Utility';
    outfitPairing = 'Unlined khaki cotton gabardine trench coat over a crewneck long-sleeve merino tee, styled with customized dark-wash selvedge denim and suede boots.';
    concept = 'Balanced Radiative Sillage Capture';
  }

  // Accentuate based on predominant accords
  if (dominantAccord.includes('wood') || dominantAccord.includes('cedar') || dominantAccord.includes('sandal') || dominantAccord.includes('earth')) {
    materials = [...new Set([...materials, 'Heirloom Horsehide Leather', 'Waxed Duck Canvas'])];
    stylePersona += ' with Organic Earth-core Textures';
  } else if (dominantAccord.includes('citrus') || dominantAccord.includes('fresh') || dominantAccord.includes('marine') || dominantAccord.includes('aquatic')) {
    materials = [...new Set([...materials, 'Perforated Mesh Knitwear', 'Ripstop Nylon Fabrics'])];
    stylePersona += ' with Cool High-ventilation Accents';
  } else if (dominantAccord.includes('amber') || dominantAccord.includes('spicy') || dominantAccord.includes('vanilla') || dominantAccord.includes('sweet')) {
    materials = [...new Set([...materials, 'Silk Tweed', 'Soft Cashmere Ribbing', 'Peau de Soie Velvet'])];
    stylePersona += ' with Enveloping Warm Scent-retention Accents';
  }

  return { materials, silhouette, stylePersona, outfitPairing, concept };
};

const getPreCalculatedMoodboard = (frag: FragranceData) => {
  const dominantAccord = getDominantAccord(frag.accords);

  let aestheticTitle = "Abstract Molecular Canvas";
  let vibeAssessment = `A sophisticated layout balanced perfectly on chemical compounds. Features soft sillage vectors that complement ${frag.olfactoryFamily.toLowerCase()} structures.`;
  let colors = ["#0F172A", "#1E293B", "#3B82F6", "#10B981"];
  let tactileMetaphors = [
    "Matte sand-blasted titanium sheets mirroring an overcast winter twilight",
    "Pristine dry linen fibers stacked atop polished concrete slate slabs",
    "A clean, crackling laboratory beaker containing high-purity carrier isolates",
    "Delicate dew condensing on highly tensioned metallic structural wires"
  ];

  if (dominantAccord.includes('wood') || dominantAccord.includes('forest') || dominantAccord.includes('earth') || dominantAccord.includes('patchouli') || dominantAccord.includes('vetiver')) {
    aestheticTitle = "Raw Brutalist Timber";
    vibeAssessment = `A dark, soil-bonded textural matrix anchored by heavily loaded polymers. Imparts a slow, smoky evaporation signature carrying dense primeval wood resin vectors.`;
    colors = ["#130E0A", "#2E1C12", "#C2410C", "#F59E0B"];
    tactileMetaphors = [
      "Splintered logs of weathered cedar exposing dry golden heartwood fibers",
      "Dense forest humus covered with dry, crackling amber-encrusted pine needles",
      "Smoldering birch pitch forming sticky, pitch-black geometric shapes",
      "High-texture sheared vintage suede glowing under candlelight"
    ];
  } else if (dominantAccord.includes('citrus') || dominantAccord.includes('marine') || dominantAccord.includes('fresh') || dominantAccord.includes('ozonic') || dominantAccord.includes('aquatic')) {
    aestheticTitle = "High-Altitude Coastal Mineralism";
    vibeAssessment = `A cold, ultra-modern aerodynamic space styled with generous negative space. High vapor pressures trigger rapid energy discharges of effervescent particles.`;
    colors = ["#080E1A", "#134E5E", "#06B6D4", "#F0FFD4"];
    tactileMetaphors = [
      "A sudden, bracing salt-spray wave crashing over sub-zero granite stones",
      "Cold, squeezed zesty bergamot rinds suspended in dry glacial carbonation",
      "Brushed silver aluminum reflecting a pristine early-morning solar glow",
      "Washed white sails snapping in a heavy, highly oxygenated offshore gale"
    ];
  } else if (dominantAccord.includes('amber') || dominantAccord.includes('spice') || dominantAccord.includes('sweet') || dominantAccord.includes('leather') || dominantAccord.includes('gourmand')) {
    aestheticTitle = "Gilded Obsidian Smoulder";
    vibeAssessment = `A dense, highly luxurious atmospheric velvet aura. Combines heavy base-fixative anchors with sweet, unctuous resinous molecular chains for supreme skin retention.`;
    colors = ["#1A0C0E", "#450A0B", "#D97706", "#FDE047"];
    tactileMetaphors = [
      "Polished high-gloss obsidian blocks casting amber geometric shadows",
      "Warm, buttery distressed glove leather infused with crushed dry saffron threads",
      "A slow, viscous pour of golden benzoin resin crystallizing into hard amber jewels",
      "Rich cashmere blankets layered deep inside a warm wood-paneled study"
    ];
  }

  return { aestheticTitle, vibeAssessment, colors, tactileMetaphors };
};

export default function App() {
  const [selectedFragrance, setSelectedFragrance] = useState<FragranceData>(PREDEFINED_FRAGRANCES[0]);
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'Origin' | 'Flanker Release' | 'Reformulation' | 'Milestone' | 'Award' | 'House Event'>('all');
  const [searchBrand, setSearchBrand] = useState('');
  const [searchName, setSearchName] = useState('');
  const [batchCodeInput, setBatchCodeInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Custom brand & batch parser inputs
  const [batchVerifyBrand, setBatchVerifyBrand] = useState('');
  const [batchVerifyCode, setBatchVerifyCode] = useState('');
  const [isVerifyingBatch, setIsVerifyingBatch] = useState(false);
  const [batchResult, setBatchResult] = useState<ParsedBatchCode | null>(null);
  const [batchError, setBatchError] = useState<string | null>(null);

  // Quality of Life Olfactory Fatigue Alert states
  const [isFatigueBannerDismissed, setIsFatigueBannerDismissed] = useState(false);

  // Print Mode & Interactive Export Portal State
  const [printMode, setPrintMode] = useState<'dossier' | 'layering' | null>(null);
  const [isPrintPortalOpen, setIsPrintPortalOpen] = useState(false);
  const [printPortalType, setPrintPortalType] = useState<'dossier' | 'layering' | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handlePrintSection = (type: 'dossier' | 'layering') => {
    setPrintMode(type);
    setPrintPortalType(type);
    setIsPrintPortalOpen(true);
    setCopySuccess(false);
    
    // Attempt standard print dialog wrapper gracefully
    setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        console.warn("Printing is sandboxed or unavailable in this view context:", e);
      }
      
      // Let printMode reset so screen rendering is normal, but keep the full interactive preview open for copy & export support!
      setTimeout(() => {
        setPrintMode(null);
      }, 500);
    }, 150);
  };

  const handleCopyReportData = () => {
    let text = '';
    if (printPortalType === 'dossier' && selectedFragrance) {
      text = `AROMATA MOLECULAR SYSTEMS - LAB REPORT
TARGET: ${selectedFragrance.brand} - ${selectedFragrance.name} (${selectedFragrance.concentration || 'EDPs'})
CREATOR: ${selectedFragrance.nose || 'N/A'} | YEAR: ${selectedFragrance.releaseYear}
FAMILY: ${selectedFragrance.olfactoryFamily}

CONCEPT DESCRIPTION:
${selectedFragrance.story || ''}

OLFACTORY NOTES MAP:
- TOP NOTES: ${selectedFragrance.notes?.top?.join(', ') || 'N/A'}
- HEART NOTES: ${selectedFragrance.notes?.heart?.join(', ') || 'N/A'}
- BASE NOTES: ${selectedFragrance.notes?.base?.join(', ') || 'N/A'}

PERFORMANCE INDICES:
- Skin Longevity: ${selectedFragrance.skinLongevityIndex?.toFixed(1) || 'N/A'} Hours
- Fabric Permanence: ${selectedFragrance.fabricPermanenceIndex || 'N/A'} Hours
- Olfactory Fatigue Risk: ${selectedFragrance.olfactoryFatigueRisk || '0'}%

COMPOSITION SPECIMEN MATRICES:
- Natural Percentage: ${selectedFragrance.naturalToSyntheticRatio?.natural || 'N/A'}%
- Synthetic Percentage: ${selectedFragrance.naturalToSyntheticRatio?.synthetic || 'N/A'}%
- Chemical Isolation Breakdown:
${selectedFragrance.aromaChemicalMatrix?.map(i => `  * ${i.name} - ${i.percentage}% [Description: ${i.description}]`).join('\n') || ''}

IFRA REGULATORY SAFETY STATUS: ${selectedFragrance.ifraAssessment?.status || 'N/A'}
${selectedFragrance.ifraAssessment?.criticalRestrictedMaterials?.map(m => `  * ${m.name}: Ceiling (${m.limitPercent}%) | Actual Scent (${m.actualPercent}%) [${m.impact}]`).join('\n') || ''}
CHEF DIRECTIVES: ${selectedFragrance.ifraAssessment?.chemistsTakeaway || 'N/A'}
`;
    } else if (printPortalType === 'layering' && layeringResult) {
      text = `AROMATA MOLECULAR SYSTEMS - MOLECULAR LAYERING REPORT
PRIMARY SPECIMEN A: ${layeringSelectA}
CANOPY SPECIMEN B: ${layeringSelectB}

SYNERGY COEFFICIENT: ${layeringResult.compatibilityScore}% [${layeringResult.compatibilityLevel}]

CHEMIST PAIRING OVERVIEW:
${layeringResult.molecularSummary}

DETAILED CHEMICAL ACTIONS:
- Base-Fixative Amplification Action:
${layeringResult.baseFixativeAmplification}

- Top-Note Conflict Actions & Warnings:
${layeringResult.topNoteConflict}

OPTIMAL APPLICATION PROTOCOL & TIMELINE:
${layeringResult.applicationSequence}
`;
    }

    if (text) {
      navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Intelligent Molecular Layering Compatibility Solver states
  const [layeringSelectA, setLayeringSelectA] = useState<string>(PREDEFINED_FRAGRANCES[0] ? `${PREDEFINED_FRAGRANCES[0].brand} - ${PREDEFINED_FRAGRANCES[0].name}` : '');
  const [layeringSelectB, setLayeringSelectB] = useState<string>(PREDEFINED_FRAGRANCES[1] ? `${PREDEFINED_FRAGRANCES[1].brand} - ${PREDEFINED_FRAGRANCES[1].name}` : '');
  const [isAnalyzingLayering, setIsAnalyzingLayering] = useState(false);
  const [layeringResult, setLayeringResult] = useState<{
    compatibilityScore: number;
    compatibilityLevel: string;
    baseFixativeAmplification: string;
    topNoteConflict: string;
    applicationSequence: string;
    molecularSummary: string;
  } | null>(null);
  const [layeringError, setLayeringError] = useState<string | null>(null);

  // Active View Tab State
  const [activeTab, setActiveTab] = useState<'dossier' | 'references' | 'cabinet' | 'compounding' | 'glossary' | 'noses' | 'houses' | 'niche' | 'synthetics' | 'matrix' | 'timeline'>('dossier');

  // Compounding Bench state parameters
  const [compoundingName, setCompoundingName] = useState('My Custom Blend');
  const [compoundingCreator, setCompoundingCreator] = useState('Artisan Perfumer');
  const [dilutionPercent, setDilutionPercent] = useState(20); // 1-100%
  const [solventType, setSolventType] = useState<'alcohol' | 'dpg' | 'ipm'>('alcohol');
  const [compoundingIsolates, setCompoundingIsolates] = useState<{name: string, parts: number, category: string, description: string}[]>([
    { name: "Iso E Super", parts: 220, category: "Woody Backbones", description: "Smooth velvet amberwood background filler." },
    { name: "Ambroxan", parts: 145, category: "Ambers/Musks", description: "Vibrant marine-dry ambergris synthetic projection." },
    { name: "Hedione", parts: 180, category: "Others", description: "Luminous, airy jasmine-like synthetic radiance enhancer." },
    { name: "Galaxolide", parts: 55, category: "Ambers/Musks", description: "Clean white musk for skin durability and softness." },
    { name: "Linalool & Linalyl Acetate", parts: 120, category: "Others", description: "Isolates replicating citrus peel and lavender." },
    { name: "Eugenol", parts: 10, category: "Others", description: "Spicy, warm clove-like aromatic isolate." },
    { name: "Oakmoss Extract", parts: 5, category: "Others", description: "Earthy, mossy forest floor absolute." },
    { name: "Lilial", parts: 0, category: "Others", description: "Banned sweet lily-of-the-valley floral aldehyde." }
  ]);
  const [newIsolateName, setNewIsolateName] = useState('Dihydromyrcenol');
  const [newIsolateParts, setNewIsolateParts] = useState(50);

  // Educational state for interactive chemistry explorer
  const [eduIsolateType, setEduIsolateType] = useState<'top' | 'heart' | 'base'>('top');

  // Dynamic Compounding calculation engine
  const compoundingAnalysis = (() => {
    const totalParts = compoundingIsolates.reduce((sum, item) => sum + item.parts, 0) || 1;
    
    // Calculate raw and final concentrations
    const withPercentages = compoundingIsolates.map(item => {
      const percentage = Number(((item.parts / totalParts) * 100).toFixed(2));
      const finalConcentration = Number((percentage * (dilutionPercent / 100)).toFixed(3));
      return {
        ...item,
        percentage,
        finalConcentration
      };
    });

    const baseParts = compoundingIsolates.filter(i => i.category === 'Ambers/Musks' || i.category === 'Woody Backbones').reduce((sum, item) => sum + item.parts, 0);
    const heartParts = compoundingIsolates.filter(i => i.category === 'Sweet/Gourmand Anchors').reduce((sum, item) => sum + item.parts, 0);
    const topParts = compoundingIsolates.filter(i => i.category === 'Others').reduce((sum, item) => sum + item.parts, 0);

    const baseRatio = baseParts / totalParts;
    const heartRatio = heartParts / totalParts;
    const topRatio = topParts / totalParts;

    // Standard points [0, 1, 2, 4, 6, 10]
    const hours = [0, 1, 2, 4, 6, 10];
    const evaporationCurve = hours.map(h => {
      let topDecay = Math.exp(-h * 1.5);
      let heartDecay = Math.exp(-h * 0.45);
      let baseDecay = Math.exp(-h * 0.12);

      // Solvent adjustments - Alcohol flashes off, DPG/IPM hold down top notes
      if (solventType === 'alcohol') {
        topDecay = Math.exp(-h * 2.2);
        if (h === 0) topDecay = 1.6;
        else if (h === 1) topDecay = 1.1;
      } else {
        // Fixated oil: delay evaporation, cushion top notes
        topDecay = Math.exp(-h * 0.7);
        if (h === 0) topDecay = 0.6;
        else if (h === 1) topDecay = 0.8;
        
        heartDecay = Math.exp(-h * 0.28);
        baseDecay = Math.exp(-h * 0.08);
      }

      // Dilution adjust
      const dilScale = dilutionPercent / 20; // benchmark: EDP 20%
      let scale = Math.min(1.4, Math.max(0.4, dilScale));

      let tVal = Math.round(topRatio * 100 * topDecay * scale);
      let hVal = Math.round(heartRatio * 100 * heartDecay * scale);
      let bVal = Math.round(baseRatio * 100 * baseDecay * scale);

      // Bound to 0-100
      tVal = Math.min(100, Math.max(0, tVal));
      hVal = Math.min(100, Math.max(0, hVal));
      bVal = Math.min(100, Math.max(0, bVal));

      return {
        hour: h,
        top: tVal,
        heart: hVal,
        base: bVal
      };
    });

    // Estimate skin longevity
    const defaultLongevity = 4.0 + 11.0 * baseRatio + 4.0 * heartRatio; // Base has 15hr longevity, Heart has 8hr
    const solventMult = solventType === 'alcohol' ? 1.0 : 1.35; // oils drag exposure out
    const dilMult = dilutionPercent >= 30 ? 1.4 : (dilutionPercent >= 16 ? 1.0 : (dilutionPercent >= 8 ? 0.7 : 0.45));
    const predictedLongevity = Number((defaultLongevity * solventMult * dilMult).toFixed(1));

    // Dynamic Sillage Radius curve
    const sillageProjectionRadiusCurve = hours.map(h => {
      const initialSillage = 2.5 + 4.5 * (topRatio * 0.5 + heartRatio * 0.35 + baseRatio * 0.15); // max 7ft
      const solventSillageMult = solventType === 'alcohol' ? (h <= 1 ? 1.35 : 0.6) : (h <= 1 ? 0.75 : 1.15);
      const dilutionSillageMult = dilutionPercent / 20;
      
      const decayEnvelope = Math.exp(-h / (predictedLongevity * 0.35 || 1));
      let radius = initialSillage * solventSillageMult * dilutionSillageMult * decayEnvelope;
      return {
        hour: h,
        radiusFeet: Number(Math.min(12, Math.max(0.1, radius)).toFixed(1))
      };
    });

    // Safety Audit against major IFRA Standards Category 4 limits (Fine Fragrances)
    // 1. Oakmoss extract cap 0.1%
    // 2. Lilial cap 0.0% (banned)
    // 3. Eugenol cap 0.5%
    // 4. Coumarin cap 1.5%
    // 5. Cashmeran cap 3.8%
    // 6. Benzyl Benzoate cap 4.8%
    // 7. Linalool allergen threshold 0.01%
    const safetyChecks = withPercentages.map(item => {
      const lower = item.name.toLowerCase();
      let limit = 100.0;
      let isBanned = false;
      let isAllergenWarning = false;
      let status: 'compliant' | 'warning' | 'non-compliant' = 'compliant';
      let message = 'Complies with general safety thresholds.';

      if (lower.includes('oakmoss')) {
        limit = 0.1;
        if (item.finalConcentration > limit) {
          status = 'non-compliant';
          message = `Exceeds IFRA Category 4 safety limit of ${limit}% in finished formulation (severe sensitizer hazard).`;
        }
      } else if (lower.includes('lilial')) {
        limit = 0.0;
        isBanned = true;
        if (item.finalConcentration > 0) {
          status = 'non-compliant';
          message = 'Banned substance (IFRA 50th Amendment / EU Cosmetics Regulation). Limit is strict 0.0%.';
        }
      } else if (lower.includes('eugenol')) {
        limit = 0.5;
        if (item.finalConcentration > limit) {
          status = 'non-compliant';
          message = `Exceeds IFRA safety threshold of ${limit}% in finished product (potential allergen contact hazard).`;
        }
      } else if (lower.includes('coumarin')) {
        limit = 1.5;
        if (item.finalConcentration > limit) {
          status = 'non-compliant';
          message = `Exceeds IFRA safety cap of ${limit}% inside finished cosmetic products.`;
        }
      } else if (lower.includes('cashmeran')) {
        limit = 3.8;
        if (item.finalConcentration > limit) {
          status = 'non-compliant';
          message = `Exceeds IFRA olfactory ceiling cap of ${limit}% inside fine fragrances.`;
        }
      } else if (lower.includes('benzyl benzoate')) {
        limit = 4.8;
        if (item.finalConcentration > limit) {
          status = 'non-compliant';
          message = `Exceeds regulatory limit of ${limit}% in finished products.`;
        }
      } else if (lower.includes('linalool')) {
        limit = 0.01;
        isAllergenWarning = true;
        if (item.finalConcentration > limit) {
          status = 'warning';
          message = `Finished concentration (${item.finalConcentration}%) exceeds allergen labeling disclosure threshold of ${limit}%. Declare on retail carton.`;
        }
      }

      return {
        name: item.name,
        finalConcentration: item.finalConcentration,
        status,
        limit,
        isBanned,
        isAllergenWarning,
        message
      };
    });

    const isFullyCompliant = !safetyChecks.some(c => c.status === 'non-compliant');
    const hasWarnings = safetyChecks.some(c => c.status === 'warning');

    return {
      withPercentages,
      totalParts,
      evaporationCurve,
      predictedLongevity,
      sillageProjectionRadiusCurve,
      safetyChecks,
      isFullyCompliant,
      hasWarnings
    };
  })();

  // Compound registration action: pack compounding states and save to specimens cabinet
  const handleSaveCompoundedFragrance = () => {
    if (!compoundingName.trim()) {
      showNotification("Compounding desk: Please designate a name for this custom molecular isolate formula.");
      return;
    }

    // Determine raw concentrations
    const concLabel = dilutionPercent <= 8 ? 'Cologne (EDC)' : 
                      dilutionPercent <= 15 ? 'Toilette (EDT)' : 
                      dilutionPercent <= 24 ? 'Parfum (EDP)' : 
                      dilutionPercent <= 40 ? 'Extrait' : 'Pure Parfum';

    const matrixMapped = compoundingAnalysis.withPercentages.map(item => ({
      name: item.name,
      percentage: item.percentage,
      category: item.category as any,
      description: item.description
    }));

    // Estimate olfactory family based on weight
    const woodyWeight = compoundingIsolates.filter(i => i.category === 'Woody Backbones').reduce((s, i) => s + i.parts, 0);
    const muskWeight = compoundingIsolates.filter(i => i.category === 'Ambers/Musks').reduce((s, i) => s + i.parts, 0);
    const sweetWeight = compoundingIsolates.filter(i => i.category === 'Sweet/Gourmand Anchors').reduce((s, i) => s + i.parts, 0);
    
    let olfactoryFamily = "Aromatic Citrus Fresh";
    if (woodyWeight >= muskWeight && woodyWeight >= sweetWeight) {
      olfactoryFamily = "Dry Woody Ambergris";
    } else if (muskWeight >= woodyWeight && muskWeight >= sweetWeight) {
      olfactoryFamily = "Powdery White Amber Musk";
    } else if (sweetWeight >= woodyWeight && sweetWeight >= muskWeight) {
      olfactoryFamily = "Gourmand Benzoin Accord";
    }

    const totalParts = compoundingIsolates.reduce((s, i) => s + i.parts, 0) || 1;
    const naturalParts = compoundingIsolates
      .filter(i => KNOWN_ISOLATES_DATABASE[i.name.toLowerCase()]?.originClassification === 'Natural Distillation Rectification')
      .reduce((s, i) => s + i.parts, 0);
    const naturalPct = Math.round((naturalParts / totalParts) * 100);

    const customSpecimen: FragranceData = {
      brand: "Aromata Lab",
      name: compoundingName.trim(),
      concentration: concLabel as FragranceConcentration,
      nose: compoundingCreator.trim() || "Artisan Perfumer",
      releaseYear: new Date().getFullYear(),
      batchLineage: `Formulation Ref: LAB-${Math.floor(1000 + Math.random() * 9000)}. Solvent carrier: ${solventType === 'alcohol' ? '96% perfumer\'s alcohol' : solventType === 'dpg' ? 'solvent DPG' : 'IPM carrier'}. Dilution factor: ${dilutionPercent}%.`,
      aromaChemicalMatrix: matrixMapped,
      naturalToSyntheticRatio: {
        natural: naturalPct,
        synthetic: 100 - naturalPct
      },
      evaporationCurve: compoundingAnalysis.evaporationCurve,
      skinLongevityIndex: compoundingAnalysis.predictedLongevity,
      fabricPermanenceIndex: Number((compoundingAnalysis.predictedLongevity * 1.8).toFixed(1)),
      sillageProjectionRadiusCurve: compoundingAnalysis.sillageProjectionRadiusCurve,
      olfactoryFatigueRisk: compoundingIsolates.some(i => i.name.toLowerCase().includes('ambroxan') || i.name.toLowerCase().includes('iso e super')) ? 85 : 45,
      olfactoryFatigueExplanation: "High loading of bulky macrocyclic musks and linear woody synthetic isolates bind aggressively to olfactory nasal neurons, inducing receptor adaptation/saturation within 15 mins of direct breathing tracking.",
      olfactoryFamily,
      accords: [
        { name: woodyWeight > 0 ? "Woody" : "Clean", intensity: 85 },
        { name: muskWeight > 0 ? "Ambergris" : "Musky", intensity: 75 },
        { name: "Synthetic-Sharp", intensity: 65 }
      ],
      tempRangeMinCelsius: 8,
      tempRangeMaxCelsius: 28,
      humidityTolerance: solventType === 'alcohol' ? "Evaporates clean in dryer conditions" : "Lipophilic carrier locks onto skin in damp environments",
      settingScoring: [
        { name: "Strict Office", score: dilutionPercent >= 25 ? 50 : 85 },
        { name: "Open-Air Only", score: dilutionPercent >= 25 ? 90 : 65 },
        { name: "High-Performance Nightlife", score: dilutionPercent >= 20 ? 95 : 60 }
      ],
      avgRetailPrice: 0,
      pricePerMl: 0,
      valueRating: "Bespoke Compound",
      alternatives: [],
      formulationHeritage: `Created dynamically using the parts-per-thousand (ppt) laboratory blender bench. Fully audited against modern IFRA Category 4 safety standards.`
    };

    // Push structure into Cabinet
    const newCabinet = [customSpecimen, ...cabinet.filter(f => !(f.brand === customSpecimen.brand && f.name === customSpecimen.name))];
    setCabinet(newCabinet);
    localStorage.setItem('scent_cabinet', JSON.stringify(newCabinet));

    // Force selection and shift focus to dossier analyst tab so they can trace the sillage/analysis of their custom blend!
    setSelectedFragrance(customSpecimen);
    setActiveTab('dossier');

    showNotification(`Lab Compound "${customSpecimen.brand} ${customSpecimen.name}" registered to cabinet & activated in Dossier Analyst!`, 5000);
  };

  // Sillage Simulation state
  const [sillageSimHour, setSillageSimHour] = useState(0);
  const [sillageFloorPlan, setSillageFloorPlan] = useState<'studio' | 'office' | 'car' | 'patio'>('studio');
  const [sillageSprays, setSillageSprays] = useState(3);
  const [sillageVentilation, setSillageVentilation] = useState<'none' | 'low' | 'high'>('none');
  const [isSimPlaying, setIsSimPlaying] = useState(false);

  // Specimen Shelf / Personal Cabinet state 
  const [cabinet, setCabinet] = useState<FragranceData[]>([]);
  const [comparedSpecimens, setComparedSpecimens] = useState<string[]>([]); // Array of custom composite IDs: `${brand} - ${name}`
  const [isComparingSpecimens, setIsComparingSpecimens] = useState(false);
  const [shelfNotification, setShelfNotification] = useState<string | null>(null);

  // AI-Assisted Olfactory Moodboard Generator state
  const [isGeneratingMoodboard, setIsGeneratingMoodboard] = useState(false);
  const [moodboardData, setMoodboardData] = useState<{
    aestheticTitle: string;
    vibeAssessment: string;
    colors: string[];
    tactileMetaphors: string[];
  } | null>(null);
  const [moodboardError, setMoodboardError] = useState<string | null>(null);

  // Source Origin Map search and active overlay state
  const [activeOriginIsolate, setActiveOriginIsolate] = useState<string | null>(null);
  const [searchOriginQuery, setSearchOriginQuery] = useState('');
  const [searchGlossaryQuery, setSearchGlossaryQuery] = useState('');
  const [searchNosesQuery, setSearchNosesQuery] = useState('');
  const [searchHousesQuery, setSearchHousesQuery] = useState('');
  const [searchNicheQuery, setSearchNicheQuery] = useState('');
  const [selectedNicheCategory, setSelectedNicheCategory] = useState<string | null>(null);
  const [searchSyntheticsQuery, setSearchSyntheticsQuery] = useState('');
  const [selectedSyntheticsCategory, setSelectedSyntheticsCategory] = useState<string | null>(null);
  const [searchMatrixQuery, setSearchMatrixQuery] = useState('');
  const [selectedMatrixCategory, setSelectedMatrixCategory] = useState<string | null>(null);
  const [searchTimelineQuery, setSearchTimelineQuery] = useState('');
  const [selectedTimelineCategory, setSelectedTimelineCategory] = useState<string | null>(null);

  // Instantly sync dynamic moodboard overlay on fragrance change to prevent any latency gaps
  useEffect(() => {
    if (selectedFragrance) {
      setMoodboardData(getPreCalculatedMoodboard(selectedFragrance));
      setMoodboardError(null);
    }
  }, [selectedFragrance]);

  // Request high-fidelity GenAI visual theme and vibe parsing from Gemini Core
  const handleGenerateMoodboardLive = async () => {
    setIsGeneratingMoodboard(true);
    setMoodboardError(null);
    try {
      const response = await fetch('/api/moodboard-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: selectedFragrance.brand,
          name: selectedFragrance.name,
          olfactoryFamily: selectedFragrance.olfactoryFamily,
          accords: selectedFragrance.accords
        })
      });

      if (!response.ok) {
        throw new Error('Failed connecting to molecular board builder.');
      }

      const result = await response.json();
      if (result && result.aestheticTitle) {
        setMoodboardData(result);
      } else {
        throw new Error('Aesthetic engine returned an empty model stream.');
      }
    } catch (e: any) {
      console.error("Moodboard synthesis API error:", e);
      setMoodboardError("AI Engine busy. Local high-parity molecular design values displayed successfully.");
      // Fallback is already established in state, keeping it safe
    } finally {
      setIsGeneratingMoodboard(false);
    }
  };

  // Load Cabinet Shelf specimens from Local Storage
  useEffect(() => {
    const saved = localStorage.getItem('scent_cabinet');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setCabinet(parsed);
          return;
        }
      } catch (e) {
        console.error("Failed loading user cabinet registry shelf:", e);
      }
    }
    // Baseline seed fallback
    setCabinet(PREDEFINED_FRAGRANCES);
    localStorage.setItem('scent_cabinet', JSON.stringify(PREDEFINED_FRAGRANCES));
  }, []);

  // Update persistent cabinet storage
  const updateCabinet = (newCabinet: FragranceData[]) => {
    setCabinet(newCabinet);
    localStorage.setItem('scent_cabinet', JSON.stringify(newCabinet));
  };

  // Show notification that auto-clears after delay
  const showNotification = (message: string, delay = 4000) => {
    setShelfNotification(message);
    setTimeout(() => setShelfNotification(null), delay);
  };

  // Add analyzed commercial or predefined dossier directly to personal Shelf
  const handleSaveCurrentToCabinet = () => {
    const exists = fragranceExistsInCabinet(selectedFragrance, cabinet);
    if (exists) {
      showNotification(`"${selectedFragrance.brand} ${selectedFragrance.name}" is already catalogued on your spec cabinet!`);
      return;
    }
    const newCabinet = [selectedFragrance, ...cabinet];
    updateCabinet(newCabinet);
    showNotification(`Specimen "${selectedFragrance.brand} ${selectedFragrance.name}" catalogued to Shelf.`);
  };

  // Delete specimen entries from Cabinet shelf
  const handleDeleteFromCabinet = (brand: string, name: string) => {
    if (cabinet.length <= 1) {
      showNotification("Dossier shelf preservation: Your cabinet requires at least 1 specimen.");
      return;
    }
    const filtered = cabinet.filter(f => !(f.brand.toLowerCase() === brand.toLowerCase() && f.name.toLowerCase() === name.toLowerCase()));
    updateCabinet(filtered);

    // Filter comparisons
    const compID = `${brand} - ${name}`;
    setComparedSpecimens(comparedSpecimens.filter(id => id !== compID));

    if (selectedFragrance.brand === brand && selectedFragrance.name === name) {
      setSelectedFragrance(filtered.length > 0 ? filtered[0] : cabinet[0]);
    }
    showNotification(`Removed "${brand} ${name}" from Cabinet Shelf.`);
  };

  // Toggle selection of specimens for comparison
  const handleToggleCompare = (brand: string, name: string) => {
    const compID = `${brand} - ${name}`;
    if (comparedSpecimens.includes(compID)) {
      setComparedSpecimens(comparedSpecimens.filter(id => id !== compID));
    } else {
      if (comparedSpecimens.length >= 2) {
        showNotification("Aromachemical Comparison Limit: Maximum 2 specimens selected. Please deselect one to add another.");
        return;
      }
      setComparedSpecimens([...comparedSpecimens, compID]);
    }
  };

  // Status updates for engaging laboratory loading sequencer
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingSteps = [
    "Priming GC-MS Spectrometer query channel...",
    "Injecting vaporized fragrance matrix specimen...",
    "Measuring aromachemical isolate weight ratios...",
    "Synthesizing volatility decay curve vectors...",
    "Predicting olfactory fatigue limits & sillage radius...",
    "Compiling empirical market parity metrics...",
    "Finalizing raw chemical blueprint audit sheet..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 1400);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Smoothly increment sillageSimHour if simulator is playing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimPlaying) {
      timer = setInterval(() => {
        setSillageSimHour((prev) => {
          if (prev >= 10) {
            return 0; // wrap around
          }
          return Number((prev + 0.1).toFixed(1));
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isSimPlaying]);

  // Trigger Browser Notifications for High Olfactory Fatigue Risk
  useEffect(() => {
    if (selectedFragrance && selectedFragrance.olfactoryFatigueRisk > 80) {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'default') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              try {
                new Notification(`RECEPTOR FATIGUE HAZARD: ${selectedFragrance.name}`, {
                  body: `This fragrance carries an extreme anosmia risk of ${selectedFragrance.olfactoryFatigueRisk}%. Click to view olfactory recovery guidelines.`,
                });
              } catch (e) {
                console.warn("Notification error:", e);
              }
            }
          });
        } else if (Notification.permission === 'granted') {
          try {
            new Notification(`RECEPTOR FATIGUE HAZARD: ${selectedFragrance.name}`, {
              body: `This fragrance carries an extreme anosmia risk of ${selectedFragrance.olfactoryFatigueRisk}%. Click to view olfactory recovery guidelines.`,
            });
          } catch (e) {
            console.warn("Notification error:", e);
          }
        }
      }
    }
  }, [selectedFragrance]);

  // Reset the fatigue banner dismissal status on specimen change
  useEffect(() => {
    setIsFatigueBannerDismissed(false);
  }, [selectedFragrance]);

  // Trigger Molecular Layering Compatibility Report Generation via Backend API
  const handleLayeringCompatibilityCheck = async () => {
    if (!layeringSelectA || !layeringSelectB) {
      setLayeringError("Both Fragrance A and Fragrance B must be selected.");
      return;
    }

    if (layeringSelectA === layeringSelectB) {
      setLayeringError("To evaluate layering compatibility, please select two distinct specimen formulas.");
      return;
    }

    setIsAnalyzingLayering(true);
    setLayeringError(null);
    setLayeringResult(null);

    const availableFragrances = [
      ...PREDEFINED_FRAGRANCES,
      ...cabinet.filter(c => !PREDEFINED_FRAGRANCES.some(p => p.name === c.name && p.brand === c.brand))
    ];

    const fragA = availableFragrances.find(f => `${f.brand} - ${f.name}` === layeringSelectA);
    const fragB = availableFragrances.find(f => `${f.brand} - ${f.name}` === layeringSelectB);

    if (!fragA || !fragB) {
      setLayeringError("Selected specimen formulas could not be loaded.");
      setIsAnalyzingLayering(false);
      return;
    }

    try {
      const response = await fetch('/api/layering-compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fragA, fragB })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error((errData as any).error || 'Chemistry server returned error evaluating formula interactions.');
      }

      const data = await response.json();
      setLayeringResult(data);

    } catch (err: any) {
      console.error("Layering Compatibility error:", err);
      setLayeringError(err?.message || "An unexpected error occurred during chemical evaluation.");
    } finally {
      setIsAnalyzingLayering(false);
    }
  };

  // Handle Dynamic Specimen Molecular Report Generation via Backend API (using real server-side Gemini call)
  const handleAnalyze = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) {
      setErrorMessage("specimen fragrance name required to execute analysis.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: searchBrand.trim(),
          name: searchName.trim(),
          batchCode: batchCodeInput.trim() || undefined
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error((errData as any).error || 'Server returned an error running specimen chemical matrix.');
      }

      const data = await response.json();
      setSelectedFragrance(data);
      // Immediately include in cabinet shelf automatically if analyzed!
      const existsInCabinet = fragranceExistsInCabinet(data, cabinet);
      if (!existsInCabinet) {
        updateCabinet([data, ...cabinet]);
      }

      // If user performed active batch code parsing inside search, highlight it
      if (batchCodeInput) {
        setBatchResult(data.parsedBatchCode);
        setBatchVerifyBrand(data.brand);
        setBatchVerifyCode(batchCodeInput);
      }
      
      // Reset inputs after run
      setSearchBrand('');
      setSearchName('');
      setBatchCodeInput('');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "A system-level connection fault occurred while hitting the molecular solver.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Dedicated direct batch code parsing tool
  const handleVerifyBatchCodeDirect = async (e: FormEvent) => {
    e.preventDefault();
    if (!batchVerifyCode.trim()) {
      setBatchError("Batch code is required.");
      return;
    }

    setIsVerifyingBatch(true);
    setBatchError(null);
    setBatchResult(null);

    try {
      const targetBrand = batchVerifyBrand.trim() || selectedFragrance.brand;
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: targetBrand,
          name: selectedFragrance.name,
          batchCode: batchVerifyCode.trim()
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error((errData as any).error || 'Batch code server parser fault.');
      }

      const data = await response.json();
      if (data.parsedBatchCode) {
        setBatchResult(data.parsedBatchCode);
      } else {
        throw new Error("Specimen could not map batch keys; please retry.");
      }
    } catch (err: any) {
      console.error(err);
      setBatchError(err.message || "Failed parsing the designated alphanumeric batch lineage check.");
    } finally {
      setIsVerifyingBatch(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#E0E2E6] font-sans antialiased selection:bg-[#3B82F6] selection:text-black pb-12 relative">
      <div id="main-app-layout">
      
      {/* Decorative Matrix Background Accent Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#3B82F6]/5 to-transparent pointer-events-none" />
      
      {/* Bento Grid Header */}
      <header className="border-b border-[#2D3139] bg-[#0A0B0E]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#15181F] border border-[#2D3139] rounded-sm">
              <Beaker className="w-6 h-6 text-[#3B82F6] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#6A7180] uppercase font-bold">FRAGRANCE ANALYSIS PLATFORM</span>
                <span className="h-2 w-2 rounded-full bg-[#3B82F6] animate-ping" />
              </div>
              <h1 className="font-display text-xl font-light tracking-tight text-[#E0E2E6] mt-0.5">
                DETERMINISTIC <span className="font-bold text-[#3B82F6]">IDENTITY</span> REGISTRY
              </h1>
            </div>
          </div>
          
          {/* Quick Stats Banner placeholder */}
          
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* Scent Shelf Notification Toast Alert */}
        <AnimatePresence>
          {shelfNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, x: "-50%" }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full bg-[#15181F] border-2 border-[#3B82F6] rounded-sm p-3.5 shadow-2xl flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-[#3B82F6] shrink-0" />
              <p className="text-xs font-mono text-white leading-normal">{shelfNotification}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Viewport System Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#2D3139] pb-4 mb-8">
          <button
            onClick={() => setActiveTab('dossier')}
            className={`flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm border cursor-pointer transition-all outline-none ${
              activeTab === 'dossier'
                ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                : 'bg-transparent border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/30 hover:text-white'
            }`}
          >
            <Beaker className="w-4 h-4" />
            Dossier Analyst
          </button>

          <button
            onClick={() => setActiveTab('references')}
            className={`flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm border cursor-pointer transition-all outline-none ${
              activeTab === 'references'
                ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                : 'bg-transparent border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/30 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Reference Library
          </button>

          <button
            onClick={() => setActiveTab('cabinet')}
            className={`flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm border cursor-pointer transition-all outline-none ${
              activeTab === 'cabinet'
                ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                : 'bg-transparent border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/30 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            Specimen Shelf ({cabinet.length})
          </button>

          <button
            onClick={() => setActiveTab('compounding')}
            className={`flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm border cursor-pointer transition-all outline-none ${
              activeTab === 'compounding'
                ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                : 'bg-transparent border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/30 hover:text-white'
            }`}
          >
            <Droplet className="w-4 h-4 text-[#10B981]" />
            Compounding Bench
          </button>

          <button
            onClick={() => setActiveTab('glossary')}
            className={`flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm border cursor-pointer transition-all outline-none ${
              activeTab === 'glossary'
                ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                : 'bg-transparent border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/30 hover:text-white'
            }`}
          >
            <Info className="w-4 h-4" />
            Layman Glossary
          </button>

          <button
            onClick={() => setActiveTab('noses')}
            className={`flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm border cursor-pointer transition-all outline-none ${
              activeTab === 'noses'
                ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                : 'bg-transparent border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/30 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Master Noses
          </button>

          <button
            onClick={() => setActiveTab('houses')}
            className={`flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm border cursor-pointer transition-all outline-none ${
              activeTab === 'houses'
                ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                : 'bg-transparent border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/30 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            Master Houses
          </button>

          <button
            onClick={() => setActiveTab('niche')}
            className={`flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm border cursor-pointer transition-all outline-none ${
              activeTab === 'niche'
                ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                : 'bg-transparent border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/30 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            Independent Niche
          </button>

          <button
            onClick={() => setActiveTab('synthetics')}
            className={`flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm border cursor-pointer transition-all outline-none ${
              activeTab === 'synthetics'
                ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                : 'bg-transparent border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/30 hover:text-white'
            }`}
          >
            <Atom className="w-4 h-4 text-[#A855F7]" />
            Synthetics Guide
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm border cursor-pointer transition-all outline-none ${
              activeTab === 'matrix'
                ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                : 'bg-transparent border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/30 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-[#10B981]" />
            Technical Matrix
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm border cursor-pointer transition-all outline-none ${
              activeTab === 'timeline'
                ? 'bg-[#3B82F6]/10 border-[#3B82F6] text-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                : 'bg-transparent border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/30 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#F59E0B]" />
            Genre Timeline
          </button>
        </div>

        {activeTab === 'dossier' && (
          <>
            {/* Olfactory Fatigue Alert Warning Banner */}
            {selectedFragrance && selectedFragrance.olfactoryFatigueRisk > 80 && !isFatigueBannerDismissed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 bg-gradient-to-r from-rose-950/40 to-rose-900/10 border-l-4 border-rose-500 rounded-r-sm p-5 relative overflow-hidden shadow-lg"
              >
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
                          {selectedFragrance.olfactoryFatigueRisk}% ANOSMIA RISK
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
                      The high density of complex linear synthetics inside <strong className="text-rose-300 font-medium">{selectedFragrance.brand} {selectedFragrance.name}</strong> is medically certified to rapidly saturate human olfactory receptors, inducing temporary sensory blindness (anosmia) to the scent itself.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 bg-black/40 border border-rose-950/50 p-4 rounded-sm">
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] text-rose-400 uppercase font-bold tracking-wider block">
                          [1] Nasal Neutralization Purge (Active Protocol)
                        </span>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Smell clean, unperfumed bare forearms or raw organic wool for 45 seconds. Avoid coffee beans as they introduce heavy volatile oils that compound receptor exhaust.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] text-rose-400 uppercase font-bold tracking-wider block">
                          [2] Optimum Dispenser Rotation Protocol
                        </span>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Initiate a strict 72-hour olfactory holiday from this formula. Re-prime receptors using ultra-airy citrus eau de colognes or light high-evaporation solo molecules.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {/* Added dynamic database shelf linkage check and Print Report option */}
            <div className="flex justify-end gap-3 mb-4 no-print">
              <button
                type="button"
                onClick={() => handlePrintSection('dossier')}
                className="flex items-center gap-1.5 px-4 py-2 bg-purple-950/20 hover:bg-purple-600 hover:text-white text-purple-400 text-xs font-mono font-bold tracking-wider uppercase border border-purple-500/25 rounded-sm cursor-pointer transition-all shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Analytical Report
              </button>

              <button
                onClick={handleSaveCurrentToCabinet}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#3B82F6]/10 hover:bg-[#3B82F6] hover:text-white text-[#3B82F6] text-xs font-mono font-bold tracking-wider uppercase border border-[#3B82F6]/25 rounded-sm cursor-pointer transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Catalogue Specimen to Shelf
              </button>
            </div>

            {/* Control Deck Bento Item */}
            <section className="bg-[#15181F] border border-[#2D3139] rounded-sm p-8 mb-8 max-w-4xl mx-auto shadow-xl" id="acquisition-control-deck">
              <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#E0E2E6] border-b border-[#2D3139] pb-4 mb-6 flex items-center gap-2" id="acquisition-header">
                <Activity className="w-4 h-4 text-[#3B82F6]" />
                Fragment Specimen Acquisition Menu & Dynamic Solver
              </h2>

              <p className="text-xs text-[#6A7180] mb-6 leading-relaxed max-w-2xl font-sans" id="acquisition-desc">
                Enter any commercial fragrance name, specialty flanker, or niche house below. Our server-side chemistry engine will search GC-MS mass spectrometry patterns to map natural-to-synthetic ratios, isolate evaporations, and sillage radii.
              </p>

              <form onSubmit={handleAnalyze} className="space-y-5" id="acquisition-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#6A7180] mb-1.5 font-bold">
                      Brand / Perfume House <span className="text-[#6A7180]">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={searchBrand}
                      onChange={(e) => setSearchBrand(e.target.value)}
                      placeholder="e.g. Creed, Tom Ford, Chanel, Dior"
                      disabled={isAnalyzing}
                      className="w-full bg-[#0A0B0E] border border-[#2D3139] focus:border-[#3B82F6] text-xs font-mono text-[#E0E2E6] rounded-sm px-4 py-2.5 outline-none transition-colors placeholder:text-[#6A7180]/30"
                      id="perfume-brand-input"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#6A7180] mb-1.5 font-bold">
                      Fragrance Name & Flanker <span className="text-[#F87171]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      placeholder="e.g. Lost Cherry, Bleeker Street, Sauvage"
                      disabled={isAnalyzing}
                      className="w-full bg-[#0A0B0E] border border-[#2D3139] focus:border-[#3B82F6] text-xs font-mono text-[#E0E2E6] rounded-sm px-4 py-2.5 outline-none transition-colors placeholder:text-[#6A7180]/30"
                      id="perfume-name-input"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#6A7180] font-bold">
                      Bottle Batch Code <span className="text-[#6A7180]">(Optional verification)</span>
                    </label>
                    <span className="text-[9px] text-[#3B82F6] font-mono italic">Parser Enabled</span>
                  </div>
                  <input
                    type="text"
                    value={batchCodeInput}
                    onChange={(e) => setBatchCodeInput(e.target.value)}
                    placeholder="e.g. A4221V01, 1H03, F000301 (parses chemistry date, lineage & longevity)"
                    disabled={isAnalyzing}
                    className="w-full bg-[#0A0B0E] border border-[#2D3139] focus:border-[#3B82F6] text-xs font-mono text-[#E0E2E6] rounded-sm px-4 py-2.5 outline-none transition-colors placeholder:text-[#6A7180]/30"
                    id="perfume-batch-input"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 font-mono text-xs text-white bg-[#3B82F6] cursor-pointer hover:bg-[#3B82F6]/90 px-8 py-3 rounded-sm font-bold shadow-md transition-all disabled:opacity-50 tracking-wider uppercase"
                    id="perfume-submit-btn"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        RUNNING GC-MS SPECIMEN ASSAY...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        INITIATE CHEMICAL BLUEPRINT MATRIX
                      </>
                    )}
                  </button>
                  <span className="text-[10px] font-mono text-[#6A7180] text-center sm:text-left leading-relaxed">
                    Estimating weight percentage calculations, volatility curves & receptor fatigue warnings.
                  </span>
                </div>
              </form>

              <div className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-4 mt-8 flex items-start gap-3">
                <Info className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#6A7180] leading-relaxed font-mono">
                  <strong className="text-[#E0E2E6]">Empirical Standards Note:</strong> Aromata is powered by synthetic aromachemical and natural isolation database patterns. To browse tested historical benchmarks, explore the <strong className="text-[#3B82F6] underline cursor-pointer" onClick={() => setActiveTab('references')}>Reference Library</strong> tab anytime.
                </p>
              </div>

              {errorMessage && (
                <div className="mt-4 p-3 bg-[#1E2229] border border-[#F87171] rounded-sm text-xs font-mono text-[#F87171] leading-normal flex items-start gap-2 animate-pulse">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#F87171]" />
                  <span>{errorMessage}</span>
                </div>
              )}

            </section>

        {/* Dynamic Laboratory Science Progress Overlay Screen */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#0A0B0E]/95 flex flex-col items-center justify-center p-6 backdrop-blur-sm"
            >
              <div className="relative max-w-lg w-full bg-[#15181F] border border-[#2D3139] rounded-sm p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#3B82F6] animate-pulse" />
                
                {/* Modern Radar Scanner Scan Graphic */}
                <div className="relative w-28 h-28 mb-6 bg-[#0A0B0E] border border-[#2D3139] rounded-full flex items-center justify-center">
                  <div className="absolute inset-2 border border-[#3B82F6]/20 rounded-full animate-pulse" />
                  <div className="absolute inset-6 border border-[#6A7180]/15 rounded-full" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute inset-0 border-t-2 border-[#3B82F6]/60 rounded-full"
                  />
                  <Beaker className="w-10 h-10 text-[#3B82F6] animate-bounce" />
                </div>

                <h3 className="text-lg font-display text-white font-bold tracking-tight mb-2">
                  SPECTROPHOTOMETRIC CHANNELS ENGAGED
                </h3>
                <p className="text-xs text-[#3B82F6] font-mono mb-4 font-bold uppercase tracking-widest">
                  Model Context Analysis Layer Running...
                </p>

                {/* Simulated Terminal Readout */}
                <div className="w-full bg-[#0A0B0E] rounded-sm p-4 mb-6 font-mono text-left border border-[#2D3139] h-28 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-[#6A7180] uppercase">Current Phase</div>
                    <div className="text-[#10B981] font-semibold text-xs mt-1 animate-pulse">
                      &gt;&gt; {loadingSteps[loadingStep]}
                    </div>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {loadingSteps.map((_, index) => (
                      <div 
                        key={index} 
                        className={`h-1 flex-1 rounded-sm transition-all duration-300 ${
                          index <= loadingStep ? 'bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-[#2D3139]'
                        }`} 
                      />
                    ))}
                  </div>
                  <div className="text-[9px] text-[#6A7180] text-right uppercase">
                    DATABASE_QUERY: STEADY
                  </div>
                </div>

                <p className="text-xs text-[#6A7180] max-w-sm">
                  We are accessing structural research databases via our server pipeline to retrieve natural ratio forecasts and formulation heritage.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Searchable 'Source Origin Map' Dialog Overlay */}
        <AnimatePresence>
          {activeOriginIsolate !== null && (() => {
            const originData = getDynamicSourceOriginData(activeOriginIsolate);
            const specimenIsolates = selectedFragrance?.aromaChemicalMatrix || [];
            
            // Available global catalog isolates for exploration
            const globalCommonIsolates = Object.keys(KNOWN_ISOLATES_DATABASE).map(k => KNOWN_ISOLATES_DATABASE[k].chemicalName);

            // Simple search filter matching query
            const filteredCatalog = [...new Set([
              ...specimenIsolates.map(i => i.name),
              ...globalCommonIsolates
            ])].filter(name => 
              name.toLowerCase().includes(searchOriginQuery.toLowerCase())
            );

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-[#07090D]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
                onClick={() => setActiveOriginIsolate(null)}
              >
                <motion.div
                  initial={{ scale: 0.96, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.96, y: 15 }}
                  className="bg-[#12151D] border border-[#2D3139] rounded-sm w-full max-w-7xl h-[92vh] sm:h-[88vh] shadow-2xl overflow-hidden flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Top Header bar */}
                  <div className="bg-[#181C26] border-b border-[#2D3139] p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-sm bg-[#10B981]/15 flex items-center justify-center border border-[#10B981]/20">
                        <Globe className="w-4 h-4 text-[#10B981]" />
                      </div>
                      <div>
                        <h2 className="text-xs font-bold font-display text-white tracking-widest uppercase flex items-center gap-2">
                          Source Origin & Precursor Locator
                          <span className="text-[9px] font-mono text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">
                            GC-MS STREAM MAP
                          </span>
                        </h2>
                        <p className="text-[10px] text-[#6A7180] font-sans">
                          Aromata global botanical harvesting grids and advanced synthetic synthesis coordinates
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveOriginIsolate(null)}
                      className="px-3 py-1 bg-[#2D3139]/50 hover:bg-rose-500 hover:text-white border border-[#2D3139] hover:border-rose-400 font-mono text-[10px] text-[#6A7180] rounded-sm uppercase tracking-wider transition-all duration-150 cursor-pointer"
                    >
                      Close [Esc]
                    </button>
                  </div>

                  {/* Main contents scrollable segment */}
                  <div className="flex-1 overflow-hidden grid grid-cols-1 xl:grid-cols-4">
                    
                    {/* COL 1: ADVANCED INTERACTIVE DIRECTORY & SEARCH UTILITY */}
                    <div className="border-b xl:border-b-0 xl:border-r border-[#2D3139] bg-[#0E1015] p-5 flex flex-col h-full overflow-hidden">
                      <div className="space-y-4 flex flex-col h-full">
                        
                        {/* Interactive Search Field */}
                        <div>
                          <label className="block text-[9.5px] font-mono uppercase text-[#6A7180] mb-1.5 font-bold tracking-wider">
                            Search Aromachemical / Precursor
                          </label>
                          <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#6A7180]" />
                            <input
                              type="text"
                              value={searchOriginQuery}
                              onChange={(e) => setSearchOriginQuery(e.target.value)}
                              placeholder="Type Ambroxan, Vetiverol, etc."
                              className="w-full bg-[#07080B] border border-[#2D3139] text-xs text-white pl-9 pr-3 py-2 rounded-sm focus:outline-none focus:border-[#3B82F6] font-mono placeholder:text-[#2D3139]"
                            />
                            {searchOriginQuery && (
                              <button 
                                onClick={() => setSearchOriginQuery('')}
                                className="absolute right-2.5 top-2.5 text-[9px] font-mono text-slate-400 hover:text-white"
                              >
                                CLEAR
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Scrolling list selector */}
                        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                          
                          {/* Checked filter match list */}
                          <div>
                            <span className="block text-[8.5px] font-mono text-[#6A7180] uppercase tracking-widest border-b border-[#2D3139]/40 pb-1 mb-2 font-bold">
                              {searchOriginQuery ? 'SEARCH RESULTS' : 'AVAILABLE ISOLATES'}
                            </span>
                            
                            <div className="space-y-1">
                              {filteredCatalog.length > 0 ? (
                                filteredCatalog.map((name) => {
                                  const isActive = activeOriginIsolate.toLowerCase() === name.toLowerCase();
                                  const isDirectSpecimen = specimenIsolates.some(i => i.name.toLowerCase() === name.toLowerCase());

                                  return (
                                    <button
                                      key={name}
                                      onClick={() => {
                                        setActiveOriginIsolate(name);
                                      }}
                                      className={`w-full text-left px-2.5 py-1.5 rounded-sm transition-all text-xs font-mono flex items-center justify-between ${
                                        isActive 
                                          ? 'bg-[#3B82F6]/15 hover:bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30 font-bold' 
                                          : 'hover:bg-[#15181F] text-slate-300 border border-transparent'
                                      }`}
                                    >
                                      <span className="truncate flex items-center gap-1.5">
                                        <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-[#3B82F6]' : 'bg-[#6A7180]/40'}`} />
                                        {name}
                                      </span>
                                      
                                      {isDirectSpecimen && (
                                        <span className="text-[7.5px] uppercase bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 px-1 py-0.1 ml-1 scale-90 rounded">
                                          JUICE
                                        </span>
                                      )}
                                    </button>
                                  );
                                })
                              ) : (
                                <p className="text-[10px] text-amber-500 font-mono italic">
                                  No matches. Generative models will compile fallback coordinates below.
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Specimen checklist context helper banner */}
                          {!searchOriginQuery && (
                            <div className="bg-[#12151D] border border-dashed border-[#2D3139] p-3 rounded-sm">
                              <span className="font-mono text-[8.5px] text-blue-400 font-bold block mb-0.5">DIRECT SPECIMEN MATRIX</span>
                              <p className="text-[10px] text-[#6A7180] leading-snug">
                                {specimenIsolates.length} aromatic isolates are currently selected. Click any to analyze precursor harvests.
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {specimenIsolates.map((item, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      setActiveOriginIsolate(item.name);
                                      setSearchOriginQuery(item.name);
                                    }}
                                    className="text-[8px] font-mono bg-[#07080B] hover:bg-[#1E2530] text-emerald-400 border border-[#2D3139] px-2 py-0.5 rounded-sm transition-colors"
                                  >
                                    {item.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>

                        {/* Coordinate tracker values */}
                        <div className="bg-[#07080B] border border-[#2D3139] p-3 rounded-sm font-mono text-[9px] text-[#6A7180] space-y-1 mt-auto">
                          <div className="flex justify-between">
                            <span>SATELLITE SYNC</span>
                            <span className="text-emerald-400 font-bold">ACTIVE</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ACTIVE ISO</span>
                            <span className="text-[#3B82F6] truncate max-w-[120px]">{activeOriginIsolate}</span>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* COL 2-3: THE ACTUAL WORLD MAP VISUALIZATION AREA */}
                    <div className="col-span-1 xl:col-span-2 bg-[#080B0F] p-5 flex flex-col justify-between overflow-x-hidden relative select-none">
                      
                      {/* Grid header info and interactive states */}
                      <div className="flex justify-between items-center mb-4 z-10">
                        <div className="font-mono space-y-0.5 font-semibold text-left">
                          <span className="text-[#6A7180] text-[9px] uppercase tracking-wider block">GEOGRAPHIC PROJECTION VECTOR</span>
                          <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            {originData.chemicalName} Synthesis Feedstock Coordinates
                          </span>
                        </div>
                        <div className="text-[9px] font-mono text-[#6A7180] text-right">
                          LAT: LONG MERCATOR // DOT MATRIX GRID
                        </div>
                      </div>

                      {/* Interactive Map Board container */}
                      <div className="flex-1 relative border border-[#2D3139]/40 bg-[#0B0D12] overflow-hidden rounded-sm flex items-center justify-center">
                        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ 
                          backgroundImage: 'radial-gradient(circle, #3B82F6 1px, transparent 1px)', 
                          backgroundSize: '24px 24px' 
                        }} />

                        {/* Interactive SVG World Matrix */}
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-[#1e293b]">
                          {/* Coordinate latitude divisions helper labels */}
                          <line x1="0" y1="28" x2="100" y2="28" stroke="#1A202C" strokeWidth="0.3" strokeDasharray="2 4" />
                          <line x1="0" y1="50" x2="100" y2="50" stroke="#3B82F6" strokeWidth="0.4" strokeOpacity="0.25" />
                          <line x1="0" y1="72" x2="100" y2="72" stroke="#1A202C" strokeWidth="0.3" strokeDasharray="2 4" />
                          <line x1="50" y1="0" x2="50" y2="100" stroke="#1A202C" strokeWidth="0.3" strokeDasharray="2 4" />

                          {/* Text tags for grid lines */}
                          <text x="2" y="27" className="font-mono text-[2.2px] fill-[#6A7180] tracking-widest uppercase">Tropic of Cancer [23.5° N]</text>
                          <text x="2" y="49" className="font-mono text-[2.2px] fill-[#3B82F6]/50 tracking-widest uppercase font-bold">Equator [0.0° Parallel]</text>
                          <text x="2" y="71" className="font-mono text-[2.2px] fill-[#6A7180] tracking-widest uppercase">Tropic of Capricorn [23.5° S]</text>
                          <text x="51" y="98" className="font-mono text-[2.2px] fill-[#6A7180] tracking-widest uppercase">Prime Meridian</text>

                          {/* STYLIZED CONTINENTS FOR GEOGRAPHIC COMPOSITION */}
                          {/* North America */}
                          <path 
                            d="M 5,20 L 25,20 L 32,32 L 28,45 L 20,45 L 14,35 Z" 
                            fill="#111520" 
                            stroke="#1E2533" 
                            strokeWidth="0.4" 
                          />
                          <text x="18" y="28" className="font-mono text-[2px] fill-[#2D3648] tracking-widest uppercase pointer-events-none">NORTH AMER CRITERIA</text>

                          {/* South America */}
                          <path 
                            d="M 24,46 L 29,48 L 33,63 L 38,72 L 34,84 L 28,68 L 24,56 Z" 
                            fill="#111520" 
                            stroke="#1E2533" 
                            strokeWidth="0.4" 
                          />
                          <text x="26" y="62" className="font-mono text-[2px] fill-[#2D3648] tracking-widest uppercase pointer-events-none text-center">NEOTROPICAL REGION</text>

                          {/* Europe */}
                          <path 
                            d="M 45,18 L 57,18 L 56,33 L 47,33 Z" 
                            fill="#111520" 
                            stroke="#1E2533" 
                            strokeWidth="0.4" 
                          />
                          <text x="47" y="24" className="font-mono text-[2px] fill-[#2D3648] tracking-widest uppercase pointer-events-none">EURO FINE SCI</text>

                          {/* Africa */}
                          <path 
                            d="M 45,34 L 56,34 L 62,50 L 61,62 L 57,75 L 53,75 L 49,52 L 44,45 Z" 
                            fill="#111520" 
                            stroke="#1E2533" 
                            strokeWidth="0.4" 
                          />
                          <text x="50" y="55" className="font-mono text-[1.8px] fill-[#2D3648] tracking-widest uppercase pointer-events-none">BOTANICAL RIFTS</text>

                          {/* Asia */}
                          <path 
                            d="M 56,18 L 85,18 L 88,42 L 82,53 L 73,53 L 68,48 L 56,33 Z" 
                            fill="#111520" 
                            stroke="#1E2533" 
                            strokeWidth="0.4" 
                          />
                          <text x="68" y="30" className="font-mono text-[2px] fill-[#2D3648] tracking-widest uppercase pointer-events-none">ASIATIC COMPLEX</text>

                          {/* Australia */}
                          <path 
                            d="M 78,68 L 88,68 L 90,78 L 80,78 Z" 
                            fill="#111520" 
                            stroke="#1E2533" 
                            strokeWidth="0.4" 
                          />
                          <text x="79" y="74" className="font-mono text-[2px] fill-[#2D3648] tracking-widest uppercase pointer-events-none">AUST FORESTRY</text>

                          {/* Trade convergence vector curves linking suppliers to Central Lab in Grasse (49, 33) */}
                          {originData.regions.map((region, idx) => {
                            const isNearGrasse = Math.abs(region.coordinates.x - 49) < 4 && Math.abs(region.coordinates.y - 33) < 4;
                            if (isNearGrasse) return null;

                            // Draw a beautiful quadratic bezier curve from region to Europe (49, 33)
                            const rx = region.coordinates.x;
                            const ry = region.coordinates.y;
                            const cx = (rx + 49) / 2;
                            const cy = Math.min(ry, 33) - 12; // bend upward
                            
                            return (
                              <g key={`curve-${idx}`}>
                                <path
                                  d={`M ${rx} ${ry} Q ${cx} ${cy} 49 33`}
                                  fill="none"
                                  stroke={region.type === 'botanic-harvest' ? '#10B981' : '#3B82F6'}
                                  strokeWidth="0.4"
                                  strokeOpacity="0.55"
                                  strokeDasharray="1.5 1.5"
                                  className="animate-pulse"
                                />
                                {/* Growing particle path emitter flowing along coordinates */}
                                <circle r="0.45" fill="#FFF" className="animate-ping">
                                  <animateMotion 
                                    path={`M ${rx} ${ry} Q ${cx} ${cy} 49 33`} 
                                    dur={`${2.5 + idx}s`} 
                                    repeatCount="indefinite" 
                                  />
                                </circle>
                              </g>
                            );
                          })}

                          {/* Receiver symbol located at Grasse Center (49, 33) */}
                          <g transform="translate(49, 33)">
                            <circle r="1.8" fill="#3B82F6" fillOpacity="0.15" />
                            <circle r="0.8" fill="#3B82F6" className="animate-pulse" />
                            <circle r="0.3" fill="#FFF" />
                          </g>

                          {/* RATING COORDINATE PINPOINTS */}
                          {originData.regions.map((region, idx) => {
                            const rx = region.coordinates.x;
                            const ry = region.coordinates.y;
                            const isBotanic = region.type === 'botanic-harvest';

                            return (
                              <g 
                                key={`pin-${idx}`} 
                                transform={`translate(${rx}, ${ry})`} 
                                className="cursor-pointer group"
                              >
                                {/* Ping ripple ring */}
                                <circle 
                                  r="2.8" 
                                  fill={isBotanic ? '#10B981' : '#3B82F6'} 
                                  fillOpacity="0.1" 
                                  className="animate-ping" 
                                />
                                <circle 
                                  r="1.2" 
                                  fill={isBotanic ? '#10B981' : '#3B82F6'} 
                                  fillOpacity="0.35" 
                                />
                                <circle 
                                  r="0.5" 
                                  fill={isBotanic ? '#34D399' : '#60A5FA'} 
                                />

                                {/* Interactive small SVG Tooltip shown directly inside vector overlay on pointer hover */}
                                <title>
                                  {region.name} ({region.country})\nType: {isBotanic ? 'Natural Crop' : 'Syntheric Lab'}\nLAT/LT: {region.coordinates.lat}° / {region.coordinates.lng}°
                                </title>
                              </g>
                            );
                          })}

                        </svg>

                        {/* Interactive floating indicator panel in bottom-left */}
                        <div className="absolute bottom-4 left-4 right-4 bg-[#12151D]/90 border border-[#2D3139] p-3 rounded-sm font-mono text-[9px] flex flex-col md:flex-row gap-4 items-center justify-between">
                          <div className="flex flex-wrap items-center gap-4">
                            <span className="flex items-center gap-1.5 font-bold">
                              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                              Botanical Crop Harvest Site
                            </span>
                            <span className="flex items-center gap-1.5 font-bold">
                              <span className="h-2 w-2 rounded-full bg-[#3B82F6]" />
                              Premium Synthesis Lab Hub
                            </span>
                            <span className="flex items-center gap-1.5 font-bold">
                              <span className="h-2 w-2 rounded-full bg-white border border-[#3B82F6]" />
                              Grasse Formulation Receiver
                            </span>
                          </div>
                          <span className="text-[#6A7180] hidden md:inline">
                            Hold cursor over pins to view raw GPS matrix coordinates
                          </span>
                        </div>

                      </div>

                      {/* Geological disclaimer */}
                      <div className="text-[10px] font-mono text-[#6A7180] mt-3 flex justify-between">
                        <span>EST. RADIUS MERCATOR PROJECTION</span>
                      </div>

                    </div>

                    {/* COL 4: HIGH-FIDELITY TECHNICAL SPECTRAL METADATA SIDEBAR */}
                    <div className="bg-[#151922] p-6 h-full overflow-y-auto border-t xl:border-t-0 border-[#2D3139] flex flex-col gap-5 justify-between">
                      <div className="space-y-5">
                        
                        {/* Title block */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono text-[9px] text-blue-400 uppercase font-black tracking-widest">
                              SPECIMEN LAB CARD
                            </span>
                            <span className="text-[9.5px] font-mono text-[#10B981] font-bold">
                              {originData.chemicalFormula}
                            </span>
                          </div>

                          <h3 className="font-display text-lg font-black text-white hover:text-blue-300 transition-colors uppercase text-left">
                            {originData.chemicalName}
                          </h3>

                          <div className="mt-1.5 flex gap-1.5 justify-start">
                            <span className="font-mono text-[8.5px] uppercase tracking-wider bg-[#1E2530] text-blue-300 border border-blue-900/30 px-2 py-0.5 rounded-sm">
                              {originData.originClassification}
                            </span>
                          </div>
                        </div>

                        {/* Technical Process text */}
                        <div className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm space-y-3 font-sans text-xs">
                          <div className="text-left">
                            <span className="font-mono text-[9px] text-[#6A7180] uppercase block font-bold leading-normal mb-1">
                              BOTANICAL PRECURSOR / FEEDSTOCK
                            </span>
                            <p className="text-[#E0E2E6] font-medium text-[11px]">
                              {originData.precursorClass}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-[#2D3139]/50 text-left">
                            <span className="font-mono text-[9px] text-[#6A7180] uppercase block font-bold leading-normal mb-1">
                              SYNTHESIS & EXTRACTION PROTOCOL
                            </span>
                            <p className="text-slate-300 text-[10.5px] leading-relaxed text-justify">
                              {originData.technicalProcess}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-[#2D3139]/50 flex justify-between items-center text-[10px] font-mono">
                            <span className="text-[#6A7180] uppercase font-bold">BIOMASS YIELD DENSITY:</span>
                            <span className="text-emerald-400 font-extrabold">{originData.yieldDensity}</span>
                          </div>
                        </div>

                        {/* Sourcing Region locations specs checklist */}
                        <div>
                          <span className="font-mono text-[9.5px] text-[#6A7180] uppercase block mb-2 font-bold tracking-wider text-left">
                            ACTIVE GLOBAL SUPPLIERS ({originData.regions.length})
                          </span>

                          <div className="space-y-3">
                            {originData.regions.map((region, keyIdx) => (
                              <div key={keyIdx} className="bg-[#0A0B0E] border border-[#2D3139] p-3 rounded-sm space-y-2">
                                <div className="flex justify-between items-start">
                                  <div className="text-left">
                                    <h4 className="text-[11px] font-bold text-white leading-tight">
                                      {region.name}
                                    </h4>
                                    <span className="text-[9px] font-mono text-[#6A7180] uppercase">
                                      {region.country}
                                    </span>
                                  </div>

                                  <span className={`text-[8px] font-mono border px-1.5 py-0.2 uppercase rounded font-bold ${
                                    region.type === 'botanic-harvest' 
                                      ? 'bg-emerald-400/5 text-emerald-400 border-emerald-500/10' 
                                      : 'bg-blue-400/5 text-blue-400 border-blue-500/10'
                                  }`}>
                                    {region.type === 'botanic-harvest' ? 'HARVEST' : 'SYNTHESIS'}
                                  </span>
                                </div>

                                <p className="text-[10px] text-slate-400 leading-snug text-left">
                                  {region.description}
                                </p>

                                <div className="pt-1.5 border-t border-[#2D3139]/30 flex justify-between items-center text-[8.5px] font-mono text-[#6A7180]">
                                  <span>COORDINATES:</span>
                                  <span className="text-[#10B981] font-bold flex gap-1 items-center">
                                    {region.coordinates.lat.toFixed(2)}° N / {region.coordinates.lng.toFixed(2)}° E
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Footer tracking signature */}
                      <div className="text-[9px] font-mono text-[#6A7180] border-t border-[#2D3139] pt-3 mt-4 text-left">
                        DATA VALIDATION FOR SPECIMEN MATRIX REFERENCE CORE // GEN-VIBE-0.1
                      </div>

                    </div>

                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* MAIN RESULTS DOSSIER DISPLAY GRID */}
        {selectedFragrance && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* ROW 1: PRIMARY HEAD BLOCK, LINEAGE & ACTIVE BATCH CODE PARSER PARSING BLOCK */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* PRIMARY DETERMINISTIC HOUSE & IDENTITY CORE */}
              <div className="lg:col-span-8 bg-[#15181F] border border-[#2D3139] rounded-sm p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                  <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="white"><circle cx="50" cy="50" r="40"/><path d="M50 10 L50 90 M10 50 L90 50"/></svg>
                </div>
                
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-[#3B82F6] text-white text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase inline-block">
                      CORE DATA
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#6A7180] uppercase">
                      {selectedFragrance.concentration}
                    </span>
                  </div>

                  <h2 className="font-display text-4xl font-light italic leading-none text-white tracking-tight mt-4">
                    {selectedFragrance.name}
                  </h2>
                  <p className="font-mono text-xs tracking-widest text-[#6A7180] font-semibold uppercase mt-1">
                    {selectedFragrance.brand}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-b border-[#2D3139] py-4 my-4 font-mono text-[11px] text-[#6A7180]">
                    <div>
                      <span className="text-[#6A7180] uppercase text-[10px] block">The Nose</span>
                      <span className="text-[#E0E2E6] font-medium text-sm flex items-center gap-1.5 mt-1">
                        <Award className="w-4 h-4 text-[#3B82F6]" />
                        {selectedFragrance.nose}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6A7180] uppercase text-[10px] block">Classification</span>
                      <span className="text-[#E0E2E6] font-medium text-sm flex items-center gap-1.5 mt-1">
                        <Calendar className="w-4 h-4 text-[#3B82F6]" />
                        {selectedFragrance.releaseYear}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6A7180] uppercase text-[10px] block">Olfactory Family</span>
                      <span className="text-[#10B981] font-semibold text-sm flex items-center gap-1.5 mt-1">
                        <Compass className="w-4 h-4" />
                        {selectedFragrance.olfactoryFamily}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-mono text-[10px] uppercase text-[#3B82F6] font-bold tracking-wider mb-1.5 flex items-center gap-1">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    CHRONOLOGICAL BATCH LINEAGE HISTORY & FORMULA FLUIDITY
                  </h4>
                  <p className="text-xs text-[#6A7180] leading-relaxed bg-[#0A0B0E] p-3 rounded-sm border border-[#2D3139] font-sans">
                    {selectedFragrance.batchLineage}
                  </p>
                </div>
              </div>

              {/* BATCH CODE VERIFICATION PARSER & DECODER */}
              <div className="lg:col-span-4 bg-[#15181F] border border-[#2D3139] p-5 rounded-sm flex flex-col justify-between relative">
                
                <div>
                  <div className="flex items-center justify-between border-b border-[#2D3139] pb-2 mb-4">
                    <span className="font-mono text-[10px] uppercase text-[#3B82F6] font-bold tracking-widest flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
                      Batch Code Parser
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  </div>

                  <p className="text-[11px] text-[#6A7180] mb-4 leading-normal">
                    Assess structural fresh stability, manufacturing date matrices, and molecular degradation risk by batch:
                  </p>

                  <form onSubmit={handleVerifyBatchCodeDirect} className="space-y-3 mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={batchVerifyCode}
                        onChange={(e) => setBatchVerifyCode(e.target.value)}
                        placeholder="Enter code (e.g. 1H03)"
                        disabled={isVerifyingBatch}
                        className="flex-1 bg-[#0A0B0E] border border-[#2D3139] focus:border-[#3B82F6] text-xs font-mono text-white rounded-sm px-2.5 py-1.5 outline-none uppercase placeholder:text-[#6A7180]/30"
                      />
                      <button
                        type="submit"
                        disabled={isVerifyingBatch}
                        className="bg-[#2D3139] text-[#E0E2E6] font-mono text-xs px-3 py-1.5 rounded-sm cursor-pointer hover:bg-[#3B82F6] hover:text-white font-bold transition-all shrink-0 flex items-center gap-1 disabled:opacity-50"
                      >
                        {isVerifyingBatch ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          "DECODE"
                        )}
                      </button>
                    </div>
                  </form>

                  {batchError && (
                    <div className="p-2.5 bg-[#1E2229] border border-[#F87171] rounded-sm text-[10px] font-mono text-[#F87171] mb-4 leading-normal">
                      {batchError}
                    </div>
                  )}

                  {/* ACTIVE BATCH DECODING RESULT BOX */}
                  {batchResult ? (
                    <div className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-3.5 font-mono text-[11px] space-y-2">
                      <div className="flex justify-between items-center bg-[#15181F] px-2.5 py-1 rounded-sm border border-[#2D3139]">
                        <span className="text-[#6A7180] font-bold uppercase text-[9px]">Specimen Code</span>
                        <span className="font-bold text-white tracking-widest uppercase">{batchResult.code}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] py-1 border-b border-[#2D3139]">
                        <div>
                          <span className="text-[#6A7180] block text-[9px] uppercase">Manufactured</span>
                          <span className="text-[#3B82F6] font-medium block mt-0.5">{batchResult.manufacturingDate || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-[#6A7180] block text-[9px] uppercase">Factory Origin</span>
                          <span className="text-[#E0E2E6] font-medium block truncate mt-0.5">{batchResult.factoryOrigin || "Unverified Origin"}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] py-1 border-b border-[#2D3139]">
                        <div>
                          <span className="text-[#6A7180] block text-[9px] uppercase">Stability Index</span>
                          <span className="text-[#F59E0B] block mt-0.5">{batchResult.activeIngredientsStability || "Active stable"}</span>
                        </div>
                        <div>
                          <span className="text-[#6A7180] block text-[9px] uppercase">Freshness Status</span>
                          <span className={`font-semibold inline-block rounded-sm px-1.5 py-0.5 text-[9px] mt-0.5 ${
                            batchResult.shelfLifeStatus === 'Fresh' ? 'bg-[#10B981]/15 text-[#10B981]' :
                            batchResult.shelfLifeStatus === 'Mature' ? 'bg-[#F59E0B]/15 text-[#F59E0B]' :
                            'bg-[#F87171]/15 text-[#F87171]'
                          }`}>
                            {batchResult.shelfLifeStatus || "Unknown"}
                          </span>
                        </div>
                      </div>

                      <p className="text-[10px] text-[#6A7180] leading-normal pt-1 text-justify font-sans italic">
                        {batchResult.explanation}
                      </p>
                    </div>
                  ) : (
                    <div className="border border-dashed border-[#2D3139] rounded-sm p-10 select-none text-center text-[#6A7180] font-mono text-[10px]">
                      <Clock className="w-5 h-5 mx-auto mb-2 text-[#2D3139] animate-pulse" />
                      Pending alphanumeric verification key lookup.
                    </div>
                  )}

                </div>

                <div className="text-[9px] font-mono text-[#6A7180] text-right uppercase border-t border-[#2D3139] mt-4 pt-2">
                  Verify shelf-life calculations
                </div>
              </div>

            </div>

            {/* CHRONOLOGICAL HISTORICAL TIMELINE & FLANKER LINEAGE */}
            {(() => {
              const timelineEvents = selectedFragrance.historicalTimeline || [
                { year: String(selectedFragrance.releaseYear), title: `${selectedFragrance.name} Launch`, description: `First released in ${selectedFragrance.releaseYear} under the creative nose of ${selectedFragrance.nose}, establishing the initial ${selectedFragrance.olfactoryFamily} composition blueprint.`, classification: "Origin" },
                { year: String(selectedFragrance.releaseYear + 2), title: "Global Market Ascent", description: `Reaches peak worldwide distribution and acclaim, praised for its unique blend containing raw percentages of aromachemicals.`, classification: "Milestone" },
                { year: String(selectedFragrance.releaseYear + 5), title: "IFRA Safety Standardization", description: `The formulation adapts gracefully to meet international cosmetic safety standards (IFRA), revising botanical load counts slightly while maintaining active projection sillage.`, classification: "Reformulation" }
              ];

              return (
                <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6 relative overflow-hidden" id="historical-heritage-timeline">
                  <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
                    <Calendar className="w-36 h-36 text-white/5" />
                  </div>

                  <div className="border-b border-[#2D3139] pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#F59E0B]" />
                        Historical Heritage & Flanker Lineage
                      </h3>
                      <p className="text-[11px] text-[#6A7180] mt-1 font-sans">
                        Browse key chemical milestones, prestigious design awards, reformulations, and notable flankers inside the <span className="text-white">{selectedFragrance.brand}</span> universe.
                      </p>
                    </div>

                    {/* Filtering Buttons */}
                    <div className="flex flex-wrap gap-1.5 font-mono text-[9px]">
                      {['all', 'Origin', 'Flanker Release', 'Reformulation', 'Milestone', 'Award', 'House Event', 'Gossip'].map((category) => {
                        const count = category === 'all' 
                          ? timelineEvents.length 
                          : timelineEvents.filter(e => e.classification === category).length;
                        if (category !== 'all' && count === 0) return null; // hide empty categories to stay neat

                        return (
                          <button
                            key={category}
                            onClick={() => setTimelineFilter(category as any)}
                            className={`px-2.5 py-1 rounded transition-all uppercase border cursor-pointer font-bold ${
                              timelineFilter === category
                                ? category === 'Gossip'
                                  ? 'bg-[#EF4444]/15 border-[#EF4444] text-[#F87171]'
                                  : 'bg-[#F59E0B]/15 border-[#F59E0B] text-[#F59E0B]'
                                : 'bg-[#0A0B0E] border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/30 hover:text-[#E0E2E6]'
                            }`}
                          >
                            {category === 'all' ? 'All Milestones' : category} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Timeline List/Vertical Grid */}
                  <div className="relative border-l border-[#2D3139]/50 ml-4 pl-6 space-y-4">
                    {(() => {
                      const filteredEvents = timelineFilter === 'all' 
                        ? timelineEvents 
                        : timelineEvents.filter(e => e.classification === timelineFilter);

                      // Sort chronological by year
                      const sortedEvents = [...filteredEvents].sort((a, b) => Number(a.year) - Number(b.year));

                      if (sortedEvents.length === 0) {
                        return (
                          <p className="text-xs text-[#6A7180] font-mono italic">
                            No milestones found for this filter criteria in the specimen records.
                          </p>
                        );
                      }

                      return sortedEvents.map((event, idx) => {
                        // Tag Styles and Color based on Classification
                        let colorClass = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                        let dotClass = 'bg-blue-500 ring-blue-500/20';
                        let isGossip = event.classification === 'Gossip' || event.classification.toLowerCase() === 'gossip' || (event.description?.startsWith('GOSSIP:') ?? false);

                        if (event.classification === 'Origin') {
                          colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                          dotClass = 'bg-emerald-500 ring-emerald-500/20';
                        } else if (event.classification === 'Reformulation') {
                          colorClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                          dotClass = 'bg-amber-500 ring-amber-500/20';
                        } else if (event.classification === 'Flanker Release') {
                          colorClass = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
                          dotClass = 'bg-purple-500' ;
                        } else if (event.classification === 'Award') {
                          colorClass = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
                          dotClass = 'bg-yellow-500';
                        } else if (event.classification === 'House Event') {
                          colorClass = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
                          dotClass = 'bg-indigo-500';
                        } else if (isGossip) {
                          colorClass = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
                          dotClass = 'bg-rose-500 ring-rose-500/30';
                        }

                        // Clean GOSSIP moniker if present to show custom layout
                        let displayDesc = event.description;
                        let hasGossipPrefix = displayDesc.startsWith('GOSSIP:');
                        if (hasGossipPrefix) {
                          displayDesc = displayDesc.substring(7).trim();
                        }

                        return (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`relative border p-4 rounded-sm transition-all duration-200 group flex flex-col md:flex-row md:items-start gap-4 ${
                              isGossip 
                                ? 'bg-gradient-to-r from-[#EF4444]/5 to-transparent border-rose-900/30 hover:border-rose-500/40' 
                                : 'bg-[#0A0B0E] border-[#2D3139]/60 hover:border-[#F59E0B]/30'
                            }`}
                          >
                            {/* Bullet dot indicator */}
                            <div className={`absolute -left-[31px] top-5 w-2.5 h-2.5 rounded-full border-2 border-[#15181F] ${dotClass} transition-all duration-300 group-hover:scale-125`} />
                            
                            {/* Year Badge */}
                            <div className="shrink-0 md:w-20 font-mono">
                              <span className="text-[17px] font-bold text-white tracking-tight block leading-none">{event.year}</span>
                              <span className={`inline-block border text-[8px] tracking-wider uppercase px-1.5 py-0.2 rounded font-bold mt-1.5 ${colorClass}`}>
                                {isGossip ? 'GOSSIP LORE' : event.classification}
                              </span>
                            </div>

                            {/* Content info */}
                            <div className="flex-1 space-y-1.5">
                              <h4 className={`font-mono text-xs font-bold transition-colors uppercase flex items-center gap-2 ${
                                isGossip 
                                  ? 'text-rose-400 group-hover:text-rose-300' 
                                  : 'text-[#E0E2E6] group-hover:text-[#F59E0B]'
                              }`}>
                                {isGossip && <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse shrink-0" />}
                                {event.title}
                              </h4>
                              
                              <p className={`text-[11px] font-sans leading-relaxed text-justify ${
                                isGossip ? 'text-rose-100/80' : 'text-[#8C93A3]'
                              }`}>
                                {isGossip && <span className="text-[9px] font-mono uppercase tracking-wider text-rose-400 border border-rose-500/30 px-1 py-0.2 rounded bg-rose-500/10 mr-1.5 shrink-0 inline-block font-bold">GOSSIP</span>}
                                {displayDesc}
                              </p>
                            </div>
                          </motion.div>
                        );
                      });
                    })()}
                  </div>

                  {/* Molecular Blueprint Shift (Volatility Scaffolding) */}
                  {selectedFragrance.molecularBlueprintShift && (
                    <div className="mt-8 pt-6 border-t border-[#2D3139] space-y-4">
                      <div className="flex items-center gap-2">
                        <Atom className="w-4 h-4 text-[#F59E0B]" />
                        <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                          {selectedFragrance.molecularBlueprintShift.title || "The Molecular Blueprint Shift"}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#8C93A3] leading-relaxed">
                        To understand how a house morphs a single fragrance across a timeline, examine how the physical formula matrix shifts its weight from the top of the volatility clock to the base:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {/* High Volatility Card */}
                        <div className="bg-[#0A0B0E] border border-[#2D3139]/60 hover:border-[#F59E0B]/30 p-4 rounded-sm transition-all duration-200">
                          <div className="flex items-center gap-2 mb-2 text-[#F59E0B]">
                            <Wind className="w-4 h-4 text-[#F59E0B] animate-pulse" />
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">High Volatility Scaffolding (Radiative Focus)</span>
                          </div>
                          <div className="space-y-2 text-[11px]">
                            <div>
                              <span className="font-mono text-[9px] text-[#6A7180] uppercase block">Molecular Engine:</span>
                              <p className="text-[#E0E2E6] font-sans leading-relaxed">{selectedFragrance.molecularBlueprintShift.highVolatilityEngine}</p>
                            </div>
                            <div>
                              <span className="font-mono text-[9px] text-[#6A7180] uppercase block">Diffusion Effect:</span>
                              <p className="text-[#8C93A3] font-sans leading-relaxed">{selectedFragrance.molecularBlueprintShift.highVolatilityEffect}</p>
                            </div>
                          </div>
                        </div>

                        {/* Low Volatility Card */}
                        <div className="bg-[#0A0B0E] border border-[#2D3139]/60 hover:border-purple-500/30 p-4 rounded-sm transition-all duration-200">
                          <div className="flex items-center gap-2 mb-2 text-purple-400">
                            <Layers className="w-4 h-4 text-purple-400 animate-pulse" />
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Low Volatility Scaffolding (Density Focus)</span>
                          </div>
                          <div className="space-y-2 text-[11px]">
                            <div>
                              <span className="font-mono text-[9px] text-[#6A7180] uppercase block">Molecular Engine:</span>
                              <p className="text-[#E0E2E6] font-sans leading-relaxed">{selectedFragrance.molecularBlueprintShift.lowVolatilityEngine}</p>
                            </div>
                            <div>
                              <span className="font-mono text-[9px] text-[#6A7180] uppercase block">Tenacity Effect:</span>
                              <p className="text-[#8C93A3] font-sans leading-relaxed">{selectedFragrance.molecularBlueprintShift.lowVolatilityEffect}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Strategic Takeaway Section */}
                  {selectedFragrance.strategicTakeaway && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-[#F59E0B]/5 to-transparent border-l-2 border-[#F59E0B] rounded-r-xs">
                      <span className="font-mono text-[9px] text-[#F59E0B] uppercase font-bold tracking-wider block mb-1">Strategic Portfolio Takeaway:</span>
                      <p className="text-[11px] text-[#E0E2E6] font-sans leading-relaxed text-justify">
                        {selectedFragrance.strategicTakeaway}
                      </p>
                    </div>
                  )}

                  {/* IFRA Regulatory Compliance Section */}
                  {selectedFragrance.ifraAssessment && (
                    <div className="mt-8 pt-6 border-t border-[#2D3139] space-y-4">
                      <div className="flex items-center justify-between border-b border-[#2D3139]/40 pb-3">
                        <div className="flex items-center gap-2">
                          <Scale className="w-4 h-4 text-[#F59E0B]" />
                          <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                            IFRA Material Compliance Matrix
                          </h4>
                        </div>
                        <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                          selectedFragrance.ifraAssessment.status === 'Compliant'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          STATUS: {selectedFragrance.ifraAssessment.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* LEFT COLUMN: Table (7 cols) */}
                        <div className="lg:col-span-7 overflow-x-auto">
                          <table className="w-full text-left font-mono text-[10px] border border-[#2D3139]/40 min-w-[500px]">
                            <thead>
                              <tr className="bg-[#0A0B0E] border-b border-[#2D3139]/60 text-[#6A7180]">
                                <th className="p-2.5 font-bold uppercase">Restricted Chemical / Fraction</th>
                                <th className="p-2.5 font-bold uppercase text-right">IFRA Threshold Limit</th>
                                <th className="p-2.5 font-bold uppercase text-right">Actual Scent Mass</th>
                                <th className="p-2.5 font-bold uppercase pl-4">Formulation/Safety Impact</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2D3139]/30 text-[#8C93A3]">
                              {selectedFragrance.ifraAssessment.criticalRestrictedMaterials.map((material, idx) => (
                                <tr key={idx} className="hover:bg-[#0A0B0E]/50 transition-colors">
                                  <td className="p-2.5 font-bold text-[#E0E2E6]">{material.name}</td>
                                  <td className="p-2.5 text-right font-medium text-amber-400">{material.limitPercent === 0 ? "BANNED (0.00%)" : `≤ ${material.limitPercent}%`}</td>
                                  <td className="p-2.5 text-right font-semibold text-white">{material.actualPercent}%</td>
                                  <td className="p-2.5 pl-4 text-[11px] font-sans text-[#8C93A3] leading-relaxed">{material.impact}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* RIGHT COLUMN: Radial Regulatory Ceiling Usage Chart (5 cols) */}
                        <div className="lg:col-span-5 bg-[#0D0F14] border border-[#2D3139]/40 p-5 rounded-sm space-y-4">
                          <span className="font-mono text-[9px] text-[#6A7180] uppercase tracking-widest font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
                            Regulatory Ceiling Usage Proximity
                          </span>
                          
                          <div className="space-y-3.5">
                            {(() => {
                              const materialsWithCeiling = selectedFragrance.ifraAssessment.criticalRestrictedMaterials.map(material => {
                                const limit = material.limitPercent;
                                const actual = material.actualPercent;
                                let ratio = 0;
                                
                                if (limit === 0) {
                                  ratio = actual > 0 ? 100 : 0;
                                } else {
                                  ratio = Math.min(100, Number(((actual / limit) * 100).toFixed(1)));
                                }
                                
                                let color = "#10B981"; // emerald
                                let textClass = "text-emerald-400";
                                let borderClass = "border-emerald-500/20 bg-emerald-500/10";
                                
                                if (ratio >= 80) {
                                  color = "#EF4444"; // red
                                  textClass = "text-rose-400 font-bold animate-pulse";
                                  borderClass = "border-rose-500/25 bg-rose-500/10";
                                } else if (ratio >= 50) {
                                  color = "#F59E0B"; // amber
                                  textClass = "text-amber-400 font-semibold";
                                  borderClass = "border-amber-500/20 bg-amber-500/10";
                                }
                                
                                return {
                                  ...material,
                                  ratio,
                                  color,
                                  textClass,
                                  borderClass
                                };
                              });

                              return materialsWithCeiling.map((m, idx) => {
                                const radius = 22;
                                const circ = 2 * Math.PI * radius;
                                const offset = circ - (m.ratio / 100) * circ;
                                
                                return (
                                  <div key={idx} className="flex items-center gap-4 bg-[#15181F] border border-[#2D3139]/40 p-3 rounded-sm hover:border-[#3B82F6]/20 transition-all">
                                    <div className="relative shrink-0 w-12 h-12">
                                      <svg className="w-full h-full -rotate-90">
                                        <circle
                                          cx="24"
                                          cy="24"
                                          r={radius}
                                          className="stroke-[#2D3139]/30 fill-none"
                                          strokeWidth="3"
                                        />
                                        <motion.circle
                                          cx="24"
                                          cy="24"
                                          r={radius}
                                          className="fill-none"
                                          stroke={m.color}
                                          strokeWidth="3"
                                          strokeDasharray={circ}
                                          initial={{ strokeDashoffset: circ }}
                                          animate={{ strokeDashoffset: offset }}
                                          transition={{ duration: 1.2, ease: "easeOut" }}
                                          strokeLinecap="round"
                                        />
                                      </svg>
                                      <div className="absolute inset-0 flex flex-col items-center justify-center font-mono leading-none">
                                        <span className="text-[9px] font-bold text-white">{m.ratio}%</span>
                                        <span className="text-[5px] text-[#6A7180] tracking-tighter uppercase">ceiling</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex-1 space-y-0.5 min-w-0">
                                      <span className="font-mono text-[10px] font-bold text-white block truncate" title={m.name}>
                                        {m.name}
                                      </span>
                                      <div className="font-mono text-[9px] flex items-center gap-2 text-[#6A7180]">
                                        <span>Actual: <b className="text-white font-semibold">{m.actualPercent}%</b></span>
                                        <span>Ceiling: <b className="text-amber-400 font-semibold">{m.limitPercent === 0 ? "0%" : `${m.limitPercent}%`}</b></span>
                                      </div>
                                      <span className={`font-mono text-[8px] font-bold px-1.5 py-0.5 rounded inline-block uppercase border mt-1 ${m.borderClass} ${m.textClass}`}>
                                        {m.ratio >= 80 ? "CRITICAL RISK" : m.ratio >= 50 ? "WARNING" : "SAFE / COMPLIANT"}
                                      </span>
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Chemist's Takeaway Callout Box */}
                      <div className="bg-[#0A0B0E] border border-amber-500/15 p-4 rounded-sm flex gap-3 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-5 pointer-events-none transition-transform duration-300 group-hover:scale-110">
                          <Beaker className="w-24 h-24 text-amber-400" />
                        </div>
                        <div className="shrink-0">
                          <Beaker className="w-5 h-5 text-amber-400 mt-0.5" />
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-mono text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                            The Chemist's Takeaway: Cumulative Aggregate Burden
                          </h5>
                          <p className="text-[11px] text-[#A6ADB5] font-sans leading-relaxed text-justify">
                            When checking a formula, you have to look for hidden totals. If an extraction matrix contains three different natural essential oils (like Geranium, Rose, and Ylang-Ylang) that all contain natural fractions of Geraniol, you must calculate the cumulative mass of Geraniol across all ingredients combined. If the total breaches the aggregate threshold, the perfume fails compliance testing.
                          </p>
                          <p className="text-[11px] text-[#E0E2E6] font-sans leading-relaxed border-t border-[#2D3139]/40 pt-2 text-justify">
                            <span className="font-mono text-[9px] text-amber-400 font-bold uppercase mr-1.5">[SPECIMEN ANALYSIS]</span>
                            {selectedFragrance.ifraAssessment.chemistsTakeaway}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ROW 1.5: THE INTEGRATED MATRICES (ART & SCIENCE) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" id="art-and-science-deck">
              
              {/* ARTISTIC DOSSIER: STORY & OLFACTORY PYRAMID */}
              <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6 relative overflow-hidden flex flex-col justify-between" id="perfume-story-deck">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
                  <Scroll className="w-36 h-36 text-white/5" />
                </div>

                <div>
                  <h3 className="font-display text-xs font-bold text-white tracking-widest border-b border-[#2D3139] pb-3 mb-4 flex items-center justify-between uppercase" id="story-header">
                    <span className="flex items-center gap-2">
                      <Scroll className="w-4 h-4 text-[#10B981]" />
                      Artistic Dossier: Scent Story & Concept
                    </span>
                    <span className="font-mono text-[9px] text-[#10B981] font-bold uppercase bg-[#10B981]/10 px-2.5 py-0.5 rounded-sm border border-[#10B981]/15">
                      Creative Narrative
                    </span>
                  </h3>

                  <p className="text-xs text-[#10B981] mb-3 font-mono uppercase tracking-wide">
                    Artistic Concept & Design Heritage
                  </p>

                  <p className="text-slate-300 leading-relaxed text-xs sm:text-sm font-sans text-justify italic mb-6">
                    "{selectedFragrance.story || "Each selective compound represents a distinct sensory chapter. This fragrance encapsulates a bespoke universe, shifting delicately across its physical boundaries to paint a luminous atmosphere on skin."}"
                  </p>
                </div>

                {/* Classic Olfactory notes pyramid */}
                {selectedFragrance.notes ? (
                  <div className="border-t border-[#2D3139] pt-4 mt-auto">
                    <span className="font-mono text-[10px] uppercase text-white/80 font-bold mb-3 block flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Classical Olfactory Note Pyramid
                    </span>

                    <div className="grid grid-cols-3 gap-3">
                      {/* Top notes */}
                      <div className="bg-[#0A0B0E] border border-[#2D3139]/50 rounded-sm p-3 flex flex-col justify-between">
                        <div>
                          <span className="font-mono text-[9px] text-[#3B82F6] font-bold uppercase block mb-1">
                            Top Notes
                          </span>
                          <span className="text-[9px] text-[#6A7180] font-sans block mb-2 leading-tight">
                            Initial 15-30m
                          </span>
                        </div>
                        <ul className="space-y-1 font-sans text-[11px] text-[#E0E2E6]">
                          {selectedFragrance.notes.top.map((note, idx) => (
                            <li key={idx} className="flex items-center gap-1.5 truncate">
                              <span className="w-1 h-1 rounded-full bg-[#3B82F6]" />
                              {note}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Heart notes */}
                      <div className="bg-[#0A0B0E] border border-[#2D3139]/50 rounded-sm p-3 flex flex-col justify-between">
                        <div>
                          <span className="font-mono text-[9px] text-[#10B981] font-bold uppercase block mb-1">
                            Heart Notes
                          </span>
                          <span className="text-[9px] text-[#6A7180] font-sans block mb-2 leading-tight">
                            Middle 2-4h
                          </span>
                        </div>
                        <ul className="space-y-1 font-sans text-[11px] text-[#E0E2E6]">
                          {selectedFragrance.notes.heart.map((note, idx) => (
                            <li key={idx} className="flex items-center gap-1.5 truncate">
                              <span className="w-1 h-1 rounded-full bg-[#10B981]" />
                              {note}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Base notes */}
                      <div className="bg-[#0A0B0E] border border-[#2D3139]/50 rounded-sm p-3 flex flex-col justify-between">
                        <div>
                          <span className="font-mono text-[9px] text-amber-500 font-bold uppercase block mb-1">
                            Base Notes
                          </span>
                          <span className="text-[9px] text-[#6A7180] font-sans block mb-2 leading-tight">
                            Long 8h+
                          </span>
                        </div>
                        <ul className="space-y-1 font-sans text-[11px] text-[#E0E2E6]">
                          {selectedFragrance.notes.base.map((note, idx) => (
                            <li key={idx} className="flex items-center gap-1.5 truncate">
                              <span className="w-1 h-1 rounded-full bg-amber-500" />
                              {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-[#2D3139] pt-4 mt-auto">
                    <span className="font-mono text-[10px] uppercase text-[#6A7180] font-bold mb-1 block">
                      Pyramid Synthesis Pending
                    </span>
                    <p className="text-[11px] text-[#6A7180] font-sans">
                      Classic marketing note hierarchy will load upon active matrix GC-MS compilation.
                    </p>
                  </div>
                )}
              </div>

              {/* MOLECULAR DECK (LAYMAN CHEMISTRY) */}
              <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6 relative overflow-hidden flex flex-col justify-between" id="layman-chemistry-deck">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
                  <Beaker className="w-36 h-36 text-white/5" />
                </div>
                
                <div>
                  <h3 className="font-display text-xs font-bold text-white tracking-widest border-b border-[#2D3139] pb-3 mb-4 flex items-center justify-between uppercase" id="layman-header">
                    <span className="flex items-center gap-2">
                      <Beaker className="w-4 h-4 text-[#3B82F6]" />
                      Molecule Mechanics & Layman's Chemistry
                    </span>
                    <span className="font-mono text-[9px] text-[#3B82F6] font-bold uppercase bg-[#3B82F6]/10 px-2.5 py-0.5 rounded-sm border border-[#3B82F6]/15">
                      Scent Physics
                    </span>
                  </h3>

                  <p className="text-xs text-[#3B82F6] mb-3 leading-normal font-mono uppercase tracking-wide">
                    How the Scent Physically Evaporates & Interacts
                  </p>

                  <div className="text-slate-300 leading-relaxed text-xs sm:text-sm font-sans space-y-3 text-justify mb-6" id="layman-description">
                    {selectedFragrance.laymanChemistryExplanation ? (
                      selectedFragrance.laymanChemistryExplanation.split('\n\n').map((paragraph, idx) => (paragraph.trim() && (
                        <p key={idx} className="last:mb-0">
                          {paragraph.trim()}
                        </p>
                      )))
                    ) : (
                      <p>
                        This formulation utilizes a high-volatility denatured carrier solvent to spread high-purity synthetic isolates evenly across your skin lipids. Body heat triggers key aromatic molecules to evaporate at custom speeds, forming a 3D sillage trail.
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-[#0A0B0E] border border-[#2D3139]/80 rounded-sm p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] font-mono" id="layman-highlights">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#3B82F6] text-[9px] font-bold uppercase flex items-center gap-1">
                      <Droplet className="w-3 h-3 text-[#3B82F6]" />
                      Solvent Carrier
                    </span>
                    <p className="text-[10px] text-[#6A7180] font-sans leading-relaxed">
                      Alcohol boils off rapidly upon application, leaving a clean matrix of oils on the skin.
                    </p>
                  </div>
                  <div className="flex flex-col gap-0.5 border-t md:border-t-0 md:border-l md:border-r border-[#2D3139]/60 pt-2 md:pt-0 md:px-2.5">
                    <span className="text-[#10B981] text-[9px] font-bold uppercase flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-[#10B981]" />
                      Body Heat Release
                    </span>
                    <p className="text-[10px] text-[#6A7180] font-sans leading-relaxed">
                      Your unique skin warmth dictates vapor pressure and evaporation kinetics.
                    </p>
                  </div>
                  <div className="flex flex-col gap-0.5 border-t md:border-t-0 pt-2 md:pt-0 md:pl-1">
                    <span className="text-amber-500 text-[9px] font-bold uppercase flex items-center gap-1">
                      <Wind className="w-3 h-3 text-amber-500" />
                      Adaptation/Fatigue
                    </span>
                    <p className="text-[10px] text-[#6A7180] font-sans leading-relaxed">
                      Receptors block static aromatic signals to guard system sensitivity.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* ROW 2: MOLECULAR CHROMATOGRAPHY MATRIX & NATURAL/SYNTHETIC INDEX & EVAPORATION PLOT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* COMPOSITION BLOCK: ISOLATES ARRAY & BOTANICAL INDEX */}
              <div className="lg:col-span-6 bg-[#15181F] border border-[#2D3139] rounded-sm p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xs font-bold text-white tracking-widest border-b border-[#2D3139] pb-3 mb-4 flex items-center justify-between uppercase">
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#3B82F6]" />
                      Aroma-Chemical Fingerprint (Molecular Matrix)
                    </span>
                    <span className="font-mono text-[9px] text-[#6A7180]">GC-MS QUANTIFIED</span>
                  </h3>

                  <p className="text-xs text-[#6A7180] mb-5 leading-normal">
                    Our database decodes commercial notes back to raw chemical isolate percentages inside the compound blend concentrate:
                  </p>

                  {/* Botanical vs Synthetic Bio-Index Bar */}
                  <div className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-3 mb-6">
                    <div className="flex justify-between items-center font-mono text-[11px] mb-2">
                      <span className="text-[#6A7180] flex items-center gap-1 uppercase"><Droplet className="w-3.5 h-3.5 text-[#10B981]" /> Botanical / Natural</span>
                      <span className="text-[#3B82F6] flex items-center gap-1 uppercase"><Beaker className="w-3.5 h-3.5" /> Synthetic Isolates</span>
                    </div>
                    <div className="h-4 bg-[#2D3139] rounded-sm overflow-hidden flex">
                      <div 
                        style={{ width: `${selectedFragrance.naturalToSyntheticRatio.natural}%` }} 
                        className="bg-[#10B981] h-full relative"
                      >
                        <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] text-white font-bold">
                          {selectedFragrance.naturalToSyntheticRatio.natural}%
                        </span>
                      </div>
                      <div 
                        style={{ width: `${selectedFragrance.naturalToSyntheticRatio.synthetic}%` }} 
                        className="bg-[#3B82F6] h-full relative"
                      >
                        <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] text-white font-bold">
                          {selectedFragrance.naturalToSyntheticRatio.synthetic}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-[#6A7180] mt-2">
                      <span>Pure crops / Cold pressed fractions</span>
                      <span>Ambroxan, Iso E Super, Synthetic musks</span>
                    </div>
                  </div>

                  {/* Isolates List */}
                  <div className="space-y-2">
                    {selectedFragrance.aromaChemicalMatrix.map((iso, i) => (
                      <div 
                        key={i} 
                        onClick={() => {
                          setActiveOriginIsolate(iso.name);
                          setSearchOriginQuery(iso.name);
                        }}
                        className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-3 text-xs flex flex-col gap-1 hover:border-[#3B82F6]/50 hover:bg-[#111319] hover:scale-[1.005] cursor-pointer transition-all duration-200 group"
                        title="Click to view raw chemical geographic sources and precursor harvest sites"
                      >
                        <div className="flex justify-between items-center font-mono font-medium">
                          <span className="text-white font-bold group-hover:text-[#3B82F6] transition-colors flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                            {iso.name}
                          </span>
                          <span className="text-[#3B82F6] bg-[#3B82F6]/10 px-1.5 py-0.5 rounded-sm font-bold">{iso.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`font-mono text-[8.5px] uppercase rounded-sm px-1.5 py-0.2 shrink-0 ${
                            iso.category === 'Ambers/Musks' ? 'bg-amber-400/10 text-amber-400' :
                            iso.category === 'Woody Backbones' ? 'bg-indigo-400/10 text-indigo-400' :
                            iso.category === 'Sweet/Gourmand Anchors' ? 'bg-[#f43f5e]/10 text-[#f43f5e]' :
                            'bg-teal-400/10 text-teal-400'
                          }`}>
                            {iso.category}
                          </span>
                          <p className="text-[11px] text-[#6A7180] tracking-wide leading-relaxed font-sans mt-0.5">
                            {iso.description}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-[#2D3139]/30 font-mono text-[9px] text-[#6A7180] group-hover:text-white transition-colors">
                          <span className="uppercase flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-[#10B981]" /> Source Origin Map
                          </span>
                          <span className="text-[#10B981] group-hover:underline font-bold">Trace Feedstock →</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                <div className="text-[9px] font-mono text-[#6A7180] text-left border-t border-[#2D3139] mt-6 pt-3">
                  Approximations modeled dynamically from spectrum averages.
                </div>
              </div>

              {/* DYNAMIC VOLATILITY EVAPORATION PLOT (SLIDES ALONG A TIMELINE) */}
              <div className="lg:col-span-6 bg-[#15181F] border border-[#2D3139] rounded-sm p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xs font-bold text-white tracking-widest border-b border-[#2D3139] pb-3 mb-4 flex items-center justify-between uppercase">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
                      Volatility & Evaporation Decay Vector Map
                    </span>
                    <span className="font-mono text-[9px] text-[#6A7180]">MAPPED IN HOURS</span>
                  </h3>

                  <p className="text-xs text-[#6A7180] mb-5 leading-normal">
                    This vector chart tracks the molecular release volume of chemical layers from initial skin projection (Hour 0) through complete drydown (Hour 10):
                  </p>

                  <div className="h-68 w-full bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-2 flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedFragrance.evaporationCurve} margin={{ top: 15, right: 15, left: -25, bottom: 5 }}>
                        <XAxis 
                          dataKey="hour" 
                          stroke="#6A7180" 
                          fontFamily="monospace"
                          fontSize={9}
                          tickFormatter={(value) => `H${value}`}
                        />
                        <YAxis 
                          stroke="#6A7180" 
                          fontFamily="monospace"
                          fontSize={9}
                          domain={[0, 100]}
                        />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#15181F', borderColor: '#2D3139', borderRadius: '4px' }}
                          labelStyle={{ fontFamily: 'monospace', fontSize: '10px', color: '#10B981' }}
                          itemStyle={{ fontFamily: 'monospace', fontSize: '10px' }}
                          formatter={(value: any, name: string) => [`${value}% Load`, name.toUpperCase()]}
                          labelFormatter={(label) => `Elapsed Duration: Hour ${label}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="top" 
                          name="Top (High Volatile)" 
                          stroke="#10B981" 
                          strokeWidth={2} 
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="heart" 
                          name="Heart (Mid Volatile)" 
                          stroke="#3B82F6" 
                          strokeWidth={2} 
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="base" 
                          name="Base (Low Volatile)" 
                          stroke="#6366f1" 
                          strokeWidth={2} 
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-5 font-mono text-[10px]">
                    <div className="bg-[#0A0B0E] p-2.5 rounded-sm border border-[#2D3139] text-center">
                      <span className="text-[#10B981] font-bold block">TOP LAYER</span>
                      <p className="text-[9px] text-[#6A7180] mt-0.5 line-clamp-2 leading-tight">Light compounds. Blasts off instantly.</p>
                    </div>
                    <div className="bg-[#0A0B0E] p-2.5 rounded-sm border border-[#2D3139] text-center">
                      <span className="text-[#3B82F6] font-bold block">HEART LAYER</span>
                      <p className="text-[9px] text-[#6A7180] mt-0.5 line-clamp-2 leading-tight">Florals & spices. High diffusion center.</p>
                    </div>
                    <div className="bg-[#0A0B0E] p-2.5 rounded-sm border border-[#2D3139] text-center">
                      <span className="text-[#6366f1] font-bold block">BASE LAYER</span>
                      <p className="text-[9px] text-[#6A7180] mt-0.5 line-clamp-2 leading-tight">Heavy woods & resins. Long anchor.</p>
                    </div>
                  </div>

                </div>

                <div className="text-[9px] font-mono text-[#6A7180] text-left border-t border-[#2D3139] mt-6 pt-3 flex justify-between">
                  <span>Substantivity Vector Array</span>
                  <span>Solvent Evap Constant: R2+</span>
                </div>
              </div>

            </div>

            {/* ROW 3: EMPIRICAL PERFORMANCE VETTING, SILLAGE TIMELINE, ANOSMIA EXPLANATION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* LONGEVITY METRICS CARD */}
              <div className="lg:col-span-4 bg-[#15181F] border border-[#2D3139] rounded-sm p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xs font-bold text-white tracking-widest border-b border-[#2D3139] pb-3 mb-4 flex items-center gap-2 uppercase">
                    <Clock className="w-4 h-4 text-amber-500" />
                    Decay permanence limits
                  </h3>

                  <p className="text-xs text-[#6A7180] mb-5 leading-normal">
                    Observed duration limits before specimen concentration declines below standard human sensory thresholds:
                  </p>

                  <div className="space-y-4">
                    {/* Skin longevity index meter */}
                    <div className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <span className="font-mono text-[9px] text-[#6A7180] uppercase">Skin Longevity Constant</span>
                          <p className="text-2xl font-display font-light text-white mt-0.5">
                            {selectedFragrance.skinLongevityIndex.toFixed(1)} <span className="text-xs font-mono font-normal text-[#6A7180]">Hours</span>
                          </p>
                        </div>
                        <span className="font-mono text-xs text-[#10B981] font-bold">
                          {selectedFragrance.skinLongevityIndex >= 10 ? 'POWERHOUSE' : selectedFragrance.skinLongevityIndex >= 7 ? 'STRONG' : 'MODERATE'}
                        </span>
                      </div>
                      <div className="w-full bg-[#2D3139] h-2 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${(selectedFragrance.skinLongevityIndex / 14) * 100}%` }} 
                          className="bg-[#10B981] h-full"
                        />
                      </div>
                      <p className="text-[10px] text-[#6A7180] mt-2 font-mono">
                        Calculated on average skin pH context chemistry (76°F skin).
                      </p>
                    </div>

                    {/* Fabric permanence index */}
                    <div className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <span className="font-mono text-[9px] text-[#6A7180] uppercase">Fabric Permanence Limit</span>
                          <p className="text-2xl font-display font-light text-[#E0E2E6] mt-0.5">
                            {selectedFragrance.fabricPermanenceIndex >= 24 
                              ? `${(selectedFragrance.fabricPermanenceIndex / 24).toFixed(0)} Days+` 
                              : `${selectedFragrance.fabricPermanenceIndex} Hours`
                            }
                          </p>
                        </div>
                        <span className="font-mono text-xs text-[#3B82F6] font-bold">
                          {selectedFragrance.fabricPermanenceIndex.toFixed(0)} Hours detected
                        </span>
                      </div>
                      <div className="w-full bg-[#2D3139] h-2 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${Math.min((selectedFragrance.fabricPermanenceIndex / 168) * 100, 100)}%` }} 
                          className="bg-[#3B82F6] h-full"
                        />
                      </div>
                      <p className="text-[10px] text-[#6A7180] mt-2 font-mono">
                        Measured via retention limit on porous natural cotton test cards.
                      </p>
                    </div>
                  </div>

                </div>

                <div className="text-[9px] font-mono text-[#6A7180] text-left border-t border-[#2D3139] mt-6 pt-3">
                  Testing environment state: 21°C ambient atmospheric.
                </div>
              </div>

              {/* SILLAGE & PROJECTION RADIUS CURVE OVER 12 HOURS */}
              <div className="lg:col-span-5 bg-[#15181F] border border-[#2D3139] rounded-sm p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xs font-bold text-white tracking-widest border-b border-[#2D3139] pb-3 mb-4 flex items-center justify-between uppercase">
                    <span className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-[#3B82F6]" />
                      Sillage & Outer Projection Radius
                    </span>
                    <span className="font-mono text-[9px] text-[#6A7180]">RADIUS IN FEET</span>
                  </h3>

                  <p className="text-xs text-[#6A7180] mb-5 leading-normal">
                    This empirical mapping plots the distance the active scent trail spreads outward into the ambient surrounding room over a 12-hour timeline:
                  </p>

                  <div className="h-60 w-full bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-2 relative">
                    {(() => {
                      const smoothData = [];
                      const maxHour = 10;
                      // Generate dense interpolation points for seamless flow
                      for (let h = 0; h <= maxHour; h = Number((h + 0.1).toFixed(1))) {
                        const radius = getInterpolatedSillageRadius(selectedFragrance, h);
                        smoothData.push({
                          hour: h,
                          radiusFeet: Number(radius.toFixed(2)),
                        });
                      }

                      return (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={smoothData} margin={{ top: 15, right: 15, left: -25, bottom: 5 }}>
                            <XAxis 
                              type="number"
                              domain={[0, 10]}
                              dataKey="hour" 
                              stroke="#475569" 
                              fontFamily="monospace"
                              fontSize={9}
                              tickFormatter={(value) => `H${value}`}
                              ticks={[0, 1, 2, 4, 6, 8, 10]}
                            />
                            <YAxis 
                              stroke="#475569" 
                              fontFamily="monospace"
                              fontSize={9}
                              domain={[0, 10]}
                              tickFormatter={(value) => `${value}ft`}
                            />
                            <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#15181F', borderColor: '#2D3139', borderRadius: '4px' }}
                              labelStyle={{ fontFamily: 'monospace', fontSize: '10px', color: '#3B82F6' }}
                              itemStyle={{ fontFamily: 'monospace', fontSize: '10px' }}
                              formatter={(value: any) => [`${value} ft radius`, 'Projection Envelope']}
                              labelFormatter={(label) => `Elapsed Time: Hour ${label}`}
                            />
                            <defs>
                              <linearGradient id="sillage-envelope-gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0.01}/>
                              </linearGradient>
                            </defs>
                            <Area 
                              type="monotone" 
                              dataKey="radiusFeet" 
                              stroke="#10B981" 
                              strokeWidth={2}
                              fillOpacity={1} 
                              fill="url(#sillage-envelope-gradient)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      );
                    })()}
                  </div>

                </div>

                <div className="text-[9px] font-mono text-[#6A7180] text-left border-t border-[#2D3139] mt-6 pt-3 flex justify-between">
                  <span>Emission projection tracking constant</span>
                  <span>Dispersion Constant: Kd-3</span>
                </div>
              </div>

              {/* ANOSMIA / OLFACTORY SENSORY FATIGUE RISK WARNING */}
              <div className="lg:col-span-3 bg-[#1A1618] border border-rose-950 rounded-sm p-6 flex flex-col justify-between relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-500/5 via-transparent to-transparent pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between border-b border-rose-950/40 pb-2 mb-4">
                    <span className="font-mono text-[9px] uppercase text-rose-400 font-bold tracking-widest flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      RECEPTOR FATIGUE
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  </div>

                  <p className="text-[11px] text-[#6A7180] mb-4 leading-normal">
                    Certain linear, heavy-weight synthetic molecules exhaust human olfactory receptors, triggering sensory blindness.
                  </p>

                  <div className="bg-[#0A0B0E] border border-rose-950/20 rounded-sm p-4 text-center">
                    <span className="font-mono text-[9px] text-[#6A7180] uppercase">ANOSMIA RISK INDEX</span>
                    <p className="text-4.5xl font-display font-black text-rose-400 mt-1">
                      {selectedFragrance.olfactoryFatigueRisk}%
                    </p>
                    <span className="font-mono text-[10px] text-rose-300 font-bold mt-1 inline-block bg-rose-950/30 px-2 py-0.5 rounded-sm border border-rose-500/20">
                      {selectedFragrance.olfactoryFatigueRisk >= 85 ? 'EXTREME HAZARD' : selectedFragrance.olfactoryFatigueRisk >= 60 ? 'HIGH RISK' : 'MODERATE'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans mt-4 text-justify">
                    {selectedFragrance.olfactoryFatigueExplanation}
                  </p>

                  {/* ACTIVE RECOVERY PROTOCOL MODULE */}
                  <div className="mt-5 pt-4 border-t border-rose-950/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] uppercase text-rose-300 font-bold tracking-widest flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                        RECOVERY PROTOCOL INSTRUCTIONS
                      </span>
                      {selectedFragrance.olfactoryFatigueRisk >= 60 && (
                        <span className="text-[8px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">
                          HIGH RISK RECEPTOR OVERLOAD
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 font-sans text-xs">
                      <div className="bg-[#120F10] border border-rose-950/40 p-3 rounded-sm">
                        <h4 className="font-mono text-[10px] text-rose-300 font-semibold uppercase mb-1 flex items-center gap-1.5">
                          <span className="text-[#3B82F6]">1.</span> Nasal Neutralization Purge
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Perform receptor resetting by inhaling an unperfumed organic wool wool coat or clean, scent-free bare forearms for 45s. Refrain from smelling ground coffee beans, as their heavy volatile oils add additional aromatic sensory fatigue.
                        </p>
                      </div>

                      <div className="bg-[#120F10] border border-rose-950/40 p-3 rounded-sm">
                        <h4 className="font-mono text-[10px] text-rose-300 font-semibold uppercase mb-1 flex items-center gap-1.5">
                          <span className="text-[#3B82F6]">2.</span> Optimum Dispenser Rotation
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Impose a strict 72-hour olfactory holiday from this specimen. Rotate to high-evaporation, simple linear molecules like ISO E Super solo or airy citrus eau de colognes to allow base-affinity receptors to rest.
                        </p>
                      </div>

                      <div className="bg-[#120F10] border border-rose-950/40 p-3 rounded-sm">
                        <h4 className="font-mono text-[10px] text-rose-300 font-semibold uppercase mb-1 flex items-center gap-1.5">
                          <span className="text-[#3B82F6]">3.</span> Anchor Point Decoupling
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Avoid the front neck/chest. Direct sprays to the upper shoulder blade, back of the neck, or lower spine. This positions the vapor dispersion trail behind your breathing tract, avoiding direct sensory lock-out.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[9px] font-mono text-rose-400/50 text-left border-t border-rose-950/20 mt-6 pt-3 uppercase">
                  Avoid sensory lock-out
                </div>
              </div>

            </div>

            {/* ROW 4: OLFACTORY FAMILY CLIMATE COMPATIBILITY & REAL TEXTURE PROFILE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* UNVARNISHED RAW ACCORDS PROFILE & CLIMATE SPAN */}
              <div className="lg:col-span-7 bg-[#15181F] border border-[#2D3139] rounded-sm p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xs font-bold text-white tracking-widest border-b border-[#2D3139] pb-3 mb-4 flex items-center justify-between uppercase">
                    <span className="flex items-center gap-2">
                      <Beaker className="w-4 h-4 text-[#3B82F6]" />
                      True Mineral Accord Assessment
                    </span>
                    <span className="font-mono text-[9px] text-[#6A7180]">RAW SENSORY BIAS</span>
                  </h3>

                  <p className="text-xs text-[#6A7180] mb-5 leading-normal">
                    Tactility and accord sensation profiles measured from expert target panel consensus metrics:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Visual Progress Bar Accords & Climate parameters */}
                    <div className="md:col-span-6 space-y-5 flex flex-col justify-between">
                      <div className="space-y-4">
                        {selectedFragrance.accords.map((acc, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between items-center font-mono text-[10.5px]">
                              <span className="text-slate-300 uppercase font-medium">{acc.name}</span>
                              <span className="text-[#3B82F6] font-bold">{acc.intensity}% Intensity</span>
                            </div>
                            <div className="h-1.5 bg-[#0A0B0E] border border-[#2D3139] rounded-sm overflow-hidden">
                              <div 
                                style={{ width: `${acc.intensity}%` }} 
                                className="bg-[#3B82F6] h-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Climate compatibility parameters incorporated into left column */}
                      <div className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-4 font-mono text-xs space-y-4">
                        <div className="border-b border-[#2D3139] pb-2">
                          <span className="text-[#6A7180] uppercase text-[9px] block font-bold">Atmospheric Temp Span</span>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Thermometer className="w-5 h-5 text-amber-500" />
                            <p className="text-xs font-bold text-white">
                              {selectedFragrance.tempRangeMinCelsius}°C to {selectedFragrance.tempRangeMaxCelsius}°C
                              <span className="block text-[10px] text-[#6A7180] font-normal mt-0.5">
                                ({(selectedFragrance.tempRangeMinCelsius * 9/5 + 32).toFixed(0)}°F to {(selectedFragrance.tempRangeMaxCelsius * 9/5 + 32).toFixed(0)}°F)
                              </span>
                            </p>
                          </div>
                        </div>

                        <div>
                          <span className="text-[#6A7180] uppercase text-[9px] block font-bold">Resilience Matrix</span>
                          <div className="flex items-start gap-2 mt-2">
                            <Wind className="w-4 h-4 text-[#3B82F6] mt-0.5 shrink-0" />
                            <p className="text-[11px] text-[#6A7180] font-sans leading-relaxed">
                              {selectedFragrance.humidityTolerance}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Olfactory Accords Radar Chart Map */}
                    <div className="md:col-span-6 flex flex-col justify-between space-y-4 bg-[#0A0B0E] border border-[#2D3139] rounded-sm p-4">
                      <div>
                        <span className="font-mono text-[9px] text-[#3B82F6] block uppercase tracking-wider font-extrabold">Olfactory Profile Radar</span>
                        <p className="text-[10px] text-[#6A7180] font-sans leading-snug">Visual vector composition mapping raw sensory accords intensities</p>
                      </div>
                      
                      <div className="h-[210px] w-full flex items-center justify-center font-mono text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={selectedFragrance.accords.map(acc => ({ subject: acc.name, intensity: acc.intensity }))}>
                            <PolarGrid stroke="#2D3139" strokeWidth={0.5} />
                            <PolarAngleAxis 
                              dataKey="subject" 
                              tick={{ fill: '#8F9BBA', fontSize: 8.5, fontFamily: 'monospace', fontWeight: 500 }} 
                            />
                            <PolarRadiusAxis 
                              angle={90} 
                              domain={[0, 100]} 
                              tick={{ fill: '#4E576B', fontSize: 7.5 }} 
                              axisLine={false}
                              tickLine={false}
                            />
                            <Radar
                              name="Intensity"
                              dataKey="intensity"
                              stroke="#3b82f6"
                              fill="#3b82f6"
                              fillOpacity={0.16}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="font-mono text-[8px] text-[#6A7180] flex justify-between uppercase pt-1.5 border-t border-[#2D3139]/30">
                        <span>Radial Vector Plot</span>
                        <span>0% - 100% bounds</span>
                      </div>
                    </div>

                  </div>

                </div>

                <div className="text-[9px] font-mono text-[#6A7180] text-left border-t border-[#2D3139] mt-6 pt-3 uppercase">
                  Tactile profile registry parameters
                </div>
              </div>

              {/* SITUATIONAL MATCH SCOREBOARD */}
              <div className="lg:col-span-5 bg-[#15181F] border border-[#2D3139] rounded-sm p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xs font-bold text-white tracking-widest border-b border-[#2D3139] pb-3 mb-4 flex items-center justify-between uppercase">
                    <span className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#3B82F6]" />
                      Occasion Setting Appropriateness Map
                    </span>
                    <span className="font-mono text-[9px] text-[#6A7180]">MAX_SCORE: 100</span>
                  </h3>

                  <p className="text-xs text-[#6A7180] mb-5 leading-normal">
                    Suitability rating based on structural emission density. Highly aggressive projection carrying caution buffers in narrow indoor environments:
                  </p>

                  <div className="space-y-4">
                    {selectedFragrance.settingScoring.map((score, index) => (
                      <div key={index} className="bg-[#0A0B0E] border border-[#2D3139] p-3 rounded-sm flex items-center justify-between gap-4 font-mono">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2 h-2 rounded-full ${
                            score.score >= 85 ? 'bg-[#10B981]' :
                            score.score >= 60 ? 'bg-amber-400' :
                            'bg-rose-400'
                          }`} />
                          <span className="text-xs text-slate-300 font-bold block truncate">{score.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-white">{score.score} pts</span>
                          <div className="w-16 bg-[#2D3139] h-1 rounded-full overflow-hidden hidden sm:block">
                            <div 
                              style={{ width: `${score.score}%` }} 
                              className={`h-full ${
                                score.score >= 85 ? 'bg-[#10B981]' :
                                score.score >= 60 ? 'bg-amber-400' :
                                'bg-rose-400'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                <div className="text-[9px] font-mono text-[#6A7180] text-left border-t border-[#2D3139] mt-6 pt-3 uppercase">
                  Situational appropriateness indicators
                </div>
              </div>

            </div>

            {/* ROW 5: LOGISTICAL FINANCIAL & CLONE/ALTERNATIVE COMPILATION & HERITAGE ADJ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* LOGISTICAL & FINANCIAL METRICS */}
              <div className="lg:col-span-4 bg-[#15181F] border border-[#2D3139] rounded-sm p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xs font-bold text-white tracking-widest border-b border-[#2D3139] pb-3 mb-4 flex items-center gap-2 uppercase">
                    <DollarSign className="w-4 h-4 text-[#10B981]" />
                    Market Logistical Pricing Index
                  </h3>

                  <p className="text-xs text-[#6A7180] mb-5 leading-normal">
                    Assessing commercial financial parity values on standard retail shelves:
                  </p>

                  <div className="grid grid-cols-2 gap-4 my-4 font-mono">
                    <div className="bg-[#0A0B0E] p-3 rounded-sm border border-[#2D3139] text-center">
                      <span className="text-[#6A7180] uppercase text-[9px] block">Retail Price Value</span>
                      <span className="text-xl font-bold text-white block mt-0.5">${selectedFragrance.avgRetailPrice}</span>
                      <span className="text-[9px] text-[#6A7180]">Avg 100mL MSP</span>
                    </div>
                    <div className="bg-[#0A0B0E] p-3 rounded-sm border border-[#2D3139] text-center">
                      <span className="text-[#6A7180] uppercase text-[9px] block">Unit Price (per mL)</span>
                      <span className="text-xl font-bold text-[#3B82F6] block mt-0.5">${selectedFragrance.pricePerMl.toFixed(2)}/ml</span>
                      <span className="text-[9px] text-[#6A7180]">Concentrate ratio</span>
                    </div>
                  </div>

                  <div className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm flex items-center justify-between text-xs font-mono">
                    <span className="text-[#6A7180] uppercase text-[10px]">Value Rating</span>
                    <span className={`font-semibold inline-block rounded-sm border px-3 py-1 ${
                      selectedFragrance.valueRating === 'Great Value' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25' :
                      selectedFragrance.valueRating === 'Fair' ? 'bg-amber-400/10 text-amber-300 border-amber-400/25' :
                      'bg-rose-400/10 text-rose-300 border-rose-400/25'
                    }`}>
                      {selectedFragrance.valueRating}
                    </span>
                  </div>

                </div>

                <div className="text-[9px] font-mono text-[#6A7180] text-left border-t border-[#2D3139] mt-6 pt-3 uppercase">
                  Logistical financial indexation
                </div>
              </div>

              {/* MARKET REPLICATORS / MATCH RATIO */}
              <div className="lg:col-span-8 bg-[#15181F] border border-[#2D3139] rounded-sm p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xs font-bold text-white tracking-widest border-b border-[#2D3139] pb-3 mb-4 flex items-center justify-between uppercase">
                    <span className="flex items-center gap-2">
                      <Shuffle className="w-4 h-4 text-[#3B82F6]" />
                      Verified Market Alternatives & Replicators
                    </span>
                    <span className="font-mono text-[9px] text-[#6A7180]">MATCH ESTIMATES</span>
                  </h3>

                  <p className="text-xs text-[#6A7180] mb-5 leading-normal">
                    Independent market clones, alternative formats, or high-value twins quantified alongside their chemical matching similarity levels:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedFragrance.alternatives.map((alt, index) => (
                      <div key={index} className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm flex flex-col justify-between hover:border-[#3B82F6]/40 transition-all font-mono">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] text-[#6A7180] uppercase block truncate max-w-[70%]">{alt.brand}</span>
                            <span className="text-[#3B82F6] font-bold text-xs">{alt.similarity}% MATCH</span>
                          </div>
                          <h4 className="text-xs font-bold text-white tracking-wide line-clamp-1 mt-0.5">{alt.name}</h4>
                        </div>
                        <div className="bg-[#15181F] px-2 py-1.5 rounded-sm border border-[#2D3139] mt-3 text-[10px] text-slate-300 flex justify-between items-center">
                          <span className="text-[9px] text-[#6A7180] uppercase">Parity Price</span>
                          <span className="font-semibold text-[#10B981] capitalize">{alt.priceComparison}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Formulation Heritage / IFRA context review */}
                  <div className="bg-[#0A0B0E] border border-[#2D3139] p-3.5 rounded-sm text-xs leading-relaxed font-sans text-[#6A7180] mt-5">
                    <strong className="text-amber-500 font-mono text-[10px] uppercase block mb-1">
                      IFRA Ingredient Adjustments & Heritage Warning:
                    </strong>
                    {selectedFragrance.formulationHeritage}
                  </div>

                </div>

                 <div className="text-[9px] font-mono text-[#6A7180] text-left border-t border-[#2D3139] mt-6 pt-3 uppercase">
                  alternate purchase pathway catalog
                </div>
              </div>

            </div>

            {/* ROW 5.2: SEASONAL WARDROBE INTEGRATION & SCENT MOODBOARD GENERATOR */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* SEASONAL WARDROBE INTEGRATION */}
              <div className="lg:col-span-5 bg-[#15181F] border border-[#2D3139] rounded-sm p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xs font-bold text-white tracking-widest border-b border-[#2D3139] pb-3 mb-4 flex items-center justify-between uppercase">
                    <span className="flex items-center gap-2">
                      <Shirt className="w-4 h-4 text-[#3B82F6]" />
                      Seasonal Wardrobe Integration
                    </span>
                    <span className="font-mono text-[9px] text-[#6A7180]">FABRIC FIT</span>
                  </h3>

                  <p className="text-xs text-[#6A7180] mb-5 leading-normal">
                    Curated fabric pairings and aesthetic silhouettes that scientifically accommodate this fragrance's volatility and climate window:
                  </p>

                  {(() => {
                    const recommend = getSeasonalWardrobeRecommendation(selectedFragrance);
                    return (
                      <div className="space-y-4">
                        <div className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm space-y-3 font-mono">
                          <div>
                            <span className="text-[#6A7180] text-[9.5px] uppercase block">RECOMMENDED TEXTILES</span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {recommend.materials.map((mat, i) => (
                                <span key={i} className="text-[10px] uppercase font-semibold text-[#3B82F6] bg-[#3B82F6]/10 px-2.5 py-0.5 rounded border border-[#3B82F6]/20">
                                  {mat}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#2D3139]/40">
                            <div>
                              <span className="text-[#6A7180] text-[9px] uppercase block">APPAREL SILHOUETTE</span>
                              <span className="text-[11px] font-bold text-white leading-tight block mt-0.5">
                                {recommend.silhouette}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#6A7180] text-[9px] uppercase block">STYLE PERSONA</span>
                              <span className="text-[11px] font-bold text-emerald-400 leading-tight block mt-0.5">
                                {recommend.stylePersona}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm">
                          <span className="font-mono text-[9px] text-[#6A7180] uppercase block mb-1">RECOMMENDED OUTFIT PAIRING</span>
                          <p className="text-xs text-[#E0E2E6] leading-relaxed">
                            "{recommend.outfitPairing}"
                          </p>
                        </div>

                        <div className="bg-[#1C1A16] border border-amber-950/40 p-3 rounded-sm text-[10px] leading-relaxed text-[#D97706] font-mono">
                          <strong className="uppercase block text-[9px] text-amber-500 mb-0.5 font-bold">THERMO-EVAPORATION CONTEXT:</strong>
                          This apparel structure forms a micro-climate buffer that regulates molecule dispersion constant ({recommend.concept}).
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="text-[9px] font-mono text-[#6A7180] text-left border-t border-[#2D3139] mt-6 pt-3 uppercase">
                  Climate Wardrobe Synergy Profile
                </div>
              </div>

              {/* MOODBOARD BUILDER / AI VIBE ASSESSMENT */}
              <div className="lg:col-span-7 bg-[#15181F] border border-[#2D3139] rounded-sm p-6 flex flex-col justify-between relative">
                <div>
                  <h3 className="font-display text-xs font-bold text-white tracking-widest border-b border-[#2D3139] pb-3 mb-4 flex items-center justify-between uppercase">
                    <span className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[#3B82F6]" />
                      Olfactory Moodboard & AI Vibe Analyzer
                    </span>
                    <span className="font-mono text-[9px] text-[#6A7180]">AESTHETIC SYNC</span>
                  </h3>

                  <p className="text-xs text-[#6A7180] mb-4 leading-normal">
                    Generate an atmospheric aesthetic blueprint mapped to this scent's active chemical accords. Synthesizes poetic design statements and deep color codes:
                  </p>

                  {moodboardData ? (
                    <div className="space-y-4">
                      {/* Vibe Summary Title Block */}
                      <div className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
                          <Palette className="w-32 h-32 text-white/5" />
                        </div>
                        
                        <div className="flex items-center justify-between border-b border-[#2D3139]/40 pb-2 mb-2">
                          <span className="font-mono text-[9px] text-[#6A7180] uppercase">AESTHETIC IDENTITY PRESYNC</span>
                          <span className="text-[8px] font-mono text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-[#10B981]/10">
                            GC-MS ACCORD MAP
                          </span>
                        </div>

                        <h4 className="font-display text-sm font-bold text-white tracking-wide uppercase">
                          {moodboardData.aestheticTitle}
                        </h4>

                        <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2 italic">
                          "{moodboardData.vibeAssessment}"
                        </p>
                      </div>

                      {/* Color Palette Array */}
                      <div>
                        <span className="font-mono text-[9.5px] text-[#6A7180] uppercase block mb-1.5">SYNTHESIZED COLOR PALETTE GRID</span>
                        <div className="grid grid-cols-4 gap-2">
                          {moodboardData.colors.map((color, idx) => (
                            <div key={idx} className="flex flex-col gap-1">
                              <div 
                                style={{ backgroundColor: color }} 
                                className="h-10 rounded-sm border border-[#2D3139]/30 shadow-inner" 
                              />
                              <span className="text-[9px] font-mono text-center text-[#6A7180] font-bold">
                                {color.toUpperCase()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Metaphors Cards Grid */}
                      <div>
                        <span className="font-mono text-[9.5px] text-[#6A7180] uppercase block mb-1.5">SENSORY METAPHORS & MATRIC IMAGERY</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {moodboardData.tactileMetaphors.map((item, id) => (
                            <div key={id} className="bg-[#0A0B0E] border border-[#2D3139] p-3 rounded-sm hover:border-[#3B82F6]/30 transition-all">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="text-[10px] font-mono text-[#3B82F6] font-bold">#0{id + 1}</span>
                                <div className="h-px bg-[#2D3139] flex-1" />
                              </div>
                              <p className="text-[11px] text-[#94A3B8] leading-relaxed font-sans font-medium">
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="border border-dashed border-[#2D3139] p-8 rounded-sm text-center flex flex-col items-center justify-center">
                      <Palette className="w-8 h-8 text-[#6A7180] mb-2 animate-pulse" />
                      <span className="font-mono text-xs text-[#6A7180]">No Moodboard generated yet.</span>
                    </div>
                  )}

                  {/* AI trigger interaction button */}
                  <div className="mt-4 pt-1.5 flex flex-col sm:flex-row gap-3 items-center border-t border-[#2D3139]/40">
                    <button
                      type="button"
                      disabled={isGeneratingMoodboard}
                      onClick={handleGenerateMoodboardLive}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#3B82F6]/50 text-[#0A0B0E] text-xs font-mono font-bold tracking-wider uppercase rounded-sm cursor-pointer transition-all shadow-[0_0_12px_rgba(59,130,246,0.15)] disabled:cursor-not-allowed shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingMoodboard ? 'animate-spin' : ''}`} />
                      {isGeneratingMoodboard ? 'SYNTHESIZING VIBE MATRIX...' : 'REGENERATE VIA GEMINI AI'}
                    </button>

                    {moodboardError && (
                      <span className="text-[10px] font-mono text-amber-400">
                        {moodboardError}
                      </span>
                    )}
                    {!moodboardError && !isGeneratingMoodboard && (
                      <span className="text-[9.5px] font-mono text-[#6A7180]">
                        Queries Gemini client-model using real-time molecular weights. Fallback safe.
                      </span>
                    )}
                  </div>

                </div>

                <div className="text-[9px] font-mono text-[#6A7180] text-left border-t border-[#2D3139] mt-6 pt-3 uppercase">
                  Generative Scent-Aesthetic Synthesis
                </div>
              </div>

            </div>

            {/* ROW 5: SPATIAL DIFFUSION SIMULATOR: 2D FLOOR PLAN HEATMAP */}
            <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6 space-y-6">
              
              {/* Header */}
              <div className="border-b border-[#2D3139] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
                    <Wind className="w-4 h-4 text-[#3B82F6]" />
                    Spatial Sillage Diffusion Simulator (2D Floor Plan Heatmap)
                  </h3>
                  <p className="text-xs text-[#6A7180] mt-1">
                    Simulate real-time physical molecule dispersion inside enclosed spaces using GC-MS vapor pressure coefficients and dynamic projection rates.
                  </p>
                </div>
                
                {/* Active Indicator */}
                <span className="shrink-0 font-mono text-[9px] bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 px-3 py-1 rounded-sm uppercase font-semibold flex items-center gap-1.5 self-start md:self-auto">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-ping" />
                  VAPOR MODELING: ACTIVE
                </span>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Control Panel */}
                <div className="lg:col-span-4 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    
                    {/* Simulation Parameters Section Label */}
                    <div className="font-mono text-[9px] text-[#6A7180] uppercase tracking-wider border-b border-[#2D3139]/50 pb-1.5">
                      1. Environment Tuning
                    </div>

                    {/* Floor Plan Preset Selection */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-slate-300 uppercase">Select Target Space Presets:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setSillageFloorPlan('studio')}
                          className={`px-3 py-2 text-left font-mono text-[11px] rounded transition-all border flex flex-col justify-between h-14 ${
                            sillageFloorPlan === 'studio'
                              ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white'
                              : 'bg-[#0A0B0E] border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/40 hover:text-white'
                          }`}
                        >
                          <span className="font-bold">STUDIO APT</span>
                          <span className="text-[9px] opacity-70">500 sq ft • Enclosed</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSillageFloorPlan('office')}
                          className={`px-3 py-2 text-left font-mono text-[11px] rounded transition-all border flex flex-col justify-between h-14 ${
                            sillageFloorPlan === 'office'
                              ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white'
                              : 'bg-[#0A0B0E] border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/40 hover:text-white'
                          }`}
                        >
                          <span className="font-bold">OPEN OFFICE</span>
                          <span className="text-[9px] opacity-70">1,500 sq ft • Medium</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSillageFloorPlan('car')}
                          className={`px-3 py-2 text-left font-mono text-[11px] rounded transition-all border flex flex-col justify-between h-14 ${
                            sillageFloorPlan === 'car'
                              ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white'
                              : 'bg-[#0A0B0E] border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/40 hover:text-white'
                          }`}
                        >
                          <span className="font-bold">SUV CABIN</span>
                          <span className="text-[9px] opacity-70">80 sq ft • Compact</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSillageFloorPlan('patio')}
                          className={`px-3 py-2 text-left font-mono text-[11px] rounded transition-all border flex flex-col justify-between h-14 ${
                            sillageFloorPlan === 'patio'
                              ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white'
                              : 'bg-[#0A0B0E] border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/40 hover:text-white'
                          }`}
                        >
                          <span className="font-bold">OUTDOOR CAFÉ</span>
                          <span className="text-[9px] opacity-70">1,000 sq ft • High Loss</span>
                        </button>
                      </div>
                    </div>

                    {/* Dosage / Sprays */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <label className="text-xs font-mono text-slate-300 uppercase">Application Dosage:</label>
                        <span className="font-mono text-[11px] text-[#3B82F6] font-bold">
                          {sillageSprays === 1 ? '1 Spray (Subtle)' : sillageSprays === 3 ? '3 Sprays (Normal)' : '6 Sprays (Oversprayed)'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {[1, 3, 6].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setSillageSprays(num)}
                            className={`flex-1 font-mono text-xs py-1.5 rounded transition-all border ${
                              sillageSprays === num
                                ? 'bg-[#3B82F6] text-[#0A0B0E] border-[#3B82F6] font-bold'
                                : 'bg-[#0A0B0E] border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/40'
                            }`}
                          >
                            {num} {num === 1 ? 'SPRAY' : 'SPRAYS'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ventilation Settings */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-slate-300 uppercase">Atmospheric Ventilation:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { key: 'none', label: 'STATIC', desc: 'No movement' },
                          { key: 'low', label: 'AC FLOW', desc: 'Gentle drift' },
                          { key: 'high', label: 'EXHAUST', desc: 'Turbulent' }
                        ].map((v) => (
                          <button
                            key={v.key}
                            type="button"
                            onClick={() => setSillageVentilation(v.key as any)}
                            className={`px-2 py-1.5 font-mono rounded border flex flex-col items-center justify-center transition-all ${
                              sillageVentilation === v.key
                                ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white'
                                : 'bg-[#0A0B0E] border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/40'
                            }`}
                          >
                            <span className="text-[10px] font-bold">{v.label}</span>
                            <span className="text-[8px] opacity-60 mt-0.5">{v.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Simulation Parameters Section Label */}
                    <div className="font-mono text-[9px] text-[#6A7180] uppercase tracking-wider border-b border-[#2D3139]/50 pb-1.5 pt-2">
                      2. Molecular Timeline
                    </div>

                    {/* Time / Hour timeline slider */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-baseline font-mono text-xs">
                        <span className="text-slate-300 uppercase">Elapsed Scent Wear:</span>
                        <span className="text-[#10B981] font-bold text-[12px] bg-[#10B981]/15 px-2 py-0.5 rounded-sm">
                          Hour {sillageSimHour.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsSimPlaying(!isSimPlaying)}
                          className={`p-1.5 rounded border font-mono text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shrink-0 ${
                            isSimPlaying 
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' 
                              : 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981] hover:bg-[#10B981]/20'
                          }`}
                          title={isSimPlaying ? "Pause Molecular Flow" : "Play Molecular Flow"}
                        >
                          {isSimPlaying ? <Pause className="w-3.5 h-3.5 animate-pulse" /> : <Play className="w-3.5 h-3.5" />}
                          <span className="text-[9px] font-bold uppercase tracking-wider">{isSimPlaying ? 'PAUSE' : 'PLAY'}</span>
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.1"
                          value={sillageSimHour}
                          onChange={(e) => {
                            setSillageSimHour(parseFloat(e.target.value));
                            setIsSimPlaying(false); // Pause loop on manual override
                          }}
                          className="flex-1 h-1.5 bg-[#0A0B0E] border border-[#2D3139] rounded-lg appearance-none cursor-pointer accent-[#10B981] outline-none"
                        />
                      </div>
                      <div className="flex justify-between text-[8px] text-[#6A7180] font-mono uppercase">
                        <span>H0 (Initial Blast)</span>
                        <span>H5</span>
                        <span>H10 (Drydown)</span>
                      </div>
                    </div>

                  </div>

                  {/* GC-MS Feedback */}
                  <div className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm space-y-2 text-xs font-mono">
                    <span className="text-[#3B82F6] text-[9px] font-bold uppercase tracking-wide block">GC-MS PROJECTION ANALYSIS</span>
                    
                    {(() => {
                      const baseRadius = getInterpolatedSillageRadius(selectedFragrance, sillageSimHour);
                      const sprayMultiplier = sillageSprays === 1 ? 0.65 : sillageSprays === 6 ? 1.7 : 1.0;
                      const ventilationMultiplier = sillageVentilation === 'none' ? 1.0 : sillageVentilation === 'low' ? 0.85 : 0.55;
                      const activeRadius = Math.max(0, baseRadius * sprayMultiplier * ventilationMultiplier);
                      
                      return (
                        <div className="space-y-1.5 text-[#E0E2E6]">
                          <div className="flex justify-between">
                            <span className="text-[#6A7180]">Theoretical Radius:</span>
                            <span>{baseRadius.toFixed(2)} ft</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#6A7180]">Effective Cloud Radius:</span>
                            <span className="text-[#10B981] font-bold">{activeRadius.toFixed(2)} ft</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#6A7180]">Volatility Family:</span>
                            <span className="text-amber-400 font-bold truncate max-w-[120px]">{selectedFragrance.olfactoryFamily.split(' ')[0]}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#6A7180]">Vapor Retention:</span>
                            <span className="text-xs">
                              {activeRadius > 5.5 ? 'EXTREME' : activeRadius > 3.0 ? 'HIGH MODERATE' : activeRadius > 1.0 ? 'CLINGING AURA' : 'TRACE ODORS'}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                </div>

                {/* Floor Plan visualization canvas zone */}
                <div className="lg:col-span-8 bg-[#090A0E] border border-[#2D3139]/80 rounded-sm overflow-hidden relative flex flex-col justify-between h-[510px]">
                  
                  {/* Grid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(45,49,57,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(45,49,57,0.06)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  
                  {/* Floor plan headers */}
                  <div className="p-3.5 bg-[#12141C]/50 border-b border-[#2D3139]/40 flex justify-between items-center z-10 font-mono text-[9px] uppercase">
                    <span className="text-[#3B82F6] font-bold flex items-center gap-1">
                      <Maximize2 className="w-3 h-3" /> Blueprint Matrix Preset: {sillageFloorPlan}
                    </span>
                    <span className="text-[#6A7180] tracking-wider">Scale: 1 square = 2 x 2 ft</span>
                  </div>

                  {/* Dynamic Sensory Intensity Warning Overlay Badge */}
                  {(() => {
                    const getConcentrationScore = (conc: string): number => {
                      const c = conc?.toLowerCase() || '';
                      if (c.includes('extrait') || c.includes('pure')) return 4.0;
                      if (c.includes('parfum') || c.includes('edp')) return 3.0;
                      if (c.includes('toilette') || c.includes('edt')) return 2.0;
                      return 1.2;
                    };

                    const getRoomMultiplier = (fp: string): { multiplier: number; spaceName: string; size: string } => {
                      switch (fp) {
                        case 'car':
                          return { multiplier: 3.8, spaceName: 'SUV Cabin', size: '80 sq ft' };
                        case 'studio':
                          return { multiplier: 1.6, spaceName: 'Studio Apt', size: '500 sq ft' };
                        case 'office':
                          return { multiplier: 0.8, spaceName: 'Open Office', size: '1,500 sq ft' };
                        case 'patio':
                          return { multiplier: 0.25, spaceName: 'Outdoor Café', size: '1,000 sq ft (Air Loss)' };
                        default:
                          return { multiplier: 1.0, spaceName: 'Standard Room', size: '200 sq ft' };
                      }
                    };

                    const concScore = getConcentrationScore(selectedFragrance?.concentration || '');
                    const roomData = getRoomMultiplier(sillageFloorPlan);
                    const intensityValue = concScore * sillageSprays * roomData.multiplier;

                    let badgeColor = 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10';
                    let barColor = 'bg-emerald-500';
                    let statusLabel = 'AERATED COMFORT';
                    let description = '';

                    if (intensityValue > 16) {
                      badgeColor = 'border-rose-500/30 text-rose-400 bg-rose-500/10';
                      barColor = 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse';
                      statusLabel = 'SENSORY HAZARD';
                      description = `High molecular density of ${selectedFragrance?.concentration || 'compounds'} (${sillageSprays} sprays) in ${roomData.spaceName} (${roomData.size}) will trigger olfactory fatigue or temporary anosmia.`;
                    } else if (intensityValue >= 6.5) {
                      badgeColor = 'border-amber-500/30 text-amber-400 bg-amber-500/10';
                      barColor = 'bg-amber-500';
                      statusLabel = 'SATURATION RISK';
                      description = `Elevated molecular load detected for ${roomData.size}. High risk of nose-blindness if exposed continuously without proper ventilation.`;
                    } else {
                      badgeColor = 'border-emerald-500/30 text-emerald-400 bg-[#10B981]/5';
                      barColor = 'bg-emerald-500';
                      statusLabel = 'OPTIMAL';
                      description = `Excellent physical dilution. Scent dispersion is well-aerated, staying comfortably below saturation thresholds in ${roomData.spaceName}.`;
                    }

                    return (
                      <div className="absolute top-14 right-3.5 z-30 max-w-[245px] sm:max-w-[275px] bg-[#0C0E14]/95 backdrop-blur-md border border-[#2D3139]/90 rounded-sm p-3 font-mono text-[9px] sm:text-[10px] space-y-2 pointer-events-auto shadow-xl">
                        <div className="flex items-center justify-between border-b border-[#2D3139]/50 pb-1.5 gap-2">
                          <span className="font-bold tracking-wider text-slate-400">SENSORY RISK MATRIX</span>
                          <span className={`text-[8.5px] px-1.5 py-0.2 rounded-sm uppercase tracking-widest font-black ${badgeColor}`}>
                            {statusLabel}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] text-[#6A7180] tracking-wider">
                            <span>ATOM DENSITY CALCULATOR:</span>
                            <span className="text-white font-bold font-mono">{(intensityValue * 10).toFixed(0)} PPM EQ</span>
                          </div>
                          <div className="h-1 bg-[#151822] rounded-full overflow-hidden">
                            <div className={`h-full ${barColor}`} style={{ width: `${Math.min(100, intensityValue * 3.5)}%` }} />
                          </div>
                        </div>

                        <p className="text-[9.5px] text-slate-300 leading-normal font-sans">
                          {description}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Floor Plan Preset Outlines */}
                  <div className="flex-1 w-full relative flex items-center justify-center p-6 overflow-hidden select-none">
                    
                    {/* STUDIO APARTMENT LAYOUT PRESET */}
                    {sillageFloorPlan === 'studio' && (
                      <div className="w-full h-full max-w-[500px] border-2 border-[#2D3139] relative rounded-sm bg-[#0E1118]/20 flex flex-col">
                        {/* Top row rooms */}
                        <div className="flex-1 flex border-b border-[#2D3139] border-dashed">
                          {/* Bedroom portion */}
                          <div className="flex-1 border-r border-[#2D3139] border-dashed p-3 relative">
                            <span className="absolute top-2 left-2 font-mono text-[8px] text-[#6A7180] tracking-wider uppercase">Living Room / Bed Zone</span>
                            {/* Sketch bed shape */}
                            <div className="absolute bottom-2 right-2 w-14 h-16 border border-[#2D3139]/60 rounded-sm bg-[#15181F]/30 flex flex-col justify-end p-1">
                              <div className="h-4 border-b border-[#2D3139]/60 w-full" />
                              <span className="text-[7.5px] font-mono text-[#6A7180] text-center mt-auto">BED</span>
                            </div>
                          </div>
                          {/* Ensuite Bathroom */}
                          <div className="w-[30%] p-3 relative">
                            <span className="absolute top-2 left-2 font-mono text-[8px] text-[#6A7180] tracking-wider uppercase">Bath</span>
                            <div className="absolute bottom-2 left-2 w-8 h-8 rounded-full border border-[#2D3139]/60 bg-[#15181F]/30 flex items-center justify-center">
                              <span className="text-[7px] font-mono text-[#6A7180]">SINK</span>
                            </div>
                          </div>
                        </div>
                        {/* Bottom kitchenette */}
                        <div className="h-[35%] p-3 relative">
                          <span className="absolute top-2 left-2 font-mono text-[8px] text-[#6A7180] tracking-wider uppercase">Kitchenette Entrance Bar</span>
                          <div className="absolute top-2 right-3 w-28 h-4 border border-[#2D3139]/60 bg-[#15181F]/30 flex items-center justify-center rounded-sm">
                            <span className="text-[7px] font-mono text-[#6A7180]">KITCHEN BAR COUNTER</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* OPEN OFFICE PRESET */}
                    {sillageFloorPlan === 'office' && (
                      <div className="w-full h-full max-w-[500px] border-2 border-[#2D3139] relative rounded-sm bg-[#0E1118]/20">
                        {/* conference room layout */}
                        <div className="absolute top-3 left-3 w-[45%] h-[40%] border border-[#2D3139] border-dashed p-2">
                          <span className="font-mono text-[8px] text-[#6A7180] tracking-wider uppercase block">Conference Rm A</span>
                          <div className="w-24 h-8 border border-[#2D3139]/60 rounded-sm bg-[#15181F]/30 mx-auto mt-2 flex items-center justify-center">
                            <span className="text-[7px] font-mono text-[#6A7180]">CENTER TABLE</span>
                          </div>
                        </div>
                        {/* Break room outline */}
                        <div className="absolute top-3 right-3 w-[45%] h-[35%] border border-[#2D3139] border-dashed p-2">
                          <span className="font-mono text-[8px] text-[#6A7180] tracking-wider uppercase block">Pantry / Coffee bar</span>
                        </div>
                        {/* Desk Cubicles row */}
                        <div className="absolute bottom-4 left-3 right-3 h-[45%] border border-[#2D3139] border-dashed p-2 flex gap-3">
                          <div className="flex-1 border border-[#2D3139]/40 rounded bg-[#15181F]/35 p-1 relative flex items-center justify-center">
                            <span className="text-[8px] font-mono text-[#6A7180]">DESK 01</span>
                          </div>
                          <div className="flex-1 border border-[#2D3139]/40 rounded bg-[#15181F]/35 p-1 relative flex items-center justify-center">
                            <span className="text-[8px] font-mono text-[#6A7180]">DESK 02</span>
                          </div>
                          <div className="flex-1 border border-[#2D3139]/40 rounded bg-[#15181F]/35 p-1 relative flex items-center justify-center">
                            <span className="text-[8px] font-mono text-[#3B82F6] font-bold">SOURCE CHAIR</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUV VEHICLE CABIN PRESET */}
                    {sillageFloorPlan === 'car' && (
                      <div className="w-[85%] h-full max-w-[280px] border-2 border-[#2D3139] rounded-3xl relative bg-[#0E1118]/20 p-4 font-mono">
                        <span className="absolute top-3 left-1/2 transform -translate-x-1/2 text-[8px] text-[#6A7180] tracking-wider uppercase text-center w-full">SUV Internal Cabin</span>
                        
                        {/* Front windshield line */}
                        <div className="w-full h-2 border-b-2 border-[#2D3139]/70 rounded-full mt-4" />

                        {/* Front seats row */}
                        <div className="flex justify-between mt-8 px-4">
                          {/* Driver seat */}
                          <div className="w-14 h-14 border border-[#2D3139]/80 rounded-t-xl bg-[#15181F]/40 flex flex-col items-center justify-center">
                            <span className="text-[7.5px] text-[#6A7180] uppercase">Driver</span>
                          </div>
                          {/* Passenger seat */}
                          <div className="w-14 h-14 border border-[#2D3139]/80 rounded-t-xl bg-[#15181F]/40 flex flex-col items-center justify-center">
                            <span className="text-[7.5px] text-[#6A7180] uppercase">Co-Pilot</span>
                          </div>
                        </div>

                        {/* Middle Console Console/Armrest */}
                        <div className="w-8 h-10 border border-[#2D3139]/60 bg-[#15181F]/60 rounded-md absolute top-[110px] left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                          <span className="text-[6.5px] text-slate-300">SPRAY</span>
                        </div>

                        {/* Back Seats row */}
                        <div className="flex justify-between mt-12 px-2">
                          <div className="w-full h-12 border border-[#2D3139]/80 rounded-xl bg-[#15181F]/30 flex items-center justify-center">
                            <span className="text-[8px] text-[#6A7180] uppercase">Rear Passenger Seat bench</span>
                          </div>
                        </div>

                        {/* Trunk space */}
                        <div className="mt-8 border-t border-[#2D3139]/60 pt-2 text-center text-[7px] text-[#6A7180]">
                          TRUNK STORAGE AREA
                        </div>
                      </div>
                    )}

                    {/* OUTDOOR COURTYARD CAFÉ PRESET */}
                    {sillageFloorPlan === 'patio' && (
                      <div className="w-full h-full max-w-[500px] border-2 border-[#2D3139] border-dashed relative rounded-full bg-[#0E1118]/10 flex items-center justify-center">
                        <span className="absolute top-4 font-mono text-[8px] text-[#6A7180] tracking-wider uppercase text-center w-full">Open-Air Café Courtyard</span>
                        
                        {/* Scattered tables layout */}
                        <div className="absolute top-[20%] left-[20%] w-10 h-10 rounded-full border border-dashed border-[#2D3139] flex items-center justify-center">
                          <span className="text-[6.5px] font-mono text-[#6A7180]">TABLE</span>
                        </div>
                        <div className="absolute top-[20%] right-[20%] w-10 h-10 rounded-full border border-dashed border-[#2D3139] flex items-center justify-center">
                          <span className="text-[6.5px] font-mono text-[#6A7180]">TABLE</span>
                        </div>
                        <div className="absolute bottom-[20%] left-[20%] w-10 h-10 rounded-full border border-dashed border-[#2D3139] flex items-center justify-center">
                          <span className="text-[6.5px] font-mono text-[#6A7180]">TABLE</span>
                        </div>
                        <div className="absolute bottom-[20%] right-[20%] w-10 h-10 rounded-full border border-dashed border-[#2D3139] flex items-center justify-center">
                          <span className="text-[6.5px] font-mono text-[#6A7180]">TABLE</span>
                        </div>

                        {/* Shrubs decoration circles */}
                        <div className="absolute top-1/2 left-3 w-4 h-4 rounded-full bg-emerald-900/20 border border-emerald-900/50" />
                        <div className="absolute top-1/2 right-3 w-4 h-4 rounded-full bg-emerald-900/20 border border-emerald-900/50" />
                      </div>
                    )}

                    {/* CENTRAL HEATMAP OVERLAY COMPONENT */}
                    {(() => {
                      const baseRadiusVec = getInterpolatedSillageRadius(selectedFragrance, sillageSimHour);
                      const sprayScale = sillageSprays === 1 ? 0.65 : sillageSprays === 6 ? 1.7 : 1.0;
                      const ventScale = sillageVentilation === 'none' ? 1.0 : sillageVentilation === 'low' ? 0.85 : 0.6;
                      const finalRadiusFt = Math.max(0.1, baseRadiusVec * sprayScale * ventScale);
                      
                      const visualDiameterPct = finalRadiusFt * 2 * 4.4;

                      let driftX = 0;
                      let driftY = 0;
                      let blurAdd = 14;
                      let skewHorizontal = 1.0;
                      let skewVertical = 1.0;
                      
                      if (sillageVentilation === 'low') {
                        driftX = 40;
                        driftY = -15;
                        blurAdd = 20;
                        skewHorizontal = 1.25;
                      } else if (sillageVentilation === 'high') {
                        driftX = 90;
                        driftY = -25;
                        blurAdd = 32;
                        skewHorizontal = 1.5;
                        skewVertical = 0.85;
                      }

                      let stopColor1 = "rgba(59, 130, 246, 0.75)";
                      let stopColor2 = "rgba(124, 58, 237, 0.35)";
                      let stopColor3 = "rgba(124, 58, 237, 0.0)";

                      const familyLower = selectedFragrance.olfactoryFamily?.toLowerCase() || '';
                      if (familyLower.includes('citrus') || familyLower.includes('fresh') || familyLower.includes('aromatic') || familyLower.includes('fougère')) {
                        stopColor1 = "rgba(16, 185, 129, 0.75)";
                        stopColor2 = "rgba(6, 182, 212, 0.4)";
                        stopColor3 = "rgba(6, 182, 212, 0)";
                      } else if (familyLower.includes('sweet') || familyLower.includes('gourmand') || familyLower.includes('vanilla') || familyLower.includes('spicy')) {
                        stopColor1 = "rgba(244, 63, 94, 0.75)";
                        stopColor2 = "rgba(245, 158, 11, 0.4)";
                        stopColor3 = "rgba(245, 158, 11, 0)";
                      } else if (familyLower.includes('wood') || familyLower.includes('amber') || familyLower.includes('oud') || familyLower.includes('leather')) {
                        stopColor1 = "rgba(217, 119, 6, 0.75)";
                        stopColor2 = "rgba(220, 38, 38, 0.35)";
                        stopColor3 = "rgba(220, 38, 38, 0)";
                      }

                      const finalYOffset = sillageFloorPlan === 'office' ? '65%' : '50%';

                      return (
                        <>
                          <div 
                            className="absolute z-35 w-3 h-3 bg-white rounded-full border-2 border-slate-900 shadow-md flex items-center justify-center transition-all duration-500"
                            style={{ 
                              left: '50%', 
                              top: finalYOffset,
                              transform: 'translate(-50%, -50%)'
                            }} 
                          >
                            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
                          </div>

                          <div
                            className="absolute rounded-full transition-all duration-500 transform pointer-events-none z-20"
                            style={{
                              left: '50%',
                              top: finalYOffset,
                              width: `${visualDiameterPct}%`,
                              height: `${visualDiameterPct}%`,
                              transform: `translate(-50%, -50%) translate(${driftX}px, ${driftY}px) scaleX(${skewHorizontal}) scaleY(${skewVertical})`,
                              background: `radial-gradient(circle, ${stopColor1} 0%, ${stopColor2} 35%, ${stopColor3} 70%)`,
                              filter: `blur(${blurAdd}px)`,
                              opacity: finalRadiusFt > 0.3 ? 0.9 : 0.35
                            }}
                          />

                          {finalRadiusFt > 1.0 && (
                            <div
                              className="absolute rounded-full transition-all duration-500 border border-dashed pointer-events-none z-10"
                              style={{
                                left: '50%',
                                top: finalYOffset,
                                width: `${visualDiameterPct}%`,
                                height: `${visualDiameterPct}%`,
                                transform: `translate(-50%, -50%) translate(${driftX}px, ${driftY}px) scaleX(${skewHorizontal}) scaleY(${skewVertical})`,
                                borderColor: stopColor1,
                                opacity: 0.25
                              }}
                            />
                          )}

                          {sillageVentilation !== 'none' && (
                            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                              <div className="flex flex-col gap-10 absolute left-4 top-14 opacity-25 font-mono text-[9px] text-[#3B82F6]">
                                <span className="animate-pulse">AC ACTIVE ➔</span>
                                <span className="animate-pulse" style={{ animationDelay: '150ms' }}>AIR CURRENT ➔</span>
                                <span className="animate-pulse" style={{ animationDelay: '300ms' }}>DISPERSION ➔</span>
                              </div>
                              <div className="absolute w-[2px] h-[2px] bg-sky-200 rounded-full left-[25%] top-[45%] animate-ping opacity-60" />
                              <div className="absolute w-[1.5px] h-[1.5px] bg-sky-200 rounded-full left-[60%] top-[30%] animate-ping opacity-60" style={{ animationDelay: '500ms' }} />
                              <div className="absolute w-[2px] h-[2px] bg-sky-200 rounded-full left-[75%] top-[65%] animate-ping opacity-60" style={{ animationDelay: '1s' }} />
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* Floor Plan Legend & stats footer */}
                  <div className="p-4 bg-[#12141C]/60 border-t border-[#2D3139]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono z-10">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block opacity-80" />
                        <span>High Density (Core)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span className="w-2.5 h-2.5 rounded bg-sky-500 inline-block opacity-50" />
                        <span>Medium scent trail</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span className="w-2.5 h-2.5 border border-dashed border-slate-500 bg-transparent inline-block rounded" />
                        <span>Threshold fence</span>
                      </div>
                    </div>

                    <div className="text-[#6A7180] text-[9px] sm:text-right">
                      Vapor Evaporation: <span className="text-white font-bold">{Math.max(0, 100 - (sillageSimHour * 9.5)).toFixed(0)}% Intensity</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* COMPREHENSIVE LABORATORY MOLECULAR LAYERING COMPATIBILITY PANEL */}
            <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6 relative overflow-hidden mt-8 shadow-xl" id="layering-compatibility-deck">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
                <Atom className="w-36 h-36 text-white/5 animate-pulse" />
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#2D3139] pb-4 mb-6 gap-4">
                <div>
                  <h3 className="font-display text-xs font-bold text-white tracking-widest flex items-center gap-2 uppercase">
                    <Atom className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
                    Molecular Layering Compatibility Deck & Solver
                  </h3>
                  <p className="text-[11px] text-[#6A7180] leading-relaxed mt-1">
                    Select any two specimens to evaluate aroma-chemical synergy, fixative-amplification, or headnote clashes.
                  </p>
                </div>
                
                <span className="font-mono text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-1 rounded font-bold uppercase tracking-wider self-start md:self-auto">
                  Aromachemical Lab Engine
                </span>
              </div>

              {/* Selector Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Fragrance A Selection */}
                <div className="md:col-span-5 space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#6A7180] font-bold">
                    Base Specimen A (Primary Scent)
                  </label>
                  {(() => {
                    const availableFragrances = [
                      ...PREDEFINED_FRAGRANCES,
                      ...cabinet.filter(c => !PREDEFINED_FRAGRANCES.some(p => p.name === c.name && p.brand === c.brand))
                    ];
                    return (
                      <select
                        value={layeringSelectA}
                        onChange={(e) => setLayeringSelectA(e.target.value)}
                        className="w-full bg-[#0A0B0E] border border-[#2D3139] focus:border-purple-500 text-xs font-mono text-[#E0E2E6] rounded-sm px-3 py-2 outline-none transition-colors"
                      >
                        <option value="">-- Choose Specimen A --</option>
                        {availableFragrances.map((f, idx) => (
                          <option key={idx} value={`${f.brand} - ${f.name}`}>
                            {f.brand} - {f.name} ({f.concentration || 'EDP'})
                          </option>
                        ))}
                      </select>
                    );
                  })()}
                </div>

                {/* Connection Line */}
                <div className="md:col-span-2 flex justify-center text-center">
                  <span className="text-[#6A7180] font-mono text-xs font-bold animate-pulse">➔ ⚗️ ➔</span>
                </div>

                {/* Fragrance B Selection */}
                <div className="md:col-span-5 space-y-2">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#6A7180] font-bold">
                    Overlay Specimen B (Layering Canopy)
                  </label>
                  {(() => {
                    const availableFragrances = [
                      ...PREDEFINED_FRAGRANCES,
                      ...cabinet.filter(c => !PREDEFINED_FRAGRANCES.some(p => p.name === c.name && p.brand === c.brand))
                    ];
                    return (
                      <select
                        value={layeringSelectB}
                        onChange={(e) => setLayeringSelectB(e.target.value)}
                        className="w-full bg-[#0A0B0E] border border-[#2D3139] focus:border-purple-500 text-xs font-mono text-[#E0E2E6] rounded-sm px-3 py-2 outline-none transition-colors"
                      >
                        <option value="">-- Choose Specimen B --</option>
                        {availableFragrances.map((f, idx) => (
                          <option key={idx} value={`${f.brand} - ${f.name}`}>
                            {f.brand} - {f.name} ({f.concentration || 'EDP'})
                          </option>
                        ))}
                      </select>
                    );
                  })()}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  disabled={isAnalyzingLayering || !layeringSelectA || !layeringSelectB}
                  onClick={handleLayeringCompatibilityCheck}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 disabled:from-[#1A1624] disabled:to-[#1A1624] disabled:text-[#4A4753] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:cursor-not-allowed"
                >
                  {isAnalyzingLayering ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Analyzing Aroma Matrix...
                    </>
                  ) : (
                    <>
                      <Atom className="w-3.5 h-3.5" />
                      Compile Molecular Interaction
                    </>
                  )}
                </button>
              </div>

              {/* Error Boundary */}
              {layeringError && (
                <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-sm text-xs text-rose-400 font-mono">
                  ERROR: {layeringError}
                </div>
              )}

              {/* Results Showcase Block */}
              <AnimatePresence mode="wait">
                {layeringResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-[#2D3139] overflow-hidden"
                  >
                    {/* Header with Print Action */}
                    <div className="flex items-center justify-between mb-4 border-b border-[#2D3139]/40 pb-3 no-print">
                      <span className="font-mono text-[10px] text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        Formula Synergy Evaluation Generated
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePrintSection('layering')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/15 hover:bg-purple-600 text-purple-300 hover:text-white text-[10px] font-mono font-bold tracking-wider uppercase border border-purple-500/20 rounded-sm cursor-pointer transition-all shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Print Interaction Report
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left Block: Compatibility Ring and Base specs (4 cols) */}
                      <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#0A0B0E] border border-purple-500/15 rounded-sm relative text-center">
                        <div className="absolute top-0 right-0 p-2 opacity-5">
                          <Beaker className="w-24 h-24 text-purple-400" />
                        </div>
                        
                        <span className="font-mono text-[9px] text-[#6A7180] uppercase tracking-widest font-bold">SYNERGY COEFFICIENT</span>
                        
                        {/* Circle Gauge */}
                        <div className="relative w-32 h-32 my-4">
                          <svg className="w-full h-full -rotate-90">
                            <circle
                              cx="64"
                              cy="64"
                              r="48"
                              className="stroke-[#2D3139]/45 fill-none"
                              strokeWidth="6"
                            />
                            <circle
                              cx="64"
                              cy="64"
                              r="48"
                              className="fill-none"
                              stroke="#A855F7"
                              strokeWidth="6"
                              strokeDasharray={2 * Math.PI * 48}
                              strokeDashoffset={(2 * Math.PI * 48) - (layeringResult.compatibilityScore / 100) * (2 * Math.PI * 48)}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                            <span className="text-3xl font-black text-white">{layeringResult.compatibilityScore}%</span>
                            <span className="text-[8px] text-[#6A7180] uppercase">COMPATIBLE</span>
                          </div>
                        </div>

                        <span className="font-mono text-xs font-bold text-purple-300 uppercase tracking-wide bg-purple-950/30 px-3 py-1 rounded border border-purple-500/25">
                          {layeringResult.compatibilityLevel}
                        </span>
                      </div>

                      {/* Right Block: Dynamic Text Readouts (8 cols) */}
                      <div className="lg:col-span-8 space-y-4">
                        {/* Summary overview */}
                        <div className="p-4 bg-[#12141C] border border-[#2D3139]/60 rounded-sm">
                          <span className="font-mono text-[9px] text-purple-400 uppercase font-bold tracking-wider block mb-1">
                            Molecular Interaction Overview:
                          </span>
                          <p className="text-xs text-[#E0E2E6] leading-relaxed text-justify font-sans">
                            {layeringResult.molecularSummary}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Base-Fixative Amplification card */}
                          <div className="p-4 bg-[#0A0B0E] border border-[#2D3139]/60 hover:border-purple-500/25 rounded-sm transition-colors">
                            <span className="font-mono text-[9px] text-purple-400 uppercase font-bold tracking-wider block mb-1.5 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-purple-400" />
                              Base-Fixative Amplification
                            </span>
                            <p className="text-[11px] text-[#8C93A3] leading-relaxed text-justify">
                              {layeringResult.baseFixativeAmplification}
                            </p>
                          </div>

                          {/* Top Note Conflict card */}
                          <div className="p-4 bg-[#0A0B0E] border border-[#2D3139]/60 hover:border-amber-500/25 rounded-sm transition-colors">
                            <span className="font-mono text-[9px] text-amber-400 uppercase font-bold tracking-wider block mb-1.5 flex items-center gap-1.5">
                              <Wind className="w-3.5 h-3.5 text-amber-400" />
                              Top-Note Conflict
                            </span>
                            <p className="text-[11px] text-[#8C93A3] leading-relaxed text-justify">
                              {layeringResult.topNoteConflict}
                            </p>
                          </div>
                        </div>

                        {/* Order of Application Sequence Banner */}
                        <div className="p-4 bg-[#1C1613] border-l-2 border-amber-500 rounded-r-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
                            <span className="font-mono text-[9px] text-amber-500 uppercase font-bold tracking-wider">
                              Optimal Spray Sequence:
                            </span>
                          </div>
                          <p className="text-[11px] text-[#E0E2E6] font-sans leading-relaxed text-justify">
                            {layeringResult.applicationSequence}
                          </p>
                        </div>

                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        )}

          </>
        )}



      {/* Specimen Shelf / Personal Cabinet Tab */}
      {activeTab === 'cabinet' && (
        <div className="space-y-6 animate-fadeIn pb-12">
          {/* Header */}
          <div className="bg-[#15181F] border border-[#2D3139] p-6 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#3B82F6]" />
                Aromachemical Specimen Shelf & Cabinet
              </h2>
              <p className="text-xs text-[#6A7180] leading-relaxed max-w-xl">
                Catalogued reference benchmarks, custom DIY laboratory blends, and parsed formulas. Save custom configurations or select any spec to activate Dossier Analyser overlays.
              </p>
            </div>
            <div className="font-mono text-xs text-[#6A7180] max-w-[200px] bg-[#0A0B0E] p-3 border border-[#2D3139] rounded text-right shrink-0">
              <span className="text-[9px] select-none block uppercase">Persistent Database</span>
              <span className="text-[#3B82F6] font-bold text-sm block mt-0.5">{cabinet.length} Specimens</span>
              <span className="text-[8px] uppercase block">SAVED COMPLIANT SECURE</span>
            </div>
          </div>

          {/* Comparison Controller and Dock Bar */}
          {comparedSpecimens.length > 0 && (
            <div className="bg-[#10131A] border-2 border-[#3B82F6]/50 p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#3B82F6]/10 rounded-sm">
                  <Scale className="w-5 h-5 text-[#3B82F6] animate-pulse" />
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#3B82F6] block">Aromachemical Comparison Deck</span>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {comparedSpecimens.map((id, index) => {
                      const frag = cabinet.find(f => `${f.brand} - ${f.name}` === id);
                      return (
                        <div key={`comp-lbl-${index}`} className="flex items-center gap-1.5 bg-[#15181F] border border-[#2D3139] px-2.5 py-1 rounded">
                          <span className="text-[10px] font-mono font-semibold text-white truncate max-w-[120px]">
                            {frag?.name || id.split(' - ')[1]}
                          </span>
                          <button
                            onClick={() => {
                              setComparedSpecimens(comparedSpecimens.filter(x => x !== id));
                              // If removing drops below 2, close active comparison layout
                              if (comparedSpecimens.length <= 2) {
                                setIsComparingSpecimens(false);
                              }
                            }}
                            className="text-[#6A7180] hover:text-[#f43f5e] text-[9px] font-bold px-1 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                    {comparedSpecimens.length < 2 && (
                      <span className="text-[10.5px] text-[#6A7180] italic ml-1">
                        (Select 1 more specimen using the COMPARATION buttons on cards below)
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {comparedSpecimens.length === 2 && (
                  <button
                    onClick={() => setIsComparingSpecimens(!isComparingSpecimens)}
                    className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-[#0A0B0E] font-mono text-xs font-bold py-2 px-4 uppercase rounded-sm cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <Scale className="w-4 h-4" />
                    {isComparingSpecimens ? 'CLOSE COMPARISON' : 'COMPARE SIDE-BY-SIDE'}
                  </button>
                )}
                <button
                  onClick={() => {
                    setComparedSpecimens([]);
                    setIsComparingSpecimens(false);
                  }}
                  className="bg-transparent border border-[#2D3139] hover:border-[#6A7180]/40 text-[#6A7180] hover:text-white font-mono text-[11px] py-1.5 px-3 rounded-sm transition-colors"
                >
                  CLEAR
                </button>
              </div>
            </div>
          )}

          {/* Conditional Comparison Rendering */}
          {isComparingSpecimens && comparedSpecimens.length === 2 && (() => {
            const compFragA = cabinet.find(f => `${f.brand} - ${f.name}` === comparedSpecimens[0]);
            const compFragB = cabinet.find(f => `${f.brand} - ${f.name}` === comparedSpecimens[1]);
            
            if (!compFragA || !compFragB) return null;

            return (
              <div className="space-y-6 animate-fadeIn pb-12">
                {/* Comparison Header Information */}
                <div className="bg-[#15181F] border border-[#2D3139] p-6 rounded-sm flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-mono uppercase tracking-wider text-[#3B82F6] flex items-center gap-2">
                      <Scale className="w-4 h-4" /> Real-time GC-MS Scent Comparison
                    </h3>
                    <p className="text-xl font-display font-bold text-white mt-1">
                      {compFragA.name} <span className="text-[#6A7180] font-light">vs</span> {compFragB.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsComparingSpecimens(false)}
                    className="bg-[#2D3139] hover:bg-[#2D3139]/80 border border-[#2D3139] text-xs font-mono text-white px-4 py-2 uppercase tracking-wider rounded-sm cursor-pointer transition-colors"
                  >
                    ← Return to Shelf
                  </button>
                </div>

                {/* Identity & Basic Technical Info Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Specimen A info card */}
                  <div className="bg-[#12141C] border-l-4 border-[#3B82F6] border-y border-r border-[#2D3139] p-5 rounded-r-sm space-y-4">
                    <div>
                      <span className="font-mono text-[9px] uppercase text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded tracking-widest font-normal">SPECIMEN ALPHA [A]</span>
                      <h4 className="text-2xl font-display text-white font-bold tracking-tight mt-2">{compFragA.name}</h4>
                      <p className="text-xs font-mono text-[#6A7180] uppercase mt-0.5">By {compFragA.brand} • {compFragA.concentration}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono text-[#6A7180] border-t border-[#2D3139]/50 font-sans">
                      <div>
                        <span className="text-[9px] font-mono block uppercase">Olfactory Family</span>
                        <strong className="text-white mt-0.5 block">{compFragA.olfactoryFamily}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono block uppercase">Nose / Perfumer</span>
                        <strong className="text-white mt-0.5 block truncate" title={compFragA.nose}>{compFragA.nose}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono block uppercase">Release Year</span>
                        <strong className="text-white mt-0.5 block">{compFragA.releaseYear}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono block uppercase">Batch Lineage</span>
                        <strong className="text-white mt-0.5 block truncate" title={compFragA.batchLineage}>{compFragA.batchLineage}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Specimen B info card */}
                  <div className="bg-[#101311] border-l-4 border-[#10B981] border-y border-r border-[#2D3139] p-5 rounded-r-sm space-y-4">
                    <div>
                      <span className="font-mono text-[9px] uppercase text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded tracking-widest font-normal">SPECIMEN BETA [B]</span>
                      <h4 className="text-2xl font-display text-white font-bold tracking-tight mt-2">{compFragB.name}</h4>
                      <p className="text-xs font-mono text-[#6A7180] uppercase mt-0.5">By {compFragB.brand} • {compFragB.concentration}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono text-[#6A7180] border-t border-[#2D3139]/50 font-sans">
                      <div>
                        <span className="text-[9px] font-mono block uppercase">Olfactory Family</span>
                        <strong className="text-white mt-0.5 block">{compFragB.olfactoryFamily}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono block uppercase">Nose / Perfumer</span>
                        <strong className="text-white mt-0.5 block truncate" title={compFragB.nose}>{compFragB.nose}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono block uppercase">Release Year</span>
                        <strong className="text-white mt-0.5 block">{compFragB.releaseYear}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono block uppercase">Batch Lineage</span>
                        <strong className="text-white mt-0.5 block truncate" title={compFragB.batchLineage}>{compFragB.batchLineage}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparative Scent Metrics Panel */}
                <div className="bg-[#15181F] border border-[#2D3139] p-6 rounded-sm space-y-6">
                  <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider pb-3 border-b border-[#2D3139] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#3B82F6]" /> Active Longevity & Performance Contrast
                  </h4>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Progress comparisons */}
                    <div className="space-y-5">
                      {/* Skin Longevity */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-[#6A7180] uppercase">Skin Longevity Index</span>
                          <div className="flex gap-4 text-[11px]">
                            <span className="text-[#3B82F6] font-bold">[A] {compFragA.skinLongevityIndex} Hours</span>
                            <span className="text-[#10B981] font-bold">[B] {compFragB.skinLongevityIndex} Hours</span>
                          </div>
                        </div>
                        <div className="h-2 bg-[#0A0B0E] rounded overflow-hidden relative">
                          <div 
                            style={{ width: `${(compFragA.skinLongevityIndex / 16) * 100}%` }} 
                            className="bg-[#3B82F6] h-full absolute top-0 left-0 transition-all opacity-85" 
                          />
                          <div 
                            style={{ width: `${(compFragB.skinLongevityIndex / 16) * 100}%` }} 
                            className="bg-[#10B981] h-1.5 absolute bottom-0 left-0 transition-all opacity-85" 
                          />
                        </div>
                      </div>

                      {/* Fabric Permanence */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-[#6A7180] uppercase">Fabric Permanence Curve</span>
                          <div className="flex gap-4 text-[11px]">
                            <span className="text-[#3B82F6] font-bold">[A] {compFragA.fabricPermanenceIndex} Hours</span>
                            <span className="text-[#10B981] font-bold">[B] {compFragB.fabricPermanenceIndex} Hours</span>
                          </div>
                        </div>
                        <div className="h-2 bg-[#0A0B0E] rounded overflow-hidden relative">
                          <div 
                            style={{ width: `${(compFragA.fabricPermanenceIndex / 48) * 100}%` }} 
                            className="bg-[#3B82F6] h-full absolute top-0 left-0 transition-all opacity-85" 
                          />
                          <div 
                            style={{ width: `${(compFragB.fabricPermanenceIndex / 48) * 100}%` }} 
                            className="bg-[#10B981] h-1.5 absolute bottom-0 left-0 transition-all opacity-85" 
                          />
                        </div>
                      </div>

                      {/* Sillage Broadcast Max */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-[#6A7180] uppercase">Peak Sillage Radius</span>
                          <div className="flex gap-4 text-[11px]">
                            <span className="text-[#3B82F6] font-bold">[A] {compFragA.sillageProjectionRadiusCurve[0]?.radiusFeet || 0} feet</span>
                            <span className="text-[#10B981] font-bold">[B] {compFragB.sillageProjectionRadiusCurve[0]?.radiusFeet || 0} feet</span>
                          </div>
                        </div>
                        <div className="h-2 bg-[#0A0B0E] rounded overflow-hidden relative">
                          <div 
                            style={{ width: `${((compFragA.sillageProjectionRadiusCurve[0]?.radiusFeet || 0) / 12) * 100}%` }} 
                            className="bg-[#3B82F6] h-full absolute top-0 left-0 transition-all opacity-85" 
                          />
                          <div 
                            style={{ width: `${((compFragB.sillageProjectionRadiusCurve[0]?.radiusFeet || 0) / 12) * 100}%` }} 
                            className="bg-[#10B981] h-1.5 absolute bottom-0 left-0 transition-all opacity-85" 
                          />
                        </div>
                      </div>

                      {/* Olfactory Fatigue Risk */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-[#6A7180] uppercase">Wearer Anosmia Fatigue Risk</span>
                          <div className="flex gap-4 text-[11px]">
                            <span className="text-[#3B82F6] font-bold">[A] {compFragA.olfactoryFatigueRisk}% risk</span>
                            <span className="text-[#10B981] font-bold">[B] {compFragB.olfactoryFatigueRisk}% risk</span>
                          </div>
                        </div>
                        <div className="h-2 bg-[#0A0B0E] rounded overflow-hidden relative">
                          <div 
                            style={{ width: `${compFragA.olfactoryFatigueRisk}%` }} 
                            className="bg-[#3B82F6] h-full absolute top-0 left-0 transition-all opacity-85" 
                          />
                          <div 
                            style={{ width: `${compFragB.olfactoryFatigueRisk}%` }} 
                            className="bg-[#10B981] h-1.5 absolute bottom-0 left-0 transition-all opacity-85" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sillage Curve Comparison Multi-Line Chart */}
                    {(() => {
                      const maxHrs = 10;
                      const chartData = [];
                      let areaA = 0;
                      let areaB = 0;
                      let maxDelta = 0;
                      let maxDeltaHour = 0;
                      let deltaDominant: 'A' | 'B' | 'none' = 'none';
                      let crossoverHour = -1;

                      for (let h = 0; h <= maxHrs; h++) {
                        const rA = getInterpolatedSillageRadius(compFragA, h);
                        const rB = getInterpolatedSillageRadius(compFragB, h);
                        chartData.push({
                          hour: h,
                          sillageA: Number(rA.toFixed(2)),
                          sillageB: Number(rB.toFixed(2)),
                          divergence: Number(Math.abs(rA - rB).toFixed(2))
                        });

                        areaA += rA;
                        areaB += rB;

                        const diff = Math.abs(rA - rB);
                        if (diff > maxDelta) {
                          maxDelta = diff;
                          maxDeltaHour = h;
                          deltaDominant = rA > rB ? 'A' : 'B';
                        }
                      }

                      // Find crossover points
                      let prevSign = 0;
                      for (let h = 0; h <= maxHrs; h++) {
                        const rA = getInterpolatedSillageRadius(compFragA, h);
                        const rB = getInterpolatedSillageRadius(compFragB, h);
                        const currentSign = Math.sign(rA - rB);
                        if (h > 0 && prevSign !== 0 && currentSign !== 0 && prevSign !== currentSign) {
                          crossoverHour = h;
                        }
                        if (currentSign !== 0) {
                          prevSign = currentSign;
                        }
                      }

                      const dominantName = areaA > areaB ? compFragA.name : compFragB.name;
                      const sumA = areaA.toFixed(1);
                      const sumB = areaB.toFixed(1);

                      return (
                        <div className="space-y-3 bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-2 border-b border-[#2D3139]/40">
                            <div>
                              <span className="text-[10px] font-mono text-[#6A7180] uppercase tracking-wide block">
                                Sillage Projection Radius Overlay Chart
                              </span>
                              <span className="text-[9px] font-mono text-[#3B82F6]">
                                10-Hour Comparative Multi-Line Spatial Diffusion Density Model (Divergence Highlighted)
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 font-mono text-[9px]">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 bg-[#3B82F6] rounded-sm" /> [A] {compFragA.name}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 bg-[#10B981] rounded-sm" /> [B] {compFragB.name}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-0.5 bg-[#F59E0B] border-t border-dashed border-[#F59E0B]" /> Divergence (Δ)
                              </span>
                            </div>
                          </div>

                          <div className="h-52 pr-2 relative mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <XAxis 
                                  dataKey="hour" 
                                  stroke="#475569" 
                                  fontFamily="monospace" 
                                  fontSize={9} 
                                  tickFormatter={(v) => `H${v}`} 
                                />
                                <YAxis 
                                  stroke="#475569" 
                                  fontFamily="monospace" 
                                  fontSize={9} 
                                  domain={[0, 10]} 
                                  tickFormatter={(v) => `${v}ft`} 
                                />
                                <RechartsTooltip 
                                  contentStyle={{ backgroundColor: '#15181F', borderColor: '#2D3139', borderRadius: '4px' }} 
                                  labelStyle={{ fontFamily: 'monospace', fontSize: '10px', color: '#3B82F6' }} 
                                  itemStyle={{ fontFamily: 'monospace', fontSize: '10px' }}
                                  formatter={(value: any, name: string) => {
                                    if (name === 'sillageA') return [`${value} ft radius`, `[A] ${compFragA.name}`];
                                    if (name === 'sillageB') return [`${value} ft radius`, `[B] ${compFragB.name}`];
                                    if (name === 'divergence') return [`${value} ft`, `Divergence (Δ)`];
                                    return [value, name];
                                  }}
                                  labelFormatter={(label) => `Timeline Elapsed Time: Hour ${label}`}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="sillageA" 
                                  name="sillageA" 
                                  stroke="#3B82F6" 
                                  strokeWidth={2.5} 
                                  dot={{ r: 3 }}
                                  activeDot={{ r: 5 }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="sillageB" 
                                  name="sillageB" 
                                  stroke="#10B981" 
                                  strokeWidth={2.5} 
                                  dot={{ r: 3 }}
                                  activeDot={{ r: 5 }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="divergence" 
                                  name="divergence" 
                                  stroke="#F59E0B" 
                                  strokeWidth={1.5} 
                                  strokeDasharray="4 4" 
                                  dot={{ r: 2 }}
                                  activeDot={{ r: 4 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#2D3139]/30 font-mono text-[10px]">
                            {/* Cumulative Volume */}
                            <div className="bg-[#15181F] p-2.5 rounded-sm border border-[#2D3139]/30 space-y-1">
                              <span className="text-[#6A7180] text-[9px] uppercase tracking-wider block">Cumulative Sillage Mass</span>
                              <div className="flex justify-between items-baseline">
                                <span className="text-[#3B82F6] font-bold">[A]: {sumA} ft·h</span>
                                <span className="text-[#10B981] font-bold">[B]: {sumB} ft·h</span>
                              </div>
                              <p className="text-[9px] text-[#A6B2C6] leading-tight mt-1 pt-1 border-t border-[#2D3139]/40">
                                Total integrated spatial volume. <strong className="text-white">{dominantName}</strong> yields {(Math.abs(areaA - areaB)).toFixed(1)} ft·h more cumulative vapor impact.
                              </p>
                            </div>

                            {/* Max Projection Gap */}
                            <div className="bg-[#15181F] p-2.5 rounded-sm border border-[#2D3139]/30 space-y-1">
                              <span className="text-[#6A7180] text-[9px] uppercase tracking-wider block">Peak Radial Divergence</span>
                              <div className="flex justify-between items-baseline">
                                <span className="text-white font-bold">{maxDelta.toFixed(1)} ft</span>
                                <span className="text-[#6A7180] text-[9px]">at Hour {maxDeltaHour}</span>
                              </div>
                              <p className="text-[9px] text-[#A6B2C6] leading-tight mt-1 pt-1 border-t border-[#2D3139]/40">
                                Maximum spread divergence. <strong className="text-white">{deltaDominant === 'A' ? compFragA.name : compFragB.name}</strong> pushes further outward at this exact interval.
                              </p>
                            </div>

                            {/* Crossover Node */}
                            <div className="bg-[#15181F] p-2.5 rounded-sm border border-[#2D3139]/30 space-y-1">
                              <span className="text-[#6A7180] text-[9px] uppercase tracking-wider block">Evolution Crossover Point</span>
                              <div className="font-bold text-white uppercase">
                                {crossoverHour !== -1 ? `At Hour ${crossoverHour}.0` : "Linear Sillage Parallel"}
                              </div>
                              <p className="text-[9px] text-[#A6B2C6] leading-tight mt-1 pt-1 border-t border-[#2D3139]/40">
                                {crossoverHour !== -1 
                                  ? "Vapor lines cross. The initially quieter fragrance gains late-stage sillage superiority."
                                  : "The projection lines remain parallel, preserving initial dominance curves throughout."
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Molecular Raw Formula Ingredients Comparison */}
                <div className="bg-[#15181F] border border-[#2D3139] p-6 rounded-sm space-y-6">
                  <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider pb-3 border-b border-[#2D3139] flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-[#10B981]" /> Molecular Raw Formula & Isolate Composition
                  </h4>

                  {/* Natural Ratio & Iso E details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                    <div className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm space-y-3">
                      <span className="text-[10.5px] font-mono text-[#6A7180] uppercase tracking-wide block">Natural vs Synthetic Molecular Weight Ratio</span>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Specimen A */}
                        <div className="space-y-1 font-mono text-xs">
                          <span className="text-white font-semibold">{compFragA.name}</span>
                          <div className="flex h-4 rounded overflow-hidden">
                            <div style={{ width: `${compFragA.naturalToSyntheticRatio.natural}%` }} className="bg-[#10B981] h-full" title="Natural" />
                            <div style={{ width: `${compFragA.naturalToSyntheticRatio.synthetic}%` }} className="bg-[#3B82F6] h-full" title="Synthetic" />
                          </div>
                          <div className="flex justify-between text-[10px] text-[#6A7180] mt-1">
                            <span>Nat: {compFragA.naturalToSyntheticRatio.natural}%</span>
                            <span>Syn: {compFragA.naturalToSyntheticRatio.synthetic}%</span>
                          </div>
                        </div>
                        {/* Specimen B */}
                        <div className="space-y-1 font-mono text-xs">
                          <span className="text-white font-semibold">{compFragB.name}</span>
                          <div className="flex h-4 rounded overflow-hidden">
                            <div style={{ width: `${compFragB.naturalToSyntheticRatio.natural}%` }} className="bg-[#10B981] h-full" title="Natural" />
                            <div style={{ width: `${compFragB.naturalToSyntheticRatio.synthetic}%` }} className="bg-[#3B82F6] h-full" title="Synthetic" />
                          </div>
                          <div className="flex justify-between text-[10px] text-[#6A7180] mt-1">
                            <span>Nat: {compFragB.naturalToSyntheticRatio.natural}%</span>
                            <span>Syn: {compFragB.naturalToSyntheticRatio.synthetic}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm flex flex-col justify-between">
                      <div>
                        <span className="text-[10.5px] font-mono text-[#6A7180] uppercase tracking-wide block">Shared Aromachemical Isolates Found</span>
                        <p className="text-[11.5px] text-[#E0E2E6] leading-relaxed mt-1">
                          {(() => {
                            const namesA = compFragA.aromaChemicalMatrix.map(i => i.name.toLowerCase());
                            const namesB = compFragB.aromaChemicalMatrix.map(i => i.name.toLowerCase());
                            const shared = compFragA.aromaChemicalMatrix.filter(i => namesB.includes(i.name.toLowerCase()));
                            if (shared.length === 0) return "No shared chemical isolates mapped in current GC-MS readings.";
                            return `Detected ${shared.length} shared chemical backbone(s): ${shared.map(s => s.name).join(', ')}`;
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AUTOMATED CHEMICAL CLASH DETECTOR */}
                  {(() => {
                    const getIsolateClashes = (fragA: FragranceData, fragB: FragranceData) => {
                      const clashes: Array<{
                        name: string;
                        percA: number;
                        percB: number;
                        combined: number;
                        severity: 'critical' | 'moderate';
                        riskBrief: string;
                        scientificMechanism: string;
                      }> = [];

                      const isolatesA = fragA.aromaChemicalMatrix || [];
                      const isolatesB = fragB.aromaChemicalMatrix || [];

                      isolatesA.forEach(isoA => {
                        const isoB = isolatesB.find(i => i.name.toLowerCase() === isoA.name.toLowerCase());
                        if (isoB) {
                          const combined = isoA.percentage + isoB.percentage;
                          const lowerName = isoA.name.toLowerCase();
                          let severity: 'critical' | 'moderate' | 'none' = 'none';
                          let riskBrief = "";
                          let scientificMechanism = "";

                          if (lowerName.includes('ambroxan') || lowerName.includes('ambrox')) {
                            if (combined >= 20) {
                              severity = 'critical';
                              riskBrief = "Extreme Anosmia / Target Nasal Blindness";
                              scientificMechanism = "High-concentration cyclic wood ethers like Ambroxan act as strong agonists for receptors like OR51D1. Merging these at >20% triggers rapid neural filtering (habituation), blinding the user to the sillage field within 10-15 minutes of convergence.";
                            } else if (combined >= 10) {
                              severity = 'moderate';
                              riskBrief = "Substantial Olfactory Saturation";
                              scientificMechanism = "Steady radiant diffusion of heavy ambergris crystals blankets adjacent scent receptors, causing accelerated fatigue of light fruity or aromatic notes.";
                            }
                          } else if (lowerName.includes('iso e super') || lowerName.includes('sylvamber') || lowerName.includes('orbitone')) {
                            if (combined >= 30) {
                              severity = 'critical';
                              riskBrief = "Plush Velvet Sensory Numbing Area";
                              scientificMechanism = "Iso E Super is a large, bulky tactile isomer. At >30%, it physically crowds the olfactory epithelium, decreasing sensory response to adjacent top-note esters via competitive binding.";
                            } else if (combined >= 15) {
                              severity = 'moderate';
                              riskBrief = "Moderate Backstage Masking Warning";
                              scientificMechanism = "Creates a thick, linear, woody background shelf that dampens the top-note sparkle of citrus or green herbal accents.";
                            }
                          } else if (lowerName.includes('maltol') || lowerName.includes('vaneecar') || lowerName.includes('furaneol')) {
                            if (combined >= 15) {
                              severity = 'critical';
                              riskBrief = "Excessive Sucrose Exhaustion & Trigeminal Irritation";
                              scientificMechanism = "Ethyl Maltol possesses an exceptionally low sensory threshold. Merging sweet-gourmand profiles above 15% oversaturates sweet receptors and triggers trigeminal nerve distress, causing nose fatigue and room-stifling sweet thickness.";
                            } else if (combined >= 7) {
                              severity = 'moderate';
                              riskBrief = "Coarse Gourmand Congestion";
                              scientificMechanism = "The extreme molecular viscosity of sweet pyrones suppresses neighboring fresh-air aldehyde dynamics, causing a sticky skin projection.";
                            }
                          } else if (lowerName.includes('myrcenol') || lowerName.includes('dihydromyrcenol')) {
                            if (combined >= 12) {
                              severity = 'critical';
                              riskBrief = "Soapy Clean-Burn Receptor Overdrive";
                              scientificMechanism = "At >12%, dihydromyrcenol over-stimulates clean/metallic receptors, translating to the brain as household cleaner or chemical solvent, fatiguing receptors for lighter musky notes.";
                            } else if (combined >= 6) {
                              severity = 'moderate';
                              riskBrief = "Laundry Accord Interference";
                              scientificMechanism = "Overwhelms secondary floral-fresh compounds, limiting the three-dimensional dispersion of heart floral notes.";
                            }
                          } else if (lowerName.includes('hedione')) {
                            if (combined >= 30) {
                              severity = 'critical';
                              riskBrief = "Dilution Air-Blast Volatility";
                              scientificMechanism = "While Hedione acts as an outstanding spatial projection carrier, at a combined concentration >30% it causes immediate wind-tunnel dilution, stripping the heart elements quickly and causing fast receptor burnout.";
                            } else if (combined >= 16) {
                              severity = 'moderate';
                              riskBrief = "Hyper-Projection Exhaustion";
                              scientificMechanism = "Unloads standard volatile heart chemicals in a rapid surge, severely capping longevity while masking delicate drydown wood details.";
                            }
                          } else if (lowerName.includes('galaxolide') || lowerName.includes('habanolide') || lowerName.includes('musk')) {
                            if (combined >= 16) {
                              severity = 'critical';
                              riskBrief = "Congenital / Temporary Macrolide Anosmia";
                              scientificMechanism = "Heavy multi-ring synthetic musks easily saturate sensory channels, triggering rapid target saturation. When combined >16%, the nervous system mutes background clean-laundry nodes almost instantly.";
                            } else if (combined >= 8) {
                              severity = 'moderate';
                              riskBrief = "Viscous Hydrophobic Vapor Lock";
                              scientificMechanism = "Acts as a thick fixative ceiling. Traps smaller citrus molecules in a hydrophobic layer on the skin, causing reduced projection levels.";
                            }
                          } else {
                            if (combined >= 20) {
                              severity = 'critical';
                              riskBrief = "Aromachemical Saturation Threat";
                              scientificMechanism = "Overlapped chemical isolate volumes exceed single-cell receptor threshold ceilings, provoking fast-onset sensory adaptation.";
                            } else if (combined >= 10) {
                              severity = 'moderate';
                              riskBrief = "Elevated Scent Density Target";
                              scientificMechanism = "Doubles the concentration of homologous compound backbones competing for matching human sensory nodes.";
                            }
                          }

                          if (severity !== 'none') {
                            clashes.push({
                              name: isoA.name,
                              percA: isoA.percentage,
                              percB: isoB.percentage,
                              combined: Number(combined.toFixed(1)),
                              severity,
                              riskBrief,
                              scientificMechanism
                            });
                          }
                        }
                      });

                      // Cross-isomer checks
                      const highAmbroA = isolatesA.some(i => (i.name.toLowerCase().includes('ambroxan') || i.name.toLowerCase().includes('ambrox')) && i.percentage >= 10);
                      const highAmbroB = isolatesB.some(i => (i.name.toLowerCase().includes('ambroxan') || i.name.toLowerCase().includes('ambrox')) && i.percentage >= 10);
                      const highMaltolA_cross = isolatesA.some(i => i.name.toLowerCase().includes('maltol') && i.percentage >= 8);
                      const highMaltolB_cross = isolatesB.some(i => i.name.toLowerCase().includes('maltol') && i.percentage >= 8);

                      if ((highAmbroA && highMaltolB_cross) || (highAmbroB && highMaltolA_cross)) {
                        clashes.push({
                          name: "Synergistic Ambroxan/Maltol Merge",
                          percA: highAmbroA ? (isolatesA.find(i => i.name.toLowerCase().includes('ambroxan'))?.percentage || 0) : (isolatesA.find(i => i.name.toLowerCase().includes('maltol'))?.percentage || 0),
                          percB: highAmbroB ? (isolatesB.find(i => i.name.toLowerCase().includes('ambroxan'))?.percentage || 0) : (isolatesB.find(i => i.name.toLowerCase().includes('maltol'))?.percentage || 0),
                          combined: Number(((highAmbroA ? (isolatesA.find(i => i.name.toLowerCase().includes('ambroxan'))?.percentage || 0) : (isolatesA.find(i => i.name.toLowerCase().includes('maltol'))?.percentage || 0)) + (highAmbroB ? (isolatesB.find(i => i.name.toLowerCase().includes('ambroxan'))?.percentage || 0) : (isolatesB.find(i => i.name.toLowerCase().includes('maltol'))?.percentage || 0))).toFixed(1)),
                          severity: 'critical',
                          riskBrief: "Synergistic Sweetness/Radiance Receptor Blockade",
                          scientificMechanism: "Merging highly radiant cyclic wood ethers (Ambroxan) with dense caramel pyrones (Ethyl Maltol) creates a powerful molecular paradox. This mimics the extreme anosmic saturation profile of high-volume woody-sweet sillage, triggering rapid sensory filtration (anosmia) for the wearer while preserving a thick, dense cloud for others."
                        });
                      }

                      return clashes;
                    };

                    const clashes = getIsolateClashes(compFragA, compFragB);

                    return (
                      <div className="bg-[#1A1113] border border-rose-950/45 p-5 rounded-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-rose-950/40 pb-3">
                          <h5 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                            Molecular Clash & Anosmia Risk Warning System
                          </h5>
                          <span className="font-mono text-[9px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20 uppercase font-semibold">
                            Receptor Saturation Analysis: {clashes.length > 0 ? `${clashes.length} Active Conflict(s)` : 'Optimal Synergy'}
                          </span>
                        </div>

                        {clashes.length === 0 ? (
                          <div className="flex items-start gap-3 p-3.5 bg-emerald-950/20 border border-emerald-900/35 rounded-sm">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-xs font-mono font-bold text-white block uppercase">SAFE COEXISTENCE PROTOCOL DETECTED</span>
                              <p className="text-[11px] text-[#A6B2C6] leading-relaxed mt-1">
                                No clashing chemical backbones exceed safe saturation bounds. Overlapping isolates are balanced below our fatigue safety ceiling, allowing the dual sillage columns to diffuse side-by-side with clear, layered transitions.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-[11.5px] text-[#A6B2C6] leading-relaxed">
                              Merging these formulas unloads extreme homologous concentrations of identical chemical isolates. Receptors will be severely overcrowded, inducing rapid olfactory adaptation (wearer fatigue/anosmia). Consider layering with offset spray zones to mitigate sensory saturation:
                            </p>

                            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                              {clashes.map((clash, clashIdx) => (
                                <div key={`clash-${clashIdx}`} className="bg-[#0A0B0E] border border-rose-950/30 p-4 rounded-sm space-y-2">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 font-mono text-xs">
                                    <div className="flex items-center gap-2">
                                      <AlertTriangle className={`w-3.5 h-3.5 ${clash.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
                                      <span className="text-white font-bold">{clash.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[#6A7180]">Combined concentration:</span>
                                      <span className={`font-bold ${clash.severity === 'critical' ? 'text-red-400' : 'text-amber-400'}`}>
                                        {clash.combined}%
                                      </span>
                                      <span className="text-[9px] text-[#6A7180]">
                                        ([A]: {clash.percA}% + [B]: {clash.percB}%)
                                      </span>
                                    </div>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-rose-400 block">
                                      Risk Profile: {clash.riskBrief}
                                    </span>
                                    <p className="text-[11px] text-slate-300 text-justify leading-relaxed">
                                      {clash.scientificMechanism}
                                    </p>
                                  </div>

                                  <div className="pt-1 select-none">
                                    <div className="flex justify-between text-[8px] text-[#6A7180] font-mono uppercase mb-1">
                                      <span>Saturation Load</span>
                                      <span className={clash.severity === 'critical' ? 'text-red-400 font-bold' : 'text-amber-400 font-bold'}>
                                        {clash.severity === 'critical' ? 'CRITICAL SATURATION' : 'HIGH SATURATION'}
                                      </span>
                                    </div>
                                    <div className="w-full bg-[#1A1A24] h-1.5 rounded-sm overflow-hidden">
                                      <div 
                                        className={`h-full rounded-sm ${clash.severity === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`} 
                                        style={{ width: `${Math.min(100, (clash.combined / (clash.severity === 'critical' ? 40 : 20)) * 100)}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* FORMULA DIFF VISUALIZATION */}
                  {(() => {
                    const isolatesA = compFragA.aromaChemicalMatrix || [];
                    const isolatesB = compFragB.aromaChemicalMatrix || [];
                    
                    const allChemicalNames = Array.from(new Set([
                      ...isolatesA.map(i => i.name),
                      ...isolatesB.map(i => i.name)
                    ]));

                    const diffs = allChemicalNames.map(name => {
                      const chemA = isolatesA.find(i => i.name.toLowerCase() === name.toLowerCase());
                      const chemB = isolatesB.find(i => i.name.toLowerCase() === name.toLowerCase());
                      const percentA = chemA ? chemA.percentage : 0;
                      const percentB = chemB ? chemB.percentage : 0;
                      const diffValue = Number((percentB - percentA).toFixed(2));
                      const absDiff = Math.abs(diffValue);
                      const primaryCategory = chemA?.category || chemB?.category || 'Others';
                      const desc = chemA?.description || chemB?.description || '';

                      return {
                        name,
                        percentA,
                        percentB,
                        diffValue,
                        absDiff,
                        category: primaryCategory,
                        description: desc,
                      };
                    }).sort((x, y) => y.absDiff - x.absDiff);

                    const totalVariance = diffs.reduce((acc, curr) => acc + curr.absDiff, 0);
                    const avgVariance = diffs.length > 0 ? Number((totalVariance / diffs.length).toFixed(1)) : 0;
                    const exclusiveToA = diffs.filter(d => d.percentA > 0 && d.percentB === 0).length;
                    const exclusiveToB = diffs.filter(d => d.percentB > 0 && d.percentA === 0).length;
                    
                    return (
                      <div className="bg-[#0A0B0E] border border-[#2D3139]/80 rounded-sm p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2D3139]/30 pb-3 gap-3">
                          <div className="text-left">
                            <h5 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                              <Layers className="w-4 h-4 text-[#3B82F6]" />
                              ACTIVE SPECTRUM FORMULA DIFF ANALYZER
                            </h5>
                            <p className="text-[10px] text-[#6A7180] font-sans mt-0.5">
                              Comparing specific HPLC aroma-chemical concentrations. Sorted by highest variance.
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-4 text-[10px] font-mono shrink-0">
                            <span className="flex items-center gap-1.5 font-bold text-[#3B82F6]">
                              <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6] flex items-center justify-center text-[7px] font-black">A</span>
                              {compFragA.name}
                            </span>
                            <span className="text-[#6A7180]">vs</span>
                            <span className="flex items-center gap-1.5 font-bold text-[#10B981]">
                              <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center text-[7px] font-black">B</span>
                              {compFragB.name}
                            </span>
                          </div>
                        </div>

                        {/* Metas bento-grid line summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#11131A] border border-[#2D3139]/40 p-3 rounded-sm font-mono text-[10px]">
                          <div className="text-left space-y-0.5">
                            <span className="text-[#6A7180] uppercase text-[8px] tracking-wider block">Avg Formula Divergence</span>
                            <span className="text-sm font-extrabold text-white">{avgVariance}%</span>
                          </div>
                          <div className="text-left space-y-0.5">
                            <span className="text-[#6A7180] uppercase text-[8px] tracking-wider block">Exclusive to Specimen A</span>
                            <span className="text-sm font-extrabold text-[#3B82F6]">{exclusiveToA} Isolates</span>
                          </div>
                          <div className="text-left space-y-0.5">
                            <span className="text-[#6A7180] uppercase text-[8px] tracking-wider block">Exclusive to Specimen B</span>
                            <span className="text-sm font-extrabold text-[#10B981]">{exclusiveToB} Isolates</span>
                          </div>
                          <div className="text-left space-y-0.5">
                            <span className="text-[#6A7180] uppercase text-[8px] tracking-wider block">Matched Shared Backbones</span>
                            <span className="text-sm font-extrabold text-amber-500">
                              {diffs.filter(d => d.percentA > 0 && d.percentB > 0).length} Overlaps
                            </span>
                          </div>
                        </div>

                        {/* Core Visual list representing the slider/gauge diff list */}
                        <div className="style-scroll space-y-2 max-h-[380px] overflow-y-auto pr-1">
                          {diffs.map((diff, idx) => {
                            const isABiased = diff.diffValue < 0;
                            const isBBiased = diff.diffValue > 0;
                            
                            const maxAbsDiffPossible = Math.max(...diffs.map(d => d.absDiff)) || 1;
                            const progressPercentage = Math.min(100, (diff.absDiff / maxAbsDiffPossible) * 100);

                            return (
                              <div key={`diff-${idx}`} className="bg-[#12141C] border border-[#2D3139]/60 hover:border-[#3B82F6]/30 p-3 rounded-sm space-y-2 transition-all">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 font-mono text-xs">
                                  <div className="text-left">
                                    <div className="flex items-center gap-2">
                                      <span className="text-white font-bold text-[11px] font-sans">{diff.name}</span>
                                      <span className="text-[8px] uppercase tracking-wider bg-[#1B2130] text-[#6A7180] px-1.5 py-0.2 rounded border border-[#2D3139]/40">
                                        {diff.category}
                                      </span>
                                    </div>
                                    {diff.description && (
                                      <p className="text-[9.5px] text-[#6A7180] mt-0.5 font-sans leading-normal line-clamp-1">{diff.description}</p>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3 shrink-0 text-[10px]">
                                    <div className="flex items-center gap-1">
                                      <span className="text-slate-400">A:</span>
                                      <span className="text-white font-bold">{diff.percentA}%</span>
                                    </div>
                                    <span className="text-[#2D3139]">|</span>
                                    <div className="flex items-center gap-1">
                                      <span className="text-slate-400">B:</span>
                                      <span className="text-white font-bold">{diff.percentB}%</span>
                                    </div>
                                    <span className="text-[#2D3139]">|</span>
                                    <div className="flex items-center gap-1.5 font-mono font-black">
                                      {diff.diffValue === 0 ? (
                                        <span className="text-[#6A7180] uppercase bg-[#181C26] px-2 py-0.5 rounded border border-[#2D3139]/50">Parity</span>
                                      ) : isABiased ? (
                                        <span className="text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded border border-[#3B82F6]/35">
                                          +[A] {diff.absDiff.toFixed(1)}%
                                        </span>
                                      ) : (
                                        <span className="text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/35">
                                          +[B] {diff.absDiff.toFixed(1)}%
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Bilateral Center-Anchored Shift Bar */}
                                <div className="flex items-center gap-2">
                                  <span className="text-[7.5px] font-mono text-[#6A7180] w-2.5">A</span>
                                  <div className="flex-1 bg-[#0A0B0E] h-2 rounded-sm relative overflow-hidden flex border border-[#2D3139]/40">
                                    {/* Left half container (Specimen A bias) - goes leftwards */}
                                    <div className="w-1/2 h-full flex justify-end bg-transparent relative border-r border-[#2D3139]/40">
                                      {isABiased && (
                                        <div 
                                          style={{ width: `${progressPercentage}%` }} 
                                          className="bg-[#3B82F6] h-full transition-all duration-300"
                                        />
                                      )}
                                    </div>
                                    {/* Right half container (Specimen B bias) - goes rightwards */}
                                    <div className="w-1/2 h-full flex justify-start bg-transparent relative">
                                      {isBBiased && (
                                        <div 
                                          style={{ width: `${progressPercentage}%` }} 
                                          className="bg-[#10B981] h-full transition-all duration-300"
                                        />
                                      )}
                                    </div>

                                    {/* Tick in precise center */}
                                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#4E576B]" />
                                  </div>
                                  <span className="text-[7.5px] font-mono text-[#6A7180] w-2.5 text-right">B</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Specimen A isolates table */}
                    <div className="space-y-3">
                      <span className="font-mono text-[10px] text-[#3B82F6] uppercase tracking-wider block">[A] {compFragA.name} HPLC Matrix</span>
                      <div className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm max-h-72 overflow-y-auto">
                        <table className="w-full text-left font-mono text-[11px]">
                          <thead className="bg-[#15181F] text-[#6A7180] sticky top-0 border-b border-[#2D3139]">
                            <tr>
                              <th className="px-3 py-2 text-[9px] uppercase font-normal">Isolate Target</th>
                              <th className="px-2 py-2 text-[9px] uppercase font-normal text-right">Concentration</th>
                              <th className="px-3 py-2 text-[9px] uppercase font-normal">Functional Class</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2D3139]/40 text-slate-300">
                            {(() => {
                              const isolatesA = compFragA.aromaChemicalMatrix || [];
                              const isolatesB = compFragB.aromaChemicalMatrix || [];
                              const clashingNames = [];
                              
                              isolatesA.forEach(isoA => {
                                const isoB = isolatesB.find(i => i.name.toLowerCase() === isoA.name.toLowerCase());
                                if (isoB) {
                                  const combined = isoA.percentage + isoB.percentage;
                                  const lowerName = isoA.name.toLowerCase();
                                  let isClash = false;
                                  
                                  if (lowerName.includes('ambroxan') || lowerName.includes('ambrox')) isClash = combined >= 10;
                                  else if (lowerName.includes('iso e super') || lowerName.includes('sylvamber') || lowerName.includes('orbitone')) isClash = combined >= 15;
                                  else if (lowerName.includes('maltol') || lowerName.includes('ethyl maltol') || lowerName.includes('vaneecar')) isClash = combined >= 7;
                                  else if (lowerName.includes('myrcenol') || lowerName.includes('dihydromyrcenol')) isClash = combined >= 6;
                                  else if (lowerName.includes('hedione')) isClash = combined >= 16;
                                  else if (lowerName.includes('galaxolide') || lowerName.includes('habanolide') || lowerName.includes('musk')) isClash = combined >= 8;
                                  else isClash = combined >= 10;
                                  
                                  if (isClash) clashingNames.push(lowerName);
                                }
                              });
                              
                              const highAmbroA = isolatesA.some(i => (i.name.toLowerCase().includes('ambroxan') || i.name.toLowerCase().includes('ambrox')) && i.percentage >= 10);
                              const highAmbroB = isolatesB.some(i => (i.name.toLowerCase().includes('ambroxan') || i.name.toLowerCase().includes('ambrox')) && i.percentage >= 10);
                              const highMaltolA_cross = isolatesA.some(i => i.name.toLowerCase().includes('maltol') && i.percentage >= 8);
                              const highMaltolB_cross = isolatesB.some(i => i.name.toLowerCase().includes('maltol') && i.percentage >= 8);

                              const hasCrossClash = (highAmbroA && highMaltolB_cross) || (highAmbroB && highMaltolA_cross);

                              return compFragA.aromaChemicalMatrix.map((item, idX) => {
                                const isClashObj = clashingNames.includes(item.name.toLowerCase());
                                const isCrossClashObj = hasCrossClash && (item.name.toLowerCase().includes('ambroxan') || item.name.toLowerCase().includes('maltol'));
                                const isHighlighted = isClashObj || isCrossClashObj;
                                
                                return (
                                  <tr 
                                    key={`matrixA-${idX}`} 
                                    className={`${
                                      isHighlighted 
                                        ? 'bg-rose-500/10 border-l-2 border-l-rose-500 hover:bg-rose-500/15' 
                                        : 'hover:bg-[#15181F]/30'
                                    } transition-all`}
                                  >
                                    <td className="px-3 py-2 text-white font-medium flex items-center gap-1.5">
                                      {item.name}
                                      {isHighlighted && (
                                        <span className="shrink-0 px-1 py-0.5 font-mono text-[7px] bg-red-500/15 text-red-400 border border-red-500/30 rounded uppercase font-bold tracking-wider">
                                          clash
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-2 py-2 text-right text-[#3B82F6] font-bold">{item.percentage}%</td>
                                    <td className="px-3 py-2 text-[#6A7180] truncate max-w-[120px]" title={item.category}>{item.category}</td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Specimen B isolates table */}
                    <div className="space-y-3">
                      <span className="font-mono text-[10px] text-[#10B981] uppercase tracking-wider block">[B] {compFragB.name} HPLC Matrix</span>
                      <div className="bg-[#0A0B0E] border border-[#2D3139] rounded-sm max-h-72 overflow-y-auto">
                        <table className="w-full text-left font-mono text-[11px]">
                          <thead className="bg-[#15181F] text-[#6A7180] sticky top-0 border-b border-[#2D3139]">
                            <tr>
                              <th className="px-3 py-2 text-[9px] uppercase font-normal">Isolate Target</th>
                              <th className="px-2 py-2 text-[9px] uppercase font-normal text-right">Concentration</th>
                              <th className="px-3 py-2 text-[9px] uppercase font-normal">Functional Class</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2D3139]/40 text-slate-300">
                            {(() => {
                              const isolatesA = compFragA.aromaChemicalMatrix || [];
                              const isolatesB = compFragB.aromaChemicalMatrix || [];
                              const clashingNames = [];
                              
                              isolatesA.forEach(isoA => {
                                const isoB = isolatesB.find(i => i.name.toLowerCase() === isoA.name.toLowerCase());
                                if (isoB) {
                                  const combined = isoA.percentage + isoB.percentage;
                                  const lowerName = isoA.name.toLowerCase();
                                  let isClash = false;
                                  
                                  if (lowerName.includes('ambroxan') || lowerName.includes('ambrox')) isClash = combined >= 10;
                                  else if (lowerName.includes('iso e super') || lowerName.includes('sylvamber') || lowerName.includes('orbitone')) isClash = combined >= 15;
                                  else if (lowerName.includes('maltol') || lowerName.includes('ethyl maltol') || lowerName.includes('vaneecar')) isClash = combined >= 7;
                                  else if (lowerName.includes('myrcenol') || lowerName.includes('dihydromyrcenol')) isClash = combined >= 6;
                                  else if (lowerName.includes('hedione')) isClash = combined >= 16;
                                  else if (lowerName.includes('galaxolide') || lowerName.includes('habanolide') || lowerName.includes('musk')) isClash = combined >= 8;
                                  else isClash = combined >= 10;
                                  
                                  if (isClash) clashingNames.push(lowerName);
                                }
                              });
                              
                              const highAmbroA = isolatesA.some(i => (i.name.toLowerCase().includes('ambroxan') || i.name.toLowerCase().includes('ambrox')) && i.percentage >= 10);
                              const highAmbroB = isolatesB.some(i => (i.name.toLowerCase().includes('ambroxan') || i.name.toLowerCase().includes('ambrox')) && i.percentage >= 10);
                              const highMaltolA_cross = isolatesA.some(i => i.name.toLowerCase().includes('maltol') && i.percentage >= 8);
                              const highMaltolB_cross = isolatesB.some(i => i.name.toLowerCase().includes('maltol') && i.percentage >= 8);

                              const hasCrossClash = (highAmbroA && highMaltolB_cross) || (highAmbroB && highMaltolA_cross);

                              return compFragB.aromaChemicalMatrix.map((item, idX) => {
                                const isClashObj = clashingNames.includes(item.name.toLowerCase());
                                const isCrossClashObj = hasCrossClash && (item.name.toLowerCase().includes('ambroxan') || item.name.toLowerCase().includes('maltol'));
                                const isHighlighted = isClashObj || isCrossClashObj;

                                return (
                                  <tr 
                                    key={`matrixB-${idX}`} 
                                    className={`${
                                      isHighlighted 
                                        ? 'bg-rose-500/10 border-l-2 border-l-rose-500 hover:bg-rose-500/15' 
                                        : 'hover:bg-[#15181F]/30'
                                    } transition-all`}
                                  >
                                    <td className="px-3 py-2 text-white font-medium flex items-center gap-1.5">
                                      {item.name}
                                      {isHighlighted && (
                                        <span className="shrink-0 px-1 py-0.5 font-mono text-[7px] bg-red-500/15 text-red-400 border border-red-500/30 rounded uppercase font-bold tracking-wider">
                                          clash
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-2 py-2 text-right text-[#10B981] font-bold">{item.percentage}%</td>
                                    <td className="px-3 py-2 text-[#6A7180] truncate max-w-[120px]" title={item.category}>{item.category}</td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparative Parity Pricing Scorecard */}
                <div className="bg-[#15181F] border border-[#2D3139] p-6 rounded-sm space-y-6">
                  <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider pb-3 border-b border-[#2D3139] flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" /> Procurement Price Parity & Scent Wear Return (ROI)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
                    {/* Retail comparison */}
                    <div className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm flex flex-col justify-between font-mono">
                      <span className="text-[9.5px] text-[#6A7180] uppercase block">Benchmark Retail Price (MSP)</span>
                      <div className="mt-3 flex items-baseline justify-between shadow-sm">
                        <span className="text-xl font-display font-bold text-white">${compFragA.avgRetailPrice}</span>
                        <span className="text-xs text-[#6A7180]">vs</span>
                        <span className="text-xl font-display font-bold text-white">${compFragB.avgRetailPrice}</span>
                      </div>
                      <div className="mt-4 pt-2 border-t border-[#2D3139]/50 text-[10px] text-[#6A7180] text-center font-sans">
                        {compFragA.avgRetailPrice !== compFragB.avgRetailPrice ? (
                          <span>
                            [B] is <strong className="text-white font-mono">${Math.abs(compFragA.avgRetailPrice - compFragB.avgRetailPrice)}</strong> {compFragA.avgRetailPrice < compFragB.avgRetailPrice ? "more expensive" : "cheaper"} than [A]
                          </span>
                        ) : (
                          <span>MSP parity matched.</span>
                        )}
                      </div>
                    </div>

                    {/* Price per ml comparison */}
                    <div className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm flex flex-col justify-between font-mono">
                      <span className="text-[9.5px] text-[#6A7180] uppercase block">Fluid unit cost ($ / ml)</span>
                      <div className="mt-3 flex items-baseline justify-between shadow-sm">
                        <span className="text-xl font-display font-semibold text-[#3B82F6]">${compFragA.pricePerMl.toFixed(2)}/ml</span>
                        <span className="text-xs text-[#6A7180]">vs</span>
                        <span className="text-xl font-display font-semibold text-[#10B981]">${compFragB.pricePerMl.toFixed(2)}/ml</span>
                      </div>
                      <div className="mt-4 pt-2 border-t border-[#2D3139]/50 text-[10px] text-[#6A7180] text-center font-sans">
                        <span className="uppercase text-[9px] font-mono text-[#6A7180]">Value: <strong className="text-white font-sans">{compFragA.valueRating}</strong> vs <strong className="text-white font-sans">{compFragB.valueRating}</strong></span>
                      </div>
                    </div>

                    {/* Parity Hour index (Wear Investment Score) */}
                    <div className="bg-[#0A0B0E] border border-[#2D3139] p-4 rounded-sm flex flex-col justify-between font-mono">
                      <span className="text-[9.5px] text-[#6A7180] uppercase block">Price per Hour of Active Wear</span>
                      <div className="mt-3 flex items-baseline justify-between shadow-sm">
                        <span className="text-xl font-display font-extrabold text-[#3B82F6]">${(compFragA.avgRetailPrice / compFragA.skinLongevityIndex).toFixed(2)}</span>
                        <span className="text-xs text-[#6A7180]">vs</span>
                        <span className="text-xl font-display font-extrabold text-[#10B981]">${(compFragB.avgRetailPrice / compFragB.skinLongevityIndex).toFixed(2)}</span>
                      </div>
                      <div className="mt-4 pt-2 border-t border-[#2D3139]/50 text-[10px] text-[#6A7180] text-center font-sans">
                        <span>Wear continuous sillage cost factor. Lower is higher ROI.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Cabinet Matrix List / Grid (Render when NOT actively comparing specimens) */}
          {(!isComparingSpecimens || comparedSpecimens.length !== 2) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cabinet.map((frag, idx) => {
                const isSelected = selectedFragrance.name.toLowerCase() === frag.name.toLowerCase() && selectedFragrance.brand.toLowerCase() === frag.brand.toLowerCase();
                const isAddedToCompare = comparedSpecimens.includes(`${frag.brand} - ${frag.name}`);
                return (
                  <div
                    key={`shelf-${frag.brand}-${frag.name}-${idx}`}
                    className={`bg-[#15181F] border rounded-sm p-5 flex flex-col justify-between transition-all hover:border-[#6A7180]/50 relative overflow-hidden ${
                      isSelected ? 'border-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.08)]' : 'border-[#2D3139]'
                    }`}
                  >
                    <div>
                      {/* Identity & Label */}
                      <div className="flex justify-between items-start border-b border-[#2D3139] pb-3 mb-3.5">
                        <div className="max-w-[75%]">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#6A7180] block truncate">
                            {frag.brand}
                          </span>
                          <h3 className="font-display font-medium text-xs text-[#E0E2E6] tracking-wide mt-0.5 max-w-full truncate">
                            {frag.name}
                          </h3>
                        </div>
                        <span className="font-mono text-[9px] text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded-sm shrink-0">
                          {frag.concentration.split(' ')[0]}
                        </span>
                      </div>

                      {/* Aromachemical specs list */}
                      <div className="space-y-1.5 font-mono text-[10.5px]">
                        <div className="flex justify-between">
                          <span className="text-[#6A7180] uppercase">Family:</span>
                          <span className="text-slate-300 font-bold max-w-[65%] truncate text-right">{frag.olfactoryFamily}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6A7180] uppercase">Longevity Index:</span>
                          <span className="text-[#10B981] font-bold">{frag.skinLongevityIndex} Hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6A7180] uppercase">Isolates Decoded:</span>
                          <span className="text-white bg-[#2D3139]/40 px-1 py-0.2 rounded text-[10px]">
                            {frag.aromaChemicalMatrix?.length || 0} isolates
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6A7180] uppercase">Parity Price:</span>
                          <span className="text-[#3B82F6] font-bold">${frag.avgRetailPrice} MSP</span>
                        </div>
                      </div>

                      {/* Isolates tags preview */}
                      <div className="flex flex-wrap gap-1 mt-4">
                        {frag.aromaChemicalMatrix?.slice(0, 3).map((matrix, mIdx) => (
                          <span key={`tag-${frag.name}-${mIdx}`} className="text-[8.5px] font-mono uppercase bg-[#0A0B0E] text-[#6A7180] border border-[#2D3139] px-1.5 py-0.5 rounded">
                            {matrix.name.split(' ')[0]}
                          </span>
                        ))}
                        {(frag.aromaChemicalMatrix?.length || 0) > 3 && (
                          <span className="text-[8.5px] font-mono text-[#3B82F6] px-1.5 py-0.5">
                            +{(frag.aromaChemicalMatrix?.length || 0) - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions control deck */}
                    <div className="border-t border-[#2D3139] pt-4 mt-5 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedFragrance(frag);
                          setActiveTab('dossier');
                        }}
                        className="flex-1 bg-[#3B82F6]/10 hover:bg-[#3B82F6] hover:text-white text-[#3B82F6] font-mono text-[10px] font-bold py-1.5 rounded cursor-pointer transition-colors"
                      >
                        ACTIVATE DOSSIER
                      </button>
                      <button
                        onClick={() => handleToggleCompare(frag.brand, frag.name)}
                        className={`px-3 py-1.5 font-mono text-[10px] font-bold rounded cursor-pointer transition-colors border ${
                          isAddedToCompare
                            ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981]'
                            : 'bg-transparent border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/40 hover:text-white'
                        }`}
                        title="Add/remove specimen comparison"
                      >
                        {isAddedToCompare ? 'ADDED' : 'COMPARE'}
                      </button>
                      <button
                        onClick={() => handleDeleteFromCabinet(frag.brand, frag.name)}
                        className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 hover:border-transparent rounded cursor-pointer transition-colors flex items-center justify-center p-1"
                        title="Delete from Cabinet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'references' && (
        <div className="space-y-6 animate-fadeIn pb-12" id="references-tab-panel">
          {/* Header */}
          <div className="bg-[#15181F] border border-[#2D3139] p-6 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-[#3B82F6]" />
                Baseline Reference Specimens
              </h2>
              <p className="text-xs text-[#6A7180] leading-relaxed max-w-xl font-sans">
                Explore precompiled GC-MS chromatography profiles and structural raw material lines for famous community benchmarks. Select any specimen to activate advanced dynamic model simulations.
              </p>
            </div>
            <div className="font-mono text-xs text-[#6A7180] max-w-[200px] bg-[#0A0B0E] p-3 border border-[#2D3139] rounded text-right shrink-0">
              <span className="text-[9px] select-none block uppercase">Precompiled Cores</span>
              <span className="text-[#3B82F6] font-bold text-sm block mt-0.5">{PREDEFINED_FRAGRANCES.length} Reference Specs</span>
              <span className="text-[8px] uppercase block">FULLY CYLINDRICAL</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PREDEFINED_FRAGRANCES.map((frag, idx) => {
              const isSelected = selectedFragrance.name.toLowerCase() === frag.name.toLowerCase() && selectedFragrance.brand.toLowerCase() === frag.brand.toLowerCase();
              return (
                <div
                  key={`ref-lib-${frag.brand}-${frag.name}-${idx}`}
                  className={`bg-[#15181F] border rounded-sm p-5 flex flex-col justify-between transition-all hover:border-[#6A7180]/50 relative overflow-hidden ${
                    isSelected ? 'border-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.08)]' : 'border-[#2D3139]'
                  }`}
                >
                  <div>
                    {/* Identity & Label */}
                    <div className="flex justify-between items-start border-b border-[#2D3139] pb-3 mb-3.5">
                      <div className="max-w-[75%]">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#6A7180] block truncate">
                          {frag.brand}
                        </span>
                        <h3 className="font-display font-medium text-xs text-[#E0E2E6] tracking-wide mt-0.5 max-w-full truncate">
                          {frag.name}
                        </h3>
                      </div>
                      <span className="font-mono text-[9px] text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded-sm shrink-0">
                        {frag.concentration.split(' ')[0]}
                      </span>
                    </div>

                    {/* Aromachemical specs list */}
                    <div className="space-y-1.5 font-mono text-[10.5px]">
                      <div className="flex justify-between">
                        <span className="text-[#6A7180] uppercase">Family:</span>
                        <span className="text-slate-300 font-bold max-w-[65%] truncate text-right">{frag.olfactoryFamily}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6A7180] uppercase">Release Year:</span>
                        <span className="text-white font-bold">{frag.releaseYear}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6A7180] uppercase">Isolates Modeled:</span>
                        <span className="text-[#10B981] font-bold">
                          {frag.aromaChemicalMatrix?.length || 0} isolates
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6A7180] uppercase">Longevity Score:</span>
                        <span className="text-[#3B82F6] font-bold">{frag.skinLongevityIndex} Hours</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-[#6A7180] leading-relaxed mt-4 line-clamp-3 italic font-sans border-t border-[#2D3139]/30 pt-3">
                      "{frag.batchLineage}"
                    </p>
                  </div>

                  {/* Actions control deck */}
                  <div className="border-t border-[#2D3139] pt-4 mt-5">
                    <button
                      onClick={() => {
                        setSelectedFragrance(frag);
                        setBatchResult(null);
                        setBatchVerifyBrand(frag.brand);
                        setBatchVerifyCode('');
                        setActiveTab('dossier');
                        // Push a brief alert
                        showNotification(`Activated "${frag.brand} ${frag.name}" analysis in Dossier tab.`);
                      }}
                      className="w-full bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-mono text-[10px] font-bold py-2.5 rounded cursor-pointer transition-colors uppercase text-center flex items-center justify-center gap-1.5 outline-none"
                    >
                      <Beaker className="w-3.5 h-3.5" />
                      ACTIVATE INTEGRAL DOSSIER
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'compounding' && (
        <div className="space-y-6 animate-fadeIn pb-12">
          {/* Compounding Desk Header Banner */}
          <div className="bg-[#0E1521] border border-[#10B981]/30 p-6 rounded-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-sm font-mono uppercase tracking-wider text-[#10B981] flex items-center gap-2">
                <Beaker className="w-4 h-4 text-[#10B981]" /> Aromata Laboratory Workbench
              </h3>
              <p className="text-2xl font-display font-bold text-white mt-1">
                Compounding Formula Sheet & Evaporation Simulator
              </p>
              <p className="text-xs text-[#94A3B8] max-w-3xl mt-2 leading-relaxed font-sans">
                Formulate like a lab perfumer at the compounding bench. Add ingredients using 
                <strong className="text-white font-semibold"> Parts per Thousand (ppt)</strong>, adjust carrier solvents with genuine molecular fixative properties, and audit safety live against 
                <strong className="text-white font-semibold"> international IFRA Category 4 thresholds</strong>. Register your final custom blend to your specimen shelf to run full simulations and layering diagnostics.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT SIDE: PPT Formula Spreadsheet & Inputs (8 cols on lg) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Formula Blueprint Fields */}
              <div className="bg-[#15181F] border border-[#2D3139] p-4 rounded-sm">
                <span className="font-mono text-[10px] text-[#10B981] uppercase tracking-wider block mb-3">Formula Metadata Registry</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-slate-400 uppercase mb-1">Blend Name</label>
                    <input 
                      type="text" 
                      value={compoundingName}
                      onChange={(e) => setCompoundingName(e.target.value)}
                      placeholder="e.g. Amberwood Splash"
                      className="w-full bg-[#0A0B0E] border border-[#2D3139] rounded-sm px-3 py-2 text-xs text-white font-mono placeholder-[#6A7180] focus:border-[#10B981] transition-colors outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-slate-400 uppercase mb-1">Lead Perfumer / Nose</label>
                    <input 
                      type="text" 
                      value={compoundingCreator}
                      onChange={(e) => setCompoundingCreator(e.target.value)}
                      placeholder="e.g. Artisan Nose"
                      className="w-full bg-[#0A0B0E] border border-[#2D3139] rounded-sm px-3 py-2 text-xs text-white font-mono placeholder-[#6A7180] focus:border-[#10B981] transition-colors outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Lab Bench PPT Spreadsheet */}
              <div className="bg-[#15181F] border border-[#2D3139] p-4 rounded-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#2D3139]/60 pb-3">
                  <div>
                    <span className="font-mono text-[10px] text-[#10B981] uppercase tracking-wider block">Compounding Sheet</span>
                    <p className="text-[10px] text-[#6A7180] font-mono mt-0.5">Laboratory units of weight (relative ratios out of {compoundingAnalysis.totalParts} total parts)</p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-400 uppercase block">Total Ratios Loaded:</span>
                    <span className="text-sm font-bold text-[#10B981]">{compoundingAnalysis.totalParts} pts</span>
                  </div>
                </div>

                {/* Spreadsheet Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-[#2D3139] text-[#6A7180] text-[9px] uppercase">
                        <th className="py-2.5 font-normal">Scent Isolate / Chemical Target</th>
                        <th className="py-2.5 font-normal text-center w-24">Category</th>
                        <th className="py-2.5 font-normal text-center w-36">Parts Weight (ppt)</th>
                        <th className="py-2.5 font-normal text-right w-20">Share (wt%)</th>
                        <th className="py-2.5 font-normal text-right w-20">Final (vol%)</th>
                        <th className="py-2.5 font-normal text-center w-12">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2D3139]/40">
                      {compoundingAnalysis.withPercentages.map((item, idx) => {
                        const safety = compoundingAnalysis.safetyChecks.find(s => s.name === item.name);
                        const isViolating = safety ? safety.status === 'non-compliant' : false;
                        const isWarning = safety ? safety.status === 'warning' : false;

                        return (
                          <tr key={`compounding-iso-${idx}`} className={`hover:bg-[#1C202B]/20 transition-colors ${isViolating ? 'bg-red-950/10' : ''}`}>
                            <td className="py-3">
                              <span className="text-white font-medium block">{item.name}</span>
                              <span className="text-[9px] text-[#6A7180] block max-w-xs truncate" title={item.description}>{item.description}</span>
                            </td>
                            <td className="py-3 text-center">
                              <span className={`px-1.5 py-0.5 text-[8px] rounded uppercase font-bold tracking-wider ${
                                item.category === 'Ambers/Musks' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                item.category === 'Woody Backbones' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                item.category === 'Sweet/Gourmand Anchors' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                              }`}>
                                {item.category.split('/')[0].split(' ')[0]}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-2">
                                <input 
                                  type="number" 
                                  min="0" 
                                  max="1000"
                                  value={item.parts}
                                  onChange={(e) => {
                                    const val = Math.max(0, parseInt(e.target.value) || 0);
                                    const updated = [...compoundingIsolates];
                                    updated[idx].parts = val;
                                    setCompoundingIsolates(updated);
                                  }}
                                  className="w-14 bg-[#0A0B0E] border border-[#2D3139] rounded px-1.5 py-1 text-center font-mono text-[11px] text-white focus:border-[#10B981] outline-none"
                                />
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="1000" 
                                  value={item.parts}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    const updated = [...compoundingIsolates];
                                    updated[idx].parts = val;
                                    setCompoundingIsolates(updated);
                                  }}
                                  className="w-20 accent-[#10B981] h-1"
                                />
                              </div>
                            </td>
                            <td className="py-3 text-right text-slate-300 font-medium">
                              {item.percentage}%
                            </td>
                            <td className="py-3 text-right">
                              <span className={`font-bold pr-1 ${
                                isViolating ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-[#10B981]'
                              }`}>
                                {item.finalConcentration}%
                              </span>
                            </td>
                            <td className="py-3 text-center">
                              <button 
                                onClick={() => {
                                  setCompoundingIsolates(compoundingIsolates.filter((_, i) => i !== idx));
                                }}
                                className="p-1 hover:text-red-400 text-slate-500 rounded transition-colors cursor-pointer"
                                title="Remove isolate"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Add Isolate Row Form */}
                <div className="bg-[#0D0F14] border border-[#2D3139] p-3.5 rounded-sm flex flex-col md:flex-row items-end gap-3">
                  <div className="flex-1 w-full">
                    <label className="block font-mono text-[9px] text-[#6A7180] uppercase mb-1">Select Isolate to Compound</label>
                    <select 
                      value={newIsolateName}
                      onChange={(e) => setNewIsolateName(e.target.value)}
                      className="w-full bg-[#0A0B0E] border border-[#2D3139] rounded px-3 py-2 text-xs text-white font-mono focus:border-[#10B981] outline-none"
                    >
                      <option value="Iso E Super">Iso E Super (Woody, sleek, backing enhancer)</option>
                      <option value="Ambroxan">Ambroxan (Ambergris, radiant, salty fresh)</option>
                      <option value="Galaxolide">Galaxolide (Clean, floral, soft skin musk)</option>
                      <option value="Hedione">Hedione (Jasmine radiance, floral volume airiness)</option>
                      <option value="Dihydromyrcenol">Dihydromyrcenol (Ultra fresh citrus, key top-note)</option>
                      <option value="Benzyl Benzoate">Benzyl Benzoate (Thin sweet balsam, valuable fixative)</option>
                      <option value="Cashmeran">Cashmeran (Velvet wood, concrete pine, musty musk)</option>
                      <option value="Ethylene Brassylate">Ethylene Brassylate (Sweet musk, powdery fixative)</option>
                      <option value="Coumarin">Coumarin (Sweet tonka, newly mowed hay, dry almond)</option>
                      <option value="Linalool & Linalyl Acetate">Linalool / Linalyl Acetate (Citrus spark, lavender fresh)</option>
                      <option value="Eugenol">Eugenol (Warm spicy clove kernel, antique flower isolate)</option>
                      <option value="Oakmoss Extract">Oakmoss Extract (Wet mossy decay forest chypre absolute)</option>
                      <option value="Lilial">Lilial (Sweet lily petal floral aldehyde - EU Banned)</option>
                      <option value="Vanillin">Vanillin (Rich baking sweets extract, sweet caramel base)</option>
                    </select>
                  </div>
                  <div className="w-full md:w-32">
                    <label className="block font-mono text-[9px] text-[#6A7180] uppercase mb-1">Ratios (parts)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="1000"
                      value={newIsolateParts}
                      onChange={(e) => setNewIsolateParts(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full bg-[#0A0B0E] border border-[#2D3139] rounded px-3 py-2 text-xs text-white font-mono text-center focus:border-[#10B981] outline-none"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      if (!newIsolateName) return;
                      // Determine category and description
                      let cat = "Others";
                      let desc = "Custom added perfumery compound isolate.";
                      if (["Ambroxan", "Galaxolide", "Ethylene Brassylate"].includes(newIsolateName)) {
                        cat = "Ambers/Musks";
                        if (newIsolateName === "Ambroxan") desc = "Vibrant dry marine ambergris projection booster.";
                        if (newIsolateName === "Galaxolide") desc = "Clean soft white musk skin durability anchor.";
                        if (newIsolateName === "Ethylene Brassylate") desc = "Powdery, macrocyclic vanilla-gourmand clean musk.";
                      } else if (["Iso E Super", "Cashmeran"].includes(newIsolateName)) {
                        cat = "Woody Backbones";
                        if (newIsolateName === "Iso E Super") desc = "Sleek velvet synthetic woody-amber backbone structure.";
                        if (newIsolateName === "Cashmeran") desc = "Deep concrete-slate pine needle and warm skin texture.";
                      } else if (["Coumarin", "Vanillin"].includes(newIsolateName)) {
                        cat = "Sweet/Gourmand Anchors";
                        if (newIsolateName === "Coumarin") desc = "Sweet toasted almond, herbal hay, and dry coumarinic absolute.";
                        if (newIsolateName === "Vanillin") desc = "Creamy, heavy sweet standard pod-vanilla compound.";
                      } else {
                        if (newIsolateName === "Hedione") desc = "Radiant jasmine floral airiness and diffusive envelope.";
                        if (newIsolateName === "Dihydromyrcenol") desc = "Screechy fresh metallic lavender-lime citrus blast.";
                        if (newIsolateName === "Benzyl Benzoate") desc = "Faint balsamic almond ester carrier fluid and fixative.";
                        if (newIsolateName === "Eugenol") desc = "Heavy phenolic warm clove kernel and dry earth spice.";
                        if (newIsolateName === "Oakmoss Extract") desc = "Classic forest lichen base note absolute - highly restricted.";
                        if (newIsolateName === "Lilial") desc = "Banned sweet lily aldehydic compound.";
                        if (newIsolateName.includes("Linalool")) desc = "Fresh bergamot floral herbal volatile sparkler.";
                      }

                      // Check if already in formulation
                      const exists = compoundingIsolates.find(i => i.name === newIsolateName);
                      if (exists) {
                        setCompoundingIsolates(compoundingIsolates.map(i => i.name === newIsolateName ? { ...i, parts: i.parts + newIsolateParts } : i));
                      } else {
                        setCompoundingIsolates([...compoundingIsolates, { name: newIsolateName, parts: newIsolateParts, category: cat, description: desc }]);
                      }
                      showNotification(`Compounded ${newIsolateParts} parts of "${newIsolateName}" into matrix successfully.`, 3000);
                    }}
                    className="w-full md:w-auto bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 font-mono text-xs font-bold uppercase rounded cursor-pointer transition-colors shrink-0 flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> COMPOUND
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Solvents, IFRA Audit, and Live Charts (5 cols on lg) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Carrier Solvent & Dilution Panel */}
              <div className="bg-[#15181F] border border-[#2D3139] p-4 rounded-sm space-y-4">
                <span className="font-mono text-[10px] text-[#10B981] uppercase tracking-wider block">Carrier Dilution Desk</span>
                
                {/* Solvent的选择 */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-slate-400 uppercase">Carrier Solvent Media Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => setSolventType('alcohol')}
                      className={`text-center py-2.5 px-1.5 rounded-sm border font-mono text-[10px] font-bold uppercase cursor-pointer transition-all ${
                        solventType === 'alcohol' 
                          ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981] shadow-sm' 
                          : 'bg-transparent border-[#2D3139] text-[#6A7180] hover:text-white hover:border-[#6A7180]/30'
                      }`}
                    >
                      Ethanol (96%)
                    </button>
                    <button 
                      onClick={() => setSolventType('dpg')}
                      className={`text-center py-2.5 px-1.5 rounded-sm border font-mono text-[10px] font-bold uppercase cursor-pointer transition-all ${
                        solventType === 'dpg' 
                          ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981] shadow-sm' 
                          : 'bg-transparent border-[#2D3139] text-[#6A7180] hover:text-white hover:border-[#6A7180]/30'
                      }`}
                    >
                      DPG Glycol
                    </button>
                    <button 
                      onClick={() => setSolventType('ipm')}
                      className={`text-center py-2.5 px-1.5 rounded-sm border font-mono text-[10px] font-bold uppercase cursor-pointer transition-all ${
                        solventType === 'ipm' 
                          ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981] shadow-sm' 
                          : 'bg-transparent border-[#2D3139] text-[#6A7180] hover:text-white hover:border-[#6A7180]/30'
                      }`}
                    >
                      IPM Ester
                    </button>
                  </div>
                  <span className="text-[9px] font-mono text-[#6A7180] block leading-normal pt-1">
                    {solventType === 'alcohol' 
                      ? "High-volatility alcohol catalyst. Aerosolizes isolates explosively. Maxima peak sillage, but triggers accelerated compound decay."
                      : solventType === 'dpg'
                        ? "Heavy linear glycol solution. Highly viscous. Acts as a molecular fixative, binding top notes, flattening the projection line, and increasing durability."
                        : "Non-greasy synthetic ester. Excellent odorless skin skin lipid absorption. Exhibits intermediate fixative kinetics."
                    }
                  </span>
                </div>

                {/* Dilution Vol % Control */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-mono">
                    <label className="text-[10px] text-slate-400 uppercase">Fragrance Oil Dilution Load</label>
                    <span className="text-xs font-bold text-[#10B981]">{dilutionPercent}% Oil / {100 - dilutionPercent}% Solv</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={dilutionPercent}
                    onChange={(e) => setDilutionPercent(parseInt(e.target.value))}
                    className="w-full accent-[#10B981] h-1.5"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-slate-500 uppercase">
                    <span>5% EDC</span>
                    <span>12% EDT</span>
                    <span>20% EDP</span>
                    <span>30% Extrait</span>
                    <span>100% Pure Compound</span>
                  </div>
                </div>
              </div>

              {/* IFRA Regulatory Compliance Audit Center */}
              <div className="bg-[#15181F] border border-[#2D3139] p-4 rounded-sm space-y-3">
                <div id="ifra-compliance-deck" className="flex items-center justify-between border-b border-[#2D3139]/40 pb-2.5">
                  <span className="font-mono text-[10px] text-[#10B981] uppercase tracking-wider block">IFRA Safety Compliance Desk</span>
                  <div className="flex items-center gap-1.5">
                    {compoundingAnalysis.isFullyCompliant ? (
                      <span className="px-2 py-0.5 font-mono text-[9px] font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 rounded uppercase tracking-wider">
                        ★ Standard Compliant
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 font-mono text-[9px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded uppercase tracking-wider">
                        ⚠️ NON-COMPLIANT
                      </span>
                    )}
                  </div>
                </div>

                {/* Audit Checklist lines */}
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {compoundingAnalysis.safetyChecks.map((check, cIdx) => (
                    <div 
                      key={`safety-chk-${cIdx}`} 
                      className={`font-mono text-[10px] p-2 border ${
                        check.status === 'non-compliant' 
                          ? 'bg-rose-500/5 border-rose-500/20 text-rose-300' 
                          : check.status === 'warning' 
                            ? 'bg-yellow-500/5 border-yellow-500/20 text-yellow-300' 
                            : 'bg-[#0A0B0E]/60 border-[#2D3139]/40 text-slate-400'
                      } rounded-sm flex items-start gap-2`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {check.status === 'non-compliant' ? (
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                        ) : check.status === 'warning' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                        )}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex justify-between items-center text-white">
                          <span className="font-bold">{check.name}</span>
                          <span className="font-semibold text-[9px] uppercase">
                            {check.finalConcentration}% in formula
                          </span>
                        </div>
                        <p className="text-[9px] leading-relaxed select-none">{check.message}</p>
                      </div>
                    </div>
                  ))}
                  {compoundingAnalysis.safetyChecks.length === 0 && (
                    <p className="text-center text-[10px] text-[#6A7180] font-mono py-4">No active molecules compounded to audit.</p>
                  )}
                </div>
              </div>

              {/* Dynamic Predictor Simulation Plots */}
              <div className="bg-[#15181F] border border-[#2D3139] p-4 rounded-sm space-y-4">
                <span className="font-mono text-[10px] text-[#10B981] uppercase tracking-wider block">Live Predictive Physics Simulation</span>
                
                {/* Evaporation Chart */}
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-[#94A3B8] uppercase block">Molecular Gas Volatility Decay Line</span>
                  <div className="h-44 bg-[#0A0B0E] p-2 border border-[#2D3139]/60 rounded-sm">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={compoundingAnalysis.evaporationCurve} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="hour" stroke="#4A5160" fontSize={8} tickFormatter={(h) => `Hr ${h}`} />
                        <YAxis stroke="#4A5160" fontSize={8} domain={[0, 100]} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#15181F', borderColor: '#2D3139', fontSize: 10, fontFamily: 'monospace' }} />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: 8, fontFamily: 'monospace', paddingTop: 4 }} />
                        <Line type="monotone" dataKey="top" name="Top Volatiles" stroke="#10B981" strokeWidth={2} activeDot={{ r: 4 }} dot={false} />
                        <Line type="monotone" dataKey="heart" name="Heart Solutes" stroke="#E11D48" strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="base" name="Heavy Fixers" stroke="#3B82F6" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sillage Projection Radius Area Chart */}
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-[#94A3B8] uppercase block">Simulated Dispersion Radius (Projection Feet)</span>
                  <div className="h-40 bg-[#0A0B0E] p-2 border border-[#2D3139]/60 rounded-sm">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={compoundingAnalysis.sillageProjectionRadiusCurve} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="hour" stroke="#4A5160" fontSize={8} tickFormatter={(h) => `${h}h`} />
                        <YAxis stroke="#4A5160" fontSize={8} domain={[0, 12]} tickFormatter={(f) => `${f}ft`} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#15181F', borderColor: '#2D3139', fontSize: 10, fontFamily: 'monospace' }} />
                        <defs>
                          <linearGradient id="compSillageGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.01}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="radiusFeet" name="Sillage (Radius ft)" stroke="#10B981" strokeWidth={2} fill="url(#compSillageGrad)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Predictor Outcomes Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#0A0B0E] border border-[#2D3139]/60 p-3 rounded-sm text-center">
                    <span className="font-mono text-[8px] text-slate-500 uppercase block">Active Skin Longevity</span>
                    <span className="font-display text-lg font-bold text-[#10B981] block mt-0.5">
                      {compoundingAnalysis.predictedLongevity} hrs
                    </span>
                  </div>
                  <div className="bg-[#0A0B0E] border border-[#2D3139]/60 p-3 rounded-sm text-center">
                    <span className="font-mono text-[8px] text-slate-500 uppercase block">Initial Sillage Bubble</span>
                    <span className="font-display text-lg font-bold text-[#10B981] block mt-0.5">
                      {compoundingAnalysis.sillageProjectionRadiusCurve[0]?.radiusFeet || 0.0} ft
                    </span>
                  </div>
                </div>
              </div>

              {/* REGISTER IN CABINET ACTION */}
              <button 
                onClick={handleSaveCompoundedFragrance}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-mono text-xs font-bold py-4 rounded cursor-pointer transition-colors uppercase text-center flex items-center justify-center gap-2 outline-none shadow-lg tracking-wider"
              >
                <Plus className="w-4 h-4" />
                Register Formula Specimen on Cabinet Shelf
              </button>

            </div>
          </div>

          {/* Molecular Chemistry & Physics Education Center */}
          <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6 space-y-6 mt-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.06),transparent_40%)] pointer-events-none" />
            
            <div className="border-b border-[#2D3139]/60 pb-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#3B82F6] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#3B82F6]" /> Aromatherapeutic & Molecular Physics Masterclass
              </h4>
              <p className="text-xl font-display font-bold text-white mt-1">
                The Science of Perfumery: Fluid Evaporation, Fixation, & Olfactory Biology
              </p>
              <p className="text-xs text-[#94A3B8] max-w-4xl mt-1.5 leading-relaxed font-sans">
                A fine fragrance is not merely an aesthetic combination of beautiful notes—it is a meticulously balanced thermodynamic solution. Every raw material possesses static chemical characteristics that govern its physical interaction with air, skin, and sensory receptors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Raoult's Law & Vapor Pressure */}
              <div className="bg-[#0A0B0E]/60 border border-[#2D3139]/50 p-4 rounded-sm space-y-2.5">
                <div className="flex items-center gap-2 text-[#3B82F6]">
                  <Activity className="w-4 h-4 shrink-0" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">Vapor Pressure Kinetics</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed font-sans">
                   Evaporation is governed by <strong>Raoult's Law</strong>. The rate at which an isolate molecule shifts from liquid to gas is a direct function of its molecular weight and ambient vapor pressure. Light citrus terpenes, with high vapor pressures, escape rapidly. Heavy musk elements, with tight intramolecular cohesion, escape slowly.
                </p>
              </div>

              {/* Card 2: Thermodynamic Fixation */}
              <div className="bg-[#0A0B0E]/60 border border-[#2D3139]/50 p-4 rounded-sm space-y-2.5">
                <div className="flex items-center gap-2 text-[#10B981]">
                  <Droplet className="w-4 h-4 shrink-0" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">Cohesion & Fixation</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed font-sans">
                  <strong>Fixatives</strong> do not merely last long on their own; they actively reduce the activity coefficient of other lighter compounds in solution. Heavy glycols (DPG) and high-boiling-point esters (Benzyl Benzoate) form molecular clusters that suppress early vapor release, lengthening the introductory sillage bubble.
                </p>
              </div>

              {/* Card 3: Olfactory Biology & Arrestins */}
              <div className="bg-[#0A0B0E]/60 border border-[#2D3139]/50 p-4 rounded-sm space-y-2.5">
                <div className="flex items-center gap-2 text-rose-500">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">Biological Receptor Fatigue</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed font-sans">
                  Human scent detection relies on <strong>G-Protein Coupled Receptors (GPCRs)</strong>. When an abundance of continuous linear synthetics (e.g., Ambroxan or Iso E Super) binds to nasal receptors, phosphorylation shuts down the transduction channel to prevent overload. This triggers temporary anosmia/fatigue.
                </p>
              </div>

              {/* Card 4: Natural Complexity vs Synthetics */}
              <div className="bg-[#0A0B0E]/60 border border-[#2D3139]/50 p-4 rounded-sm space-y-2.5">
                <div className="flex items-center gap-2 text-amber-500">
                  <Scale className="w-4 h-4 shrink-0" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">Isomerism & Complexity</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed font-sans">
                  A pure synthetic isolate consists of a single rigid molecular structure (e.g., Hedione). A natural absolute (e.g., patchouli absolute) is a complex multi-component soup composed of hundreds of different sesquiterpenes, aldehydes, and chiral isomers, which results in a multi-faceted, alive fragrance profile.
                </p>
              </div>
            </div>

            {/* Interactive Isolate Volatility Profile Explorer */}
            <div className="bg-[#0D0F14] border border-[#2D3139] rounded-sm p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#2D3139]/60 pb-3">
                <div>
                  <span className="font-mono text-[10px] text-[#3B82F6] uppercase tracking-wider block">Interactive Lab Tool</span>
                  <span className="text-sm font-bold text-white font-mono block">Isolate Volatility & Physical Properties Tracker</span>
                </div>
                {/* SELECTOR */}
                <div className="flex bg-[#15181F] border border-[#2D3139] rounded p-0.5 font-mono text-[10px] uppercase font-bold shrink-0">
                  <button 
                    onClick={() => setEduIsolateType('top')}
                    className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                      eduIsolateType === 'top' ? 'bg-[#3B82F6] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Top Volatiles
                  </button>
                  <button 
                    onClick={() => setEduIsolateType('heart')}
                    className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                      eduIsolateType === 'heart' ? 'bg-rose-500' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Heart Solutes
                  </button>
                  <button 
                    onClick={() => setEduIsolateType('base')}
                    className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                      eduIsolateType === 'base' ? 'bg-indigo-500' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Base Fixers
                  </button>
                </div>
              </div>

              {/* Data Display Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                
                {/* Dial/Metrics block */}
                <div className="space-y-3 font-mono">
                  <span className="text-[#6A7180] text-[9px] uppercase tracking-wider block">Physical Specifications</span>
                  
                  <div className="bg-[#15181F] p-3 border border-[#2D3139]/40 rounded-sm">
                    <span className="text-[9px] text-slate-400 block uppercase">Typical Molecular Weight:</span>
                    <span className="text-base font-bold text-white">
                      {eduIsolateType === 'top' ? "130 – 150 g/mol" : eduIsolateType === 'heart' ? "150 – 220 g/mol" : "220 – 300+ g/mol"}
                    </span>
                  </div>

                  <div className="bg-[#15181F] p-3 border border-[#2D3139]/40 rounded-sm">
                    <span className="text-[9px] text-slate-400 block uppercase">Vapor Pressure at 25°C:</span>
                    <span className="text-base font-bold text-white">
                      {eduIsolateType === 'top' ? "150 – 300+ Pa (Extremely High)" : eduIsolateType === 'heart' ? "1.0 – 50.0 Pa (Moderate)" : "0.001 – 0.1 Pa (Ultra-Low)"}
                    </span>
                  </div>

                  <div className="bg-[#15181F] p-3 border border-[#2D3139]/40 rounded-sm">
                    <span className="text-[9px] text-slate-400 block uppercase">Typical Atmospheric Lifespan:</span>
                    <span className="text-sm font-bold text-white">
                      {eduIsolateType === 'top' ? "5 mins to 45 mins" : eduIsolateType === 'heart' ? "1 hr to 5 hrs" : "6 hrs to 48+ hrs"}
                    </span>
                  </div>
                </div>

                {/* Behavior & Chemical examples */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Evaporative Behavior Profile</span>
                    <p className="text-sm text-slate-300 leading-relaxed font-sans">
                      {eduIsolateType === 'top' ? (
                        "Light volatility isolates possess lightweight carbon-chains and weak molecular intermolecular forces (e.g., hydrogen-bonding is minimal or absent). Consequently, the energy barrier required for these molecules to pass from a dissolved liquid state into the ambient headspace is remarkably low. This triggers an instantaneous olfactory explosion when aerosolized or applied to hot pulse points, creating the primary volume of the initial sillage."
                      ) : eduIsolateType === 'heart' ? (
                        "Heart isolates comprise moderately complex carbon rings with dense hydrogen-bonding opportunities (e.g., phenyl rings, alcohols, and light esters). These structures generate intermediate vapor pressures, maintaining cohesive retention during early spray flash-off. They act as the structural bridge that holds volatile top keys together with massive base fixatives, allowing the fragrance signature to stay legibly unified over hours."
                      ) : (
                        "Heavy base chemical couplers exhibit highly intricate carbon cages, cyclic rings, or macrocyclic configurations with intensive dispersion forces and heavy intermolecular networks. Their minuscule vapor pressure means they resist cellular evaporation, clinging highly to standard skin lipid bilayers and textile fabric bonds. They slowly desorb over long horizons, acting as a molecular anchor that drags down other lighter volatile esters."
                      )}
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-2">Key Representative Aromachemical Isolates</span>
                    <div className="grid grid-cols-2 gap-2">
                      {eduIsolateType === 'top' ? (
                        <>
                          <div className="bg-[#15181F] border border-[#2D3139]/40 p-2 rounded text-[10.5px] font-mono text-white text-left">
                            <span className="font-bold text-[#3B82F6] block">Dihydromyrcenol</span>
                            <span className="text-[9px] text-[#6A7180]">Vapor pressure: 23.3 Pa • Citrus lavender boost</span>
                          </div>
                          <div className="bg-[#15181F] border border-[#2D3139]/40 p-2 rounded text-[10.5px] font-mono text-white text-left">
                            <span className="font-bold text-[#3B82F6] block">Limonene</span>
                            <span className="text-[9px] text-[#6A7180]">Vapor pressure: 198 Pa • High-sparkle orange peel</span>
                          </div>
                        </>
                      ) : eduIsolateType === 'heart' ? (
                        <>
                          <div className="bg-[#15181F] border border-[#2D3139]/40 p-2 rounded text-[10.5px] font-mono text-white text-left">
                            <span className="font-bold text-rose-400 block">Linalool</span>
                            <span className="text-[9px] text-[#6A7180]">Vapor pressure: 2.1 Pa • Bergamot peppery timber</span>
                          </div>
                          <div className="bg-[#15181F] border border-[#2D3139]/40 p-2 rounded text-[10.5px] font-mono text-white text-left">
                            <span className="font-bold text-rose-400 block">Hedione</span>
                            <span className="text-[9px] text-[#6A7180]">Vapor pressure: 1.3 Pa • Radiant blooming jasmine</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-[#15181F] border border-[#2D3139]/40 p-2 rounded text-[10.5px] font-mono text-white text-left">
                            <span className="font-bold text-indigo-400 block">Ambroxan</span>
                            <span className="text-[9px] text-[#6A7180]">Vapor pressure: 0.005 Pa • Velvet salty dry woody amber</span>
                          </div>
                          <div className="bg-[#15181F] border border-[#2D3139]/40 p-2 rounded text-[10.5px] font-mono text-white text-left">
                            <span className="font-bold text-indigo-400 block">Iso E Super</span>
                            <span className="text-[9px] text-[#6A7180]">Vapor pressure: 0.015 Pa • Smooth velvety cedarwood background</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Extra didactic note on layering chemistry */}
            <div className="bg-[#1C202B]/30 border border-[#2D3139]/60 p-4 rounded-sm flex items-start gap-4 text-left">
              <span className="p-2 border border-[#3B82F6]/30 bg-[#3B82F6]/10 rounded-sm font-mono text-xs font-bold text-[#3B82F6] block shrink-0 select-none">
                LAB PRACTICE
              </span>
              <div className="space-y-1 font-mono text-[10.5px]">
                <span className="font-bold text-white block uppercase">Empirical Note on Layering Kinetics</span>
                <p className="text-slate-400 leading-normal font-sans text-xs">
                  Applying a high-base heavy linear formula (such as an EDP rich in Ambroxan or Ethylene Brassylate) immediately prior to spraying a high-top volatile cologne (like Limonene or Dihydromyrcenol) creates a temporary surface lipid emulsification on the skin. The hydrophobic qualities of the heavy base musks act as a protective barrier shield, trapping the rapid citrus molecules and physically slowing down their evaporation rate. Try blending these groups on the bench!
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {activeTab === 'glossary' && (
        <div className="space-y-6 animate-fadeIn pb-12">
          {/* Glossary Header */}
          <div className="bg-[#15181F] border border-[#2D3139] p-6 rounded-sm">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#3B82F6] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#3B82F6]" /> Technical Scent & Formulation Encyclopedia
            </h3>
            <p className="text-2xl font-display font-bold text-white mt-1">
              Chemical Glossary & Layman Terminology
            </p>
            <p className="text-xs text-[#6A7180] max-w-2xl mt-2 leading-relaxed font-sans">
              Explore easy-to-understand definitions for the advanced scientific concepts, analytical lab methods, physical molecular processes, and raw chemical compounds monitored throughout the Aromata system.
            </p>

            {/* Glossary Search Field */}
            <div className="relative max-w-md mt-6">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#6A7180]" />
              </span>
              <input
                type="text"
                placeholder="Search technical glossary terms..."
                value={searchGlossaryQuery}
                onChange={(e) => setSearchGlossaryQuery(e.target.value)}
                className="w-full bg-[#0A0B0E] border border-[#2D3139] text-xs font-mono text-white placeholder-[#6A7180] pl-9 pr-4 py-2 rounded focus:outline-none focus:border-[#3B82F6] transition-colors"
                id="glossary-search-input"
              />
              {searchGlossaryQuery && (
                <button
                  onClick={() => setSearchGlossaryQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6A7180] hover:text-white text-[9px] font-mono"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* Glossary List/Grid */}
          {(() => {
            const dictionary = [
              {
                term: "GC-MS (Gas Chromatography-Mass Spectrometry)",
                category: "Laboratory Science",
                layman: "We separate molecular ingredients (using gas chromatography) and crash them into a sensor helper (mass spectrometry) to identify, weigh, and calculate their exact chemical percentages. Think of it as scanning a barcoded receipt for every ingredient inside."
              },
              {
                term: "Aromachemicals / Isolates",
                category: "Organic Chemistry",
                layman: "Purified individual molecules extracted from natural oils or synthetically constructed in a lab to carry one highly distinct, ultra-reliable smell characteristic. Some examples include Iso E Super (velvety cedarwood), Ambroxan (warm amber animalic), or Hedione (creamy fresh jasmine)."
              },
              {
                term: "HPLC (High-Performance Liquid Chromatography)",
                category: "Separation Science",
                layman: "A precision physical science technique that pressurizes liquid perfume compound carriers across specialized columns to separate, sort, and record exact percentage weights of raw compounds present. Essential for formula authenticity verification."
              },
              {
                term: "Sillage",
                category: "Olfactory Performance",
                layman: "Pronounced 'see-yahzh'. The elegant scent cloud or trail a wearer projects outward into the surrounding airspace. It determines whether your perfume stays close to your skin or fills the entire room."
              },
              {
                term: "Sillage Projection Curve",
                category: "Simulation & Modeling",
                layman: "A diagnostic graphical chart mapping how the scent's physical radius of reach projects outward (in feet) throughout a standard 10-hour evaporation timeline on active skin. Shows exactly when the fragrance is screaming vs. whispering."
              },
              {
                term: "Olfactory Family",
                category: "Grouping & Esthetic",
                layman: "The high-level category grouping scent compounds based on shared core aromatic profiles, such as Woody (rich timbers), Citrus (effervescent zesty rinds), Marine/Aquatic (cool sea air and salt), or Ambery (warm resins and spices)."
              },
              {
                term: "Concentration Percentage (Extrait vs. Eau de Parfum)",
                category: "Physical Compound Ratio",
                layman: "The pure ratio of raw fragrant oils loaded into the final bottle relative to the liquid alcohol solvent carrier. Extrait (20-40%) wears exceptionally long on skin, Eau de Parfum (15-20%) offers excellent balanced trail, and Eau de Toilette (5-15%) is light and breezy."
              },
              {
                term: "Parity Unit Price ($/ml)",
                category: "Procurement Analytics",
                layman: "A normalized financial metric calculated by dividing a bottle's retail price by its milliliter size, identifying exactly how much you pay per droplet of liquid formula. Allows fair trade value auditing across different shapes and sizes."
              },
              {
                term: "Formula Variance / Divergence",
                category: "Mathematical Analysis",
                layman: "The direct numerical variance detected between chemical compound weights when comparing two specimens side-by-side. It reveals matching overlaps, unique solo ingredients, and total genetic divergence between perfume formulas."
              },
              {
                term: "Olfactory Fatigue (Sensory Adaptation / Anosmia)",
                category: "Biology & Perception",
                layman: "A temporary biological saturation of nose receptors where your brain stops detecting a continuous scent compound (especially big heavy molecules like Iso E Super or Ambroxan) to protect your nose from smell overload. Although you can't smell it, people walking past you still can."
              },
              {
                term: "Scent Wear Return (ROI - Return on Investment)",
                category: "Performance Economics",
                layman: "A proprietary continuous efficiency rating computed as total bottle price divided by its active hours of skin projection. Lower hourly cost reflects higher scent wear payoff."
              },
              {
                term: "Accords",
                category: "Aesthetic Composition",
                layman: "The synergetic accord created when separate aromachemicals blend perfectly to output a completely new, unified scent concept, like how blue and yellow paint create green. A 'fresh ocean breeze accord' is composed of marine elements, ozone molecules, and cold floral trace isolates."
              },
              {
                term: "Vapor Pressure",
                category: "Physical Kinetics",
                layman: "The physical speed and ease at which fragrant molecules boil and vaporize off your skin at normal room temperatures. Top notes (citrus, aldehydes) have very high vapor pressure and vanish in minutes, whereas heavy base fixatives (musks, woods, resins) have ultra-low vapor pressure, holding dry-downs for hours."
              },
              {
                term: "HPLC Isolate Matrix",
                category: "Database Structure",
                layman: "The underlying laboratory roster plotting every identified aroma chemical compound name, concentration percentage, family category, and olfactory tag. This serves as the blueprint representing the scent's DNA."
              }
            ];

            const filtered = dictionary.filter(item => {
              const query = searchGlossaryQuery.toLowerCase();
              return item.term.toLowerCase().includes(query) || 
                     item.category.toLowerCase().includes(query) || 
                     item.layman.toLowerCase().includes(query);
            });

            if (filtered.length === 0) {
              return (
                <div className="bg-[#15181F] border border-[#2D3139] p-12 text-center rounded-sm space-y-3">
                  <span className="text-xl font-mono block text-[#6A7180]">✕</span>
                  <p className="font-mono text-xs text-[#6A7180] uppercase tracking-wider">No matching glossary terms found</p>
                  <p className="text-[10px] text-[#6A7180] font-sans">Try searching for simple search concepts like "sillage", "hplc", "olfactory", or "fatigue".</p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-left">
                {filtered.map((item, idx) => (
                  <div key={`glossary-card-${idx}`} className="bg-[#15181F] border border-[#2D3139] hover:border-[#3B82F6]/30 p-5 rounded-sm flex flex-col justify-between transition-all font-mono space-y-3">
                    <div>
                      <div className="flex items-start justify-between border-b border-[#2D3139]/40 pb-3 mb-3 shrink-0">
                        <h4 className="font-display font-semibold text-xs text-white tracking-wide max-w-[70%] leading-relaxed">
                          {item.term}
                        </h4>
                        <span className="text-[7.5px] font-mono bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 px-2 py-0.5 rounded-sm uppercase tracking-wider block shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 font-sans leading-relaxed">
                        {item.layman}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {activeTab === 'noses' && (
        <div className="space-y-6 animate-fadeIn pb-12">
          {/* Noses Gallery Header */}
          <div className="bg-[#15181F] border border-[#2D3139] p-6 rounded-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-5 pointer-events-none">
              <Users className="w-48 h-48 text-[#3B82F6]" />
            </div>
            
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#3B82F6] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#3B82F6]" /> The Guild of Masters
            </h3>
            <p className="text-2xl font-display font-bold text-white mt-1">
              Master Noses & Olfactory Styles
            </p>
            <p className="text-xs text-[#6A7180] max-w-3xl mt-2 leading-relaxed font-sans text-justify bg-gradient-to-r from-transparent to-transparent">
              Explore the legendary creators who transformed synthetic chemistry and botanical extractions into high-end art. Every master operates under a signature structural blueprint—defining how they balance volatility, density, and skin chemistry. Select any seminal work below to load its profile instantly into the <strong className="text-[#3B82F6] hover:underline cursor-pointer" onClick={() => setActiveTab('dossier')}>Dossier Analyst</strong>.
            </p>

            {/* Custom Noses Search Box */}
            <div className="relative max-w-md mt-6">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#6A7180]" />
              </span>
              <input
                type="text"
                placeholder="Search master noses, signatures, or seminal creations..."
                value={searchNosesQuery}
                onChange={(e) => setSearchNosesQuery(e.target.value)}
                className="w-full bg-[#0A0B0E] border border-[#2D3139] text-xs font-mono text-white placeholder-[#6A7180]/50 pl-9 pr-4 py-2 rounded focus:outline-none focus:border-[#3B82F6] transition-colors"
                id="noses-search-input"
              />
              {searchNosesQuery && (
                <button
                  onClick={() => setSearchNosesQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6A7180] hover:text-white text-[9px] font-mono container-clear-btn"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* MASTERCLASS BANNER: PERFUME VS FRAGRANCE */}
          <div className="bg-[#15181F] border border-[#2D3139] rounded-sm p-6 relative overflow-hidden" id="perfume-vs-fragrance-masterclass">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5 pointer-events-none animate-pulse">
              <BookOpen className="w-36 h-36 text-white/5" />
            </div>

            <h4 className="font-display text-xs font-bold text-white tracking-widest border-b border-[#2D3139] pb-3 mb-4 flex items-center justify-between uppercase">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#3B82F6]" />
                Olfactory Distinction: Perfume vs. Fragrance
              </span>
              <span className="font-mono text-[9px] text-[#3B82F6] font-bold uppercase bg-[#3B82F6]/10 px-2.5 py-0.5 rounded-sm border border-[#3B82F6]/15">
                Technical Education
              </span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm font-sans mb-6">
              <div className="space-y-2 text-justify">
                <span className="text-white font-mono font-bold text-xs uppercase text-[#3B82F6] block">
                  1. The Broad Concept: What is a "Fragrance"?
                </span>
                <p className="text-slate-300 text-xs leading-relaxed">
                  A <strong>fragrance</strong> is a vast umbrella term denoting any composite aromatic profile or pleasant odor character. It describes the sensory experience itself or any substance engineered to emit a smell. This applies universally across industries—from ambient scented candles and laundry fabric softeners to functional soap surfactants, interior sprays, and cosmetic items. In essence, fragrance acts as the abstract olfactory formula or signature atmosphere.
                </p>
              </div>

              <div className="space-y-2 text-justify">
                <span className="text-white font-mono font-bold text-xs uppercase text-[#10B981] block">
                  2. The Fine Object: What is a "Perfume"?
                </span>
                <p className="text-slate-300 text-xs leading-relaxed">
                  A <strong>perfume</strong> (specifically matching the traditional French *parfum* or *extrait*) is a highly specific, high-end product form in fine perfumery. While the fragrance represents the sweet-or-smoky smell, the perfume represents the physical delivery system. It is a precise solution composed of highly pure aromatic raw materials—botanical oils, moss concretes, synthetic aroma-chemical isolates, and natural absolute fractions—precisely suspended in high-volatility denatured ethyl alcohol carrier, designed strategically for personal skin and textile application.
                </p>
              </div>
            </div>

            {/* Dynamic Concentration Hierarchy Visualizer */}
            <div className="bg-[#0A0B0E] border border-[#2D3139]/70 rounded-sm p-4 mt-4">
              <span className="text-slate-300 font-mono text-[10px] font-bold uppercase block mb-3 text-center tracking-widest">
                Scientific Concentration & Release Spectrum
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-center">
                <div className="bg-[#15181F] border border-[#2D3139]/60 rounded-sm p-3 flex flex-col justify-between">
                  <div>
                    <span className="block text-[#E0E2E6] text-[11px] font-bold uppercase">Parfum / Extrait</span>
                    <span className="block text-[#3B82F6] text-xs font-black mt-1">20% – 40% Conc.</span>
                  </div>
                  <div className="border-t border-[#2D3139]/40 mt-3 pt-2">
                    <span className="block text-[9.5px] text-[#6A7180] leading-snug font-sans">
                      Durable, low-volatility anchors. Blends tightly with skin lipids, generating a lingering, close-to-skin aura lasting <strong>8 – 12h+</strong>.
                    </span>
                  </div>
                </div>

                <div className="bg-[#15181F] border border-[#2D3139]/60 rounded-sm p-3 flex flex-col justify-between">
                  <div>
                    <span className="block text-[#E0E2E6] text-[11px] font-bold uppercase">Eau de Parfum</span>
                    <span className="block text-[#10B981] text-xs font-black mt-1">15% – 20% Conc.</span>
                  </div>
                  <div className="border-t border-[#2D3139]/40 mt-3 pt-2">
                    <span className="block text-[9.5px] text-[#6A7180] leading-snug font-sans">
                      The industry benchmark. Achieves balanced atomic diffusion with moderate citrus evaporation and rich mid-level sillage for <strong>6 – 8h</strong>.
                    </span>
                  </div>
                </div>

                <div className="bg-[#15181F] border border-[#2D3139]/60 rounded-sm p-3 flex flex-col justify-between">
                  <div>
                    <span className="block text-[#E0E2E6] text-[11px] font-bold uppercase">Eau de Toilette</span>
                    <span className="block text-amber-500 text-xs font-black mt-1">5% – 15% Conc.</span>
                  </div>
                  <div className="border-t border-[#2D3139]/40 mt-3 pt-2">
                    <span className="block text-[9.5px] text-[#6A7180] leading-snug font-sans">
                      Focuses heavily on bright, sparkling top-notes and floral heart-spacers. Highly diffusive but evaporates quickly over <strong>3 – 4h</strong>.
                    </span>
                  </div>
                </div>

                <div className="bg-[#15181F] border border-[#2D3139]/60 rounded-sm p-3 flex flex-col justify-between">
                  <div>
                    <span className="block text-[#E0E2E6] text-[11px] font-bold uppercase">Eau de Cologne</span>
                    <span className="block text-[#F87171] text-xs font-black mt-1">2% – 5% Conc.</span>
                  </div>
                  <div className="border-t border-[#2D3139]/40 mt-3 pt-2">
                    <span className="block text-[9.5px] text-[#6A7180] leading-snug font-sans">
                      High-volatility citrus, herbs, and aldehydes that boil off the skin within <strong>1 – 2h</strong>. Designed for instant refreshing clean bursts.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NOSE CARDS GRID */}
          <div className="space-y-6">
            {(() => {
              const query = searchNosesQuery.toLowerCase().trim();
              const filtered = MASTER_NOSES_DATABASE.filter(item => {
                if (!query) return true;
                return item.name.toLowerCase().includes(query) ||
                  item.category.toLowerCase().includes(query) ||
                  item.blueprint.toLowerCase().includes(query) ||
                  item.howHeWorked.toLowerCase().includes(query) ||
                  item.experience.toLowerCase().includes(query) ||
                  item.seminalWorksList.some(work => 
                    work.name.toLowerCase().includes(query) || 
                    work.brand.toLowerCase().includes(query)
                  );
              });

              if (filtered.length === 0) {
                return (
                  <div className="bg-[#15181F] border border-[#2D3139] p-12 text-center rounded-sm space-y-3">
                    <span className="text-xl font-mono block text-[#6A7180]">✕</span>
                    <p className="font-mono text-xs text-[#6A7180] uppercase tracking-wider">No matching perfumers found</p>
                    <p className="text-[10px] text-[#6A7180] font-sans">Try searching for famous names like "Jean-Claude", "Guerlain", "Kurkdjian" or creation names like "Terre d'Hermès" or "Shalimar".</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.map((nose, noseIdx) => (
                    <div 
                      key={`nose-card-${noseIdx}`}
                      className="bg-[#15181F] border border-[#2D3139] hover:border-[#3B82F6]/30 p-6 rounded-sm flex flex-col justify-between transition-all"
                    >
                      <div className="space-y-4">
                        {/* Header metadata segment */}
                        <div className="flex items-start justify-between border-b border-[#2D3139]/50 pb-3">
                          <div>
                            <span className="text-[8px] font-mono bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/15 px-2.5 py-0.5 rounded-sm uppercase tracking-wider block w-fit mb-1.5 font-bold">
                              {nose.category}
                            </span>
                            <h4 className="font-display font-medium text-base text-white tracking-wide">
                              {nose.name}
                            </h4>
                          </div>
                          <Users className="w-5 h-5 text-[#6A7180]/40 shrink-0" />
                        </div>

                        {/* Visual Blueprint Row */}
                        <div className="bg-[#0A0B0E] p-3 border border-[#2D3139]/40 rounded-sm">
                          <span className="font-mono text-[8.5px] uppercase text-[#3B82F6] font-bold block mb-1">
                            Aesthetic Blueprint
                          </span>
                          <p className="text-xs text-white/95 font-sans italic leading-relaxed">
                            "{nose.blueprint}"
                          </p>
                        </div>

                        {/* Working Methodology */}
                        <div className="space-y-1">
                          <span className="font-mono text-[8.5px] uppercase text-[#6A7180] font-bold block">
                            How They Worked (Scent Science & Strategy)
                          </span>
                          <p className="text-xs text-slate-300 font-sans leading-relaxed text-justify">
                            {nose.howHeWorked}
                          </p>
                        </div>

                        {/* Sensory Experience wear */}
                        <div className="space-y-1">
                          <span className="font-mono text-[8.5px] uppercase text-[#10B981] font-bold block">
                            The Scent Experience (The Wear Profile)
                          </span>
                          <p className="text-xs text-slate-300 font-sans leading-relaxed text-justify text-left">
                            {nose.experience}
                          </p>
                        </div>
                      </div>

                      {/* Seminal Creations pill grid selection */}
                      <div className="border-t border-[#2D3139]/50 pt-4 mt-5">
                        <span className="font-mono text-[8.5px] uppercase text-amber-500 font-bold block mb-2.5">
                          Seminal Creations (Click to Analyze)
                        </span>

                        <div className="flex flex-wrap gap-2">
                          {nose.seminalWorksList.map((work, workIdx) => (
                            <button
                              key={`work-${workIdx}`}
                              onClick={() => {
                                setSearchBrand(work.brand);
                                setSearchName(work.name);
                                setActiveTab('dossier');
                                showNotification(`Loaded "${work.brand} ${work.name}" into Dossier Analyst. Press Initiate to run GC-MS assay.`, 5000);
                              }}
                              className="bg-[#0A0B0E] hover:bg-[#3B82F6]/10 border border-[#2D3139] hover:border-[#3B82F6]/50 text-slate-200 hover:text-[#3B82F6] text-[10.5px] font-mono px-3 py-1.5 rounded cursor-pointer transition-all flex items-center gap-1.5 outline-none font-bold"
                            >
                              <Sparkles className="w-2.5 h-2.5 shrink-0" />
                              <span className="font-sans font-medium">{work.name}</span>
                              <span className="text-[8px] text-[#6A7180] uppercase">({work.brand})</span>
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {activeTab === 'houses' && (
        <div className="space-y-6 animate-fadeIn pb-12">
          {/* Houses Gallery Header */}
          <div className="bg-[#15181F] border border-[#2D3139] p-6 rounded-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-5 pointer-events-none">
              <Globe className="w-48 h-48 text-[#3B82F6]" />
            </div>
            
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#3B82F6] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#3B82F6]" /> The Great Perfume Houses
            </h3>
            <p className="text-2xl font-display font-bold text-white mt-1">
              Master Houses & Olfactory Philosophies
            </p>
            <p className="text-xs text-[#6A7180] max-w-3xl mt-2 leading-relaxed font-sans text-justify">
              Explore the iconic fragrance houses that shape global olfaction. From legendary historic dynasties preserving the ancestral royal courts to industrial avant-garde rebels redefining what &quot;smells good&quot; entirely. Every house is built upon a signature architectural style and a strict core mandate. Click any of their exquisite creations below to load it instantly into the <strong className="text-[#3B82F6] hover:underline cursor-pointer" onClick={() => setActiveTab('dossier')}>Dossier Analyst</strong>.
            </p>

            {/* Custom Houses Search Box */}
            <div className="relative max-w-md mt-6">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#6A7180]" />
              </span>
              <input
                type="text"
                placeholder="Search master houses, philosophies, scents, or creations..."
                value={searchHousesQuery}
                onChange={(e) => setSearchHousesQuery(e.target.value)}
                className="w-full bg-[#0A0B0E] border border-[#2D3139] text-xs font-mono text-white placeholder-[#6A7180]/50 pl-9 pr-4 py-2 rounded focus:outline-none focus:border-[#3B82F6] transition-colors"
                id="houses-search-input"
              />
              {searchHousesQuery && (
                <button
                  onClick={() => setSearchHousesQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6A7180] hover:text-white text-[9px] font-mono container-clear-btn"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* HOUSES CARDS GRID */}
          <div className="space-y-6">
            {(() => {
              const query = searchHousesQuery.toLowerCase().trim();
              const filtered = MASTER_HOUSES_DATABASE.filter(item => {
                if (!query) return true;
                return item.name.toLowerCase().includes(query) ||
                  item.category.toLowerCase().includes(query) ||
                  item.philosophy.toLowerCase().includes(query) ||
                  item.scentProfile.toLowerCase().includes(query) ||
                  item.coreMandate.toLowerCase().includes(query) ||
                  item.creationsList.some(work => 
                    work.name.toLowerCase().includes(query) || 
                    work.brand.toLowerCase().includes(query)
                  );
              });

              if (filtered.length === 0) {
                return (
                  <div className="bg-[#15181F] border border-[#2D3139] p-12 text-center rounded-sm space-y-3">
                    <span className="text-xl font-mono block text-[#6A7180]">✕</span>
                    <p className="font-mono text-xs text-[#6A7180] uppercase tracking-wider">No matching perfume houses found</p>
                    <p className="text-[10px] text-[#6A7180] font-sans">Try searching for famous houses like &quot;Guerlain&quot;, &quot;Creed&quot;, &quot;Hermès&quot;, &quot;Le Labo&quot; or creation names like &quot;Aventus&quot;, &quot;Layton&quot; or &quot;Santal 33&quot;.</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.map((house, idx) => (
                    <div 
                      key={`house-card-${idx}`}
                      className="bg-[#15181F] border border-[#2D3139] hover:border-[#3B82F6]/30 p-6 rounded-sm flex flex-col justify-between transition-all"
                    >
                      <div className="space-y-4">
                        {/* Header metadata segment */}
                        <div className="flex items-start justify-between border-b border-[#2D3139]/50 pb-3">
                          <div>
                            <span className="text-[8px] font-mono bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/15 px-2.5 py-0.5 rounded-sm uppercase tracking-wider block w-fit mb-1.5 font-bold">
                              {house.category}
                            </span>
                            <h4 className="font-display font-medium text-base text-white tracking-wide flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></span>
                              {house.name}
                            </h4>
                          </div>
                          <Globe className="w-5 h-5 text-[#6A7180]/40 shrink-0" />
                        </div>

                        {/* Visual Philosophy Row */}
                        <div className="bg-[#0A0B0E] p-3 border border-[#2D3139]/40 rounded-sm">
                          <span className="font-mono text-[8.5px] uppercase text-[#3B82F6] font-bold block mb-1">
                            The Philosophy
                          </span>
                          <p className="text-xs text-white/95 font-sans italic leading-relaxed">
                            &quot;{house.philosophy}&quot;
                          </p>
                        </div>

                        {/* Scent Profile */}
                        <div className="space-y-1">
                          <span className="font-mono text-[8.5px] uppercase text-[#6A7180] font-bold block">
                            The Scent Profile
                          </span>
                          <p className="text-xs text-slate-300 font-sans leading-relaxed text-[#c0c6d4] text-justify">
                            {house.scentProfile}
                          </p>
                        </div>

                        {/* Core Mandate */}
                        <div className="space-y-1">
                          <span className="font-mono text-[8.5px] uppercase text-[#10B981] font-bold block">
                            The Core Mandate
                          </span>
                          <p className="text-xs text-slate-300 font-sans leading-relaxed text-[#c0c6d4] text-justify">
                            {house.coreMandate}
                          </p>
                        </div>
                      </div>

                      {/* House Creations click selection */}
                      <div className="border-t border-[#2D3139]/50 pt-4 mt-5">
                        <span className="font-mono text-[8.5px] uppercase text-amber-500 font-bold block mb-2.5">
                          Seminal Creations (Click to Analyze & Load)
                        </span>

                        <div className="flex flex-wrap gap-2">
                          {house.creationsList.map((create, cIdx) => (
                            <button
                              key={`create-${cIdx}`}
                              onClick={() => {
                                setSearchBrand(create.brand);
                                setSearchName(create.name);
                                setActiveTab('dossier');
                                showNotification(`Loaded "${create.brand} ${create.name}" into Dossier Analyst. Press Initiate to run GC-MS assay.`, 5000);
                              }}
                              className="bg-[#0A0B0E] hover:bg-[#3B82F6]/10 border border-[#2D3139] hover:border-[#3B82F6]/50 text-slate-200 hover:text-[#3B82F6] text-[10.5px] font-mono px-3 py-1.5 rounded cursor-pointer transition-all flex items-center gap-1.5 outline-none font-bold"
                            >
                              <Sparkles className="w-2.5 h-2.5 shrink-0 text-amber-500" />
                              <span className="font-sans font-medium">{create.name}</span>
                              <span className="text-[8px] text-[#6A7180] uppercase">({create.brand})</span>
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {activeTab === 'niche' && (
        <div className="space-y-6 animate-fadeIn pb-12">
          {/* Niche Icons Gallery Header */}
          <div className="bg-[#15181F] border border-[#2D3139] p-6 rounded-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-5 pointer-events-none">
              <Sparkles className="w-48 h-48 text-[#F59E0B]" />
            </div>
            
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#F59E0B] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" /> Independent Niche &amp; Avant-Garde
            </h3>
            <p className="text-2xl font-display font-bold text-white mt-1">
              Independent Niche Noses &amp; Houses
            </p>
            <p className="text-xs text-[#6A7180] max-w-3xl mt-2 leading-relaxed font-sans text-justify">
              The landscape of independent perfumery has evolved into a highly intellectual, non-commercial battlefield. The following 25 exemplary niche houses and independent &quot;noses&quot; are distinguished by their refusal to rely on mass-market trends. They treat fragrance as an exercise in structural design, historical preservation, or raw molecular art—distinct from any creators previously analyzed. Click any of their exquisite creation names below to instantly load them and begin analysis on the home page.
            </p>

            {/* Custom Search & Filters Box */}
            <div className="mt-6 space-y-4">
              <div className="relative max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-[#6A7180]" />
                </span>
                <input
                  type="text"
                  placeholder="Search independent niche, philosophies, blueprints, or creations..."
                  value={searchNicheQuery}
                  onChange={(e) => setSearchNicheQuery(e.target.value)}
                  className="w-full bg-[#0A0B0E] border border-[#2D3139] text-xs font-mono text-white placeholder-[#6A7180]/50 pl-9 pr-4 py-2 rounded focus:outline-none focus:border-[#3B82F6] transition-colors"
                  id="niche-search-input"
                />
                {searchNicheQuery && (
                  <button
                    onClick={() => setSearchNicheQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6A7180] hover:text-white text-[9px] font-mono container-clear-btn shadow-none bg-transparent hover:bg-transparent border-0"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Interactivity: Category Filters */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[#2D3139]/40">
                <button
                  onClick={() => setSelectedNicheCategory(null)}
                  className={`text-[9.5px] font-mono px-3 py-1.5 rounded-sm border transition-all cursor-pointer ${
                    selectedNicheCategory === null 
                      ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white' 
                      : 'bg-[#15181F] border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/40 hover:text-white'
                  }`}
                >
                  All Categories
                </button>
                {[
                  "The Avant-Garde Concept Architects",
                  "The Landscape & Narrative Archivists",
                  "The Botanical Purists & Terroir Masters",
                  "The Modern Minimalists & Concept Rebels",
                  "The Intellectual & Mythological Alchemists"
                ].map((cat, catIdx) => (
                  <button
                    key={`niche-cat-tab-${catIdx}`}
                    onClick={() => setSelectedNicheCategory(cat)}
                    className={`text-[9.5px] font-mono px-3 py-1.5 rounded-sm border transition-all cursor-pointer ${
                      selectedNicheCategory === cat 
                        ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white' 
                        : 'bg-[#15181F] border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/40 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* GALLERY GRID */}
          <div className="space-y-6">
            {(() => {
              const query = searchNicheQuery.toLowerCase().trim();
              const filtered = INDEPENDENT_NICHE_DATABASE.filter(item => {
                // Category Filter
                if (selectedNicheCategory && item.category !== selectedNicheCategory) return false;

                // Search Query Filter
                if (!query) return true;
                return item.name.toLowerCase().includes(query) ||
                  item.category.toLowerCase().includes(query) ||
                  item.origin.toLowerCase().includes(query) ||
                  item.philosophy.toLowerCase().includes(query) ||
                  item.blueprint.toLowerCase().includes(query) ||
                  item.creations.some(c => 
                    c.name.toLowerCase().includes(query) || 
                    c.brand.toLowerCase().includes(query)
                  );
              });

              if (filtered.length === 0) {
                return (
                  <div className="bg-[#15181F] border border-[#2D3139] p-12 text-center rounded-sm space-y-3">
                    <span className="text-xl font-mono block text-[#6A7180]">✕</span>
                    <p className="font-mono text-xs text-[#6A7180] uppercase tracking-wider">No matching independent niche houses found</p>
                    <p className="text-[10px] text-[#6A7180] font-sans">Try modifying your search or choosing &quot;All Categories&quot; above.</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.map((nicheItem, idx) => (
                    <div 
                      key={`niche-card-${idx}`}
                      className="bg-[#15181F] border border-[#2D3139] hover:border-[#F59E0B]/30 p-6 rounded-sm flex flex-col justify-between transition-all"
                    >
                      <div className="space-y-4">
                        {/* Header metadata segment */}
                        <div className="flex items-start justify-between border-b border-[#2D3139]/50 pb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5 font-bold">
                              <span className="text-[8px] font-mono bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/15 px-2.5 py-0.5 rounded-sm uppercase tracking-wider font-bold">
                                {nicheItem.category}
                              </span>
                              <span className="text-[9px] font-mono text-[#6A7180] font-semibold">
                                #{String(nicheItem.id).padStart(2, '0')}
                              </span>
                            </div>
                            <h4 className="font-display font-medium text-base text-white tracking-wide flex items-center gap-2">
                              {nicheItem.name}
                              <span className="text-[10px] font-mono text-[#6A7180] font-normal">
                                ({nicheItem.origin})
                              </span>
                            </h4>
                          </div>
                          <Sparkles className="w-5 h-5 text-[#F59E0B]/40 shrink-0" />
                        </div>

                        {/* Design Philosophy Row */}
                        <div className="bg-[#0A0B0E] p-3 border border-[#2D3139]/40 rounded-sm">
                          <span className="font-mono text-[8.5px] uppercase text-[#F59E0B] font-bold block mb-1">
                            Design Philosophy
                          </span>
                          <p className="text-xs text-white/95 font-sans italic leading-relaxed text-left text-justify">
                            {nicheItem.philosophy}
                          </p>
                        </div>

                        {/* Scent Science & Blueprint Mechanism */}
                        <div className="space-y-1">
                          <span className="font-mono text-[8.5px] uppercase text-[#6A7180] font-bold block">
                            Blueprint Mechanism &amp; Molecular Art
                          </span>
                          <p className="text-xs text-slate-300 font-sans leading-relaxed text-[#c0c6d4] text-justify text-left">
                            {nicheItem.blueprint}
                          </p>
                        </div>
                      </div>

                      {/* Fragrance Creations list of links */}
                      <div className="border-t border-[#2D3139]/50 pt-4 mt-5 font-bold">
                        <span className="font-mono text-[8.5px] uppercase text-amber-500 font-bold block mb-2.5">
                          Seminal Creations (Click to load &amp; analyze)
                        </span>

                        <div className="flex flex-wrap gap-2">
                          {nicheItem.creations.map((create, cIdx) => (
                            <button
                              key={`niche-create-${cIdx}`}
                              onClick={() => {
                                setSearchBrand(create.brand);
                                setSearchName(create.name);
                                setActiveTab('dossier');
                                setShelfNotification(`Loaded "${create.brand} ${create.name}" into Fragrance Name &amp; Flanker field. Press Initiate to run GC-MS assay.`);
                                setTimeout(() => setShelfNotification(null), 5000);
                              }}
                              className="bg-[#0A0B0E] hover:bg-[#F59E0B]/10 border border-[#2D3139] hover:border-[#F59E0B]/50 text-slate-200 hover:text-[#F59E0B] text-[10.5px] font-mono px-3 py-1.5 rounded cursor-pointer transition-all flex items-center gap-1.5 outline-none font-bold"
                            >
                              <Flame className="w-2.5 h-2.5 shrink-0 text-[#F59E0B]" />
                              <span className="font-sans font-medium text-white group-hover:text-[#F59E0B]">{create.name}</span>
                              <span className="text-[8px] text-[#6A7180] uppercase">({create.brand})</span>
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {activeTab === 'synthetics' && (
        <div className="space-y-6 animate-fadeIn pb-12">
          {/* Synthetics Gallery Header */}
          <div className="bg-[#15181F] border border-[#2D3139] p-6 rounded-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-5 pointer-events-none">
              <Atom className="w-48 h-48 text-[#A855F7]" />
            </div>
            
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#A855F7] flex items-center gap-2">
              <Atom className="w-4 h-4 text-[#A855F7]" /> The Layman&apos;s Guide
            </h3>
            <p className="text-2xl font-display font-bold text-white mt-1">
              Perfume Synthetics &amp; Molecular Building Blocks
            </p>
            <p className="text-xs text-[#6A7180] max-w-3xl mt-2 leading-relaxed font-sans text-justify">
              Modern fine fragrance is an intricate tapestry of nature and advanced organic synthesis. Synthetics aren&apos;t &ldquo;cheap fillers&rdquo;&mdash;they are the incredible structural backbones, invisible radiators, and crisp special effects that make a perfume float, last, or turn into mouth-watering, delicious art. Click any of the iconic creations listed under the <strong>Where You&apos;ve Smelled It</strong> column to load it instantly into our <strong>Dossier Analyst</strong>.
            </p>

            {/* Custom Search & Filters Box */}
            <div className="mt-6 space-y-4">
              <div className="relative max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-[#6A7180]" />
                </span>
                <input
                  type="text"
                  placeholder="Search synthetics, scent profiles, magic tricks, or fragrances..."
                  value={searchSyntheticsQuery}
                  onChange={(e) => setSearchSyntheticsQuery(e.target.value)}
                  className="w-full bg-[#0A0B0E] border border-[#2D3139] text-xs font-mono text-white placeholder-[#6A7180]/50 pl-9 pr-4 py-2 rounded focus:outline-none focus:border-[#3B82F6] transition-colors"
                  id="synthetics-search-input"
                />
                {searchSyntheticsQuery && (
                  <button
                    onClick={() => setSearchSyntheticsQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6A7180] hover:text-white text-[9px] font-mono container-clear-btn shadow-none bg-transparent hover:bg-transparent border-0"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[#2D3139]/40">
                <button
                  onClick={() => setSelectedSyntheticsCategory(null)}
                  className={`text-[9.5px] font-mono px-3 py-1.5 rounded-sm border transition-all cursor-pointer ${
                    selectedSyntheticsCategory === null 
                      ? 'bg-[#A855F7]/15 border-[#A855F7] text-white font-bold' 
                      : 'bg-[#15181F] border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/40 hover:text-white'
                  }`}
                >
                  All Molecules
                </button>
                {[
                  "The Clean, Cozy, & \"Skin-Like\" Aromas",
                  "The Invisible Radiance & Mineral Textures",
                  "The Floral Illusions",
                  "The Fresh, Green, & Aquatic \"Special Effects\"",
                  "The Sweet, Delicious Gourmands"
                ].map((cat, catIdx) => (
                  <button
                    key={`synthetic-cat-tab-${catIdx}`}
                    onClick={() => setSelectedSyntheticsCategory(cat)}
                    className={`text-[9.5px] font-mono px-3 py-1.5 rounded-sm border transition-all cursor-pointer ${
                      selectedSyntheticsCategory === cat 
                        ? 'bg-[#A855F7]/15 border-[#A855F7] text-white font-bold' 
                        : 'bg-[#15181F] border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/40 hover:text-white'
                    }`}
                  >
                    {cat.replace(/"/g, '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SYNTHETICS LISTING */}
          <div className="space-y-6">
            {(() => {
              const query = searchSyntheticsQuery.toLowerCase().trim();
              const filtered = PERFUME_SYNTHETICS_DATABASE.filter(item => {
                // Category Filter
                if (selectedSyntheticsCategory && item.category !== selectedSyntheticsCategory) return false;

                // Search Query Filter
                if (!query) return true;
                return item.name.toLowerCase().includes(query) ||
                  item.category.toLowerCase().includes(query) ||
                  item.smell.toLowerCase().includes(query) ||
                  item.magicTrick.toLowerCase().includes(query) ||
                  item.whereSmelledText.toLowerCase().includes(query) ||
                  item.creations.some(c => 
                    c.name.toLowerCase().includes(query) || 
                    (c.brand && c.brand.toLowerCase().includes(query))
                  );
              });

              if (filtered.length === 0) {
                return (
                  <div className="bg-[#15181F] border border-[#2D3139] p-12 text-center rounded-sm space-y-3">
                    <span className="text-xl font-mono block text-[#6A7180]">✕</span>
                    <p className="font-mono text-xs text-[#6A7180] uppercase tracking-wider">No matching synthetics found</p>
                    <p className="text-[10px] text-[#6A7180] font-sans">Try searching for famous chemicals like &quot;Ambroxan&quot;, &quot;Iso E Super&quot;, &quot;Cashmeran&quot;, or &quot;Hedione&quot;.</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.map((item, idx) => (
                    <div 
                      key={`synthetic-card-${idx}`}
                      className="bg-[#15181F] border border-[#2D3139] hover:border-[#A855F7]/40 p-6 rounded-sm flex flex-col justify-between transition-all"
                    >
                      <div className="space-y-4">
                        {/* Header metadata segment */}
                        <div className="flex items-start justify-between border-b border-[#2D3139]/50 pb-3">
                          <div>
                            <span className="text-[8px] font-mono bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/15 px-2.5 py-0.5 rounded-sm uppercase tracking-wider block w-fit mb-1.5 font-bold">
                              {item.category}
                            </span>
                            <h4 className="font-display font-medium text-base text-white tracking-wide flex items-center gap-2">
                              {item.name}
                            </h4>
                          </div>
                          <Atom className="w-5 h-5 text-[#A855F7]/40 shrink-0" />
                        </div>

                        {/* What It Actually Smells Like Row */}
                        <div className="bg-[#0A0B0E] p-3 border border-[#2D3139]/40 rounded-sm">
                          <span className="font-mono text-[8.5px] uppercase text-[#A855F7] font-bold block mb-1">
                            What It Actually Smells Like
                          </span>
                          <p className="text-xs text-white/95 font-sans italic leading-relaxed">
                            &quot;{item.smell}&quot;
                          </p>
                        </div>

                        {/* Direct Perfume Magic Trick Explanation */}
                        <div className="space-y-1">
                          <span className="font-mono text-[8.5px] uppercase text-[#6A7180] font-bold block">
                            The Perfume Magic Trick
                          </span>
                          <p className="text-xs text-slate-300 font-sans leading-relaxed text-[#c0c6d4] text-justify text-left">
                            {item.magicTrick}
                          </p>
                        </div>

                        {/* Where You've Smelled It Raw Text */}
                        <div className="space-y-1">
                          <span className="font-mono text-[8.5px] uppercase text-[#6A7180] font-bold block">
                            Where You&apos;ve Smelled It
                          </span>
                          <p className="text-xs text-slate-400 font-sans italic text-left">
                            {item.whereSmelledText}
                          </p>
                        </div>
                      </div>

                      {/* Interactive creations click selection */}
                      <div className="border-t border-[#2D3139]/50 pt-4 mt-5">
                        <span className="font-mono text-[8.5px] uppercase text-[#A855F7] font-bold block mb-2.5">
                          Analyze Famous References (Click to load &amp; analyze)
                        </span>

                        <div className="flex flex-wrap gap-2">
                          {item.creations.map((create, cIdx) => (
                            <button
                              key={`synthetic-create-${cIdx}`}
                              onClick={() => {
                                setSearchBrand(create.brand || '');
                                setSearchName(create.name);
                                setActiveTab('dossier');
                                showNotification(`Loaded "${create.brand ? create.brand + ' ' : ''}${create.name}" into Fragrance Name &amp; Flanker field. Press Initiate to run GC-MS assay.`, 5000);
                              }}
                              className="bg-[#0A0B0E] hover:bg-[#A855F7]/10 border border-[#2D3139] hover:border-[#A855F7]/50 text-slate-200 hover:text-[#A855F7] text-[10.5px] font-mono px-3 py-1.5 rounded cursor-pointer transition-all flex items-center gap-1.5 outline-none font-bold"
                            >
                              <Atom className="w-2.5 h-2.5 shrink-0 text-[#A855F7]" />
                              <span className="font-sans font-medium">{create.name}</span>
                              {create.brand && <span className="text-[8px] text-[#6A7180] uppercase">({create.brand})</span>}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {activeTab === 'matrix' && (
        <div className="space-y-6 animate-fadeIn pb-12">
          {/* Master Matrix Header */}
          <div className="bg-[#15181F] border border-[#2D3139] p-6 rounded-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-5 pointer-events-none">
              <FileSpreadsheet className="w-48 h-48 text-[#10B981]" />
            </div>
            
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#10B981] flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#10B981]" /> Formulation &amp; Regulatory Database
            </h3>
            <p className="text-2xl font-display font-bold text-white mt-1">
              Master Inventory of Synthetics (Technical &amp; Regulatory Formulation Matrix)
            </p>
            <p className="text-xs text-[#6A7180] max-w-3xl mt-2 leading-relaxed font-sans text-justify">
              This master technical registry exposes the thermodynamic properties, chemical identifiers, regulatory limits, and olfactory dynamics of key synthetic isolates. Filter by formulation category or search by material name, CAS number, or physical characteristics to inspect high-velocity volatiles, diffusive blenders, and linear fixative anchors.
            </p>

            {/* Custom Search & Filters Box */}
            <div className="mt-6 space-y-4">
              <div className="relative max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-[#6A7180]" />
                </span>
                <input
                  type="text"
                  placeholder="Search by name, CAS, IUPAC identity, or scent profiles..."
                  value={searchMatrixQuery}
                  onChange={(e) => setSearchMatrixQuery(e.target.value)}
                  className="w-full bg-[#0A0B0E] border border-[#2D3139] text-xs font-mono text-white placeholder-[#6A7180]/50 pl-9 pr-4 py-2 rounded focus:outline-none focus:border-[#3B82F6] transition-colors"
                  id="matrix-search-input"
                />
                {searchMatrixQuery && (
                  <button
                    onClick={() => setSearchMatrixQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6A7180] hover:text-white text-[9px] font-mono container-clear-btn shadow-none bg-transparent hover:bg-transparent border-0"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[#2D3139]/40">
                <button
                  onClick={() => setSelectedMatrixCategory(null)}
                  className={`text-[9.5px] font-mono px-3 py-1.5 rounded-sm border transition-all cursor-pointer ${
                    selectedMatrixCategory === null 
                      ? 'bg-[#10B981]/15 border-[#10B981] text-white font-bold' 
                      : 'bg-[#15181F] border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/40 hover:text-white'
                  }`}
                >
                  All Classes
                </button>
                {[
                  "Top Note Modifiers & High-Velocity Volatiles",
                  "Heart-Note Core Architects & Diffusive Blenders",
                  "Woody, Ambergris, & Macrocyclic Fixative Anchors",
                  "Macrocyclic & Alicyclic Musks"
                ].map((cat, catIdx) => (
                  <button
                    key={`matrix-cat-tab-${catIdx}`}
                    onClick={() => setSelectedMatrixCategory(cat)}
                    className={`text-[9.5px] font-mono px-3 py-1.5 rounded-sm border transition-all cursor-pointer ${
                      selectedMatrixCategory === cat 
                        ? 'bg-[#10B981]/15 border-[#10B981] text-white font-bold' 
                        : 'bg-[#15181F] border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/40 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table Matrix */}
          <div className="bg-[#11141A] border border-[#2D3139] rounded-sm overflow-hidden">
            {(() => {
              const query = searchMatrixQuery.toLowerCase().trim();
              const filtered = TECHNICAL_SYNTHETICS_DATABASE.filter(item => {
                // Category Filter
                if (selectedMatrixCategory && item.category !== selectedMatrixCategory) return false;

                // Search Query Filter
                if (!query) return true;
                return item.name.toLowerCase().includes(query) ||
                  item.category.toLowerCase().includes(query) ||
                  item.casIupac.toLowerCase().includes(query) ||
                  item.profile.toLowerCase().includes(query) ||
                  item.substantivity.toLowerCase().includes(query) ||
                  item.ifraLimit.toLowerCase().includes(query) ||
                  item.vaporPressure.toLowerCase().includes(query);
              });

              if (filtered.length === 0) {
                return (
                  <div className="p-12 text-center space-y-3">
                    <span className="text-xl font-mono block text-[#6A7180]">✕</span>
                    <p className="font-mono text-xs text-[#6A7180] uppercase tracking-wider">No technical records found matching criteria</p>
                    <p className="text-[10px] text-[#6A7180] font-sans">Try modifying your search or choosing &quot;All Classes&quot; above.</p>
                  </div>
                );
              }

              return (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#15181F] border-b border-[#2D3139]/80 text-[#6A7180] font-mono uppercase text-[9.5px] tracking-wider">
                        <th className="p-4 font-semibold w-[15%] min-w-[140px]">Material Name</th>
                        <th className="p-4 font-semibold w-[22%] min-w-[200px]">CAS &amp; IUPAC Identity</th>
                        <th className="p-4 font-semibold w-[25%] min-w-[240px]">Olfactory Profile &amp; Facets</th>
                        <th className="p-4 font-semibold w-[10%] min-w-[100px]">Substantivity</th>
                        <th className="p-4 font-semibold w-[15%] min-w-[160px]">IFRA Cat 4 Max / Regs</th>
                        <th className="p-4 font-semibold w-[13%] min-w-[140px]">VP &amp; Threshold</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2D3139]/40 font-mono text-[11px] text-[#c0c6d4]">
                      {filtered.map((item, idx) => (
                        <tr 
                          key={`matrix-row-${idx}`}
                          className="hover:bg-[#15181F]/40 transition-colors"
                        >
                          {/* Material Name & Category Tag */}
                          <td className="p-4 align-top">
                            <span className="text-white font-bold font-display text-sm tracking-wide block">
                              {item.name}
                            </span>
                            <span className="text-[8px] font-mono text-[#10B981] uppercase font-semibold bg-[#10B981]/5 px-1.5 py-0.5 rounded border border-[#10B981]/10 mt-1.5 inline-block">
                              {item.category.replace(/ \(.+\)/g, '')}
                            </span>
                          </td>
                          
                          {/* CAS & IUPAC Identity */}
                          <td className="p-4 align-top text-slate-400 font-mono leading-relaxed break-all">
                            {item.casIupac}
                          </td>
                          
                          {/* Olfactory Profile */}
                          <td className="p-4 align-top font-sans text-[#c0c6d4] leading-relaxed text-justify">
                            {item.profile}
                          </td>
                          
                          {/* Substantivity */}
                          <td className="p-4 align-top text-[#ECD154] font-semibold">
                            {item.substantivity}
                          </td>
                          
                          {/* IFRA Limits / Regulation */}
                          <td className="p-4 align-top text-xs leading-relaxed text-slate-300 font-sans">
                            {item.ifraLimit}
                          </td>
                          
                          {/* Vapor Pressure */}
                          <td className="p-4 align-top text-xs leading-relaxed text-[#3B82F6] font-mono">
                            {item.vaporPressure}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="space-y-6 animate-fadeIn pb-12">
          {/* Master Timeline Header */}
          <div className="bg-[#15181F] border border-[#2D3139] p-6 rounded-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-5 pointer-events-none">
              <Calendar className="w-48 h-48 text-[#F59E0B]" />
            </div>
            
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#F59E0B] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#F59E0B]" /> Olfactory Chronogenics
            </h3>
            <p className="text-2xl font-display font-bold text-white mt-1">
              The Master Timeline of Olfactory Genre Breakdowns
            </p>
            <p className="text-xs text-[#6A7180] max-w-3xl mt-2 leading-relaxed font-sans text-justify">
              FINE FRAGRANCE IS A SPECTRUM OF HISTORICAL ACCIDENTS IN HIGH-CONTRAST JUXTAPOSITION. Explore the monumental epochs in formulation history, where the isolation and synthesis of raw molecular agents permanently altered human scent memory. Click any reference specimen&apos;s name in the timeline milestones to instantly load it into the <strong>Dossier Analyst</strong>.
            </p>

            {/* Custom Search & Era Filtering */}
            <div className="mt-6 space-y-4">
              <div className="relative max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-[#6A7180]" />
                </span>
                <input
                  type="text"
                  placeholder="Search genres, years, benchmark creations, molecules, or masters..."
                  value={searchTimelineQuery}
                  onChange={(e) => setSearchTimelineQuery(e.target.value)}
                  className="w-full bg-[#0A0B0E] border border-[#2D3139] text-xs font-mono text-white placeholder-[#6A7180]/50 pl-9 pr-4 py-2 rounded focus:outline-none focus:border-[#F59E0B] transition-colors"
                  id="timeline-search-input"
                />
                {searchTimelineQuery && (
                  <button
                    onClick={() => setSearchTimelineQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6A7180] hover:text-white text-[9px] font-mono container-clear-btn shadow-none bg-transparent hover:bg-transparent border-0"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Epoch Selectors */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[#2D3139]/40">
                <button
                  onClick={() => setSelectedTimelineCategory(null)}
                  className={`text-[9.5px] font-mono px-3 py-1.5 rounded-sm border transition-all cursor-pointer ${
                    selectedTimelineCategory === null 
                      ? 'bg-[#F59E0B]/15 border-[#F59E0B] text-white font-bold' 
                      : 'bg-[#15181F] border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/40 hover:text-white'
                  }`}
                >
                  All Epochs
                </button>
                {[
                  "The Belle Époque (1880–1919)",
                  "Post-War Avant-Garde (1920–1959)",
                  "Powerhouses & Fuel (1960–1989)",
                  "Modernism & Marine (1990–Present)"
                ].map((epoch, eIdx) => (
                  <button
                    key={`epoch-tab-${eIdx}`}
                    onClick={() => setSelectedTimelineCategory(epoch)}
                    className={`text-[9.5px] font-mono px-3 py-1.5 rounded-sm border transition-all cursor-pointer ${
                      selectedTimelineCategory === epoch 
                        ? 'bg-[#F59E0B]/15 border-[#F59E0B] text-white font-bold' 
                        : 'bg-[#15181F] border-[#2D3139] text-[#6A7180] hover:border-[#6A7180]/40 hover:text-white'
                    }`}
                  >
                    {epoch}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Olfactory Evolution Matrix Chart Card */}
          <div className="bg-[#11141A] border border-[#2D3139] p-6 rounded-sm space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#3B82F6] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse"></span>
              Olfactory Evolution Matrix
            </h4>
            <p className="text-[11.5px] text-[#c0c6d4] leading-relaxed max-w-2xl font-sans text-justify">
              Whenever you experience a contemporary perfume family, you are interacting with an engineered chemical lineage. Traditional pre-1880s linear botanical floral blends were permanently split into abstract geometric genres by the advent of custom synthesized isolates:
            </p>
            
            {/* Interactive Grid/Map for Evolution Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              {[
                {
                  year: "1882",
                  isolate: "+ Coumarin",
                  genre: "[ FOUGÈRE GENRE ]",
                  desc: "Manicured barbershop grooming blueprint.",
                  color: "border-[#10B981]/30 hover:border-[#10B981]",
                  text: "text-[#10B981]",
                  bg: "bg-[#10B981]/5"
                },
                {
                  year: "1889",
                  isolate: "+ Vanillin",
                  genre: "[ AMBRE GENRE ]",
                  desc: "Rich, abstract, non-linear resin opulence.",
                  color: "border-[#ECD154]/30 hover:border-[#ECD154]",
                  text: "text-[#ECD154]",
                  bg: "bg-[#ECD154]/5"
                },
                {
                  year: "1921",
                  isolate: "+ Aldehydes (C-10/C-11/C-12)",
                  genre: "[ ALDEHYDIC ]",
                  desc: "Freezing waxy soaps & computerized clean floral lift.",
                  color: "border-[#3B82F6]/30 hover:border-[#3B82F6]",
                  text: "text-[#3B82F6]",
                  bg: "bg-[#3B82F6]/5"
                },
                {
                  year: "1992",
                  isolate: "+ Calone 1951",
                  genre: "[ AQUATIC GENRE ]",
                  desc: "Weightless, watermelon/sea-breeze minimalist ozone.",
                  color: "border-[#06B6D4]/30 hover:border-[#06B6D4]",
                  text: "text-[#06B6D4]",
                  bg: "bg-[#06B6D4]/5"
                },
                {
                  year: "1992",
                  isolate: "+ Ethyl Maltol",
                  genre: "[ GOURMAND ]",
                  desc: "Burnt sugar confectionery with dense dark patchouli.",
                  color: "border-[#A855F7]/30 hover:border-[#A855F7]",
                  text: "text-[#A855F7]",
                  bg: "bg-[#A855F7]/5"
                }
              ].map((matrixItem, matrixIdx) => (
                <div 
                  key={`matrix-node-${matrixIdx}`}
                  className={`border ${matrixItem.color} ${matrixItem.bg} p-4 rounded-sm hover:-translate-y-1 transition-all duration-350 flex flex-col justify-between`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-[#6A7180] font-mono">
                      <span>{matrixItem.year}</span>
                      <span className="font-bold">{matrixItem.isolate}</span>
                    </div>
                    <div className={`font-mono font-bold text-xs ${matrixItem.text} tracking-wider pt-2`}>
                      {matrixItem.genre}
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed pt-1.5">
                      {matrixItem.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#2D3139]/40 mt-3">
                    <button
                      onClick={() => {
                        setSearchTimelineQuery(matrixItem.year);
                      }}
                      className="text-[9.5px] font-mono text-[#F59E0B] hover:underline hover:text-white transition-colors cursor-pointer w-full text-left bg-transparent border-0 p-0 font-bold"
                    >
                      Filter Timeline →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#0A0B0E] border border-[#2D3139]/60 p-3.5 rounded-sm relative overflow-hidden">
              <span className="absolute top-0 right-0 text-[10px] font-mono text-[#F59E0B]/10 pointer-events-none p-1.5">LINEAGE CONCEPT</span>
              <p className="text-[11px] text-[#8C93A3] leading-relaxed font-sans text-justify italic">
                &ldquo;Whenever you spray a perfume from a specific family, you are not interacting with an organic accident. You are stepping inside a carefully engineered lineage of chemical history—where an isolated synthetic molecule was deployed by a master artist to permanently alter the boundaries of human scent memory.&rdquo;
              </p>
            </div>
          </div>

          {/* MASTER VISUAL TIMELINE COMPONENT */}
          <div className="relative font-mono text-left">
            {/* Left line on desktop/mobile running behind milestones */}
            <div className="absolute left-6 md:left-[50%] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#F59E0B]/70 via-[#3B82F6]/30 to-[#10B981]/50 pointer-events-none transform md:-translate-x-[50%]"></div>

            {(() => {
              const query = searchTimelineQuery.toLowerCase().trim();
              const getCategoryForYear = (year: number) => {
                if (year >= 1880 && year <= 1919) return "The Belle Époque (1880–1919)";
                if (year >= 1920 && year <= 1959) return "Post-War Avant-Garde (1920–1959)";
                if (year >= 1960 && year <= 1989) return "Powerhouses & Fuel (1960–1989)";
                return "Modernism & Marine (1990–Present)";
              };

              const filtered = TIMELINE_DATABASE.filter(item => {
                const category = getCategoryForYear(item.year);
                if (selectedTimelineCategory && category !== selectedTimelineCategory) return false;

                if (!query) return true;
                return String(item.year).includes(query) ||
                  item.genre.toLowerCase().includes(query) ||
                  item.pillarFragrance.toLowerCase().includes(query) ||
                  item.brand.toLowerCase().includes(query) ||
                  item.masterNose.toLowerCase().includes(query) ||
                  item.breakthroughMolecule.toLowerCase().includes(query) ||
                  item.skeleton.toLowerCase().includes(query) ||
                  item.innovation.toLowerCase().includes(query);
              });

              if (filtered.length === 0) {
                return (
                  <div className="bg-[#15181F] border border-[#2D3139] p-12 text-center rounded-sm space-y-3 relative z-10">
                    <span className="text-xl font-mono block text-[#6A7180]">✕</span>
                    <p className="font-mono text-xs text-[#6A7180] uppercase tracking-wider">No timeline milestones matched</p>
                    <p className="text-[10px] text-[#6A7180] font-sans">Try widening your search terms or picking &quot;All Epochs&quot; above.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-12 relative z-10">
                  {filtered.map((item, idx) => {
                    const isEven = idx % 2 === 0;
                    const blockCategory = getCategoryForYear(item.year);

                    return (
                      <div 
                        key={`timeline-milestone-${idx}`}
                        className={`flex flex-col md:flex-row items-stretch ${
                          isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                        } relative min-h-[220px]`}
                      >
                        {/* Connecting Dot with Year hover */}
                        <div className="absolute left-6 md:left-[50%] top-6 transform -translate-x-[50%] flex items-center justify-center z-20">
                          <div className="w-10 h-10 rounded-full bg-[#0A0B0E] border-2 border-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.25)] flex items-center justify-center text-xs text-[#F59E0B] font-bold tracking-tight">
                            {item.year}
                          </div>
                        </div>

                        {/* Left Side spacer on Desktop / details card on mobile */}
                        <div className="w-full md:w-[46%] hidden md:block"></div>

                        {/* Details Card */}
                        <div className="w-full md:w-[46%] pl-14 md:pl-0">
                          <div className="bg-[#15181F] border border-[#2D3139] hover:border-[#F59E0B]/30 p-6 rounded-sm space-y-4 transition-all relative">
                            {/* Accent Glow for active card */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#F59E0B]/80 to-transparent"></div>

                            {/* Header Metadata block */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2D3139]/40 pb-2.5">
                              <div>
                                <span className="text-[8px] font-mono bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/15 px-2 py-0.5 rounded-sm uppercase tracking-wider font-semibold">
                                  {blockCategory}
                                </span>
                                <h4 className="text-base font-display font-bold text-white tracking-wide mt-1.5">
                                  {item.genre}
                                </h4>
                              </div>
                              <span className="text-xl font-display font-light text-[#F59E0B]">
                                {item.year}
                              </span>
                            </div>

                            {/* Essential Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] bg-[#0A0B0E] p-3 border border-[#2D3139]/40 rounded-sm">
                              <div>
                                <span className="text-[#6A7180] uppercase tracking-wider font-semibold text-[8px] block">Pillar Fragrance</span>
                                <button
                                  onClick={() => {
                                    setSearchBrand(item.brand);
                                    setSearchName(item.pillarFragrance);
                                    setActiveTab('dossier');
                                    showNotification(`Loaded "${item.brand} ${item.pillarFragrance}" Reference Specimen. Click Initiate to trigger GC-MS assays.`, 5000);
                                  }}
                                  className="text-white hover:text-[#F59E0B] font-bold text-left outline-none hover:underline focus:underline cursor-pointer bg-transparent border-0 p-0 block mt-0.5"
                                >
                                  {item.pillarFragrance} ({item.brand})
                                </button>
                              </div>
                              <div>
                                <span className="text-[#6A7180] uppercase tracking-wider font-semibold text-[8px] block">The Master Nose</span>
                                <span className="text-slate-350 block mt-0.5 font-sans font-medium text-slate-300">
                                  {item.masterNose}
                                </span>
                              </div>
                              <div className="sm:col-span-2 pt-1 border-t border-[#2D3139]/30 mt-1">
                                <span className="text-[#6A7180] uppercase tracking-wider font-semibold text-[8px] block">Molecular Breakthrough</span>
                                <span className="text-[#A855F7] font-semibold block mt-0.5 font-sans">
                                  {item.breakthroughMolecule}
                                </span>
                              </div>
                            </div>

                            {/* Structural Skeleton Component */}
                            <div className="space-y-1.5">
                              <span className="text-[#6A7180] uppercase tracking-wider font-semibold text-[8px] block">The Structural Skeleton</span>
                              <div className="bg-[#0D0E12] border border-[#23272F] px-3.5 py-2.5 rounded-sm flex items-center gap-1.5 text-[9.5px] font-mono text-[#10B981] overflow-x-auto whitespace-nowrap whitespace-normal">
                                <div className="flex flex-wrap items-center gap-2 font-mono font-semibold">
                                  {item.skeleton.split(' → ').map((node, nodeIdx, arr) => (
                                    <div key={`node-${nodeIdx}`} className="flex items-center gap-2">
                                      <span className="bg-[#11141A] border border-[#2D3139] px-2 py-1 rounded text-slate-200">
                                        {node}
                                      </span>
                                      {nodeIdx < arr.length - 1 && (
                                        <span className="text-[#F59E0B] font-bold">→</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Architectural Innovation Description text */}
                            <div className="space-y-1">
                              <span className="text-[#F59E0B] uppercase tracking-wider font-semibold text-[8px] block">Architectural Innovation</span>
                              <p className="text-xs text-[#c0c6d4] font-sans leading-relaxed text-justify text-left">
                                {item.innovation}
                              </p>
                            </div>

                            {/* Manual Integration Trigger button */}
                            <div className="pt-2 border-t border-[#2D3139]/35 flex justify-end">
                              <button
                                onClick={() => {
                                  setSearchBrand(item.brand);
                                  setSearchName(item.pillarFragrance);
                                  setActiveTab('dossier');
                                  showNotification(`Loaded reference legacy specimen "${item.brand} ${item.pillarFragrance}" successfully.`, 5000);
                                }}
                                className="bg-[#0A0B0E] hover:bg-[#F59E0B]/10 border border-[#2D3139] hover:border-[#F59E0B]/50 hover:text-[#F59E0B] text-white text-[10px] font-mono px-3 py-1.5 rounded cursor-pointer transition-all flex items-center gap-1.5 outline-none font-bold"
                              >
                                <Beaker className="w-3 h-3 text-[#F59E0B]" /> Parse Benchmark in Dossier
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      </main>
      
      {/* Footer copyright block with detailed legal disclaimer, copyright, and contact details */}
      <footer className="max-w-7xl mx-auto px-6 mt-20 pb-12 pt-8 border-t border-[#2D3139] space-y-8 font-mono text-[9.5px] text-[#6A7180] text-left">
        {/* Contact and Copyright strip */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#2D3139]/40 pb-6">
          <div className="space-y-1">
            <span className="text-white font-bold block">AROMATA MOLECULAR SYSTEMS</span>
            <span className="block">© 2026 Ali Asger Talib. All rights reserved.</span>
          </div>
          <div className="bg-[#15181F] border border-[#2D3139] px-4 py-2.5 rounded-sm shrink-0">
            <span className="block text-[8px] text-[#6A7180] uppercase tracking-wider font-semibold">Contact Administrator</span>
            <a href="mailto:aliasgertalib@gmail.com" className="text-[#3B82F6] hover:underline font-bold text-[10px] mt-0.5 block">
              aliasgertalib@gmail.com
            </a>
          </div>
        </div>

        {/* Scientific and Legal Disclaimer */}
        <div className="space-y-2 leading-relaxed">
          <span className="text-white font-bold uppercase tracking-wider block text-[8.5px]">Legal & Academic Disclaimer</span>
          <p className="font-sans text-[9px] text-[#6A7180] max-w-5xl leading-normal">
            All brand trademarks, trade designations, bottle presentations, commercial logs, and brand names shown, cited, or simulated inside the Aromata application are the sole property of their respective trademark owners. Aromata Molecular Systems is an independent scientific modeling simulator, academic research framework, and chemical training tool. It is not affiliated with, licensed by, authorized by, sponsored by, or associated with any commercial brand, fine fragrance house, or perfume distributor listed in the database. Scent isolate proportions, GC-MS spectrograph files, HPLC concentration matrix loads, and hourly sillage radial curves are synthesized predictive approximations designed purely for technical, educational, and scientific informational analysis.
          </p>
        </div>
      </footer>
      </div> {/* Closing main-app-layout wrapping for proper print isolation */}

      {/* ON-SCREEN PRINT PORTAL MODAL PREVIEW FOR SANDBOX OR STANDARD SHARING */}
      <AnimatePresence>
        {isPrintPortalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto no-print">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0D0F14] border border-[#2D3139] rounded-sm w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]"
            >
              {/* Header */}
              <div className="border-b border-[#2D3139] p-5 flex items-center justify-between bg-[#15181F]">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-500/10 p-2 rounded text-purple-400">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-xs font-bold text-white uppercase tracking-widest">
                      Aromata Lab Export & Print Portal
                    </h3>
                    <p className="text-[10px] text-[#6A7180] font-mono uppercase mt-0.5">
                      Deterministic Spectrometry Reporting Engine
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPrintPortalOpen(false)}
                  className="text-slate-400 hover:text-white font-mono text-sm uppercase cursor-pointer"
                >
                  Close ×
                </button>
              </div>

              {/* Informational Warning Info Plate */}
              <div className="bg-amber-950/20 border-b border-amber-500/20 p-4 font-sans text-xs text-amber-300 space-y-2">
                <div className="flex items-center gap-2 font-bold font-mono text-[10px] uppercase">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Iframe Sandbox Guidance Directive
                </div>
                <p className="leading-relaxed">
                  Most modern web browsers restrict interactive modal dialogs (like print, prompt, or alert) when apps are rendered inside a **sandboxed preview frame**. If your printer dialog did not launch, please click the <strong>"Open in normal window/New Tab"</strong> icon at the top right of your workspace before printing, or instantly copy the master lab report below.
                </p>
              </div>

              {/* Action Buttons Hub */}
              <div className="p-4 bg-[#15181F] border-b border-[#2D3139] flex flex-wrap gap-3 items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyReportData}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#3B82F6]/10 hover:bg-[#3B82F6] hover:text-white text-[#3B82F6] text-xs font-mono font-bold tracking-wider uppercase border border-[#3B82F6]/25 rounded-sm cursor-pointer transition-all"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied Lab Data!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Structured Raw Report
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      try {
                        window.print();
                      } catch (err) {
                        console.warn(err);
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-purple-500/10 hover:bg-purple-600 text-purple-400 hover:text-white text-xs font-mono font-bold tracking-wider uppercase border border-purple-500/20 rounded-sm cursor-pointer transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Retry Print Trigger
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPrintPortalOpen(false)}
                  className="px-4 py-2 bg-transparent text-[#6A7180] hover:text-white text-xs font-mono uppercase tracking-widest font-bold cursor-pointer transition-colors"
                >
                  Exit Portal
                </button>
              </div>

              {/* Paper Certificate Layout Preview */}
              <div className="p-6 md:p-8 overflow-y-auto bg-zinc-100 flex-1">
                <div className="bg-white text-black p-8 md:p-12 shadow-lg rounded-sm border border-zinc-300 font-serif max-w-3xl mx-auto text-left relative">
                  {/* Seal watermark */}
                  <div className="absolute right-8 top-8 w-24 h-24 border border-zinc-200 rounded-full flex items-center justify-center opacity-40 pointer-events-none select-none">
                    <span className="font-mono text-[9px] uppercase tracking-tighter text-zinc-400 font-bold text-center">AROMATA<br/>SEAL OF<br/>ORIGIN</span>
                  </div>

                  {/* Document Header */}
                  <div className="border-b-4 border-black pb-4 mb-6 flex justify-between items-end">
                    <div>
                      <h4 className="text-xl font-black uppercase font-serif tracking-tight">
                        Aromata Molecular Systems
                      </h4>
                      <p className="text-[9px] uppercase tracking-widest font-mono text-zinc-500 font-extrabold">
                        Chromatography & Residual Fine Spectrometry Lab Report
                      </p>
                    </div>
                    <div className="text-right font-mono text-[8px] text-zinc-400 leading-tight">
                      <div>REPORT ID: AMS-DETERMINISTIC-{selectedFragrance ? selectedFragrance.brand.substring(0,3).toUpperCase() : 'LAY'}</div>
                      <div>DATE: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      <div>CERTIFICATION: SECURE LAB DATA</div>
                    </div>
                  </div>

                  {printPortalType === 'dossier' && selectedFragrance ? (
                    <div className="space-y-6 text-xs text-zinc-900 leading-relaxed">
                      <div>
                        <span className="font-mono text-[80%] uppercase tracking-widest text-zinc-400 font-bold block">Specimen Analysis Target</span>
                        <h3 className="text-xl font-bold font-serif italic text-black">
                          {selectedFragrance.brand} — {selectedFragrance.name}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 font-mono text-[90%] text-zinc-700 bg-zinc-50 p-2 border border-zinc-200 rounded-sm">
                          <div><strong>CONC:</strong> {selectedFragrance.concentration || 'EDPs'}</div>
                          <div><strong>CREATOR:</strong> {selectedFragrance.nose || 'N/A'}</div>
                          <div><strong>YEAR:</strong> {selectedFragrance.releaseYear}</div>
                          <div><strong>FAMILY:</strong> {selectedFragrance.olfactoryFamily}</div>
                        </div>
                      </div>

                      <div className="border-t border-zinc-150 pt-3">
                        <span className="font-mono text-[80%] uppercase tracking-widest text-zinc-400 font-bold block">SPECIMEN ESSENCE & PROFILE SUMMARY</span>
                        <p className="italic text-zinc-700 font-serif mt-1">
                          "{selectedFragrance.story || "Each selective compound represents a distinct sensory chapter."}"
                        </p>
                      </div>

                      <div className="border-t border-zinc-150 pt-3">
                        <span className="font-mono text-[80%] uppercase tracking-widest text-zinc-400 font-bold block mb-1">OLFACTORY NOTES HIERARCHY</span>
                        <div className="grid grid-cols-3 gap-3 font-mono text-[90%]">
                          <div className="p-2 border border-zinc-200 bg-zinc-50/50">
                            <strong>Top Notes</strong>
                            <ul className="list-disc pl-4 text-zinc-750 space-y-0.5 mt-1 font-serif text-[90%]">
                              {selectedFragrance.notes.top.map((n, i) => <li key={i}>{n}</li>)}
                            </ul>
                          </div>
                          <div className="p-2 border border-zinc-200 bg-zinc-50/50">
                            <strong>Heart Notes</strong>
                            <ul className="list-disc pl-4 text-zinc-750 space-y-0.5 mt-1 font-serif text-[90%]">
                              {selectedFragrance.notes.heart.map((n, i) => <li key={i}>{n}</li>)}
                            </ul>
                          </div>
                          <div className="p-2 border border-zinc-200 bg-zinc-50/50">
                            <strong>Base Notes</strong>
                            <ul className="list-disc pl-4 text-zinc-750 space-y-0.5 mt-1 font-serif text-[90%]">
                              {selectedFragrance.notes.base.map((n, i) => <li key={i}>{n}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-zinc-150 pt-3 grid grid-cols-3 gap-3 text-center">
                        <div className="p-2 border border-zinc-200">
                          <span className="font-mono text-[80%] text-zinc-400 uppercase font-bold">Skin Longevity</span>
                          <div className="text-sm font-black mt-0.5 text-black">{selectedFragrance.skinLongevityIndex.toFixed(1)} Hours</div>
                        </div>
                        <div className="p-2 border border-zinc-200">
                          <span className="font-mono text-[80%] text-zinc-400 uppercase font-bold">Fabric Permanence</span>
                          <div className="text-sm font-black mt-0.5 text-black">{selectedFragrance.fabricPermanenceIndex >= 24 ? `${(selectedFragrance.fabricPermanenceIndex/24).toFixed(0)}d+` : `${selectedFragrance.fabricPermanenceIndex}h`}</div>
                        </div>
                        <div className="p-2 border border-zinc-200">
                          <span className="font-mono text-[80%] text-zinc-400 uppercase font-bold">Anosmia Risk</span>
                          <div className="text-sm font-black mt-0.5 text-rose-700">{selectedFragrance.olfactoryFatigueRisk}%</div>
                        </div>
                      </div>

                      <div className="border-t border-zinc-150 pt-3">
                        <span className="font-mono text-[80%] uppercase tracking-widest text-zinc-400 font-bold block mb-1">Aroma Isolates & Chemical Matrix</span>
                        <table className="w-full text-left font-mono text-[85%] border border-zinc-200">
                          <thead>
                            <tr className="bg-zinc-100 border-b border-zinc-200 font-bold text-zinc-650">
                              <th className="p-1.5 pl-3">Isolate Agent</th>
                              <th className="p-1.5 text-right">Ratio</th>
                              <th className="p-1.5 pl-4">Chemical Purpose</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedFragrance.aromaChemicalMatrix.map((iso, i) => (
                              <tr key={i} className="border-b border-zinc-100">
                                <td className="p-1.5 pl-3 font-semibold text-zinc-900">{iso.name}</td>
                                <td className="p-1.5 text-right font-black text-black">{iso.percentage}%</td>
                                <td className="p-1.5 pl-4 text-zinc-500">{iso.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="border-t border-zinc-150 pt-3">
                        <span className="font-mono text-[80%] uppercase tracking-widest text-zinc-400 font-bold block mb-1">IFRA Regulatory Compliance Checklist</span>
                        <div className="bg-zinc-50 border border-zinc-200 p-2 font-mono text-[90%] flex justify-between font-bold mb-2 rounded-sm">
                          <span>VERIFICATION STATUS:</span>
                          <span className="text-emerald-700">{selectedFragrance.ifraAssessment.status}</span>
                        </div>
                        <table className="w-full text-left font-mono text-[80%] border border-zinc-200">
                          <thead>
                            <tr className="bg-zinc-100 border-b border-zinc-200 text-zinc-500 font-bold">
                              <th className="p-1">Restricted Active</th>
                              <th className="p-1 text-right">Ceiling</th>
                              <th className="p-1 text-right">Actual</th>
                              <th className="p-1 pl-3">Mitigation & Safety</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedFragrance.ifraAssessment.criticalRestrictedMaterials.slice(0, 4).map((m, i) => (
                              <tr key={i} className="border-b border-zinc-100">
                                <td className="p-1 font-bold text-black">{m.name}</td>
                                <td className="p-1 text-right text-amber-700">{m.limitPercent}%</td>
                                <td className="p-1 text-right text-zinc-900">{m.actualPercent}%</td>
                                <td className="p-1 pl-3 text-zinc-500">{m.impact}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : printPortalType === 'layering' && layeringResult ? (
                    <div className="space-y-6 text-xs text-zinc-900 leading-relaxed">
                      <div>
                        <span className="font-mono text-[80%] uppercase tracking-widest text-zinc-400 font-bold block">Chemical Synergy Combination Report</span>
                        <h3 className="text-xl font-bold font-serif italic text-black">
                          Scent Overlay & Interaction Matrix
                        </h3>
                        <div className="grid grid-cols-2 gap-3 mt-3 font-mono text-[90%] text-zinc-700 bg-zinc-50 p-2 border border-zinc-200 rounded-sm">
                          <div><strong>BASE SPECIMEN A:</strong> {layeringSelectA}</div>
                          <div><strong>CANOPY SPECIMEN B:</strong> {layeringSelectB}</div>
                        </div>
                      </div>

                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-sm">
                        <div className="flex items-center justify-between font-mono font-bold mb-1.5 text-purple-950 text-[95%]">
                          <span>SYNERGY COEFFICIENT:</span>
                          <span className="text-purple-800 text-sm">{layeringResult.compatibilityScore}% ({layeringResult.compatibilityLevel})</span>
                        </div>
                        <p className="font-serif italic text-purple-900 mt-1">
                          {layeringResult.molecularSummary}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-2 border border-zinc-150">
                          <strong className="font-mono text-[85%] uppercase text-zinc-400 block pb-1 border-b border-zinc-100 mb-1">Base Fixative Amplification</strong>
                          <p className="text-zinc-650 font-serif text-[95%]">{layeringResult.baseFixativeAmplification}</p>
                        </div>
                        <div className="p-2 border border-zinc-150">
                          <strong className="font-mono text-[85%] uppercase text-zinc-400 block pb-1 border-b border-zinc-100 mb-1">Aroma Head-Note Collision Alerts</strong>
                          <p className="text-zinc-650 font-serif text-[95%]">{layeringResult.topNoteConflict}</p>
                        </div>
                      </div>

                      <div className="p-3 border-l-4 border-amber-600 bg-amber-50 rounded-r-sm">
                        <strong className="font-mono text-[80%] uppercase text-amber-800 block mb-0.5">Optimal Laydown Sequence:</strong>
                        <p className="font-sans text-zinc-850 text-[95%]">{layeringResult.applicationSequence}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 font-mono text-zinc-400">
                      Loading certified data...
                    </div>
                  )}

                  <div className="border-t border-zinc-300 pt-6 mt-10 flex justify-between items-center text-[75%] font-mono text-zinc-400">
                    <span>AROMATA CHEMISTRY PORTAL • SECURE VERIFICATION SEAL</span>
                    <span>AUTOMATIC DIGITAL OUTPUT CERTIFICATE</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-[#2D3139] p-4 flex justify-end bg-[#0D0F14]">
                <button
                  type="button"
                  onClick={() => setIsPrintPortalOpen(false)}
                  className="px-5 py-2 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600 text-white font-mono text-xs uppercase tracking-wider rounded-sm cursor-pointer transition-colors shadow"
                >
                  Dismiss Preview
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRINT PORTAL FOR HIGH-RESOLUTION FINE PAPER PRINTING */}
      {printMode && (
        <div id="print-portal" className="hidden print:block p-10 bg-white text-black font-serif">
          {/* Header block with laboratory seals */}
          <div className="border-b-4 border-black pb-4 mb-6 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                Aromata Molecular Systems
              </h1>
              <p className="text-[10px] uppercase tracking-widest font-mono text-zinc-600 font-bold">
                Chromatography & Residual Fine Spectrometry Lab Report
              </p>
            </div>
            <div className="text-right font-mono text-[9px] text-zinc-500">
              <div>REPORT ID: AMS-DETERMINISTIC-{selectedFragrance ? selectedFragrance.brand.substring(0,3).toUpperCase() : 'LAY'}</div>
              <div>DATE: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div>CERTIFICATION: SECURE LAB DATA</div>
            </div>
          </div>

          {printMode === 'dossier' && selectedFragrance ? (
            <div className="space-y-6">
              {/* Scent Primary Info */}
              <div className="border-b border-zinc-300 pb-4">
                <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold block">Specimen Analysis Target</span>
                <h2 className="text-2xl font-bold font-serif italic text-black">
                  {selectedFragrance.brand} — {selectedFragrance.name}
                </h2>
                <div className="grid grid-cols-4 gap-4 mt-3 font-mono text-[10px] text-zinc-700 bg-zinc-50 p-3 border border-zinc-200">
                  <div>
                    <strong>CONCENTRATION:</strong> {selectedFragrance.concentration || 'Eau de Parfum'}
                  </div>
                  <div>
                    <strong>CREATOR (NOSE):</strong> {selectedFragrance.nose || 'N/A'}
                  </div>
                  <div>
                    <strong>YEAR OF ORIGIN:</strong> {selectedFragrance.releaseYear}
                  </div>
                  <div>
                    <strong>FAMILY:</strong> {selectedFragrance.olfactoryFamily}
                  </div>
                </div>
              </div>

              {/* Story/Concept */}
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold block">SPECIMEN ESSENCE & PROFILE SUMMARY</span>
                <p className="text-xs text-zinc-800 leading-relaxed italic pr-6 text-justify">
                  "{selectedFragrance.story || "Each selective compound represents a distinct sensory chapter. This fragrance encapsulates a bespoke universe, shifting delicately across its physical boundaries to paint a luminous atmosphere on skin."}"
                </p>
              </div>

              {/* Olfactory Notes Hierarchy Section */}
              <div className="page-break-avoid">
                <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold block mb-2">OLFACTORY NOTES HIERARCHY MAP</span>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 border border-zinc-200 bg-zinc-50/50">
                    <span className="font-mono text-[9px] text-amber-700 uppercase font-bold block border-b border-zinc-200 pb-1 mb-2">Top Notes (High Volatility)</span>
                    <ul className="list-disc pl-4 text-[11px] text-zinc-700 space-y-1 font-serif">
                      {selectedFragrance.notes.top.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 border border-zinc-200 bg-zinc-50/50">
                    <span className="font-mono text-[9px] text-rose-700 uppercase font-bold block border-b border-zinc-200 pb-1 mb-2">Heart Notes (Medium Volatility)</span>
                    <ul className="list-disc pl-4 text-[11px] text-zinc-700 space-y-1 font-serif">
                      {selectedFragrance.notes.heart.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 border border-zinc-200 bg-zinc-50/50">
                    <span className="font-mono text-[9px] text-slate-700 uppercase font-bold block border-b border-zinc-200 pb-1 mb-2">Base Notes (Low Volatility)</span>
                    <ul className="list-disc pl-4 text-[11px] text-zinc-700 space-y-1 font-serif">
                      {selectedFragrance.notes.base.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sillage, Durability and Longevity index */}
              <div className="page-break-avoid border-t border-zinc-200 pt-4 grid grid-cols-3 gap-4 font-mono text-[10px] text-zinc-800">
                <div className="p-3 border border-zinc-200 rounded-sm">
                  <span className="text-zinc-500 font-bold block text-[8px] uppercase tracking-wider">Skin Longevity</span>
                  <div className="text-lg font-black mt-1 text-black">{selectedFragrance.skinLongevityIndex.toFixed(1)} Hours</div>
                  <p className="text-[9px] text-zinc-500 leading-tight mt-1">Calculated skin residue half-life index under normal ambient atmospheric conditions.</p>
                </div>
                <div className="p-3 border border-zinc-200 rounded-sm">
                  <span className="text-zinc-500 font-bold block text-[8px] uppercase tracking-wider">Fabric Permanence</span>
                  <div className="text-lg font-black mt-1 text-black">
                    {selectedFragrance.fabricPermanenceIndex >= 24 
                      ? `${(selectedFragrance.fabricPermanenceIndex / 24).toFixed(0)} Days+` 
                      : `${selectedFragrance.fabricPermanenceIndex} Hours`
                    }
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-tight mt-1">Fiber trap longevity index showing resilience against standard washing/evaporation.</p>
                </div>
                <div className="p-3 border border-zinc-200 rounded-sm">
                  <span className="text-zinc-500 font-bold block text-[8px] uppercase tracking-wider">Olfactory Receptor Fatigue</span>
                  <div className="text-lg font-black mt-1 text-black">{selectedFragrance.olfactoryFatigueRisk}% Risk</div>
                  <span className="text-[9px] text-red-700 font-bold block uppercase mt-0.5">
                    {selectedFragrance.olfactoryFatigueRisk >= 80 ? 'EXTREME HAZARD' : selectedFragrance.olfactoryFatigueRisk >= 60 ? 'HIGH RISK' : 'MODERATE'}
                  </span>
                </div>
              </div>

              {/* Natural vs Synthetic Ratios and Matrix Isolate details */}
              <div className="page-break-avoid border-t border-zinc-200 pt-4">
                <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold block mb-2">Aroma Isolation & Chemical Composition</span>
                <div className="grid grid-cols-12 gap-6 items-start">
                  <div className="col-span-4 bg-zinc-50 p-4 border border-zinc-200 font-mono text-[10px] space-y-3">
                    <span className="text-zinc-500 font-bold block uppercase text-[8px] tracking-wider mb-1">BOTANICAL VS SYNTHETIC</span>
                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Natural / Botanicals:</span>
                        <span>{selectedFragrance.naturalToSyntheticRatio.natural}%</span>
                      </div>
                      <div className="w-full bg-zinc-200 h-2 rounded-sm overflow-hidden">
                        <div className="bg-emerald-600 h-full" style={{ width: `${selectedFragrance.naturalToSyntheticRatio.natural}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Synthetics (Organic/High-End):</span>
                        <span>{selectedFragrance.naturalToSyntheticRatio.synthetic}%</span>
                      </div>
                      <div className="w-full bg-zinc-200 h-2 rounded-sm overflow-hidden">
                        <div className="bg-indigo-600 h-full" style={{ width: `${selectedFragrance.naturalToSyntheticRatio.synthetic}%` }} />
                      </div>
                    </div>
                    <p className="text-[8.5px] leading-relaxed text-zinc-500 font-sans mt-3">
                      This represents the molecular mass separation ratio deduced by gas-liquid chromatography algorithms.
                    </p>
                  </div>

                  {/* Chemical Matrix Table */}
                  <div className="col-span-8 overflow-x-auto">
                    <table className="w-full text-left font-mono text-[9px] border border-zinc-200">
                      <thead>
                        <tr className="bg-zinc-100 border-b border-zinc-300 text-zinc-600 font-bold">
                          <th className="p-2 uppercase">Isolate Compound</th>
                          <th className="p-2 uppercase text-right">Molecular Ratio</th>
                          <th className="p-2 uppercase pl-4">Primary Scent Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 text-zinc-700">
                        {selectedFragrance.aromaChemicalMatrix.map((iso, i) => (
                          <tr key={i} className="hover:bg-zinc-50">
                            <td className="p-2 font-bold text-zinc-900">{iso.name}</td>
                            <td className="p-2 text-right font-semibold text-black">{iso.percentage}%</td>
                            <td className="p-2 pl-4 text-zinc-500">{iso.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* IFRA SAFETY COMPLIANCE MATRIX */}
              <div className="page-break-avoid border-t border-zinc-200 pt-4">
                <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold block mb-2">IFRA STATUTORY SAFETY & COMPLIANCE MATRIX</span>
                
                <div className="bg-zinc-50 border border-zinc-200 p-4 mb-4 flex items-center justify-between font-mono">
                  <span className="text-[10px] text-zinc-700 font-bold">REGULATORY STANDARDIZATION ASSESSMENT STATUS:</span>
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded ${
                    selectedFragrance.ifraAssessment.status === 'Compliant' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {selectedFragrance.ifraAssessment.status}
                  </span>
                </div>

                <table className="w-full text-left font-mono text-[9px] border border-zinc-200">
                  <thead>
                    <tr className="bg-zinc-100 border-b border-zinc-300 text-zinc-600 font-bold">
                      <th className="p-2 uppercase">Restricted Agent Index</th>
                      <th className="p-2 uppercase text-right">IFRA Ceiling Limit</th>
                      <th className="p-2 uppercase text-right">Concentration Detected</th>
                      <th className="p-2 uppercase pl-4">Formulation Impact & Mitigation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 text-zinc-700">
                    {selectedFragrance.ifraAssessment.criticalRestrictedMaterials.map((material, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50">
                        <td className="p-2 font-bold text-zinc-900">{material.name}</td>
                        <td className="p-2 text-right text-amber-800 font-semibold">{material.limitPercent === 0 ? "BANNED" : `≤ ${material.limitPercent}%`}</td>
                        <td className="p-2 text-right font-black text-black">{material.actualPercent}%</td>
                        <td className="p-2 pl-4 text-zinc-500">{material.impact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="mt-4 p-3 border border-zinc-200 bg-amber-50/40 rounded-sm">
                  <span className="font-mono text-[8px] text-amber-800 uppercase font-bold block mb-1">Chemist's Regulatory Directives</span>
                  <p className="text-[10px] text-zinc-600 font-sans leading-relaxed text-justify">
                    {selectedFragrance.ifraAssessment.chemistsTakeaway}
                  </p>
                </div>
              </div>

              {/* Timeline Heritage */}
              <div className="page-break-avoid border-t border-zinc-200 pt-4">
                <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold block mb-2">ARCHITECTURAL TIMELINE & CLINICAL HERITAGE</span>
                <p className="text-xs text-zinc-600 leading-relaxed font-sans mt-1 text-justify text-justify">
                  {selectedFragrance.formulationHeritage}
                </p>
              </div>

              {/* End signature block */}
              <div className="border-t border-zinc-300 pt-8 mt-12 flex justify-between items-center text-[9px] font-mono text-zinc-400">
                <span>AROMATA CHEMISTRY INSTRUMENTATION SYSTEMS • AUTOMATED CERTIFICATION</span>
                <span>AUTHENTIC PRINT REPORT GENERATOR</span>
              </div>
            </div>
          ) : printMode === 'layering' && layeringResult ? (
            <div className="space-y-6">
              {/* Scent Layering Header */}
              <div className="border-b border-zinc-300 pb-4">
                <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold block text-purple-700 font-bold">Intelligent Scent Synthesis Compatibility Report</span>
                <h2 className="text-2xl font-bold font-serif italic text-black mt-1">
                  Formula Layering Interaction Analysis Dossier
                </h2>
                
                {/* Formulas Specimen Description */}
                <div className="grid grid-cols-2 gap-4 mt-4 font-mono text-[10px] text-zinc-800 bg-zinc-50 p-4 border border-zinc-200">
                  <div className="border-r border-zinc-200 pr-4">
                    <span className="text-zinc-500 font-bold uppercase text-[8px] block tracking-wider mb-1">SPECIMEN A (Primary Canvas)</span>
                    <div className="text-xs font-bold text-black">{layeringSelectA}</div>
                  </div>
                  <div className="pl-2">
                    <span className="text-zinc-500 font-bold uppercase text-[8px] block tracking-wider mb-1">SPECIMEN B (Overlay Scent Canopy)</span>
                    <div className="text-xs font-bold text-black">{layeringSelectB}</div>
                  </div>
                </div>
              </div>

              {/* Compatibility Synergy Rating */}
              <div className="grid grid-cols-3 gap-6 items-center bg-purple-50 p-6 border border-purple-200 rounded-sm">
                <div className="col-span-1 text-center border-r border-purple-100 pr-4 font-mono mb-2">
                  <span className="font-mono text-[8px] text-purple-700 uppercase font-bold tracking-widest block mb-1">Synergy Coefficient</span>
                  <div className="text-4xl font-black text-purple-950 leading-none">{layeringResult.compatibilityScore}%</div>
                  <span className="inline-block mt-2 font-mono text-[9px] font-bold text-textColor bg-purple-100 border border-purple-200 rounded px-2 py-0.5">
                    {layeringResult.compatibilityLevel}
                  </span>
                </div>
                
                <div className="col-span-2">
                  <span className="font-mono text-[9px] text-purple-700 uppercase font-bold tracking-wider block mb-1.5">Chemists Interaction Prognosis</span>
                  <p className="text-xs text-purple-950 font-sans leading-relaxed text-zinc-800 text-justify">
                    {layeringResult.molecularSummary}
                  </p>
                </div>
              </div>

              {/* Interactions Breakdown cards */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 border border-zinc-200 bg-zinc-50/50 page-break-avoid">
                  <span className="font-mono text-[9px] text-purple-800 uppercase font-bold block border-b border-zinc-200 pb-1 mb-2 font-bold">Molecular Base-Fixative Amplification</span>
                  <p className="text-xs text-zinc-700 font-serif leading-relaxed text-left text-justify">
                    {layeringResult.baseFixativeAmplification}
                  </p>
                </div>

                <div className="p-4 border border-zinc-200 bg-zinc-50/50 page-break-avoid">
                  <span className="font-mono text-[9px] text-amber-800 uppercase font-bold block border-b border-zinc-200 pb-1 mb-2 font-bold">Aromachemical Head-Note Collision Alerts</span>
                  <p className="text-xs text-zinc-700 font-serif leading-relaxed text-left text-justify">
                    {layeringResult.topNoteConflict}
                  </p>
                </div>
              </div>

              {/* Order of Spray application sequence instruction sheet */}
              <div className="p-5 border-l-4 border-amber-600 bg-amber-50/50 rounded-r-sm page-break-avoid">
                <span className="font-mono text-[9px] text-amber-800 uppercase font-bold block mb-1.5 font-bold">OPTIMAL DISPENSING & SPRAYING SEQUENCE:</span>
                <p className="text-xs text-zinc-850 font-sans leading-relaxed text-justify">
                  {layeringResult.applicationSequence}
                </p>
              </div>

              {/* Quick printing tips */}
              <div className="p-4 border border-zinc-200 font-mono text-[9px] text-zinc-500 bg-zinc-50/20">
                <div className="font-bold uppercase text-zinc-700 mb-1">Layering Methodology Guideline Note:</div>
                <p className="font-sans text-[10px] leading-relaxed text-zinc-600">
                  Lay the heavy base formula with low volatility thresholds (e.g. Amber/Synthetic fixative rich specimens) first on pulse points, waiting 120 seconds to allow the volatile molecular layer to settle before locking down the layout using the airy Citrus/Aromachemical overlay specimen.
                </p>
              </div>

              {/* Scent analysis security seals */}
              <div className="border-t border-zinc-300 pt-8 mt-12 flex justify-between items-center text-[9px] font-mono text-zinc-400">
                <span>AROMATA CHEMISTRY INSTRUMENTATION SYSTEMS • AUTOMATED CERTIFICATION</span>
                <span>AUTHENTIC PRINT REPORT GENERATOR</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 font-mono text-sm text-zinc-400">
              No results catalogued to print.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
