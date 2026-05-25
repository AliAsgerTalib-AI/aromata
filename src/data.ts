import { FragranceData } from './types';

export const PREDEFINED_FRAGRANCES: FragranceData[] = [
  {
    brand: "Christian Dior",
    name: "Sauvage",
    concentration: "Toilette (EDT)",
    nose: "François Demachy",
    releaseYear: 2015,
    batchLineage: "Initial 2015 formula (09404/A) featured extremely high levels of pure Ambroxan. Subsequent reformulations in 2018 (12404/A) and 2021 adjusted the natural/synthetic balance slightly and reduced denatured solvents to meet updated IFRA standards, shifting the top-note citrus sparkle.",
    aromaChemicalMatrix: [
      { name: "Ambroxan", percentage: 14.5, category: "Ambers/Musks", description: "Provides the signature high-vibrancy metallic woodiness and massive projection trail." },
      { name: "Iso E Super", percentage: 22.0, category: "Woody Backbones", description: "Smooth amberwood background filler that provides velvety aura warmth." },
      { name: "Dihydromyrcenol", percentage: 8.5, category: "Others", description: "Sharp, ultra-clean metallic-lime synthetic that gives the soap-and-shower gel effect." },
      { name: "Galaxolide", percentage: 5.5, category: "Ambers/Musks", description: "Clean white musk used for skin durability and softness." },
      { name: "Linalool & Linalyl Acetate", percentage: 12.0, category: "Others", description: "Synthetic isolates replicating high-projection bergamot and lavender." },
      { name: "Ambrocenide", percentage: 1.5, category: "Ambers/Musks", description: "Extreme-power dry ambergris synthetic; highly responsible for fabric permanence." }
    ],
    naturalToSyntheticRatio: {
      natural: 8,
      synthetic: 92
    },
    evaporationCurve: [
      { hour: 0, top: 100, heart: 40, base: 10 },
      { hour: 1, top: 60, heart: 80, base: 30 },
      { hour: 2, top: 20, heart: 90, base: 50 },
      { hour: 4, top: 5, heart: 50, base: 80 },
      { hour: 6, top: 1, heart: 20, base: 95 },
      { hour: 10, top: 0, heart: 5, base: 85 }
    ],
    skinLongevityIndex: 8.5,
    fabricPermanenceIndex: 48.0,
    sillageProjectionRadiusCurve: [
      { hour: 0, radiusFeet: 6.5 },
      { hour: 1, radiusFeet: 5.5 },
      { hour: 2, radiusFeet: 4.0 },
      { hour: 4, radiusFeet: 2.5 },
      { hour: 6, radiusFeet: 1.5 },
      { hour: 8, radiusFeet: 0.8 },
      { hour: 10, radiusFeet: 0.3 }
    ],
    olfactoryFatigueRisk: 90,
    olfactoryFatigueExplanation: "High levels of Ambroxan and Iso E Super trigger olfactory receptor overload. The brain filters these large-mass linear molecules out within 30-45 minutes (anosmia), meaning the wearer will think the fragrance has disappeared, while bystanders can still detect it up to 5 feet away.",
    olfactoryFamily: "Aromatic Citrus Fougère",
    accords: [
      { name: "Synthetic-Sharp", intensity: 90 },
      { name: "Metallic", intensity: 85 },
      { name: "Soapy", intensity: 75 },
      { name: "Earthy", intensity: 50 },
      { name: "Resinous", intensity: 45 }
    ],
    tempRangeMinCelsius: 5,
    tempRangeMaxCelsius: 28,
    humidityTolerance: "High moisture resistant. Volatile compounds are backed by heavy hydrophobic fixatives, ensuring the sillage does not collapse in high humidity.",
    settingScoring: [
      { name: "Strict Office", score: 60 },
      { name: "Open-Air Only", score: 95 },
      { name: "High-Heat Casual", score: 85 },
      { name: "High-Performance Nightlife", score: 98 }
    ],
    avgRetailPrice: 115,
    pricePerMl: 1.15,
    valueRating: "Fair",
    alternatives: [
      { brand: "Armaf", name: "Club de Nuit Urban Elixir", similarity: 92, priceComparison: "cheaper ($0.35/ml)" },
      { brand: "Prada", name: "Luna Rossa Carbon", similarity: 88, priceComparison: "similar ($1.10/ml)" },
      { brand: "Christian Dior", name: "Sauvage Parfum", similarity: 82, priceComparison: "more expensive ($1.50/ml)" }
    ],
    formulationHeritage: "Impacted heavily by recent Lilial (Butylphenyl Methylpropional) restrictions in 2022. The floral-fresh heart notes were subtly adjusted with Hedione isolates, resulting in a slightly woodier, less sweet drydown compared to vintage formulation jars.",
    laymanChemistryExplanation: "Dior Sauvage is a masterclass in modern synthetic architecture. It functions primarily via a high-density charge of Ambroxan, a molecular workhorse that mimics precious ambergris. When first sprayed, the denatured alcohol carrier boils away, taking the extremely light and bouncy Dihydromyrcenol molecules with it to create that intensely clean, metallic, 'just-showered' lime and bergamot blast.\n\nOver the next few hours, the warm canvas of your skin activates the mid-weight molecules. The massive dose of Iso E Super acts as concrete scaffolding, gently anchoring and slowing down the evaporation rate of the citrus components. This ensures a persistent, radiant woody aura that projects outwards. Eventually, the formulation rests entirely on the heavy, high-mass amber and synthetic musks. These base elements bind tightly to the skin's lipids, giving Sauvage its legendary durability while releasing scents slowly for up to eight hours.",
    story: "Dior Sauvage is an evocative olfactory journey inspired by untamed, wide-open spaces under an ozone-blue sky. Master Perfumer François Demachy crafted this composition to mirror the transition from fiery desert heat into cool dusk, capturing a raw masculinity that is simultaneously savage, noble, and deeply sophisticated.",
    notes: {
      top: ["Calabrian Bergamot", "Sichuan Pepper", "Elemi Resin"],
      heart: ["Lavender", "Pink Pepper", "Vetiver", "Patchouli Fraction", "Geranium"],
      base: ["Ambroxan (High Dosage)", "Cedarwood", "Labdanum Absolute"]
    }
  },
  {
    brand: "Maison Francis Kurkdjian",
    name: "Baccarat Rouge 540",
    concentration: "Parfum (EDP)",
    nose: "Francis Kurkdjian",
    releaseYear: 2015,
    batchLineage: "A conceptual artistic triumph of modern organic chemistry. No natural florals are utilized. The formulation remains incredibly consistent across batch years (primarily coded under MFK's laser engraving) due to its dependency on ultra-precise synthetic isolates that carry virtually no raw crop variation.",
    aromaChemicalMatrix: [
      { name: "Ethyl Maltol", percentage: 11.2, category: "Sweet/Gourmand Anchors", description: "Brings the legendary caramelized sugar and burnt cotton-candy note." },
      { name: "Ambroxan", percentage: 18.0, category: "Ambers/Musks", description: "Synthesizes the highly radiant, salty marine ambergris finish." },
      { name: "Hedione (High Cis)", percentage: 24.5, category: "Others", description: "Acts as a transparent, high-diffusion jasmine booster that suspends other molecules in the air." },
      { name: "Veramoss (Evernyl)", percentage: 6.8, category: "Woody Backbones", description: "A highly synthetic oakmoss analog that creates the medicinal, forest-wood depth." },
      { name: "Gamma-Nonalactone", percentage: 1.5, category: "Others", description: "Adds a subtle creamy peach skin texture to blend the sweetness." }
    ],
    naturalToSyntheticRatio: {
      natural: 1,
      synthetic: 99
    },
    evaporationCurve: [
      { hour: 0, top: 100, heart: 50, base: 30 },
      { hour: 1, top: 50, heart: 80, base: 60 },
      { hour: 2, top: 15, heart: 75, base: 85 },
      { hour: 4, top: 2, heart: 40, base: 95 },
      { hour: 6, top: 0, heart: 15, base: 100 },
      { hour: 12, top: 0, heart: 5, base: 98 }
    ],
    skinLongevityIndex: 12.0,
    fabricPermanenceIndex: 168.0,
    sillageProjectionRadiusCurve: [
      { hour: 0, radiusFeet: 8.0 },
      { hour: 2, radiusFeet: 6.5 },
      { hour: 4, radiusFeet: 5.0 },
      { hour: 6, radiusFeet: 3.5 },
      { hour: 8, radiusFeet: 2.0 },
      { hour: 12, radiusFeet: 1.0 }
    ],
    olfactoryFatigueRisk: 95,
    olfactoryFatigueExplanation: "High density of Ethyl Maltol paired with heavy Ambroxan makes BR540 the absolute highest risk for complete olfactory blindness. The brain's scent receptors shut down the signals to avoid constant stimulation. Bystanders will smell a heavy trail while you notice absolutely nothing.",
    olfactoryFamily: "Sweet Oriental Gourmand",
    accords: [
      { name: "Synthetic-Sharp", intensity: 95 },
      { name: "Powdery", intensity: 65 },
      { name: "Resinous", intensity: 80 },
      { name: "Soapy", intensity: 10 },
      { name: "Animalic", intensity: 30 }
    ],
    tempRangeMinCelsius: -5,
    tempRangeMaxCelsius: 20,
    humidityTolerance: "Collapses in heavy, humid environments. High humidity turns the intensive Ethyl Maltol sweetness dense and cloying, leading to olfactory suffocation in close spaces.",
    settingScoring: [
      { name: "Strict Office", score: 40 },
      { name: "Open-Air Only", score: 85 },
      { name: "High-Heat Casual", score: 15 },
      { name: "High-Performance Nightlife", score: 100 }
    ],
    avgRetailPrice: 325,
    pricePerMl: 4.64,
    valueRating: "Overpriced",
    alternatives: [
      { brand: "Al Haramain", name: "Amber Oud Ruby Edition", similarity: 94, priceComparison: "cheaper ($0.60/ml)" },
      { brand: "Lattafa", name: "Ana Abiyedh Rouge", similarity: 89, priceComparison: "cheaper ($0.25/ml)" },
      { brand: "Club de Nuit", name: "Untold", similarity: 93, priceComparison: "cheaper ($0.45/ml)" }
    ],
    formulationHeritage: "Very stable. Because Francis Kurkdjian designed it around highly pure aromachemical benchmarks, it has easily sidestepped botanical restrictions.",
    laymanChemistryExplanation: "Baccarat Rouge 540 functions like an invisible, high-contrast cloud in the air. Its chemistry relies on three major pillars: Ethyl Maltol (sweet caramelized sugar), Ambroxan (warm, salty ambergris), and Hedione (highly diffusive, transparent jasmine). When applied, the alcohol carrier quickly evaporates, leaving a concentrated layer of Hedione. Hedione has an incredible thermodynamic property: it increases the volatility and 'airborne drift' of everything else around it, essentially suspending the fragrance molecules in a wider sphere of air.\n\nBecause there are no heavy, dense botanical oils like sandalwood or patchouli in this recipe, the molecules escape easily, resulting in a sweet, airy trail that bystanders can spot from several feet away. However, the high purity and structural simplicity of Ethyl Maltol and Ambroxan are also what trigger extreme olfactory adaptation. Your brain quickly labels these repeating, non-threatening signals as background noise and stops notifying you, creating the famous 'disappearing act' where the wearer becomes nose-blind while others still smell a powerhouse.",
    story: "Conceived as a poetic, abstract landscape of heat and light, Baccarat Rouge 540 was born to celebrate the 250th anniversary of the legendary crystal manufacturer Baccarat. Francis Kurkdjian designed an ethereal, highly stylized perfume that mimics the transformation of gold fusing with crystal at 540°C. It stands as a pinnacle of minimalist organic alchemy, translating dense heat into a mineral, sugary breeze.",
    notes: {
      top: ["Jasmine Flowers (Scent Fraction)", "Saffron Extract"],
      heart: ["Amberwood Accord", "Ambergris Salt (Synthesized)"],
      base: ["Fir Resin (Evernia Analog)", "Cedarwood Isolate", "Ethyl Maltol"]
    }
  },
  {
    brand: "Creed",
    name: "Aventus",
    concentration: "Parfum (EDP)",
    nose: "Jean-Christophe Hérault",
    releaseYear: 2010,
    batchLineage: "Infamous for batch-to-batch lineage differences ('Aventus Batch Variations'). Early batches (2010–2013, e.g., 11Z01, 13NB01) relied heavily on birch tar extracts for a deep, smoky birch and patchouli base. Post-2014, constraints on materials removed the heavy natural birch tar, transitionally making Aventus a more clean, citrus-pineapple and synthetic woody scent.",
    aromaChemicalMatrix: [
      { name: "Iso E Super", percentage: 25.0, category: "Woody Backbones", description: "Binds the cedar-woods and patchouli in a vast, diffuse cage." },
      { name: "Galaxolide", percentage: 8.0, category: "Ambers/Musks", description: "Provides the soft, clean laundry-like background support." },
      { name: "Ambroxan / Ambrox DL", percentage: 6.5, category: "Ambers/Musks", description: "Drives the radiant ambergris saltiness in the sillage." },
      { name: "L-Limonal (Isolate)", percentage: 11.0, category: "Others", description: "Provides the characteristic juicy yellow pineapple and blackcurrant lift." },
      { name: "Evernia Prunastri (Oakmoss extract)", percentage: 1.2, category: "Woody Backbones", description: "Natural extract providing structural mossy darkness (highly constrained in modern batches)." },
      { name: "Patchouli fraction", percentage: 4.5, category: "Woody Backbones", description: "Cleaned botanical oil that adds natural volume without headiness." }
    ],
    naturalToSyntheticRatio: {
      natural: 22,
      synthetic: 78
    },
    evaporationCurve: [
      { hour: 0, top: 100, heart: 35, base: 15 },
      { hour: 1, top: 45, heart: 75, base: 40 },
      { hour: 2, top: 10, heart: 80, base: 65 },
      { hour: 4, top: 2, heart: 40, base: 85 },
      { hour: 6, top: 0, heart: 15, base: 95 },
      { hour: 8, top: 0, heart: 5, base: 90 }
    ],
    skinLongevityIndex: 7.0,
    fabricPermanenceIndex: 36.0,
    sillageProjectionRadiusCurve: [
      { hour: 0, radiusFeet: 5.5 },
      { hour: 1, radiusFeet: 4.5 },
      { hour: 2, radiusFeet: 3.2 },
      { hour: 4, radiusFeet: 1.8 },
      { hour: 6, radiusFeet: 1.0 },
      { hour: 8, radiusFeet: 0.5 }
    ],
    olfactoryFatigueRisk: 75,
    olfactoryFatigueExplanation: "Moderate-high fatigue risk. The pineapple top acts with instant sweetness, but the massive 25% dose of Iso E Super behaves like a transparent cloud, causing the wearer's nose to tune it out periodically.",
    olfactoryFamily: "Dry Woody Chypre",
    accords: [
      { name: "Earthy", intensity: 85 },
      { name: "Synthetic-Sharp", intensity: 60 },
      { name: "Animalic", intensity: 45 },
      { name: "Resinous", intensity: 40 },
      { name: "Powdery", intensity: 30 }
    ],
    tempRangeMinCelsius: 10,
    tempRangeMaxCelsius: 32,
    humidityTolerance: "High compatibility. The blend of dry woods and natural birch replacement survives extreme heat and stays masculine, clean, and dry without going sour.",
    settingScoring: [
      { name: "Strict Office", score: 85 },
      { name: "Open-Air Only", score: 90 },
      { name: "High-Heat Casual", score: 90 },
      { name: "High-Performance Nightlife", score: 80 }
    ],
    avgRetailPrice: 475,
    pricePerMl: 6.33,
    valueRating: "Overpriced",
    alternatives: [
      { brand: "Armaf", name: "Club de Nuit Intense Man (Limited Edition)", similarity: 91, priceComparison: "cheaper ($0.45/ml)" },
      { brand: "Montblanc", name: "Explorer", similarity: 85, priceComparison: "cheaper ($0.75/ml)" },
      { brand: "Afnan", name: "Supremacy Not Only Intense", similarity: 89, priceComparison: "cheaper ($0.50/ml)" }
    ],
    formulationHeritage: "Extremely heavily hit by IFRA Lilial ban, oakmoss limits, and Lyral restrictions. Modern batches (F-batches, F000301+) utilize a redesigned floral spacer, making the opening brighter with citrus, but significantly faster dying compared to historic 2011/2012 formulation masterworks.",
    laymanChemistryExplanation: "Creed Aventus relies on a classic chypre layout modernized with synthetic boosters. It works by sandwiching a highly volatile fruit opening (L-Limonal replicating sweet pineapple and blackcurrant) between a massive diffuser cage of Iso E Super and a dry, mossy-woody anchor. On your skin, the initial heat causes the juicy pineapple-like top notes to project vigorously in a bright cloud.\n\nAs the lightweight fruit molecules boil off over the first hour, the heavy, oil-affinity patchouli and synthetic gray ambers begin to emerge. The Iso E Super acts as a transparent, woody background filler, releasing a velvety cedarwood sensation. In earlier batches, raw birch tar extract added a heavy smokiness that slowed down the drydown evaporation considerably. The modern formulation replaces this with cleaner woody musks, meaning the fragrance transitions faster to its clean, skin-affinity laundry musk base.",
    story: "Paying homage to historic conquerors, Creed Aventus is a grandiose composition that captures the spirit of strength, power, and success. Designed by sixth-generation master perfumer Olivier Creed, its juxtaposition of sweet pineapple contrast against dry, aristocratic smoke and heavy oakmoss was a revolutionary creative leap that defined the modern masculine olfactory archetype.",
    notes: {
      top: ["Pineapple", "Bergamot", "Blackcurrant", "Apple"],
      heart: ["Birch Wood (Dry Smoke)", "Patchouli Fraction", "Moroccan Jasmine", "Rose"],
      base: ["Oakmoss", "Ambroxan Array", "Ambergris", "Vanilla Absolute", "Musk Cage"]
    }
  },
  {
    brand: "Terre d'Hermès",
    name: "Terre d'Hermès",
    concentration: "Toilette (EDT)",
    nose: "Jean-Claude Ellena",
    releaseYear: 2006,
    batchLineage: "Recognized as a milestone in minimalistic scent construction. Jean-Claude Ellena utilized an incredibly lean recipe where Iso E Super serves as the massive scaffolding (above 50% of the entire compound). Batches have remained remarkably stable since 2006, with minor adjustments to oakmoss limits.",
    aromaChemicalMatrix: [
      { name: "Iso E Super", percentage: 55.0, category: "Woody Backbones", description: "The core driver of the fragrance. Creates the sheer cedar wood framework." },
      { name: "Methyl Pamplemousse", percentage: 4.8, category: "Others", description: "A dry, sulfurous grapefruit isolate that blends with natural orange." },
      { name: "Vetiver Isolate (Vetiveryl Acetate)", percentage: 8.5, category: "Woody Backbones", description: "Refined vetiver molecule providing clean, dry flint/dirt notes." },
      { name: "Piperine/Pepper isolates", percentage: 3.5, category: "Others", description: "Provides the sharp, spicy mineral buzz that defines the midnotes." },
      { name: "Galaxolide", percentage: 4.0, category: "Ambers/Musks", description: "Provides basic persistence and drydown comfort." }
    ],
    naturalToSyntheticRatio: {
      natural: 15,
      synthetic: 85
    },
    evaporationCurve: [
      { hour: 0, top: 100, heart: 45, base: 20 },
      { hour: 1, top: 50, heart: 75, base: 45 },
      { hour: 2, top: 15, heart: 80, base: 65 },
      { hour: 4, top: 2, heart: 40, base: 85 },
      { hour: 6, top: 0, heart: 15, base: 90 },
      { hour: 8, top: 0, heart: 2, base: 80 }
    ],
    skinLongevityIndex: 6.5,
    fabricPermanenceIndex: 24.0,
    sillageProjectionRadiusCurve: [
      { hour: 0, radiusFeet: 4.5 },
      { hour: 1, radiusFeet: 3.5 },
      { hour: 2, radiusFeet: 2.5 },
      { hour: 4, radiusFeet: 1.5 },
      { hour: 6, radiusFeet: 0.8 },
      { hour: 8, radiusFeet: 0.3 }
    ],
    olfactoryFatigueRisk: 65,
    olfactoryFatigueExplanation: "Low-moderate fatigue risk. Although Iso E Super is incredibly high (55%), its pairing with dry flinty vetiver and persistent sulfury grapefruit creates a contrasting physical projection that is easily tracked by the wearer without rapid receptors shutdown.",
    olfactoryFamily: "Woody Spicy Mineral",
    accords: [
      { name: "Earthy", intensity: 95 },
      { name: "Bone-Dry", intensity: 90 },
      { name: "Resinous", intensity: 60 },
      { name: "Synthetic-Sharp", intensity: 45 },
      { name: "Soapy", intensity: 10 }
    ],
    tempRangeMinCelsius: 8,
    tempRangeMaxCelsius: 35,
    humidityTolerance: "Outstanding. The complete lack of sweet/cloying nodes and presence of high-mass earthy vetiver allows the flinty minerality to slice through humid heat cleanly.",
    settingScoring: [
      { name: "Strict Office", score: 98 },
      { name: "Open-Air Only", score: 80 },
      { name: "High-Heat Casual", score: 92 },
      { name: "High-Performance Nightlife", score: 50 }
    ],
    avgRetailPrice: 120,
    pricePerMl: 1.20,
    valueRating: "Great Value",
    alternatives: [
      { brand: "Terre d'Hermès", name: "Eau Givrée", similarity: 78, priceComparison: "similar ($1.25/ml)" },
      { brand: "Rasasi", name: "Fattan", similarity: 85, priceComparison: "cheaper ($0.50/ml)" },
      { brand: "Terre d'Hermès", name: "Hermès Parfum", similarity: 82, priceComparison: "more expensive ($1.45/ml)" }
    ],
    formulationHeritage: "Humble and highly resilient. Jean-Claude Ellena's design has successfully withstood regulatory shifts due to robust aromachemical stability.",
    laymanChemistryExplanation: "Terre d'Hermès is an absolute triumph of minimalism, formulated with an incredibly short recipe where Iso E Super makes up more than half of the scented oils. It works by setting up a sharp, contrasting battle between volatile citrus acids and deep woody minerals. When sprayed, a dry grapefruit isolate called Methyl Pamplemousse boils off in tandem with real botanical orange oil, giving a bitter, flinty citrus punch.\n\nBelow this blast lies the massive structural column of Iso E Super. Unlike heavy gourmand sugars or thick ambers, Iso E Super is super lightweight but chemically persistent on skin. It creates a dry, velvety cedarwood aura that hovers near skin temperatures, occasionally 'floating' off as your body heat fluctuates. Because there is a complete absence of heavy, sweet vanilla or sugary carriers, the refreshing earthy woody undertone of clean vetiver and gray pepper is allowed to remain beautifully aerated and dry, keeping its elegant, crisp mineral tone even in swelty humidity.",
    story: "Terre d’Hermès tells the story of the mythic elements; a narrative of the relationship between man and earth, active and humble dialog with nature. Created by the master of olfactory minimalism, Jean-Claude Ellena, it is a vertical structure built around woody mineral notes, avoiding any thick sweet buffers to honor clean, aerated bedrock.",
    notes: {
      top: ["Orange", "Grapefruit (Methyl Pamplemousse Isolate)"],
      heart: ["Chert/Flint Dust Accord", "Black Pepper", "Pink Peppercorn", "Geranium Leaves"],
      base: ["Vetiver (High Purity Fraction)", "Cedarwood", "Patchouli", "Benzoin Tears"]
    }
  }
];
