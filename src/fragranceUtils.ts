import { FragranceData, AccordIntensity } from './types';

export function normalizeFragranceId(brand: string, name: string): string {
  return `${brand.toLowerCase()}|||${name.toLowerCase()}`;
}

export function fragranceMatches(frag1: FragranceData, frag2: FragranceData): boolean {
  return normalizeFragranceId(frag1.brand, frag1.name) ===
         normalizeFragranceId(frag2.brand, frag2.name);
}

export function fragranceExistsInCabinet(frag: FragranceData, cabinet: FragranceData[]): boolean {
  return cabinet.some(f => fragranceMatches(frag, f));
}

export function findFragranceInList(brand: string, name: string, list: FragranceData[]): FragranceData | undefined {
  const id = normalizeFragranceId(brand, name);
  return list.find(f => normalizeFragranceId(f.brand, f.name) === id);
}

export function formatFragranceName(frag: FragranceData | { brand: string; name: string }): string {
  return `${frag.brand} - ${frag.name}`;
}

export function getDominantAccord(accords: AccordIntensity[]): string {
  if (!accords || accords.length === 0) return 'fresh';
  return accords.reduce((prev, current) =>
    (prev.intensity > current.intensity) ? prev : current
  ).name.toLowerCase();
}

export const ACCORD_PATTERNS = {
  woody: ['wood', 'cedar', 'sandal', 'earth', 'patchouli', 'vetiver', 'forest'],
  citrus: ['citrus', 'fresh', 'marine', 'ozonic', 'aquatic'],
  amber: ['amber', 'spice', 'sweet', 'leather', 'gourmand']
};

export function matchAccordType(accordName: string): keyof typeof ACCORD_PATTERNS {
  const lower = accordName.toLowerCase();
  for (const [key, patterns] of Object.entries(ACCORD_PATTERNS)) {
    if (patterns.some(p => lower.includes(p))) return key as keyof typeof ACCORD_PATTERNS;
  }
  return 'woody';
}

export const ISOLATE_TYPES = {
  ambroxan: ['ambroxan', 'ambrox'],
  isoESuperFamily: ['iso e super', 'sylvamber', 'orbitone'],
  maltolFamily: ['maltol', 'ethyl maltol', 'vaneecar', 'furaneol'],
  myrcenolFamily: ['myrcenol', 'dihydromyrcenol'],
  muskFamily: ['galaxolide', 'habanolide', 'musk']
};

export function detectIsolateType(isolateName: string): string {
  const lower = isolateName.toLowerCase();
  for (const [type, variations] of Object.entries(ISOLATE_TYPES)) {
    if (variations.some(v => lower.includes(v))) return type;
  }
  return 'unknown';
}
