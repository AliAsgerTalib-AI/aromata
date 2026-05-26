export interface SyntheticCreation {
  name: string;
  brand?: string;
}

export interface SyntheticMaterial {
  id: number;
  name: string;
  category: string;
  smell: string;
  magicTrick: string;
  whereSmelledText: string;
  creations: SyntheticCreation[];
}

export const PERFUME_SYNTHETICS_DATABASE: SyntheticMaterial[] = [
  // 1. The Clean, Cozy, & "Skin-Like" Aromas
  {
    id: 1,
    name: "Galaxolide",
    category: "The Clean, Cozy, & \"Skin-Like\" Aromas",
    smell: "Freshly laundered white towels, clean cotton, premium fabric softener.",
    magicTrick: "Creates a clean, safe, comforting background bubble that anchors light floral notes.",
    whereSmelledText: "White Musk by The Body Shop, Clean Warm Cotton",
    creations: [
      { name: "White Musk", brand: "The Body Shop" },
      { name: "Clean Warm Cotton", brand: "Clean" }
    ]
  },
  {
    id: 2,
    name: "Habanolide",
    category: "The Clean, Cozy, & \"Skin-Like\" Aromas",
    smell: "Crisp white shirts, a steaming hot iron on clean linen, subtle metallic warmth.",
    magicTrick: "Adds a modern, glossy, radiant sheen to a perfume; smells expensive and bright rather than soapy.",
    whereSmelledText: "Glow by J.Lo, Mugler Cologne",
    creations: [
      { name: "Glow", brand: "J.Lo" },
      { name: "Mugler Cologne", brand: "Mugler" }
    ]
  },
  {
    id: 3,
    name: "Ambrettolide",
    category: "The Clean, Cozy, & \"Skin-Like\" Aromas",
    smell: "Smooth, silky skin musk with a faint, sweet whisper of wild blackberries.",
    magicTrick: "Mimics the incredibly rare, natural botanical musk found in ambrette seeds. Leaves a luxurious trail.",
    whereSmelledText: "Musc Invisible by Juliette Has a Gun",
    creations: [
      { name: "Musc Invisible", brand: "Juliette Has a Gun" }
    ]
  },
  {
    id: 4,
    name: "Cashmeran",
    category: "The Clean, Cozy, & \"Skin-Like\" Aromas",
    smell: "A plush cashmere sweater, wet concrete after rain, cozy woods, and faint spice.",
    magicTrick: "The ultimate chameleon. It feels tactile, fuzzy, and warm, bridging the gap between woods and skin musks.",
    whereSmelledText: "Alien by Mugler, Dans Tes Bras by Frederic Malle",
    creations: [
      { name: "Alien", brand: "Mugler" },
      { name: "Dans Tes Bras", brand: "Frederic Malle" }
    ]
  },

  // 2. The Invisible Radiance & Mineral Textures
  {
    id: 5,
    name: "Iso E Super",
    category: "The Invisible Radiance & Mineral Textures",
    smell: "Smooth, ultra-sheer cedarwood, clean pencil shavings, a ghost-like amber breeze.",
    magicTrick: "It is often imperceptible on yourself but creates a massive, magnetic aura that others notice when you walk by.",
    whereSmelledText: "Molecule 01 (used at 100%), Fahrenheit by Dior",
    creations: [
      { name: "Molecule 01", brand: "Escentric Molecules" },
      { name: "Fahrenheit", brand: "Dior" }
    ]
  },
  {
    id: 6,
    name: "Ambroxan",
    category: "The Invisible Radiance & Mineral Textures",
    smell: "Dry, salty sea air, clean beach driftwood, warm mineral stones, premium paper.",
    magicTrick: "The clean, highly addictive modern replacement for natural whale Ambergris. It gives a fragrance incredible projecting power.",
    whereSmelledText: "Baccarat Rouge 540, Sauvage by Dior, Not A Perfume",
    creations: [
      { name: "Baccarat Rouge 540", brand: "Maison Francis Kurkdjian" },
      { name: "Sauvage", brand: "Dior" },
      { name: "Not A Perfume", brand: "Juliette Has a Gun" }
    ]
  },
  {
    id: 7,
    name: "Cetalox",
    category: "The Invisible Radiance & Mineral Textures",
    smell: "Warm, velvety skin, a sophisticated and slightly sweet ambergris cloud.",
    magicTrick: "Smoother and deeper than Ambroxan. It acts like a magnifier, making every other ingredient smell richer.",
    whereSmelledText: "Not A Perfume by Juliette Has a Gun (used at 100%)",
    creations: [
      { name: "Not A Perfume", brand: "Juliette Has a Gun" }
    ]
  },

  // 3. The Floral Illusions
  {
    id: 8,
    name: "Hedione",
    category: "The Floral Illusions",
    smell: "A field of green jasmine under a bright morning sky; airy, transparent, and water-fresh.",
    magicTrick: "It acts like a \"breeze\" inside a bottle. It opens up heavy, dense ingredients and floods the whole composition with light.",
    whereSmelledText: "Eau Sauvage by Dior, CK One by Calvin Klein",
    creations: [
      { name: "Eau Sauvage", brand: "Dior" },
      { name: "CK One", brand: "Calvin Klein" }
    ]
  },
  {
    id: 9,
    name: "Linalool",
    category: "The Floral Illusions",
    smell: "A refreshing blend of crushed lavender buds, Earl Grey bergamot, and a squeeze of lime.",
    magicTrick: "The universal fresh starter. It provides the initial burst of bright, clean, botanical air in thousands of fragrances.",
    whereSmelledText: "Found in almost 90% of all fresh, citrus, and lavender perfumes.",
    creations: [
      { name: "Lavande Romaine", brand: "Essential Parfums" },
      { name: "Pour Un Homme", brand: "Caron" }
    ]
  },
  {
    id: 10,
    name: "Phenethyl Alcohol",
    category: "The Floral Illusions",
    smell: "Fresh, dew-kissed pink rose petals with a soft drop of sweet honey.",
    magicTrick: "The absolute foundation of any rose perfume. It recreates the light, watery freshness of a real flower garden.",
    whereSmelledText: "Chloe Eau de Parfum, Paris by YSL",
    creations: [
      { name: "Chloe Eau de Parfum", brand: "Chloe" },
      { name: "Paris", brand: "YSL" }
    ]
  },
  {
    id: 11,
    name: "Alpha-Ionone",
    category: "The Floral Illusions",
    smell: "Soft, powdery candied violets, retro makeup powder, and expensive suede leather.",
    magicTrick: "Recreates the romantic, nostalgic aroma of vintage lipsticks and delicate violet flowers.",
    whereSmelledText: "Insolence by Guerlain, Misia by Chanel",
    creations: [
      { name: "Insolence", brand: "Guerlain" },
      { name: "Misia", brand: "Chanel" }
    ]
  },
  {
    id: 12,
    name: "Javanol",
    category: "The Floral Illusions",
    smell: "Ultra-creamy, warm, rich sandalwood with an unexpected splash of tropical grapefruit.",
    magicTrick: "A hyper-potent modern marvel. Just a tiny drop gives a perfume a rich, milky, expensive woodiness that lasts for weeks.",
    whereSmelledText: "Molecule 04 (used at 100%), Santal 33 by Le Labo",
    creations: [
      { name: "Molecule 04", brand: "Escentric Molecules" },
      { name: "Santal 33", brand: "Le Labo" }
    ]
  },

  // 4. The Fresh, Green, & Aquatic "Special Effects"
  {
    id: 13,
    name: "Calone 1951",
    category: "The Fresh, Green, & Aquatic \"Special Effects\"",
    smell: "Ocean breezes, crisp sea spray, ozonic air, and a slice of chilled watermelon.",
    magicTrick: "The molecule that invented the entire 1990s marine genre. It instantly transports a scent straight to the beach.",
    whereSmelledText: "Acqua di Gio by Armani, L'Eau d'Issey by Issey Miyake",
    creations: [
      { name: "Acqua di Gio", brand: "Armani" },
      { name: "L'Eau d'Issey", brand: "Issey Miyake" }
    ]
  },
  {
    id: 14,
    name: "Dihydromyrcenol",
    category: "The Fresh, Green, & Aquatic \"Special Effects\"",
    smell: "Sharp, electric blue lime-bergamot, metallic lavender, and ultra-clean grooming cream.",
    magicTrick: "Gives a bracing, high-energy, hyper-masculine \"shower gel\" freshness that feels intensely clean.",
    whereSmelledText: "Cool Water by Davidoff, Drakkar Noir",
    creations: [
      { name: "Cool Water", brand: "Davidoff" },
      { name: "Drakkar Noir", brand: "Guy Laroche" }
    ]
  },
  {
    id: 15,
    name: "Stemone",
    category: "The Fresh, Green, & Aquatic \"Special Effects\"",
    smell: "Bitter green fig leaves, snapped twigs, and the green vines of a tomato plant.",
    magicTrick: "Adds a realistic, wild, untamed botanical crunch to a perfume, keeping sweet fruity notes from tasting artificial.",
    whereSmelledText: "Philosykos by Diptyque",
    creations: [
      { name: "Philosykos", brand: "Diptyque" }
    ]
  },
  {
    id: 16,
    name: "Methyl Pamplemousse",
    category: "The Fresh, Green, & Aquatic \"Special Effects\"",
    smell: "Bitter, zesty, incredibly realistic grapefruit rind with a cold, sulfurous edge.",
    magicTrick: "Recreates the true, mouth-watering bite of a fresh grapefruit top note without turning sweet or sugary.",
    whereSmelledText: "Light Blue Pour Homme by Dolce & Gabbana",
    creations: [
      { name: "Light Blue Pour Homme", brand: "Dolce & Gabbana" }
    ]
  },

  // 5. The Sweet, Delicious Gourmands
  {
    id: 17,
    name: "Ethyl Maltol",
    category: "The Sweet, Delicious Gourmands",
    smell: "Spun sugar, warm cotton candy, toasted pralines, and strawberry jam.",
    magicTrick: "The molecule that birthed the \"Gourmand\" (dessert-like) perfume family. It makes a fragrance instantly delicious and playful.",
    whereSmelledText: "Angel by Mugler, Flowerbomb by Viktor & Rolf",
    creations: [
      { name: "Angel", brand: "Mugler" },
      { name: "Flowerbomb", brand: "Viktor & Rolf" }
    ]
  },
  {
    id: 18,
    name: "Coumarin",
    category: "The Sweet, Delicious Gourmands",
    smell: "Sweet, powdery almond paste, freshly mown hay in the sun, and unsmoked blonde tobacco.",
    magicTrick: "Found naturally in tonka beans. It provides a warm, nutty, bittersweet masculinity that defines the classic barbershop style.",
    whereSmelledText: "Le Male by Jean Paul Gaultier, Fougère Royale",
    creations: [
      { name: "Le Male", brand: "Jean Paul Gaultier" },
      { name: "Fougère Royale", brand: "Houbigant" }
    ]
  },
  {
    id: 19,
    name: "Vanillin",
    category: "The Sweet, Delicious Gourmands",
    smell: "Rich, sweet, creamy, comforting bakery vanilla bean.",
    magicTrick: "The cozy, unmistakable heart of sweet fragrances, bringing warmth and cross-generational nostalgia.",
    whereSmelledText: "Shalimar by Guerlain, Tobacco Vanille by Tom Ford",
    creations: [
      { name: "Shalimar", brand: "Guerlain" },
      { name: "Tobacco Vanille", brand: "Tom Ford" }
    ]
  },
  {
    id: 20,
    name: "Aldehyde C14",
    category: "The Sweet, Delicious Gourmands",
    smell: "Fuzzy, velvety, sun-ripened peach skin and rich apricot cream.",
    magicTrick: "It doesn't smell sharp like other aldehydes; it provides a soft, milky, fruity texture that makes a perfume feel smooth.",
    whereSmelledText: "Mitsouko by Guerlain, Fracas by Robert Piguet",
    creations: [
      { name: "Mitsouko", brand: "Guerlain" },
      { name: "Fracas", brand: "Robert Piguet" }
    ]
  }
];
