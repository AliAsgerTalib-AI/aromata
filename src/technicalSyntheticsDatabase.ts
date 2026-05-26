export interface TechnicalMaterial {
  id: number;
  name: string;
  casIupac: string;
  category: string;
  profile: string;
  substantivity: string;
  ifraLimit: string;
  vaporPressure: string;
}

export const TECHNICAL_SYNTHETICS_DATABASE: TechnicalMaterial[] = [
  // 1. Top Note Modifiers & High-Velocity Volatiles
  {
    id: 1,
    name: "Limonene (d-Limonene)",
    casIupac: "CAS: 5989-27-5 | IUPAC: 1-methyl-4-(prop-1-en-2-yl)cyclohex-1-ene",
    category: "Top Note Modifiers & High-Velocity Volatiles",
    profile: "Highly volatile, sparkling, sharp citrus rind, terpene-like top note.",
    substantivity: "~1–2 Hours",
    ifraLimit: "Unrestricted (Must state on label as a potential allergen/oxidizable substance).",
    vaporPressure: "High: ≈ 1.50 mmHg at 25°C. Rapid flashing evaporation profile."
  },
  {
    id: 2,
    name: "Dihydromyrcenol",
    casIupac: "CAS: 18479-58-8 | IUPAC: 2,6-dimethyloct-7-en-2-ol",
    category: "Top Note Modifiers & High-Velocity Volatiles",
    profile: "Powerful, fresh, clean lavender-citrus, sharp, lime-like with a distinct metallic facet.",
    substantivity: "~4 Hours",
    ifraLimit: "No structural restriction.",
    vaporPressure: "High: ≈ 0.179 mmHg at 25°C. High head-space velocity."
  },
  {
    id: 3,
    name: "Methyl Pamplemousse",
    casIupac: "CAS: 67674-46-8 | IUPAC: 6,6-dimethoxy-2,5,5-trimethylhex-2-ene",
    category: "Top Note Modifiers & High-Velocity Volatiles",
    profile: "Bitter, fresh, crisp grapefruit rind, green, slightly sulfurous top note. Highly stable in citrus accords.",
    substantivity: "~6 Hours",
    ifraLimit: "No structural restriction.",
    vaporPressure: "Med-High: ≈ 0.125 mmHg at 25°C. Low odor threshold."
  },
  {
    id: 4,
    name: "Benzyl Acetate",
    casIupac: "CAS: 140-11-4 | IUPAC: Benzyl ethanoate",
    category: "Top Note Modifiers & High-Velocity Volatiles",
    profile: "Intensely sweet, fruity, volatile, banana-like jasmine top note. Reaches headspace quickly.",
    substantivity: "~4 Hours",
    ifraLimit: "No structural restriction.",
    vaporPressure: "High: ≈ 0.180 mmHg at 25°C. Sharp, aggressive initial curve."
  },
  {
    id: 5,
    name: "Aldehyde C10 (Decanal)",
    casIupac: "CAS: 112-31-2 | IUPAC: Decanal",
    category: "Top Note Modifiers & High-Velocity Volatiles",
    profile: "Powerful, waxy, citrus-peel, orange-like, effervescent top note modifier.",
    substantivity: "~12 Hours",
    ifraLimit: "No structural restriction.",
    vaporPressure: "Medium: ≈ 0.045 mmHg at 25°C. Exceptionally low odor detection threshold."
  },

  // 2. Heart-Note Core Architects & Diffusive Blenders
  {
    id: 6,
    name: "Aldehyde C11 Undecylenical",
    casIupac: "CAS: 112-45-8 | IUPAC: Undec-10-enal",
    category: "Heart-Note Core Architects & Diffusive Blenders",
    profile: "Intensely clean, fatty, waxy, soapy, metallic-sparkling character with floral-citrus lift.",
    substantivity: "~24 Hours",
    ifraLimit: "Restricted (Typically around 1.0% due to skin irritation and sensitization).",
    vaporPressure: "Medium: ≈ 0.012 mmHg at 25°C. Extreme tinting strength."
  },
  {
    id: 7,
    name: "Phenethyl Alcohol (PEA)",
    casIupac: "CAS: 60-12-8 | IUPAC: 2-phenylethan-1-ol",
    category: "Heart-Note Core Architects & Diffusive Blenders",
    profile: "Sweet, rose petal-fresh, clean floral, honeyed undertones. Highly water-soluble.",
    substantivity: "~24 Hours",
    ifraLimit: "No structural restriction.",
    vaporPressure: "Medium: ≈ 0.086 mmHg at 25°C. High dosage tolerance."
  },
  {
    id: 8,
    name: "Hedione",
    casIupac: "CAS: 24851-98-7 | IUPAC: Methyl 2-(3-oxo-2-pentylcyclopentyl)acetate",
    category: "Heart-Note Core Architects & Diffusive Blenders",
    profile: "Airy, transparent, clean, jasmine-like floral with citrus brightness. Acts as a linear volume amplifier.",
    substantivity: "~36 Hours",
    ifraLimit: "No structural restriction.",
    vaporPressure: "Med-Low: ≈ 0.0016 mmHg at 25°C. Exceptionally high diffusion coefficient."
  },
  {
    id: 9,
    name: "Calone 1951",
    casIupac: "CAS: 28940-11-6 | IUPAC: 7-methyl-2H-1,5-benzodioxepin-3(4H)-one",
    category: "Heart-Note Core Architects & Diffusive Blenders",
    profile: "Intense marine, ozonic, fresh sea spray, distinct watery-melon facets.",
    substantivity: "~48 Hours",
    ifraLimit: "No structural restriction.",
    vaporPressure: "Medium: ≈ 0.003 mmHg at 25°C. Hyper-low threshold (overdoses easily)."
  },
  {
    id: 10,
    name: "Alpha-Ionone",
    casIupac: "CAS: 127-41-3 | IUPAC: (E)-4-(2,6,6-trimethylcyclohex-2-en-1-yl)but-3-en-2-one",
    category: "Heart-Note Core Architects & Diffusive Blenders",
    profile: "Powdery, sweet, woody-violet flower aroma, raspberry-berry nuances.",
    substantivity: "~60 Hours",
    ifraLimit: "Restricted (Subject to total collective Ionone class restrictions).",
    vaporPressure: "Med-Low: ≈ 0.014 mmHg at 25°C. Rapidly causes olfactory fatigue."
  },
  {
    id: 11,
    name: "Stemone",
    casIupac: "CAS: 22457-23-4 | IUPAC: 5-methylheptan-3-one oxime",
    category: "Heart-Note Core Architects & Diffusive Blenders",
    profile: "Sharp, bitter, green leaf, crushed twigs, natural-feeling fig leaf/galbanum facet.",
    substantivity: "~12 Hours",
    ifraLimit: "No structural restriction.",
    vaporPressure: "Medium: ≈ 0.110 mmHg at 25°C. Strong modifying power in trace levels."
  },
  {
    id: 12,
    name: "Aldehyde C14 (Undecalactone)",
    casIupac: "CAS: 104-67-6 | IUPAC: 5-heptyloxolan-2-one",
    category: "Heart-Note Core Architects & Diffusive Blenders",
    profile: "Velvety, lactonic, creamy peach skin, apricot, fruity-fatty modifier.",
    substantivity: "~100 Hours",
    ifraLimit: "No structural restriction.",
    vaporPressure: "Low: ≈ 0.002 mmHg at 25°C. Highly tenacious heart binder."
  },

  // 3. Woody, Ambergris, & Macrocyclic Fixative Anchors
  {
    id: 13,
    name: "Iso E Super",
    casIupac: "CAS: 54464-57-2 | IUPAC: 1-(1,2,3,4,5,6,7,8-octahydro-2,3,8,8-tetramethyl-2-naphthyl)ethan-1-one",
    category: "Woody, Ambergris, & Macrocyclic Fixative Anchors",
    profile: "Smooth, transparent cedarwood, ambergris facets, dry woody velvet texture. Velvet structure modifier.",
    substantivity: "~170+ Hours",
    ifraLimit: "Restricted (Typically limited around 21.4% in the finished compound).",
    vaporPressure: "Low: ≈ 0.00067 mmHg at 25°C. Highly substantive linear projection."
  },
  {
    id: 14,
    name: "Coumarin",
    casIupac: "CAS: 91-64-5 | IUPAC: 2H-chromen-2-one",
    category: "Woody, Ambergris, & Macrocyclic Fixative Anchors",
    profile: "Crystalline solid. Sweet, powdery, freshly cut hay, almond-tonka bean backbone, tobacco nuances.",
    substantivity: "~200+ Hours",
    ifraLimit: "Restricted (Typically limited to ~1.5%–2.5% max in the finished product compound).",
    vaporPressure: "Low: ≈ 0.00034 mmHg at 25°C. Dense intermolecular fixation."
  },
  {
    id: 15,
    name: "Javanol",
    casIupac: "CAS: 198404-98-7 | IUPAC: [1-methyl-2-[(1,2,2-trimethyl-3-bicyclo[3.1.0]hexanyl)methyl]cyclopropyl]methanol",
    category: "Woody, Ambergris, & Macrocyclic Fixative Anchors",
    profile: "Hyper-potent, rich, creamy, natural-feeling sandalwood with a distinct tropical-grapefruit facet.",
    substantivity: "400+ Hours",
    ifraLimit: "No structural restriction.",
    vaporPressure: "Extremely Low: ≈ 0.000004 mmHg at 25°C. Critical detection threshold (0.02 ng/L)."
  },
  {
    id: 16,
    name: "Ambroxan",
    casIupac: "CAS: 6790-58-5 | IUPAC: 3a,6,6,9a-tetramethyldodecahydronaphtho[2,1-b]furan",
    category: "Woody, Ambergris, & Macrocyclic Fixative Anchors",
    profile: "Dry, clean, mineral, salty sea-air ambergris note. High radiance and exalting performance.",
    substantivity: "400+ Hours",
    ifraLimit: "No structural restriction.",
    vaporPressure: "Low: ≈ 0.00049 mmHg at 25°C. Exceptional thermodynamic stability."
  },
  {
    id: 17,
    name: "Cetalox",
    casIupac: "CAS: 3738-00-9 | IUPAC: Dodecahydro-3a,6,6,9a-tetramethylnaphtho[2,1-b]furan",
    category: "Woody, Ambergris, & Macrocyclic Fixative Anchors",
    profile: "Rich, warm, elegant ambergris isomer profile. Sweeter, creamier skin facet than Ambroxan.",
    substantivity: "400+ Hours",
    ifraLimit: "No structural restriction.",
    vaporPressure: "Low: ≈ 0.00052 mmHg at 25°C. High-efficiency fixative blender."
  },
  {
    id: 18,
    name: "Vanillin",
    casIupac: "CAS: 121-33-5 | IUPAC: 4-hydroxy-3-methoxybenzaldehyde",
    category: "Woody, Ambergris, & Macrocyclic Fixative Anchors",
    profile: "Crystalline solid. Intensely sweet, warm, creamy, traditional vanilla pod essence.",
    substantivity: "400+ Hours",
    ifraLimit: "No structural restriction. Warning: Heavy Schiff base discoloration potential.",
    vaporPressure: "Low: ≈ 0.0017 mmHg at 25°C. High polar tenacity."
  },
  {
    id: 19,
    name: "Ethyl Maltol",
    casIupac: "CAS: 4940-11-8 | IUPAC: 2-ethyl-3-hydroxy-4H-pyran-4-one",
    category: "Woody, Ambergris, & Macrocyclic Fixative Anchors",
    profile: "Crystalline solid. Saccharide-like, sweet, burnt cotton candy, toasted praline, strawberry jam.",
    substantivity: "100+ Hours",
    ifraLimit: "No structural restriction.",
    vaporPressure: "Low: ≈ 0.0022 mmHg at 25°C. Highly intrusive performance at low thresholds."
  },

  // 4. Macrocyclic & Alicyclic Musks
  {
    id: 20,
    name: "Galaxolide",
    casIupac: "CAS: 1222-05-5 | IUPAC: 1,3,4,6,7,8-hexahydro-4,6,6,7,8,8-hexamethylindeno[5,6-c]pyran",
    category: "Macrocyclic & Alicyclic Musks",
    profile: "Viscous liquid. Clean, non-discoloring, sweet, powdery white musk. Laundry anchor.",
    substantivity: "400+ Hours",
    ifraLimit: "No structural restriction (Subject to regional polycyclic eco-accumulation caps).",
    vaporPressure: "Extremely Low: ≈ 0.000073 mmHg at 25°C. High background tenacity."
  },
  {
    id: 21,
    name: "Habanolide",
    casIupac: "CAS: 111879-80-2 | IUPAC: (E)-oxacyclohexadec-12-en-2-one",
    category: "Macrocyclic & Alicyclic Musks",
    profile: "Elegant macrocyclic musk. Metallic, hot-iron, dry silver-sheen with powdery undertones.",
    substantivity: "400+ Hours",
    ifraLimit: "No structural restriction.",
    vaporPressure: "Extremely Low: ≈ 0.00001 mmHg at 25°C. Linear, clean evaporation gradient."
  },
  {
    id: 22,
    name: "Ambrettolide",
    casIupac: "CAS: 28645-51-4 | IUPAC: Oxacycloheptadec-10-en-2-one",
    category: "Macrocyclic & Alicyclic Musks",
    profile: "Exquisite macrocyclic musk. Smooth, exalting floral-musk texture with faint botanical blackberry facets.",
    substantivity: "400+ Hours",
    ifraLimit: "No structural restriction.",
    vaporPressure: "Extremely Low: ≈ 0.000003 mmHg at 25°C. High synergy with top floral notes."
  },
  {
    id: 23,
    name: "Cashmeran",
    casIupac: "CAS: 33704-61-9 | IUPAC: 1,2,3,5,6,7-hexahydro-1,1,2,3,3-pentamethyl-4H-inden-4-one",
    category: "Macrocyclic & Alicyclic Musks",
    profile: "Crystalline mass. Complex polycyclic profile spanning clean wood, musky wool, damp earth, and clean spice.",
    substantivity: "200 Hours",
    ifraLimit: "Restricted (Strictly capped around 3.8% in finished fine fragrance concentrates).",
    vaporPressure: "Low-Medium: ≈ 0.0068 mmHg at 25°C. High spatial diffusion."
  }
];
