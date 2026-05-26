import { IngredientRow } from '../types';

export interface CompoundBlend {
  id: string; // kebab-case unique identifier
  name: string;
  description: string;
  ingredients: IngredientRow[];
  category: 'Base' | 'Heart' | 'Top' | 'Accord';
}

export const COMPOUND_LIBRARY: CompoundBlend[] = [
  // BASE COMPOUNDS
  {
    id: 'deep-woody-foundation',
    name: 'Deep Woody Foundation',
    description: 'Robust woody base with mineral projection and cedarwood character for structural depth',
    category: 'Base',
    ingredients: [
      {
        id: 'iso-e-super-base-1',
        chemicalName: 'Iso E Super',
        category: 'Invisible Radiance',
        ppt: 200,
        description: 'Cedarwood-like invisible backbone providing structural elegance and magnetic aura'
      },
      {
        id: 'galaxolide-base-1',
        chemicalName: 'Galaxolide',
        category: 'Clean, Cozy, & Skin-Like',
        ppt: 150,
        description: 'Clean synthetic musk base anchoring with soft warmth and skin-like adhesion'
      }
    ]
  },

  {
    id: 'warm-ambergris-anchor',
    name: 'Warm Ambergris Anchor',
    description: 'Rich ambergris-like base with creamy amber character and exceptional longevity',
    category: 'Base',
    ingredients: [
      {
        id: 'cetalox-base-1',
        chemicalName: 'Cetalox',
        category: 'Invisible Radiance',
        ppt: 240,
        description: 'Warm, velvety ambergris-like molecule acting as magnifier for richness and depth'
      },
      {
        id: 'ambroxan-base-1',
        chemicalName: 'Ambroxan',
        category: 'Invisible Radiance',
        ppt: 140,
        description: 'Dry mineral projection base providing sophisticated dry-down and longevity'
      }
    ]
  },

  {
    id: 'sensual-musk-base',
    name: 'Sensual Musk Base',
    description: 'Luxurious musk blend with skin-like adhesion and sensual trail character',
    category: 'Base',
    ingredients: [
      {
        id: 'ambrettolide-base-1',
        chemicalName: 'Ambrettolide',
        category: 'Clean, Cozy, & Skin-Like',
        ppt: 180,
        description: 'Silky skin musk with subtle sweetness creating intimate trail and addictive character'
      },
      {
        id: 'cashmeran-base-1',
        chemicalName: 'Cashmeran',
        category: 'Clean, Cozy, & Skin-Like',
        ppt: 160,
        description: 'Warm, fuzzy base bridging woody and musk elements with deep tactile quality'
      }
    ]
  },

  // HEART COMPOUNDS
  {
    id: 'classic-rose-floral',
    name: 'Classic Rose Floral',
    description: 'Luminous rose-like floral heart with jasmine brightness for romantic elegance',
    category: 'Heart',
    ingredients: [
      {
        id: 'hedione-heart-1',
        chemicalName: 'Hedione',
        category: 'Floral Heads',
        ppt: 220,
        description: 'Luminous jasmine-like compound providing radiance, projection and elegant floral top'
      },
      {
        id: 'geranial-heart-1',
        chemicalName: 'Geranial',
        category: 'Citrus & Fruits',
        ppt: 80,
        description: 'Rose-like lemon geranium top lift adding brightness and fresh accent to florals'
      }
    ]
  },

  {
    id: 'soft-peachy-floral',
    name: 'Soft Peachy Floral',
    description: 'Delicate fruity-floral heart with peachy sweetness and airy texture',
    category: 'Heart',
    ingredients: [
      {
        id: 'hedione-heart-2',
        chemicalName: 'Hedione',
        category: 'Floral Heads',
        ppt: 180,
        description: 'Rich jasmine-like note providing luminous floral heart and elegant projection'
      },
      {
        id: 'gamma-decalactone-heart-1',
        chemicalName: 'Gamma-Decalactone',
        category: 'Sweet/Gourmand',
        ppt: 100,
        description: 'Creamy peach and apricot fruity note adding sweetness and soft feminine warmth'
      }
    ]
  },

  {
    id: 'spicy-aromatic-heart',
    name: 'Spicy Aromatic Heart',
    description: 'Warm aromatic heart with spice complexity and herbal nuance for sophisticated depth',
    category: 'Heart',
    ingredients: [
      {
        id: 'cinnamic-aldehyde-heart-1',
        chemicalName: 'Cinnamic Aldehyde',
        category: 'Aromatics',
        ppt: 120,
        description: 'Warm cinnamon spice note adding oriental warmth and sensual depth to compositions'
      },
      {
        id: 'carvone-heart-1',
        chemicalName: 'Carvone',
        category: 'Aromatics',
        ppt: 100,
        description: 'Fresh spearmint-caraway herbal note providing aromatic complexity and freshness'
      }
    ]
  },

  // TOP COMPOUNDS
  {
    id: 'bright-citrus-opening',
    name: 'Bright Citrus Opening',
    description: 'Crisp citrus splash with lemon radiance and immediate top note sparkle',
    category: 'Top',
    ingredients: [
      {
        id: 'limonene-top-1',
        chemicalName: 'Limonene',
        category: 'Citrus & Fruits',
        ppt: 150,
        description: 'Pure lemon zest providing immediate brightness, natural sparkle and energetic top lift'
      },
      {
        id: 'bergapten-top-1',
        chemicalName: 'Bergamot',
        category: 'Citrus & Fruits',
        ppt: 120,
        description: 'Classic bergamot orange providing elegant citrus sparkle and sophisticated opening'
      }
    ]
  },

  {
    id: 'fresh-herbal-top',
    name: 'Fresh Herbal Top',
    description: 'Aromatic herbal opening with minty freshness and green brightness',
    category: 'Top',
    ingredients: [
      {
        id: 'menthol-top-1',
        chemicalName: 'Menthol',
        category: 'Aromatics',
        ppt: 100,
        description: 'Cool minty freshness providing immediate opening impact and aromatic clarity'
      },
      {
        id: 'eucalyptol-top-1',
        chemicalName: 'Eucalyptol',
        category: 'Aromatics',
        ppt: 90,
        description: 'Fresh eucalyptus green note adding herbaceous brightness and natural clarity'
      }
    ]
  },

  {
    id: 'sparkling-fruity-top',
    name: 'Sparkling Fruity Top',
    description: 'Youthful fruity top with berries and natural sparkle for playful opening',
    category: 'Top',
    ingredients: [
      {
        id: 'methyl-anthranilate-top-1',
        chemicalName: 'Methyl Anthranilate',
        category: 'Citrus & Fruits',
        ppt: 130,
        description: 'Grape and berries fruity note providing playful, youthful opening sparkle'
      },
      {
        id: 'limonene-top-2',
        chemicalName: 'Limonene',
        category: 'Citrus & Fruits',
        ppt: 100,
        description: 'Lemon brightness lifting the fruity notes with natural juicy top sparkle'
      }
    ]
  },

  // ACCORD COMPOUNDS
  {
    id: 'warm-musk-accord',
    name: 'Warm Musk Accord',
    description: 'Smooth musk blend creating intimate warmth and signature scent character',
    category: 'Accord',
    ingredients: [
      {
        id: 'galaxolide-accord-1',
        chemicalName: 'Galaxolide',
        category: 'Clean, Cozy, & Skin-Like',
        ppt: 180,
        description: 'Clean synthetic musk creating warm, comforting base with soft skin intimacy'
      },
      {
        id: 'ambrettolide-accord-1',
        chemicalName: 'Ambrettolide',
        category: 'Clean, Cozy, & Skin-Like',
        ppt: 140,
        description: 'Silky skin musk adding luxury and sensual trail to musk accord character'
      }
    ]
  },

  {
    id: 'creamy-vanilla-accord',
    name: 'Creamy Vanilla Accord',
    description: 'Smooth creamy vanilla-like accord with gourmand sweetness and comfort warmth',
    category: 'Accord',
    ingredients: [
      {
        id: 'vanillin-accord-1',
        chemicalName: 'Vanillin',
        category: 'Sweet/Gourmand',
        ppt: 160,
        description: 'Classic vanilla providing creamy sweetness, warmth and comforting gourmand character'
      },
      {
        id: 'ethyl-vanillin-accord-1',
        chemicalName: 'Ethyl Vanillin',
        category: 'Sweet/Gourmand',
        ppt: 100,
        description: 'Enhanced vanilla variant adding creamy intensity and deeper gourmand sweetness'
      }
    ]
  },

  {
    id: 'woody-amber-accord',
    name: 'Woody Amber Accord',
    description: 'Harmonious woody-amber combination with mineral elegance and depth',
    category: 'Accord',
    ingredients: [
      {
        id: 'iso-e-super-accord-1',
        chemicalName: 'Iso E Super',
        category: 'Invisible Radiance',
        ppt: 150,
        description: 'Cedarwood backbone providing structural elegance and mineral dry-down'
      },
      {
        id: 'cetalox-accord-1',
        chemicalName: 'Cetalox',
        category: 'Invisible Radiance',
        ppt: 130,
        description: 'Warm ambergris-like richness magnifying woody notes with creamy depth'
      }
    ]
  }
];
