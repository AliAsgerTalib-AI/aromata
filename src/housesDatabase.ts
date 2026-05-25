export interface HouseCreation {
  name: string;
  brand: string;
}

export interface HouseItem {
  name: string;
  category: string; // e.g. "The Historic Heritage Guards", "The Modern Creative Disruptors", etc.
  philosophy: string;
  scentProfile: string;
  coreMandate: string;
  creationsList: HouseCreation[];
}

export const MASTER_HOUSES_DATABASE: HouseItem[] = [
  // The Historic Heritage Guards
  {
    name: "Guerlain",
    category: "The Historic Heritage Guards",
    philosophy: "The Operatic Multi-Generational Dynasty.",
    scentProfile: "Dense, non-linear, and rich. Guerlain is the absolute master of the slow-release transformation, grounding their fragrances in the Guerlinade—a thick, signature accord of powdery iris, rich vanilla, bergamot, and tonka bean.",
    coreMandate: "Treating history as liquid art; their perfumes demand hours on the skin to fully transition from vintage, medicinal openings into deep, velvety warmth.",
    creationsList: [
      { name: "Shalimar", brand: "Guerlain" },
      { name: "L'Heure Bleue", brand: "Guerlain" },
      { name: "Mitsouko", brand: "Guerlain" }
    ]
  },
  {
    name: "Caron",
    category: "The Historic Heritage Guards",
    philosophy: "Subversive Sub-Accord Friction.",
    scentProfile: "High-contrast, dark, and heavy. Caron built its legacy on taking aggressive, bitter leather/industrial bases (like the famous Mousse de Saxe) and wrapping them tightly around hyper-vulnerable, sweet florals.",
    coreMandate: "Intentional, high-stakes structural tension that smells simultaneously clean-soap vintage and dangerously edgy.",
    creationsList: [
      { name: "Pour Un Homme de Caron", brand: "Caron" },
      { name: "Tabac Blond", brand: "Caron" }
    ]
  },
  {
    name: "Creed",
    category: "The Historic Heritage Guards",
    philosophy: "The Aristocratic Dynastic Standard.",
    scentProfile: "Bright, naturalistic, crisp, and flawlessly tailored. Creed relies heavily on high-grade natural ingredients (like ambergris, crisp citruses, and green tea) backed by a classic, clean, old-money freshness.",
    coreMandate: "Delivering immediate, premium luxury status and effortless wearability without leaning into weird or polarizing experimentation.",
    creationsList: [
      { name: "Aventus", brand: "Creed" },
      { name: "Green Irish Tweed", brand: "Creed" },
      { name: "Silver Mountain Water", brand: "Creed" }
    ]
  },
  {
    name: "Houbigant",
    category: "The Historic Heritage Guards",
    philosophy: "The Custodian of the Royal Fougère.",
    scentProfile: "Structured, green, elegant, and highly classical. Houbigant essentially invented the modern masculine framework by introducing synthetic coumarin to bridge fresh lavender and damp mosses.",
    coreMandate: "Maintaining the hyper-polished, pristine formal lineage of traditional French royal court perfumery.",
    creationsList: [
      { name: "Fougère Royale", brand: "Houbigant" },
      { name: "Duc de Vervins", brand: "Houbigant" }
    ]
  },
  {
    name: "Krigler",
    category: "The Historic Heritage Guards",
    philosophy: "The Custom Tailored Tuxedo.",
    scentProfile: "Rich, deep, ultra-exclusive, and distinctly timeless. Krigler structures perfumes with a dense, linear premium weight, using old-world compounding secrets to scent historical elite figures.",
    coreMandate: "Creating quiet, un-trendy, ultra-luxury statements that smell strictly like massive generational wealth.",
    creationsList: [
      { name: "Lieber Gustav 14", brand: "Krigler" },
      { name: "Chateau Krigler 12", brand: "Krigler" }
    ]
  },

  // The Modern Creative Disruptors
  {
    name: "Frédéric Malle",
    category: "The Modern Creative Disruptors",
    philosophy: "The Olfactory Publishing House.",
    scentProfile: "Eclectic, unrestricted, and highly concentrated. Malle does not design perfumes; he acts as an editor, hiring the world’s greatest independent noses to build their dream scents with zero budget caps.",
    coreMandate: "Giving absolute power back to the artist, resulting in a catalog of highly diverse, masterfully engineered, zero-compromise flagships.",
    creationsList: [
      { name: "Portrait of a Lady", brand: "Frédéric Malle" },
      { name: "Carnal Flower", brand: "Frédéric Malle" },
      { name: "Musc Ravageur", brand: "Frédéric Malle" }
    ]
  },
  {
    name: "Amouage",
    category: "The Modern Creative Disruptors",
    philosophy: "Middle Eastern Grandeur Meets Western Structure.",
    scentProfile: "Tectonic, smoky, opulent, and dense. Founded by the Sultan of Oman, the house packs its compositions with hyper-premium local resources like dark Omani frankincense, heavy myrrh, real oud, and rich spices.",
    coreMandate: "Rejecting Western clean subtlety completely in favor of massive, slow-burning, commanding clouds of deep spiritual luxury.",
    creationsList: [
      { name: "Reflection Man", brand: "Amouage" },
      { name: "Interlude Man", brand: "Amouage" },
      { name: "Jubilation XXV", brand: "Amouage" }
    ]
  },
  {
    name: "Tom Ford",
    category: "The Modern Creative Disruptors",
    philosophy: "The Neo-Classic Provocateur.",
    scentProfile: "Bold, dark, carnal, and highly texturized. Through his Private Blend line, Tom Ford pioneered modern gender-neutral, ingredient-focused perfumery by stripping away complex top notes and highlighting single bold elements like dark amber, dirty leather, or heavy vanilla.",
    coreMandate: "Hijacking classic structures and weaponizing them with raw, high-fashion sex appeal and massive presence.",
    creationsList: [
      { name: "Tobacco Vanille", brand: "Tom Ford" },
      { name: "Oud Wood", brand: "Tom Ford" },
      { name: "Lost Cherry", brand: "Tom Ford" }
    ]
  },
  {
    name: "Serge Lutens",
    category: "The Modern Creative Disruptors",
    philosophy: "The Dark Literary Avant-Garde.",
    scentProfile: "Sticky, resinous, syrupy, and boundary-pushing. Lutens, alongside perfumer Christopher Sheldrake, created the modern blueprint for dark niche perfume by drenching rich woods in honey, dried fruits, and intense resins.",
    coreMandate: "Rejecting \"clean mass appeal\" entirely to craft moody, evocative, and deeply personal emotional poetry on the skin.",
    creationsList: [
      { name: "Ambre Sultan", brand: "Serge Lutens" },
      { name: "Chergui", brand: "Serge Lutens" },
      { name: "Féminité du Bois", brand: "Serge Lutens" }
    ]
  },
  {
    name: "Parfums de Marly",
    category: "The Modern Creative Disruptors",
    philosophy: "18th-Century Equestrian Aristocracy Made Modern.",
    scentProfile: "Rich, sweet, incredibly dense, and highly performative. They take the opulent, lavish, festival spirit of King Louis XV's court and upgrade it with hyper-modern, high-impact base notes that excel in projection.",
    coreMandate: "Blending old-world French prestige with contemporary, highly addictive crowd-pleasers that dominate social media and modern luxury spaces.",
    creationsList: [
      { name: "Layton", brand: "Parfums de Marly" },
      { name: "Herod", brand: "Parfums de Marly" },
      { name: "Percival", brand: "Parfums de Marly" }
    ]
  },
  {
    name: "Initio Parfums Privés",
    category: "The Modern Creative Disruptors",
    philosophy: "Olfactory Pheromonal Witchcraft.",
    scentProfile: "Magnetic, deep, lactonic, and dangerously addictive. Initio focuses on the science of scent-memory and animal instincts, utilizing heavy overdoses of creamy musks, warm ambers, and materials like hedione to trigger raw attraction.",
    coreMandate: "Bypassing intellectual over-analysis to target the primal, sub-conscious animal response of everyone in your immediate vicinity.",
    creationsList: [
      { name: "Oud for Greatness", brand: "Initio Parfums Privés" },
      { name: "Side Effect", brand: "Initio Parfums Privés" },
      { name: "Musk Therapy", brand: "Initio Parfums Privés" }
    ]
  },
  {
    name: "Xerjoff",
    category: "The Modern Creative Disruptors",
    philosophy: "High-Velocity Italian Multi-Texturing.",
    scentProfile: "Loud, vibrant, flawlessly polished, and long-lasting. Xerjoff blends crisp, hyper-natural Mediterranean citruses and rich, tropical fruits directly into deep, complex bases of white musk, ambergris, or rare oud.",
    coreMandate: "Uniting Italian artisanal glass craftsmanship with absolute powerhouse performance; these scents are impossible to ignore.",
    creationsList: [
      { name: "Naxos", brand: "Xerjoff" },
      { name: "Erba Pura", brand: "Xerjoff" },
      { name: "Alexandria II", brand: "Xerjoff" }
    ]
  },
  {
    name: "Maison Crivelli",
    category: "The Modern Creative Disruptors",
    philosophy: "The Sensory Shock Contrast.",
    scentProfile: "Kinetic, surprising, and narrative-driven. The house builds scents based on real-world travel shocks—like drinking hibiscus tea in a gemstone market or smelling raw oud while eating tropical passionfruit.",
    coreMandate: "Pairing wildly unexpected elements together to shake up the wearer's senses and create a modern, high-definition story.",
    creationsList: [
      { name: "Oud Maracujá", brand: "Maison Crivelli" },
      { name: "Hibiscus Mahajád", brand: "Maison Crivelli" },
      { name: "Bois Datchaï", brand: "Maison Crivelli" }
    ]
  },

  // The Minimalist & Transparent Poets
  {
    name: "Hermès",
    category: "The Minimalist & Transparent Poets",
    philosophy: "The Japanese Ink-Wash Watercolor.",
    scentProfile: "Weightless, transparent, mineralic, and spacious. Driven by their lineage of in-house masters, Hermès strips away the heavy, suffocating \"noise\" of traditional perfumery, leaving massive breathing room for clean woods and crisp elements.",
    coreMandate: "Framing the clean, natural beauty of your existing environment rather than building a thick, artificial wall of scent around you.",
    creationsList: [
      { name: "Terre d'Hermès", brand: "Hermès" },
      { name: "Voyage d'Hermès", brand: "Hermès" },
      { name: "Jardin en Méditerranée", brand: "Hermès" }
    ]
  },
  {
    name: "Diptyque",
    category: "The Minimalist & Transparent Poets",
    philosophy: "The Translucent Atmospheric Snapshot.",
    scentProfile: "Ethereal, wet, green, and highly nostalgic. Diptyque treats perfume like light passing through frosted glass, focusing on hyper-realistic, fleeting memories—like a damp fig leaf crushing in your hand or a sea breeze passing a flower stall.",
    coreMandate: "Complete atmospheric clarity; their scents completely avoid heavy base fixatives, allowing the fragile, natural top-and-mid notes to drift lightly in the air.",
    creationsList: [
      { name: "Philosykos", brand: "Diptyque" },
      { name: "Tam Dao", brand: "Diptyque" },
      { name: "L'Ombre Dans L'Eau", brand: "Diptyque" }
    ]
  },
  {
    name: "Byredo",
    category: "The Minimalist & Transparent Poets",
    philosophy: "Modern Scandinavian Emotional Reductionism.",
    scentProfile: "Clean, abstract, linear, and hyper-modern. Byredo translates specific memories and emotions into incredibly crisp, non-shifting formulas that use minimal lines to maximize clarity.",
    coreMandate: "Stripping away old-world French complexity to create a chic, highly scannable, day-to-day skin aura.",
    creationsList: [
      { name: "Gypsy Water", brand: "Byredo" },
      { name: "Bal d'Afrique", brand: "Byredo" },
      { name: "Mojave Ghost", brand: "Byredo" }
    ]
  },
  {
    name: "Le Labo",
    category: "The Minimalist & Transparent Poets",
    philosophy: "The Industrial Wabi-Sabi Workshop.",
    scentProfile: "Gritty, dry, linear, and hyper-focused on single aroma-chemicals. Le Labo highlights the raw, unpolished, scratchy beauty of single wood or musk notes (like heavy cedar, clean musks, or dry woods) without smoothing out the rough edges.",
    coreMandate: "Presenting formulation as a raw, lab-fresh, industrial art piece that feels urban, structural, and fiercely individualistic.",
    creationsList: [
      { name: "Santal 33", brand: "Le Labo" },
      { name: "Thé Noir 29", brand: "Le Labo" },
      { name: "Rose 31", brand: "Le Labo" }
    ]
  },
  {
    name: "Jo Malone",
    category: "The Minimalist & Transparent Poets",
    philosophy: "The Olfactory Wardrobe Layering Matrix.",
    scentProfile: "Crisp, simple, linear, and universally accessible. They compose ultra-focused, clear pairings—like simple woods and sea salts, or crisp pears and freesias—that do not shift or evolve over time.",
    coreMandate: "Complete simplicity and transparency, explicitly designed to be combined, stacked, and layered by the wearer to create a personalized custom profile.",
    creationsList: [
      { name: "Wood Sage & Sea Salt", brand: "Jo Malone" },
      { name: "Lime Basil & Mandarin", brand: "Jo Malone" },
      { name: "English Pear & Freesia", brand: "Jo Malone" }
    ]
  },
  {
    name: "Aesop",
    category: "The Minimalist & Transparent Poets",
    philosophy: "The Holistic Botanical Exercise in Restraint.",
    scentProfile: "Rooty, herbal, dry, and deeply grounding. Aesop structures perfumes around sharp cloves, cardamom, warm sandalwood, and raw cedarwood, heavily drawing inspiration from literature and philosophy.",
    coreMandate: "Delivering a quiet, intensely confident, and atmospheric wellness bubble that rejects commercial sweetness entirely.",
    creationsList: [
      { name: "Hwyl", brand: "Aesop" },
      { name: "Marrakech Intense", brand: "Aesop" },
      { name: "Tacit", brand: "Aesop" }
    ]
  },

  // The Concept Icons & Raw Rebels
  {
    name: "Comme des Garçons",
    category: "The Concept Icons & Raw Rebels",
    philosophy: "Anti-Perfumery & Industrial Concept Art.",
    scentProfile: "Chilly, avant-garde, and intentionally artificial. They routinely bypass traditional flowers and fruits to bottle the scent of hot copy machines, dust on a lightbulb, burning asphalt, or icy, metallic silver temple incense.",
    coreMandate: "Using perfume as an intellectual weapon to challenge and upend traditional definitions of what \"smells good.\"",
    creationsList: [
      { name: "CDG 2", brand: "Comme des Garçons" },
      { name: "Wonderwood", brand: "Comme des Garçons" },
      { name: "Blackpepper", brand: "Comme des Garçons" }
    ]
  },
  {
    name: "Escentric Molecules",
    category: "The Concept Icons & Raw Rebels",
    philosophy: "Absolute, Radical Chemical Isolationism.",
    scentProfile: "The shifting, vanishing pheromonal aura. Founded by Geza Schoen, the house bottles single high-tech synthetic aroma-chemicals (like Iso E Super or Ambroxan) completely raw in alcohol with zero other ingredients.",
    coreMandate: "Shattering the luxury marketing illusion to prove that a single, raw, scientifically engineered molecule can create an intoxicating, heat-activated trail all on its own.",
    creationsList: [
      { name: "Molecule 01", brand: "Escentric Molecules" },
      { name: "Escentric 01", brand: "Escentric Molecules" },
      { name: "Molecule 02", brand: "Escentric Molecules" }
    ]
  },
  {
    name: "Zoologist Perfumes",
    category: "The Concept Icons & Raw Rebels",
    philosophy: "Hyper-Textured Animalic Eco-Narratives.",
    scentProfile: "Jagged, complex, unpolished, and intensely environmental. Each perfume is an imaginative, cruelty-free, vegan recreation of an animal’s specific habitat—using heavy smoke, damp moss, wild mushrooms, or synthetic civet and castoreum.",
    coreMandate: "Zero corporate compromise; crafting wild, cinematic, and occasionally challenging environments in a bottle.",
    creationsList: [
      { name: "Tyrannosaurus Rex", brand: "Zoologist Perfumes" },
      { name: "Squid", brand: "Zoologist Perfumes" },
      { name: "Bee", brand: "Zoologist Perfumes" }
    ]
  },
  {
    name: "Nishane",
    category: "The Concept Icons & Raw Rebels",
    philosophy: "Globalist High-Impact Storytelling.",
    scentProfile: "Massive, sweet, thick, and highly persistent. Operating out of Istanbul, Nishane bridges European design with traditional Eastern performance, offering incredibly concentrated Extrait de Parfum lines built on velvety vanillas and crisp white woods.",
    coreMandate: "Constructing highly accessible, smooth, but structurally dominant personal spaces that project with absolute reliability for an entire day.",
    creationsList: [
      { name: "Ani", brand: "Nishane" },
      { name: "Hacivat", brand: "Nishane" },
      { name: "Wulong Cha", brand: "Nishane" }
    ]
  },
  {
    name: "Mancera",
    category: "The Concept Icons & Raw Rebels",
    philosophy: "The High-Volume Powerhouse.",
    scentProfile: "Loud, proud, synthetic-oriental, and impossible to ignore. Mancera specializes in ultra-heavy, hyper-projecting compositions loaded with sweet gourmand notes, heavy synthetic ouds, and intense, smoky tobaccos.",
    coreMandate: "Giving the wearer total control over the room; these fragrances are engineered specifically for maximum longevity and unmatched, room-filling projection.",
    creationsList: [
      { name: "Cedrat Boise", brand: "Mancera" },
      { name: "Red Tobacco", brand: "Mancera" },
      { name: "Instant Crush", brand: "Mancera" }
    ]
  },
  {
    name: "Stora Skuggan",
    category: "The Concept Icons & Raw Rebels",
    philosophy: "Liquid Mythology & Avant-Garde Folklore.",
    scentProfile: "Bizarre, atmospheric, deeply texturized, and artistic. This indie house builds fragrances that act like physical folklore stories, utilizing unusual green, resinous, or chilly mineral notes.",
    coreMandate: "Treating perfumery as an all-encompassing artistic, visual, and literary experience where the scent profile must transport you to a completely different, mythical reality.",
    creationsList: [
      { name: "Mistpouffer", brand: "Stora Skuggan" },
      { name: "Moonmilk", brand: "Stora Skuggan" },
      { name: "Fantôme de Maules", brand: "Stora Skuggan" }
    ]
  }
];
