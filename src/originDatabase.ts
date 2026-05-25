export interface OriginRegion {
  name: string;
  country: string;
  coordinates: { lat: number; lng: number; x: number; y: number };
  type: 'synth-hub' | 'botanic-harvest';
  description: string;
}

export interface IsolateOriginData {
  chemicalName: string;
  chemicalFormula: string;
  precursorClass: string;
  originClassification: 'Pure Synthetic Assembly' | 'Natural Distillation Rectification' | 'Hybrid Sustainable Biocatalytic';
  regions: OriginRegion[];
  technicalProcess: string;
  yieldDensity: string;
}

export const KNOWN_ISOLATES_DATABASE: Record<string, IsolateOriginData> = {
  ambroxan: {
    chemicalName: "Ambroxan",
    chemicalFormula: "C16H28O",
    precursorClass: "Sclareol from Salvia Sclarea (Clary Sage)",
    originClassification: "Hybrid Sustainable Biocatalytic",
    technicalProcess: "High-regimen bacterial fermentation of sclariol diterpene crystals extracted from distilled clary sage leaves into amber-scented tricyclic furan.",
    yieldDensity: "3.2% oil content in premium clary sage biomass",
    regions: [
      {
        name: "Provence Sclareol Farms",
        country: "France",
        coordinates: { lat: 43.69, lng: 6.92, x: 49, y: 33 },
        type: "botanic-harvest",
        description: "Primary agricultural source of clary sage fields, cold-pressed and refined into raw crystalline sclareol feedstock."
      },
      {
        name: "Research Triangle Park Synths",
        country: "United States",
        coordinates: { lat: 35.77, lng: -78.63, x: 22, y: 38 },
        type: "synth-hub",
        description: "Premier biocatalytic manufacturing plant conversion of plant sclareol intermediates to pure recrystallized Ambroxan."
      },
      {
        name: "Shizuoka Precision Aromas",
        country: "Japan",
        coordinates: { lat: 34.97, lng: 138.38, x: 84, y: 38 },
        type: "synth-hub",
        description: "Symmetric isomer purities isolation facility ensuring 99.8% alpha-ambroxan isomer separation."
      }
    ]
  },
  'iso e super': {
    chemicalName: "Iso E Super",
    chemicalFormula: "C16H26O",
    precursorClass: "Myrcene and Alpha-Pinene Turpentine Co-products",
    originClassification: "Pure Synthetic Assembly",
    technicalProcess: "Catalytic Diels-Alder reaction of paper-pulp stream pinene feedstocks, cyclized with high-activity lewis acids to yield tetramethyl-acetyloctahydronaphthalene isomeric mixtures.",
    yieldDensity: "Up to 82% reaction conversion purity",
    regions: [
      {
        name: "Jacksonville Terpene Refinery",
        country: "United States",
        coordinates: { lat: 30.33, lng: -81.65, x: 23, y: 46 },
        type: "synth-hub",
        description: "Industrial fractionators capturing raw pinene vapors from pine forestry processing for structural amber backbone synthesis."
      },
      {
        name: "Bitterfeld-Wolfen Chemical Park",
        country: "Germany",
        coordinates: { lat: 51.62, lng: 12.27, x: 51, y: 28 },
        type: "synth-hub",
        description: "Major European manufacture facility for custom high-volume woody aromachemical matrices."
      }
    ]
  },
  hedione: {
    chemicalName: "Hedione",
    chemicalFormula: "C13H22O3",
    precursorClass: "Cyclopentanone & Methyl Jasmonate analogues",
    originClassification: "Pure Synthetic Assembly",
    technicalProcess: "High-selectivity stereocatalysis yielding custom ratios of cis-methyl dihydrojasmonate, the intensely radiant airy floral compound.",
    yieldDensity: "Pure isolate synthesis with up to 92% active cis-isomer enhancement",
    regions: [
      {
        name: "Geneva Molecular Hub",
        country: "Switzerland",
        coordinates: { lat: 46.20, lng: 6.14, x: 50, y: 31 },
        type: "synth-hub",
        description: "Birthplace and premier refinement labs for high-grade cis-isomers of methyl jasmonates."
      },
      {
        name: "Grasse Laboratory Matrix",
        country: "France",
        coordinates: { lat: 43.69, lng: 6.92, x: 49, y: 33 },
        type: "synth-hub",
        description: "Selective fractional polishing of jasmine-like molecular isolates for luxury global houses."
      }
    ]
  },
  galaxolide: {
    chemicalName: "Galaxolide",
    chemicalFormula: "C18H26O",
    precursorClass: "Hexamethylindan and Isobutylene fractions",
    originClassification: "Pure Synthetic Assembly",
    technicalProcess: "Friedel-Crafts alkylation of pentamethylindan with propylene oxide followed by high-vacuum cyclization into non-sensitizing polycyclic laundry-fresh musks.",
    yieldDensity: "85% solution load in diethyl phthalate or benzyl benzoate",
    regions: [
      {
        name: "New Jersey Musk Synthesis",
        country: "United States",
        coordinates: { lat: 40.05, lng: -74.40, x: 22, y: 35 },
        type: "synth-hub",
        description: "Primary development node for world-class synthetic clean-musk complexes."
      },
      {
        name: "Wuhan Organic Fine Synthetics",
        country: "China",
        coordinates: { lat: 30.59, lng: 114.30, x: 78, y: 43 },
        type: "synth-hub",
        description: "Catalytic chemical reactor yards supplying high-density macrocyclic and polycyclic base fixing agents."
      }
    ]
  },
  ambroxan_or_sclareol: {
    chemicalName: "Ambroxan / Clary Sage",
    chemicalFormula: "C16H28O // C20H36O2",
    precursorClass: "Sclareol Biomass",
    originClassification: "Hybrid Sustainable Biocatalytic",
    technicalProcess: "Precursor extraction and continuous bioreactor oxidation under safe chemical criteria.",
    yieldDensity: "High purity standard",
    regions: [
      {
        name: "Grasse Botanic Farms",
        country: "France",
        coordinates: { lat: 43.69, lng: 6.92, x: 49, y: 33 },
        type: "botanic-harvest",
        description: "Historic fields devoted to heirloom therapeutic distillates."
      }
    ]
  },
  calone: {
    chemicalName: "Calone 1951",
    chemicalFormula: "C10H10O3",
    precursorClass: "Methylbenzodioxepinone synthetic compounds",
    originClassification: "Pure Synthetic Assembly",
    technicalProcess: "Condensation reaction forming 7-methyl-1,5-benzodioxepin-3-one, producing a powerful marine breeze breeze scent.",
    yieldDensity: "Extreme potency, detectable at parts-per-billion levels",
    regions: [
      {
        name: "Yorkshire Estuary Synthetics",
        country: "United Kingdom",
        coordinates: { lat: 53.96, lng: -1.08, x: 47, y: 26 },
        type: "synth-hub",
        description: "Marine-accords synthesis center manufacturing ozone-laden materials."
      }
    ]
  },
  linalool: {
    chemicalName: "Linalool",
    chemicalFormula: "C10H18O",
    precursorClass: "Lavandula Angustifolia (Lavender) Distillates",
    originClassification: "Natural Distillation Rectification",
    technicalProcess: "Fractional steam distillation of high-altitude lavender spikes under moderate heat to isolate pure sweet linalool terpene fractions without thermal breakdown.",
    yieldDensity: "1.4% volatile oil yield by mass from fresh flowers",
    regions: [
      {
        name: "Valensole High-Altitude Fields",
        country: "France",
        coordinates: { lat: 43.83, lng: 5.98, x: 49, y: 33 },
        type: "botanic-harvest",
        description: "Premium lavender fields producing lavender essences with high concentrations of natural linalool."
      },
      {
        name: "Reggio Calabria Orchards",
        country: "Italy",
        coordinates: { lat: 38.11, lng: 15.65, x: 52, y: 35 },
        type: "botanic-harvest",
        description: "Bergamot rind fraction mills providing natural, bright d-linalool intermediates."
      }
    ]
  },
  vetiverol: {
    chemicalName: "Vetiverol",
    chemicalFormula: "C15H24O",
    precursorClass: "Vetiveria Zizanioides Root Complex",
    originClassification: "Natural Distillation Rectification",
    technicalProcess: "Long-duration 36-hour steam distillation of pressure-washed vetiver grass roots, followed by acid-wash rectification to remove harsh smoky pyrogenic compounds and isolate smooth woody vetiverol.",
    yieldDensity: "1.2% heavy aromatic oil by weight of raw roots",
    regions: [
      {
        name: "Les Cayes Artisan Distillers",
        country: "Haiti",
        coordinates: { lat: 18.19, lng: -73.74, x: 25, y: 51 },
        type: "botanic-harvest",
        description: "Deep volcanic sand root harvesting giving rich earthy, warm vetiver compounds."
      },
      {
        name: "Garut Highland Cooperatives",
        country: "Indonesia",
        coordinates: { lat: -7.21, lng: 107.90, x: 77, y: 64 },
        type: "botanic-harvest",
        description: "High-temperature volcanic loam processing resulting in deep balsamic, smooth woody profiles."
      }
    ]
  },
  vanillin: {
    chemicalName: "Vanillin / Ethyl Vanillin",
    chemicalFormula: "C8H8O3",
    precursorClass: "Vanilla Planifolia Cured Seedpods or Natural Ferulic Acid",
    originClassification: "Hybrid Sustainable Biocatalytic",
    technicalProcess: "Traditional hand-pollination and 6-month slow sweat curing of orchid pods to liberate glucoside-bound vanillin; or green enzymatic oxidation of wood lignin fractions.",
    yieldDensity: "2.1% pure vanillin in cured vanilla planifolia pods",
    regions: [
      {
        name: "Sava Region Vanilla Belt",
        country: "Madagascar",
        coordinates: { lat: -14.26, lng: 50.16, x: 62, y: 72 },
        type: "botanic-harvest",
        description: "The global gold-standard of hand-cured bourbon vanilla planifolia pods yielding highly unctuous, deep warm sweet metrics."
      },
      {
        name: "Rhône Green Biosynths",
        country: "France",
        coordinates: { lat: 45.76, lng: 4.83, x: 49, y: 33 },
        type: "synth-hub",
        description: "Advanced bio-catalytic conversion of natural spruce-wood wood compounds into fully food-safe bio-sourced ethyl vanillin."
      }
    ]
  },
  patchoulol: {
    chemicalName: "Patchoulol",
    chemicalFormula: "C15H26O",
    precursorClass: "Pogostemon Cablin (Patchouli) Fermented Leaves",
    originClassification: "Natural Distillation Rectification",
    technicalProcess: "Shade-fermentation of patchouli leaves to break down cellular walls, followed by solar steam boiling and molecular column rectification to select pure crystals of patchoulol sesquiterpene alcohol.",
    yieldDensity: "2.8% yields from fermented dried plant foliage",
    regions: [
      {
        name: "Aceh Rainforest Reserves",
        country: "Indonesia",
        coordinates: { lat: 4.69, lng: 96.74, x: 75, y: 62 },
        type: "botanic-harvest",
        description: "Vast sustainable wet-climate patchouli gardens yielding heavy, wood-rich, wet-earth patchoulol molecules."
      },
      {
        name: "Nosy Be Coastal Distillations",
        country: "Madagascar",
        coordinates: { lat: -13.31, lng: 48.27, x: 62, y: 68 },
        type: "botanic-harvest",
        description: "Volcanic ocean slopes providing an elegantly dry, herbal-spiced and camphoraceous patchouli profile."
      }
    ]
  },
  santalol: {
    chemicalName: "Santalol (Alpha & Beta)",
    chemicalFormula: "C15H24O",
    precursorClass: "Santalum Album (Sandalwood) Heartwood",
    originClassification: "Natural Distillation Rectification",
    technicalProcess: "Supercritical CO2 extraction or premium steam distillation of heartwood cores from mature 30+ year old sandalwood trees to yield pure creamy wood molecules.",
    yieldDensity: "4.5% oil yield in deep mature core wood sections",
    regions: [
      {
        name: "Mysore Forest Reserves",
        country: "India",
        coordinates: { lat: 12.30, lng: 76.64, x: 69, y: 52 },
        type: "botanic-harvest",
        description: "Historic government-regulated distillers producing ultra-rich, creamy, authentic Mysore Santalol."
      },
      {
        name: "Kununurra Sandalwood Plantations",
        country: "Australia",
        coordinates: { lat: -15.77, lng: 128.73, x: 81, y: 78 },
        type: "botanic-harvest",
        description: "Eco-friendly sustainable plantation projects harvesting massive Santalum album and spicatum crops."
      }
    ]
  }
};

// Generates an elegant and realistic source origin data block dynamically for any arbitrary aroma chemical name
export const getDynamicSourceOriginData = (name: string, category?: string): IsolateOriginData => {
  const cleanName = name.trim().toLowerCase();
  
  // Try exact lookup first
  if (KNOWN_ISOLATES_DATABASE[cleanName]) {
    return KNOWN_ISOLATES_DATABASE[cleanName];
  }

  // Try partial lookup
  for (const key of Object.keys(KNOWN_ISOLATES_DATABASE)) {
    if (cleanName.includes(key) || key.includes(cleanName)) {
      return KNOWN_ISOLATES_DATABASE[key];
    }
  }

  // Dynamic derivation based on descriptors or category
  const formula = `C${10 + Math.floor(Math.random() * 10)}H${14 + Math.floor(Math.random() * 18)}O${Math.floor(Math.random() * 3)}`;
  
  let precursorClass = "Crude Terpene Feedstock Fractions";
  let originClassification: IsolateOriginData["originClassification"] = "Pure Synthetic Assembly";
  let technicalProcess = "Industrial gas-phase catalytic cyclization and isomer fractionation.";
  let yieldDensity = "98.5% chemical purity level";
  let regions: OriginRegion[] = [];

  const lowerCat = (category || '').toLowerCase();
  
  if (cleanName.includes('wood') || cleanName.includes('cedar') || cleanName.includes('sandal') || lowerCat.includes('woody')) {
    precursorClass = "Conifer Terpenoid / Wood Essential Resin";
    originClassification = "Natural Distillation Rectification";
    technicalProcess = "Fractional column distillation under mild vacuum to isolate dense woody bicyclic sesquiterpenes.";
    yieldDensity = "1.8% average organic yield from heartwood fibers";
    regions = [
      {
        name: "Texas Cedarwood Mills",
        country: "United States",
        coordinates: { lat: 31.96, lng: -99.90, x: 18, y: 46 },
        type: "botanic-harvest",
        description: "High-yield state-managed cedarwood distillers isolating crisp, dry wood structures."
      },
      {
        name: "Aceh Volcanic Slopes",
        country: "Indonesia",
        coordinates: { lat: -2.54, lng: 118.01, x: 77, y: 64 },
        type: "botanic-harvest",
        description: "Sustainably cultivated dense woody materials rich in deep base fixing agents."
      }
    ];
  } else if (cleanName.includes('citrus') || cleanName.includes('lemon') || cleanName.includes('orange') || cleanName.includes('mandarin') || cleanName.includes('pample') || cleanName.includes('bergamot') || cleanName.includes('grapefruit')) {
    precursorClass = "Cold-pressed Aurantiaceae Fruit Rinds";
    originClassification = "Natural Distillation Rectification";
    technicalProcess = "Mechanical cold pressing of pristine fruit flavedo followed by continuous centrifugal extraction to isolate citrus molecules.";
    yieldDensity = "0.7% total expression content of fruit rinds";
    regions = [
      {
        name: "Calabria Citrus Cooperative",
        country: "Italy",
        coordinates: { lat: 38.11, lng: 15.65, x: 52, y: 35 },
        type: "botanic-harvest",
        description: "The global hub for prized fractionated cold pressed oil and aldehydes."
      },
      {
        name: "Florida Citrus Groves",
        country: "United States",
        coordinates: { lat: 27.66, lng: -81.51, x: 23, y: 46 },
        type: "botanic-harvest",
        description: "Continuous cold-press extraction of high-volume d-limonene and orange terpenes."
      }
    ];
  } else if (cleanName.includes('musk') || cleanName.includes('ambro') || cleanName.includes('galax') || cleanName.includes('haban') || cleanName.includes('ethyl') || lowerCat.includes('musk') || lowerCat.includes('amber')) {
    precursorClass = "Isobutylene Alkenes / Sclariol Compounds";
    originClassification = "Pure Synthetic Assembly";
    technicalProcess = "Organic molecular synthesis utilizing modern condensation loops matching eco-responsible chemistry guidelines.";
    yieldDensity = "High-concentration compound load";
    regions = [
      {
        name: "Saxony Chemical Corridor",
        country: "Germany",
        coordinates: { lat: 51.16, lng: 10.45, x: 51, y: 28 },
        type: "synth-hub",
        description: "Specialized laboratory complex focused on continuous-flow synthesis of velvet fixing bases."
      },
      {
        name: "North Carolina Biotech",
        country: "United States",
        coordinates: { lat: 35.77, lng: -78.63, x: 22, y: 38 },
        type: "synth-hub",
        description: "Advanced green synthesis optimizing macrocyclic bio-compliant musk fractions."
      }
    ];
  } else {
    // General high-precision synthesis hubs
    precursorClass = "Catalytic Organic Feedstock Petrointermediates";
    originClassification = "Pure Synthetic Assembly";
    technicalProcess = "Vacuum fraction distillation and column stereoisomeric crystallization.";
    yieldDensity = "99.2% certified lab purity grade";
    regions = [
      {
        name: "Grasse Precision Labs",
        country: "France",
        coordinates: { lat: 43.69, lng: 6.92, x: 49, y: 33 },
        type: "synth-hub",
        description: "Fine perfumery synthesis laboratories polishing synthetic aromachemical raw materials."
      },
      {
        name: "Shanghai Industrial Aromas",
        country: "China",
        coordinates: { lat: 31.23, lng: 121.47, x: 80, y: 40 },
        type: "synth-hub",
        description: "High-volume chemical synthesis site supplying clean foundational scent components."
      }
    ];
  }

  return {
    chemicalName: name,
    chemicalFormula: formula,
    precursorClass,
    originClassification,
    regions,
    technicalProcess,
    yieldDensity
  };
};
