export interface NicheCreation {
  name: string;
  brand: string;
}

export interface NicheItem {
  id: number;
  name: string;
  category: string;
  origin: string;
  philosophy: string;
  blueprint: string;
  creations: NicheCreation[];
}

export const INDEPENDENT_NICHE_DATABASE: NicheItem[] = [
  // The Avant-Garde Concept Architects
  {
    id: 1,
    name: "Francesca Bianchi",
    category: "The Avant-Garde Concept Architects",
    origin: "Netherlands / Italy",
    philosophy: "Radical Intimacy and Carnal Warmth. Bianchi explores the visceral reality of human skin, bypassing clean laundry notes to craft dense, highly texturized, and unapologetically physical compositions.",
    blueprint: "She utilizes massive overdoses of buttery, iron-rich Orris concrete slammed into dense, heavy networks of real ambergris, honey, castoreum, and warm spices. This creates a low-volatility, sticky physical film on the skin that mimics natural human pheromones rather than an applied commercial spray.",
    creations: [
      { name: "Under My Skin", brand: "Francesca Bianchi" },
      { name: "The Dark Side", brand: "Francesca Bianchi" },
      { name: "Sticky Fingers", brand: "Francesca Bianchi" }
    ]
  },
  {
    id: 2,
    name: "Papillon Artisan Perfumes / Liz Moores",
    category: "The Avant-Garde Concept Architects",
    origin: "UK",
    philosophy: "The Classical Animalic Renaissance. Self-taught perfumer Liz Moores constructs heavy, hyper-complex, vintage-leaning perfumes that restore the dangerous, carnal growl of old-world structures while maintaining a clean, modern clarity.",
    blueprint: "Moores integrates raw, highly polarizing materials like Cumin, Hyrax, and authentic Civet directly into the structural heart of absolute florals (like jasmine and tuberose), using the dirty, earthy facets of the spices to anchor the sweet, explosive volatility of the petals.",
    creations: [
      { name: "Salome", brand: "Papillon Artisan Perfumes" },
      { name: "Anubis", brand: "Papillon Artisan Perfumes" },
      { name: "Dryad", brand: "Papillon Artisan Perfumes" }
    ]
  },
  {
    id: 3,
    name: "Douglas Little / Heretic Parfum",
    category: "The Avant-Garde Concept Architects",
    origin: "USA",
    philosophy: "Gothic Botanical Realism. Little rejects synthetic safety nets to focus on the moody, intense, and sometimes unsettling dark side of 100% natural, raw botanicals.",
    blueprint: "He constructs hyper-atmospheric environments by pairing dark, rooty elements like Ambrette seed with humid, rain-soaked soil simulations, labdanum, and metallic florality, generating an eerie, non-commercial olfactory weight.",
    creations: [
      { name: "Nosferatu", brand: "Heretic Parfum" },
      { name: "Dirty Jasmine", brand: "Heretic Parfum" },
      { name: "Florgasm", brand: "Heretic Parfum" }
    ]
  },
  {
    id: 4,
    name: "Filippo Sorcinelli / UNUM",
    category: "The Avant-Garde Concept Architects",
    origin: "Italy",
    philosophy: "High-Gothic Ecclesiastical Realism. As an official tailor to the Vatican and a cathedral organist, Sorcinelli treats perfume as a literal extension of sacred architecture and sacred spaces.",
    blueprint: "He bypasses all mass-market freshness to bottle the literal scent of cold, wet cathedral stone, burning altar candles, scorched metal, and heavy incense smoke using an uncompromising blend of Somalian Frankincense and high-boiling-point resins.",
    creations: [
      { name: "LAVS", brand: "UNUM" },
      { name: "Opus 1144", brand: "UNUM" },
      { name: "Reliqvia", brand: "UNUM" }
    ]
  },
  {
    id: 5,
    name: "John Biebel / January Scent Project",
    category: "The Avant-Garde Concept Architects",
    origin: "USA",
    philosophy: "Rhythmic and Generative Symmetries. Biebel treats perfumery like an experimental music composition or visual art installation, mapping out unusual, lost-in-time scent narratives.",
    blueprint: "He builds jagged, high-friction formulas that drop unexpected materials like malt, dynamic aldehydes, and cold iron notes directly into heavy, traditional botanical bases like vetiver and heavy moss.",
    creations: [
      { name: "Smolderose", brand: "January Scent Project" },
      { name: "Burvuvu", brand: "January Scent Project" },
      { name: "Selperniku", brand: "January Scent Project" }
    ]
  },

  // The Landscape & Narrative Archivists
  {
    id: 6,
    name: "Jorum Studio / Euan McCall",
    category: "The Landscape & Narrative Archivists",
    origin: "Scotland",
    philosophy: "Phantasmagoric Botanical Texturing. Independent nose Euan McCall maps out the raw, gritty reality of the Scottish wilderness, dismantling traditional pretty floral tropes.",
    blueprint: "He weaves savory, high-diffusion spices like black pepper and cardamom directly into unusual, fuzzy natural materials like raw wool, wet moss, and damp, cold stones.",
    creations: [
      { name: "Fantosmia", brand: "Jorum Studio" },
      { name: "Firewater", brand: "Jorum Studio" },
      { name: "Healing Berry", brand: "Jorum Studio" }
    ]
  },
  {
    id: 7,
    name: "D.S. & Durga / David Seth Moltz",
    category: "The Landscape & Narrative Archivists",
    origin: "USA",
    philosophy: "Americana Realism and Musical Time-Capsules. Moltz functions like a historian using aromachemicals instead of words, building photorealistic environments based on specific moments in American geography and lore.",
    blueprint: "He highlights the unrefined, industrial facets of materials—utilizing sharp pine rosin, heavy mahogany wood chips, walnut stains, river mud, and white cedar to craft tactile, historical narratives.",
    creations: [
      { name: "Bowmakers", brand: "D.S. & Durga" },
      { name: "Mississippi Medicine", brand: "D.S. & Durga" },
      { name: "Amber Kiso", brand: "D.S. & Durga" }
    ]
  },
  {
    id: 8,
    name: "Imaginary Authors / Josh Meyer",
    category: "The Landscape & Narrative Archivists",
    origin: "USA",
    philosophy: "Literary Olfactory Fiction. Meyer builds each perfume around a completely fictional book written by a fictional author, inventing an imaginary \"note\" within the formula to anchor the storytelling.",
    blueprint: "He layers highly specific, nostalgic comfort accords (like burnt match, warm waffle cone, or saltwater taffy) into traditional structural frames like crisp pine, vetiver, or smoky vanilla.",
    creations: [
      { name: "Cape Heartache", brand: "Imaginary Authors" },
      { name: "Memoirs of a Trespasser", brand: "Imaginary Authors" },
      { name: "The Soft Lawn", brand: "Imaginary Authors" }
    ]
  },
  {
    id: 9,
    name: "Histoires de Parfums / Gérald Ghislain",
    category: "The Landscape & Narrative Archivists",
    origin: "France",
    philosophy: "The Olfactory Historical Library. Ghislain designs perfumes that act as \"volumes\" in a historical encyclopedia, dedicated to specific iconic figures, historical turning points, or cultural eras.",
    blueprint: "He builds rich, slow-evolving, highly literate French chypres and ambers that transition cleanly over hours, mirroring the dramatic arc of the historical subject matter.",
    creations: [
      { name: "1740 Marquis de Sade", brand: "Histoires de Parfums" },
      { name: "1899 Hemingway", brand: "Histoires de Parfums" },
      { name: "Tubéreuse Nuit Blanche", brand: "Histoires de Parfums" }
    ]
  },
  {
    id: 10,
    name: "Vilhelm Parfumerie / Jan Ahlgren",
    category: "The Landscape & Narrative Archivists",
    origin: "USA / France",
    philosophy: "Bottled Cinematic Memories. Ahlgren captures hyper-specific personal and historical vignettes, encasing them in a highly recognizable, heavy, visual aesthetic.",
    blueprint: "The house style relies on bright, clear, and unexpected linear contrasts—such as dropping a crisp green apple note directly into a rich, deep matrix of smoky black tea and oakwood.",
    creations: [
      { name: "Dear Polly", brand: "Vilhelm Parfumerie" },
      { name: "Poets of Berlin", brand: "Vilhelm Parfumerie" },
      { name: "Morning Chess", brand: "Vilhelm Parfumerie" }
    ]
  },

  // The Botanical Purists & Terroir Masters
  {
    id: 11,
    name: "Di Ser / Yasuyuki Shinohara",
    category: "The Botanical Purists & Terroir Masters",
    origin: "Japan",
    philosophy: "Shinto Naturalism and Terroir Realism. Operating out of Hokkaido, Shinohara crafts ultra-premium, 100% natural botanical perfumes designed to reflect the raw spirituality and climate of northern Japan.",
    blueprint: "He bypasses all Western synthetic workhorses (like Iso E Super or Hedione), utilizing rare, local distillations of native Hokkaido Jzo (Japanese Cedar), smooth Kyara Oud, shiso leaf, and yuzu to capture fleeting atmospheric transitions.",
    creations: [
      { name: "Kagiroi", brand: "Di Ser" },
      { name: "Hana Matsuri", brand: "Di Ser" },
      { name: "Haze", brand: "Di Ser" }
    ]
  },
  {
    id: 12,
    name: "Les Indémodables / Valérie Pulvérail",
    category: "The Botanical Purists & Terroir Masters",
    origin: "France",
    philosophy: "Uncompromising Material Transparency. Pulvérail treats raw materials like a Michelin-starred chef views ingredients, using custom, in-house green extractions to present classic perfume notes with zero synthetic masking.",
    blueprint: "The brand partners with extraction labs to secure exclusive, hyper-pure natural batches—such as a specific, green, non-sweet vanilla bean extract or an un-smoked patchouli absolute—and frames them inside clean, mathematically precise formulas.",
    creations: [
      { name: "Vanille Havane", brand: "Les Indémodables" },
      { name: "Musc de Sables", brand: "Les Indémodables" },
      { name: "Fougère Emeraude", brand: "Les Indémodables" }
    ]
  },
  {
    id: 13,
    name: "Anatole Lebreton",
    category: "The Botanical Purists & Terroir Masters",
    origin: "France",
    philosophy: "Independent, Self-Taught French Rigor. Lebreton is an ingredient-obsessed iconoclast who constructs complex, highly technical fragrances that ignore modern focus groups.",
    blueprint: "He maximizes the natural tenacity of materials like Ambrette seed, benzoin, and rich resins beneath highly volatile top notes, demonstrating how a natural composition can maintain massive longevity without relying on industrial synthetic fixatives.",
    creations: [
      { name: "Caribe Kiss", brand: "Anatole Lebreton" },
      { name: "L'Eau de Merzhin", brand: "Anatole Lebreton" },
      { name: "Incarnation", brand: "Anatole Lebreton" }
    ]
  },
  {
    id: 14,
    name: "Prosody London / J.N. Mclean",
    category: "The Botanical Purists & Terroir Masters",
    origin: "UK",
    philosophy: "Organic Haute Botanicals. Mclean designs highly complex, multi-layered all-natural luxury compositions that challenge the belief that organic perfumes cannot match the performance of synthetic design.",
    blueprint: "He locks fragile, heat-sensitive materials like real Rosa damascena absolute or raw, genuine Oud resin into deep, low-volatility baselines of sandalwood, patchouli, and labdanum to slow down evaporation lines completely naturally.",
    creations: [
      { name: "Oud Octavo", brand: "Prosody London" },
      { name: "Rose Rondeaux", brand: "Prosody London" },
      { name: "Whistle Moon", brand: "Prosody London" }
    ]
  },
  {
    id: 15,
    name: "Ormonde Jayne / Linda Pilkington",
    category: "The Botanical Purists & Terroir Masters",
    origin: "UK",
    philosophy: "Exotic Ingredient Formalism. Pilkington was the first to scale a niche house by intentionally introducing completely un-utilized, exotic botanicals to the Western compounding palette.",
    blueprint: "She builds hyper-elegant, smooth luxury signatures using high oil concentrations (32%) built around unusual, complex matrices like Black Hemlock absolute, Champaca absolute, and Ta'if rose.",
    creations: [
      { name: "Ormonde Woman", brand: "Ormonde Jayne" },
      { name: "Montabaco Intensivo", brand: "Ormonde Jayne" },
      { name: "Ta'if", brand: "Ormonde Jayne" }
    ]
  },

  // The Modern Minimalists & Concept Rebels
  {
    id: 16,
    name: "Liis",
    category: "The Modern Minimalists & Concept Rebels",
    origin: "USA",
    philosophy: "Second-Skin Evanescence. Liis designs weightless, transparent, \"unseen\" fragrances meant to act as subtle, clean extension lines of the wearer's physical skin chemistry.",
    blueprint: "They drop light, airy, translucent notes (like wet rice vapor, clean cotton, or transparent musks) over minimalist, low-odor-threshold synthetic skeletons that float around the body without projecting a heavy wall of scent.",
    creations: [
      { name: "Studied", brand: "Liis" },
      { name: "Floating", brand: "Liis" },
      { name: "Bo", brand: "Liis" }
    ]
  },
  {
    id: 17,
    name: "d'Annam",
    category: "The Modern Minimalists & Concept Rebels",
    origin: "Vietnam",
    philosophy: "Southeast Asian Sensory Minimalism. A contemporary house translating Vietnamese cultural hallmarks and landscapes into ultra-clean, serene, and modern fragrance structures.",
    blueprint: "They pair highly delicate, volatile organic accords—like the subtle steam of hot jasmine White Rice or the crisp green astringency of Pomelo Oolong tea—with highly spacious, transparent synthetic carriers to preserve fragile top-note realism.",
    creations: [
      { name: "White Rice", brand: "d'Annam" },
      { name: "Pomelo Oolong", brand: "d'Annam" }
    ]
  },
  {
    id: 18,
    name: "Fugazzi",
    category: "The Modern Minimalists & Concept Rebels",
    origin: "Netherlands",
    philosophy: "Electro-Magnetic Modernism. Built around a hyper-contemporary, high-contrast, youthful aesthetic that focuses on clean, magnetic materials.",
    blueprint: "They use massive, clean overdoses of Cashmeran, silky white musks, and soft ambers spiked with sharp green modifiers like bergamot and patchouli to project a clean, high-frequency, impossibly cool aura.",
    creations: [
      { name: "Angel Dust", brand: "Fugazzi" },
      { name: "Sugardaddy", brand: "Fugazzi" },
      { name: "Orange Crush", brand: "Fugazzi" }
    ]
  },
  {
    id: 19,
    name: "Akro / Olivier Cresp",
    category: "The Modern Minimalists & Concept Rebels",
    origin: "UK / France",
    philosophy: "The Bottling of Human Addictions. Master perfumer Olivier Cresp created this independent house to explore the darker, raw, and visceral side of human bad habits and obsessions.",
    blueprint: "He builds hyper-realistic, figurative illusions of dark coffee (Awake), smoky tobacco (Smoke), single-malt whiskey (Malt), and dark chocolate (Dark), keeping them elevated and wearable via masterfully engineered, clean structural foundations.",
    creations: [
      { name: "Awake", brand: "Akro" },
      { name: "Smoke", brand: "Akro" },
      { name: "Bake", brand: "Akro" }
    ]
  },
  {
    id: 20,
    name: "Room 1015 / Dr. Mike",
    category: "The Modern Minimalists & Concept Rebels",
    origin: "France",
    philosophy: "The Olfactory Rock 'n' Roll Counter-Culture. Founded by a chemist and guitar player, the house bottles the gritty, electric, neon spirit of iconic music sub-cultures and eras.",
    blueprint: "They pair sharp, volatile synthetic notes (like bleeding neon cherry accords, hot vinyl, or metallic aldehydes) with deep, comforting baselines of clean patchouli and soft leather.",
    creations: [
      { name: "Wavechild", brand: "Room 1015" },
      { name: "Cherry Punk", brand: "Room 1015" },
      { name: "Sonic Flower", brand: "Room 1015" }
    ]
  },

  // The Intellectual & Mythological Alchemists
  {
    id: 21,
    name: "Les Liquides Imaginaires",
    category: "The Intellectual & Mythological Alchemists",
    origin: "France",
    philosophy: "Fragrance as Sacred Ritual and Myth. They treat perfume as its ancient Latin root defines it: per fumum (through smoke)—a sacred liquid tool used to connect humans to the divine or mythical worlds.",
    blueprint: "The house specializes in highly textured, milky, or metallic lactonic illusions—such as locking a creamy, white, lactonic steamed-milk and white floral accord against cold, stony incense and resins.",
    creations: [
      { name: "Blanche Bête", brand: "Les Liquides Imaginaires" },
      { name: "Sancti", brand: "Les Liquides Imaginaires" },
      { name: "Fortis", brand: "Les Liquides Imaginaires" }
    ]
  },
  {
    id: 22,
    name: "Stephane Humbert Lucas 777",
    category: "The Intellectual & Mythological Alchemists",
    origin: "France",
    philosophy: "Synesthetic Luxury and Mythological Symbolism. Lucas is a painter and poet who treats perfume creation as a direct visual translation of colors and shapes into smell.",
    blueprint: "He creates dense, slow-burning, high-impact profiles that pack hyper-saturated natural tropical fruits and sweet nectar accords directly into deep, dark, resinous bases of real oud, ambergris, and leather.",
    creations: [
      { name: "God of Fire", brand: "Stephane Humbert Lucas 777" },
      { name: "Mortal Skin", brand: "Stephane Humbert Lucas 777" },
      { name: "Oumma", brand: "Stephane Humbert Lucas 777" }
    ]
  },
  {
    id: 23,
    name: "Mind Games",
    category: "The Intellectual & Mythological Alchemists",
    origin: "USA",
    philosophy: "The Strategy of the Chessboard. A high-concept house that maps out its entire fragrance architecture around the calculation, psychology, and tactical movements of chess.",
    blueprint: "They assign independent master noses to build complex, highly calculating formulas that use modern synthetic captives to deliver clean, hyper-radiant, and long-lasting floral-woody or amber profiles.",
    creations: [
      { name: "Grand Master", brand: "Mind Games" },
      { name: "Queening", brand: "Mind Games" },
      { name: "Prodigy", brand: "Mind Games" }
    ]
  },
  {
    id: 24,
    name: "Ex Nihilo",
    category: "The Intellectual & Mythological Alchemists",
    origin: "France",
    philosophy: "Parisian Avant-Garde Personalization. They combine the traditional, precise rigor of classic French luxury compounding with cutting-edge, high-tech customization and ultra-modern ingredients.",
    blueprint: "They leverage premium Givaudan captive molecules (like Akigalawood) to engineer hyper-radiant, crystalline, blue-mineral or neon-floral signatures that possess incredible lateral projection and absolute stability under extreme wear.",
    creations: [
      { name: "Fleur Narcotique", brand: "Ex Nihilo" },
      { name: "Blue Talisman", brand: "Ex Nihilo" },
      { name: "Lust In Paradise", brand: "Ex Nihilo" }
    ]
  },
  {
    id: 25,
    name: "Jusbox",
    category: "The Intellectual & Mythological Alchemists",
    origin: "Italy",
    philosophy: "The Molecular Melody. Jusbox views the art of the perfumer as identical to the work of a musical composer, mapping out formulas based on the rhythm, beat, and emotional frequency of specific musical genres and movements.",
    blueprint: "They explicitly match the structural weight of their notes to the concept—pairing raw, scratchy, distorted leather-woods with punk, or clean, airy, high-diffusion white musks with electronic ambient synth waves.",
    creations: [
      { name: "Cheeky Smile", brand: "Jusbox" },
      { name: "Beat Café", brand: "Jusbox" },
      { name: "Night Flow", brand: "Jusbox" }
    ]
  }
];
