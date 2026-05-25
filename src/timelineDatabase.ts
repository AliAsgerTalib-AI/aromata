export interface TimelineMilestone {
  year: number;
  genre: string;
  pillarFragrance: string;
  brand: string;
  masterNose: string;
  breakthroughMolecule: string;
  skeleton: string;
  innovation: string;
}

export const TIMELINE_DATABASE: TimelineMilestone[] = [
  {
    year: 1882,
    genre: "The Fougère Family (The Fern Illusion)",
    pillarFragrance: "Fougère Royale",
    brand: "Houbigant",
    masterNose: "Paul Parquet",
    breakthroughMolecule: "Coumarin (Synthesized by William Henry Perkin in 1868; first scaled use here).",
    skeleton: "Bergamot / Lavender (Top) → Geranium (Heart) → Coumarin / Oakmoss (Base)",
    innovation: "Ferns have no natural smell. Paul Parquet used the newly synthesized, powdery, sweet-hay scent of synthetic Coumarin to anchor a sharp, clean lavender-citrus top note. It created a highly structured, manicured masculine grooming archetype that became the eternal barbershop blueprint."
  },
  {
    year: 1889,
    genre: "The Modern Oriental / Ambre Family",
    pillarFragrance: "Jicky",
    brand: "Guerlain",
    masterNose: "Aimé Guerlain",
    breakthroughMolecule: "Vanillin (Synthesized from coniferin in 1874) + Coumarin.",
    skeleton: "Blinding Citrus / Lavender → Rose / Geranium → Synthetic Vanillin / Coumarin / Civet",
    innovation: "Before Jicky, perfumes were literal, linear extractions of single flowers. Aimé Guerlain used synthetic vanillin to create a highly abstract, rich, non-linear baseline, smashing it against an aggressive, dirty animalic musk and sharp culinary lavender. It birthed the concept of 'oriental' (now classified as Ambre) density."
  },
  {
    year: 1912,
    genre: "The Melanocarnation (The Powdery Floral Suede)",
    pillarFragrance: "L'Heure Bleue",
    brand: "Guerlain",
    masterNose: "Jacques Guerlain",
    breakthroughMolecule: "Methyl Ionone (Synthesized by Tiemann in 1893) + Anisic Aldehyde.",
    skeleton: "Anisic Aldehyde / Bergamot → Carnation / Clove / Violet (Ionones) → Benzoin / Iris / Vanilla",
    innovation: "Jacques Guerlain paired the newly isolated, dry, velvety wood-violet profile of Methyl Ionone with sweet, pastry-like anisic aldehyde and spicy clove-carnation. It locked in a melancholic, highly texturized, powdery floral texture that became the blueprint for vintage French cosmetic elegance."
  },
  {
    year: 1917,
    genre: "The Chypre Family (The Mossy Forest floor)",
    pillarFragrance: "Chypre de Coty",
    brand: "Coty",
    masterNose: "François Coty",
    breakthroughMolecule: "High-purity industrial stabilization of Oakmoss Absolute + Patchouli fractions.",
    skeleton: "Bergamot (Citrus Top) → Jasmine / Rose (Floral Heart) → Oakmoss / Patchouli / Labdanum (Base)",
    innovation: "Coty realized that a high-contrast juxtaposition could create massive structural drama. He anchored a sharp, highly acidic Mediterranean bergamot top note directly onto a dark, damp, bitter, and ink-like forest baseline of oakmoss and earth. It established a highly sophisticated, aristocratic genus of perfumery."
  },
  {
    year: 1921,
    genre: "The Abstract Aldehydic Floral",
    pillarFragrance: "Chanel No. 5",
    brand: "Chanel",
    masterNose: "Ernest Beaux",
    breakthroughMolecule: "An unprecedented, multi-chemical overdose of Aldehydes C-10, C-11 Undecylenic, and C-12 Lauric.",
    skeleton: "Overdosed Aliphatic Aldehydes → Ylang-Ylang / Grasse Jasmine / Rose → Sandalwood / Vetiver / Nitro-Musks",
    innovation: "Legend says a lab assistant misread Beaux's instructions and added a 10% raw dilution instead of a 1% dilution of fatty aldehydes. These freezing, intensely waxy, soapy chemicals gave the expensive natural floral heart an explosive, computerized 'lift,' rendering the flowers entirely abstract—smelling like luxury cleanliness rather than a specific garden."
  },
  {
    year: 1944,
    genre: "The Aggressive Green Leather (The Isobutyl Fougère)",
    pillarFragrance: "Bandit",
    brand: "Robert Piguet",
    masterNose: "Germaine Cellier",
    breakthroughMolecule: "A brutal 1% intentional overdose of Isobutyl Quinoline (IBQ).",
    skeleton: "Galbanum (Bitter Green) / Artemisia → Carnation / Jasmine → Overdosed IBQ (Bitter Suede) / Oakmoss / Vetiver",
    innovation: "Cellier, one of the first prominent female master noses, rejected pretty designs. She slammed the newly isolated IBQ molecule—which smells aggressively like chemical leather, bitter rubber, and ash—against hyper-bitter green galbanum resin. It created a dark, sharply masculine-edged feminine leather sub-genre."
  },
  {
    year: 1947,
    genre: "The Green Floral Chypres",
    pillarFragrance: "Miss Dior",
    brand: "Dior",
    masterNose: "Jean Carles & Paul Vacher",
    breakthroughMolecule: "Galbanum Resinoid integration into a classical Chypre frame.",
    skeleton: "Galbanum / Aldehydes / Bergamot → Narcissus / Iris / Jasmine → Oakmoss / Patchouli / Leather (IBQ)",
    innovation: "Carles and Vacher upgraded Coty's 1917 Chypre template by injecting an intense, snappy, green-vegetal crunch using raw Galbanum. This created a sharp, brisk, springtime freshness that maintained the elite, serious, intellectual base architecture of the classical mossy finish."
  },
  {
    year: 1956,
    genre: "The Photorealistic Lily of the Valley (Muguet)",
    pillarFragrance: "Diorissimo",
    brand: "Dior",
    masterNose: "Edmond Roudnitska",
    breakthroughMolecule: "Hydroxycitronellal.",
    skeleton: "Green Leaves / Bergamot → Overdosed Hydroxycitronellal / Lilac / Jasmine → Civet / Sandalwood",
    innovation: "Lily of the Valley is a 'mute flower'—its volatile oils cannot be naturally extracted from the petals. Roudnitska spent years studying the flower in his garden, discovering that a massive overdose of the synthetic aldehyde Hydroxycitronellal, balanced with green modifiers, perfectly tricked the human brain into smelling a dewy, wet lily stem in a spring forest."
  },
  {
    year: 1966,
    genre: "The Radiant Translucent Citrus (The Watery Cologne)",
    pillarFragrance: "Eau Sauvage",
    brand: "Dior",
    masterNose: "Edmond Roudnitska",
    breakthroughMolecule: "Hedione (Methyl Dihydrojasmonate - discovered and synthesized by Firmenich).",
    skeleton: "Lemon / Bergamot / Rosemary → Overdosed Hedione / Coriander / Jasmine → Oakmoss / Vetiver",
    innovation: "Before Eau Sauvage, citrus colognes evaporated off the skin in 20 minutes. Roudnitska introduced Hedione—a transparent, dew-like molecule isolated from jasmine. Hedione did not possess a heavy smell itself, but it acted as a luminous physical amplifier, allowing the citrus top notes to radiate off the body for hours like wet sunshine."
  },
  {
    year: 1978,
    genre: "The Aromatic Powerhouse Fougère",
    pillarFragrance: "Azzaro Pour Homme",
    brand: "Azzaro",
    masterNose: "Gerard Anthony & Martin Heiddenreich",
    breakthroughMolecule: "An aggressive stabilization of Anethole (Star Anise isolation) paired with high concentrations of Coumarin.",
    skeleton: "Star Anise (Anethole) / Lavender / Basil → Patchouli / Vetiver / Cardamom → Coumarin / Oakmoss / Leather",
    innovation: "The traditional clean barbershop fougère was re-engineered into a heavy, dark, hyper-masculine chest-hair statement. By elevating aniseed (Anethole) to the top and embedding it in deep woods and massive coumarin, they built a dense, warm, herbal-spicy shield that defined 1980s masculine power dynamics."
  },
  {
    year: 1988,
    genre: "The Violet-Leaf Petrol Masculine",
    pillarFragrance: "Fahrenheit",
    brand: "Dior",
    masterNose: "Jean-Louis Sieuzac & Michel Almairac",
    breakthroughMolecule: "Methyl Octine Carbonate (MOC).",
    skeleton: "Violet Leaf (MOC) / Lavender / Hawthorn → Nutmeg / Honeysuckle / Jasmine → Leather / Vetiver / Amber",
    innovation: "The perfumers discovered that an accidental compound variance involving Methyl Octine Carbonate—a highly restricted, sharp green-chemical molecule—created a distinct, hyper-realistic gasoline/petroleum note when smashed against a soft floral violet heart and heavy leather. It created an iconic, ruggedly industrial masculine signature."
  },
  {
    year: 1992,
    genre: "The Aquatic / Oceanic Revolution",
    pillarFragrance: "L'Eau d'Issey",
    brand: "Issey Miyake",
    masterNose: "Jacques Cavallier-Belletrud",
    breakthroughMolecule: "Calone 1951 (Discovered accidentally by Pfizer chemists in 1966 while looking for an anxiety drug structure).",
    skeleton: "Calone 1951 / Melon / Lotus / Freesia → Lily of the Valley / Peony → Exotic Woods / Amber / Musk",
    innovation: "Cavallier took Calone—a molecule whose geometry mimics the sulfurous, watery, ozonic smell of a sea breeze and sliced watermelon—and used it to build a weightless, hyper-transparent floral. It completely destroyed the heavy, spicy 1980s powerhouse trends, kickstarting the global 1990s minimalist obsession with running water and fresh air."
  },
  {
    year: 1992,
    genre: "The Gourmand Family (The Sophisticated Dessert)",
    pillarFragrance: "Angel",
    brand: "Thierry Mugler",
    masterNose: "Olivier Cresp & Yves de Chirin",
    breakthroughMolecule: "Ethyl Maltol (The chemical blueprint of spun sugar/cotton candy).",
    skeleton: "Bergamot / Melon / Red Berries → Honey / Blackberry / Orchid → Overdosed Ethyl Maltol / Bitter Patchouli",
    innovation: "Cresp single-handedly invented the 'edible' fragrance category. He took the hyper-sweet, sticky note of burnt sugar (Ethyl Maltol) and anchored it with a massive, brutal overdose of bitter, earthy, dark Patchouli oil. The patchouli acted as a structural ballast, stopping the sugar from sitting flat and cheap, turning a childhood carnival scent into a dangerous, high-fashion weapon."
  },
  {
    year: 1994,
    genre: "The Clean Industrial Laundromat (The Unisex Clean Slate)",
    pillarFragrance: "CK One",
    brand: "Calvin Klein",
    masterNose: "Alberto Morillas & Harry Fremont",
    breakthroughMolecule: "High-purity industrial balancing of Galaxolide (HHCB) + Dihydromyrcenol.",
    skeleton: "Dihydromyrcenol / Bergamot / Pineapple → Green Tea Accord / Jasmine / Violet → Galaxolide (White Musk) / Cedarwood",
    innovation: "Morillas and Fremont engineered the ultimate gender-neutral blank slate. By locking the sharp, soapy-clean air of Dihydromyrcenol into a massive, cloud-like base of Galaxolide (the synthetic white musk used to scent commercial laundry detergents), they built a fragrance that smelled entirely safe, transparent, and universally non-offensive."
  },
  {
    year: 2001,
    genre: "The Transparent Iso E Super Cedar Wood-Frame",
    pillarFragrance: "Terre d'Hermès",
    brand: "Hermès",
    masterNose: "Jean-Claude Ellena",
    breakthroughMolecule: "A historic, paradigm-shifting concentration (55%+ of the formula) of Iso E Super.",
    skeleton: "Bitter Orange / Grapefruit → Flint / Gunpowder / Pink Pepper → Overdosed Iso E Super / Vetiver / Cedarwood",
    innovation: "Ellena completely discarded the dense floral-amber padding of traditional woody perfumes. He used a towering, monovolume scaffolding of Iso E Super—a synthetic molecule that mimics smooth cedarwood but acts like an internal radiator. This allowed the top notes of sharp grapefruit and dirty gunmetal flint to remain suspended in mid-air, creating a see-through, vibrating woody-mineral aura around the wearer."
  }
];
