import { FormulaTemplate } from './types';

export const FORMULA_TEMPLATES: FormulaTemplate[] = [
  {
    id: 'fresh-citrus-base',
    name: 'Fresh Citrus Base',
    description: 'Bright, energetic citrus foundation with crisp top notes and airy musk base',
    category: 'Fresh',
    carrierType: 'ethanol',
    dilutionRatio: 22,
    notes: 'Perfect for daytime and sports fragrances. Use bergamot and lemon derivatives for an instant lift.',
    ingredients: [
      {
        id: 'hedione-fresh-base',
        chemicalName: 'Hedione',
        category: 'Floral Heads',
        ppt: 150,
        description: 'Luminous jasmine-like compound that adds airy radiance and projection'
      },
      {
        id: 'galaxolide-fresh-base',
        chemicalName: 'Galaxolide',
        category: 'Clean, Cozy, & Skin-Like',
        ppt: 120,
        description: 'Clean musk base that anchors the composition with a soft, comforting warmth'
      },
      {
        id: 'iso-e-super-fresh-base',
        chemicalName: 'Iso E Super',
        category: 'Invisible Radiance',
        ppt: 100,
        description: 'Cedarwood-like invisible base that projects silently and creates aura'
      }
    ]
  },
  {
    id: 'romantic-floral',
    name: 'Romantic Floral',
    description: 'Delicate floral bouquet with sensual musk base for intimate occasions',
    category: 'Floral',
    carrierType: 'ethanol',
    dilutionRatio: 23,
    notes: 'Ideal for evening wear and romantic settings. Emphasizes rose and peony-like florals.',
    ingredients: [
      {
        id: 'hedione-romantic',
        chemicalName: 'Hedione',
        category: 'Floral Heads',
        ppt: 180,
        description: 'Rich jasmine-like note providing luminous floral heart and elegant projection'
      },
      {
        id: 'ambrette-romantic',
        chemicalName: 'Ambrettolide',
        category: 'Clean, Cozy, & Skin-Like',
        ppt: 140,
        description: 'Silky skin musk with subtle sweetness, creating intimate trail'
      },
      {
        id: 'cashmeran-romantic',
        chemicalName: 'Cashmeran',
        category: 'Clean, Cozy, & Skin-Like',
        ppt: 110,
        description: 'Warm, fuzzy base bridging floral and woody elements with tactile quality'
      }
    ]
  },
  {
    id: 'woody-elegance',
    name: 'Woody Elegance',
    description: 'Sophisticated woody composition with mineral base and subtle spice notes',
    category: 'Woody',
    carrierType: 'ethanol',
    dilutionRatio: 24,
    notes: 'Professional and refined. Best for business and formal occasions. Emphasizes cedar and vetiver.',
    ingredients: [
      {
        id: 'iso-e-super-woody',
        chemicalName: 'Iso E Super',
        category: 'Invisible Radiance',
        ppt: 160,
        description: 'Premium cedarwood backbone creating smooth, invisible elegance and magnetic aura'
      },
      {
        id: 'ambroxan-woody',
        chemicalName: 'Ambroxan',
        category: 'Invisible Radiance',
        ppt: 130,
        description: 'Dry mineral base providing projection power and clean, sophisticated dry-down'
      },
      {
        id: 'cashmeran-woody',
        chemicalName: 'Cashmeran',
        category: 'Clean, Cozy, & Skin-Like',
        ppt: 100,
        description: 'Warm woods and spice bridge creating tactile depth and longevity'
      }
    ]
  },
  {
    id: 'oriental-luxury',
    name: 'Oriental Luxury',
    description: 'Warm, sensual oriental with creamy amber base and precious musk accent',
    category: 'Oriental',
    carrierType: 'ethanol',
    dilutionRatio: 25,
    notes: 'Perfect for evening and special occasions. Rich, long-lasting composition with maximum longevity.',
    ingredients: [
      {
        id: 'cetalox-oriental',
        chemicalName: 'Cetalox',
        category: 'Invisible Radiance',
        ppt: 170,
        description: 'Warm, velvety ambergris-like molecule acting as a magnifier for richness and depth'
      },
      {
        id: 'ambrettolide-oriental',
        chemicalName: 'Ambrettolide',
        category: 'Clean, Cozy, & Skin-Like',
        ppt: 150,
        description: 'Luxurious skin musk with subtle sweetness, leaving an addictive trail'
      },
      {
        id: 'ambroxan-oriental',
        chemicalName: 'Ambroxan',
        category: 'Invisible Radiance',
        ppt: 120,
        description: 'Clean mineral projection base balancing the warmth with sophisticated dry-down'
      }
    ]
  }
];
