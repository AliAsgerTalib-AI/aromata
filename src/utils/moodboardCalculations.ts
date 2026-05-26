import { FragranceData, AccordIntensity, WardrobeRecommendation } from '../types';
import { getDominantAccord } from '../fragranceUtils';

export const getPreCalculatedMoodboard = (frag: FragranceData) => {
  const dominantAccord = getDominantAccord(frag.accords);

  let aestheticTitle = "Abstract Molecular Canvas";
  let vibeAssessment = `A sophisticated layout balanced perfectly on chemical compounds. Features soft sillage vectors that complement ${(frag.olfactoryFamily || 'aromatic').toLowerCase()} structures.`;
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

export const getSeasonalWardrobeRecommendation = (frag: FragranceData): WardrobeRecommendation => {
  const maxTemp = frag.tempRangeMaxCelsius;
  const minTemp = frag.tempRangeMinCelsius;
  const dominantAccord = getDominantAccord(frag.accords);

  let season = 'Spring/Fall';
  let occasions = ['Evening', 'Casual'];
  let recommendedGarments = ['Light layers', 'Transitional fabrics'];
  let colorPalette = ['Soft pastels', 'Warm neutrals'];

  if (minTemp >= 25) {
    season = 'Summer';
    occasions = ['Beach', 'Daytime', 'Resort'];
    recommendedGarments = ['Linen', 'Cotton', 'Silk', 'Light fabrics'];
    colorPalette = ['Bright whites', 'Pastels', 'Metallics'];
  } else if (maxTemp <= 5) {
    season = 'Winter';
    occasions = ['Evening', 'Formal', 'Layering'];
    recommendedGarments = ['Wool', 'Cashmere', 'Leather', 'Suede'];
    colorPalette = ['Deep jewel tones', 'Black', 'Burgundy', 'Navy'];
  }

  return { season, occasions, recommendedGarments, colorPalette };
};
