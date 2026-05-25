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
    historicalTimeline: [
      { year: "1966", title: "Eau Sauvage Created", description: "Edmond Roudnitska creates Dior's classical citrus fragrance, introducing the legendary 'Sauvage' moniker. Tidbit: It was the first commercial perfume to utilize Hedione, an airy synthetic isolate that mimics the wet, warm, and radiant dew of a blooming jasmine garden.", classification: "House Event" },
      { year: "2015", title: "Modern Sauvage EDT Debut", description: "François Demachy builds a new molecular powerhouse from scratch. He pairs an insane 12% trial dose of synthetic Ambroxan with sharp Sichuan pepper and Calabrian bergamot, establishing a new commercial baseline for high-diffusion masculinity.", classification: "Origin" },
      { year: "2015", title: "Initial Critical Backlash", description: "GOSSIP: When first sniffed by traditional perfumery guilds and online critics, the modern Sauvage was initially blasted as 'sterile', 'screamingly synthetic', and 'pure clean-floor-cleaner static noise'. However, the public ignored print critics, and LVMH's aggressive marketing pushed Sauvage to become the best-selling fragrance in global history.", classification: "Gossip" },
      { year: "2018", title: "Sauvage Eau de Parfum", description: "François Demachy launches a rounder, denser iteration. He adds natural vanilla absolute harvested from Papua New Guinea, providing a slow-releasing, spicy-sweet cushion to slow down the highly volatile top note evaporation.", classification: "Flanker Release" },
      { year: "2021", title: "Sauvage Elixir Release", description: "Dior breaks all mainstream fresh-citrus design frameworks. Elixir drops fresh Ambroxan dominance to implement an incredibly heavy, dark, dry, liquor-like vintage fougère blend centering expensive organic lavender essence, cardamom oil, and intense clove.", classification: "Flanker Release" },
      { year: "2022", title: "Johnny Depp Solidarity Wave", description: "GOSSIP: During the widely televised civil court battles of late 2022, rumors swirled that pressure was mounting inside corporate LVMH boards to immediately drop spokesperson Johnny Depp. In response, Depp's loyal fandom launched a global viral movement, buying Dior Sauvage EDT continuously. Bottles sold out entirely across dozens of global retail boutiques, creating an accidental organic sales boost that cemented the fragrance in pop-culture history.", classification: "Gossip" },
      { year: "2022", title: "IFRA Safety Reformulation", description: "The formulation stabilizes after a mandatory European IFRA ban on Butylphenyl Methylpropional (commonly known as Lilial, used previously as a crucial lily-of-the-valley floral spacer). Perfumers re-engineer Sauvage's middle stage, substituting a customized Hedione/fresh-floral booster vector to keep the famous sillage.", classification: "Reformulation" }
    ],
    molecularBlueprintShift: {
      title: "The Molecular Blueprint Shift (From EdT to Elixir)",
      highVolatilityEngine: "A towering concentration of Dihydromyrcenol (10%+) and high-diffusion Reggio Bergamot.",
      highVolatilityEffect: "Explosive lateral projection. It vaporizes off the skin instantly, filling a room with a sharp, clean, metallic aura that forces people to notice it.",
      lowVolatilityEngine: "The fresh synthetics are slashed down. The formula is packed with dense, heavy crystalline solids—like Coumarin, real Spices, and thick Patchouli fractions.",
      lowVolatilityEffect: "Low diffusion, extreme tenacity. The liquid behaves like a thick oil on the skin, evaporating incredibly slowly, lasting over 12+ hours, and smelling deep, dark, and textured."
    },
    strategicTakeaway: "Dior’s execution of the Sauvage timeline is considered the gold standard of modern brand management. By launching a loud, mass-appeal weapon in 2015 (EdT), they captured the global youth market. They then systematically rolled out richer, denser, and more complex variations over the next six years, keeping the consumer hooked on the same brand name while adapting the liquid to fit every season, age bracket, and social environment on Earth.",
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
    historicalTimeline: [
      { year: "1764", title: "Baccarat Crystal Genesis", description: "King Louis XV of France signs the royal decree authorizing the creation of a glassworks company in the village of Baccarat in Lorraine, transforming the region into the epicenter of elite European glass blowing.", classification: "House Event" },
      { year: "2014", title: "The 250th Anniversary Alchemy", description: "Francis Kurkdjian creates the original Rouge 540 blend strictly for a highly limited collection of 250 heavy, handmade dark red crystal decanters.", classification: "Origin" },
      { year: "2014", title: "The Liquid Gold Fusion Secret", description: "GOSSIP: The signature ruby red crystal of Baccarat is not stained; it is created by slowly fusing 24-karat gold powder into lead crystal at exactly 540 degrees Celsius (990°F), yielding a deep bloody color that cannot be forged. This chemical gold fusion inspired both the perfume's name and its abstract mineral-sweet warm breeze profile.", classification: "Gossip" },
      { year: "2015", title: "Titular House Worldwide Launch", description: "Following an explosion of boutique requests from ultra-wealthy private buyers who smelled the initial 250 anniversary decanters, Kurkdjian releases the formula globally inside simple glass spray bottles, spawning the modern niche luxury trend.", classification: "Milestone" },
      { year: "2017", title: "Extrait de Parfum Launch", description: "MFK introduces an Extrait concentration. This flanker introduces a solid charge of bitter almond essence from Morocco alongside a dense, warm, earthy saffron structure designed to counterbalance the weightless, high-impact sugar trace of Ethyl Maltol.", classification: "Flanker Release" },
      { year: "2021", title: "The Uncontrollable Clone Epidemic", description: "GOSSIP: Perfumery insiders whisper that BR540 became the most cloned and heavily counterfeited perfume formula in modern aesthetic history. Because it uses a simple, highly streamlined list of ultra-pure synthetic isolates (and lacks complex natural oils that are difficult to replicate), laboratories were able to replicate its mass-spectrometry (GC-MS) chemical trail with 95%+ precision, spawning massive clone families like Ariana Grande Cloud and Club de Nuit Untold.", classification: "Gossip" }
    ],
    molecularBlueprintShift: {
      title: "The Molecular Blueprint Shift (From Eau de Parfum to Extrait)",
      highVolatilityEngine: "A diffusive booster charge of Hedione (24%+) and light Jasmine/Saffron scent fractions.",
      highVolatilityEffect: "An incredibly radiant, airborne mineral breeze. It floats in a distinct, multi-meter radius, catching bystander attention while triggering quick olfactory adaptation (temporary nose-blindness) for the wearer.",
      lowVolatilityEngine: "Moroccan Bitter Almond oil, high-density Ambergris Salt, and rich Fir Resins under an augmented Ethyl Maltol load.",
      lowVolatilityEffect: "A highly grounded, rich, metallic caramelized finish. The scent shifts from an airy, transparent sugar-shroud into a dense, long-lasting, marzipan-like skin affinity that anchors stubbornly."
    },
    strategicTakeaway: "Francis Kurkdjian's genius with Baccarat Rouge lies in total abstraction. By abandoning heavy natural botanicals in favor of pure, hyper-diffusive synthetic isolates, he created a completely new olfactory texture that acts as an invisible, high-contrast cloud. Expanding the line into the Extrait concentration allowed the house to naturally catch the peak of the global luxury boom, maintaining astronomical boutique margins through sheer ingredient scarcity and cult storytelling.",
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
    historicalTimeline: [
      { year: "2010", title: "Aventus Epoch Debut", description: "Master perfumer Jean-Christophe Hérault (working under Olivier Creed's creative direction) models a groundbreaking masculine layout: an acidic, juicy top slice of fresh pineapple, blackcurrant and apple, slammed against a heavy, raw, animalic base of oakmoss, birch tar, and gray ambergris.", classification: "Origin" },
      { year: "2013", title: "Peak Batch Scent Mythology", description: "Early batches like 11Z01, 13NB01, and 13W01 achieve immediate cult status. Tidbit: A massive secondary market emerges with spreadsheets tracking precise millimeter levels of smoky-birch-to-sweet-pineapple batch ratios.", classification: "Milestone" },
      { year: "2013", title: "Lauded 'Ghost' Perfumer Sensation", description: "GOSSIP: Although Creed marketed Aventus as a proprietary secret father-and-son formulation crafted by Olivier and Erwin Creed using dynastic methods, molecular tracking and industry archives confirmed that Jean-Christophe Hérault of IFF actually did the heavy lifting of raw formulating, a common industry secret of modern heritage licensing.", classification: "Gossip" },
      { year: "2015", title: "The Great Birch Tar Purge", description: "The International Fragrance Association (IFRA) restricts raw birch tar extract due to trace carcinogen content. Creed is forced to strip natural tar in favor of synthetic wood substitutes, converting the dark, heavy, industrial 'ashtray campfire' drydown into a cleaner, bright pineapple and laundry musk baseline.", classification: "Reformulation" },
      { year: "2019", title: "Aventus Cologne Release", description: "Creed launches Aventus Cologne as an airy, high-volatility wellness flanker. It introduces sparkling mandarin orange, ginger roots, and mint top notes over a light base of clean gray amber and styrax resin.", classification: "Flanker Release" },
      { year: "2020", title: "BlackRock €1BN Corporate Takeover", description: "GOSSIP: After decades of presenting the house as an unbroken, 250-year-old family empire serving royal courts since 1760, the Creed family quietly sells the entire brand to multinational asset managers BlackRock for an estimated €1 billion. Fragrance purists instantly lament the death of small-batch hand-blending variations in favor of strict, standardized, machine-calibrated cost efficiencies.", classification: "House Event" },
      { year: "2023", title: "Absolu Aventus & Kering Buyout", description: "GOSSIP: Only three years after the BlackRock takeover, corporate ownership shifts again as fashion conglomerate Kering (owner of Gucci and Yves Saint Laurent) acquires Creed for a staggering €3.5 billion. Concurrently, Creed releases 'Absolu Aventus', a limited-batch design that resurrects a dark, smoky, vintage-leaning orientation to calm long-term purists.", classification: "Gossip" }
    ],
    molecularBlueprintShift: {
      title: "The Molecular Blueprint Shift (From Eau de Parfum to Cologne / Absolu)",
      highVolatilityEngine: "A volatile payload of sweet pineapple, sour blackcurrant, and fresh apple, anchored by a massive 20%+ dose of Iso E Super.",
      highVolatilityEffect: "Explosive, juicy, sweet opening sillage. This fruit-heavy trail lingers with extreme projection for the first 60 minutes, turning heads quickly.",
      lowVolatilityEngine: "Unfiltered Birch Tar (in vintage batches), replaced with clean Patchouli, dry Oakmoss analogs, and salty Ambroxen fractions in modern F-batches.",
      lowVolatilityEffect: "A dry, aristocratic leather-smoke and cedarwood drydown. Vintage batches retained a dense industrial campfire depth, while modern batches settle into a clean, sporty laundry-musk profile."
    },
    strategicTakeaway: "Aventus established the modern woody-fruity masculine paradigm, perfectly timed with the rise of online grooming groups and collector subcultures. By engineering batch-to-batch variation (whether accidental or intentional), Creed turned a simple consumer product into an active hobby, generating multi-million-euro hype structures that culminated in a historic €3.5 billion acquisition by fashion titan Kering.",
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
    historicalTimeline: [
      { year: "2006", title: "The Mineral Pillar Debut", description: "Jean-Claude Ellena releases Terre d'Hermès, permanently shifting masculine defaults away from high-sugar gourmands. He implements a lean formula utilizing a massive 55%+ charge of Iso E Super paired with dry, sulfury grapefruit and bitter orange isolates.", classification: "Origin" },
      { year: "2006", title: "The Master's Dirt Quote", description: "GOSSIP: Inside Hermès studios, Ellena famously declared his desire to craft 'a fragrance of dirt, but elegant, high-luxury dirt'. Critics initially worried that a fragrance smelling of wet stones and granite dust would alienate casual buyers, but it became Hermès' primary scent engine.", classification: "Gossip" },
      { year: "2008", title: "FiFi Luxe Award", description: "The fragrance wins the prestigious FiFi Award Men's Luxe Category, cementing Ellena's 'vertical construction' (where notes persist simultaneously without a traditional top-to-bottom hierarchy) in design textbooks.", classification: "Award" },
      { year: "2009", title: "Hermès Parfum concentration", description: "Ellena compiles a thicker Parfum variation. Instead of merely boosting the concentration, he dials back the sharp citrus and expands the natural, oily earthy qualities of vetiver, cedar, and warm shiso leaves.", classification: "Flanker Release" },
      { year: "2014", title: "Eau Très Fraîche Launch", description: "Hermès drafts an ozone, watery water-citrus edition, bringing an airy mineral salt freshness perfect for high-latitude swelter.", classification: "Flanker Release" },
      { year: "2022", title: "The Secret Discontinuation", description: "GOSSIP: When Eau Très Fraîche suddenly vanished from retail shelves in early 2022, enthusiasts were furious. Deep leaks inside Hermès revealed that the formula relied heavily on Lilial (recently banned under EU safety terms). Rather than expensive re-formulation trials, Hermès simply axed the flanker to force focus onto Nagel's newly designed 'Eau Givrée'.", classification: "Gossip" },
      { year: "2022", title: "Eau Givrée Debut", description: "New in-house perfumer Christine Nagel introduces 'Eau Givrée'. She creates a freezing CITRON-to-mineral transition using intense juniper berry accents, layered over raw dry vetiver to replace the lost watery lineage.", classification: "Flanker Release" }
    ],
    molecularBlueprintShift: {
      title: "The Molecular Blueprint Shift (From Eau de Toilette to Parfum / Givrée)",
      highVolatilityEngine: "Methyl Pamplemousse (grapefruit isolate) coupled with real organic orange peel oil (15%+ of formulation).",
      highVolatilityEffect: "A stinging, bitter, hyper-realistic citrus splash. It cuts through heat instantly, releasing a zesty, sulfurous sourness that simulates crackling dry ozone.",
      lowVolatilityEngine: "A monumental 55% load of Iso E Super, supported by pure, earthy Vetiver isolates and Flint Accord chemicals.",
      lowVolatilityEffect: "A dry, continuous, minimalist cedarwood-mineral glow. Rather than dropping into sweet musks, it maintains a completely non-sweet, earthy, hot-granite dryness on the skin."
    },
    strategicTakeaway: "Terre d’Hermès is the ultimate masterwork of mineral-dry minimalism. By intentionally restricting sweet vanilla or powdery musk notes to let Iso E Super battle sulfurous citruses, Jean-Claude Ellena created an intellectual, high-contrast signature. Hermès' transition of the collection to Christine Nagel's icy Citron architectures (Eau Givrée) confirms their long-term dedication to keeping the line fresh and innovative while adhering to safety restrictions.",
    notes: {
      top: ["Orange", "Grapefruit (Methyl Pamplemousse Isolate)"],
      heart: ["Chert/Flint Dust Accord", "Black Pepper", "Pink Peppercorn", "Geranium Leaves"],
      base: ["Vetiver (High Purity Fraction)", "Cedarwood", "Patchouli", "Benzoin Tears"]
    }
  }
];
